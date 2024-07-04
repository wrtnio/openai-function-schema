import cp from "child_process";
import fs from "fs";
import util from "util";

interface IPackageJson {
  name: string;
  version: string;
  private?: boolean;
  dependencies: Record<string, string>;
}

const ROOT_PATH = `${__dirname}/..`;
const LIB_PATH = `${ROOT_PATH}/lib`;
const ALIAS_PATH = `${ROOT_PATH}/packages/alias`;

const publish = async (tag: string, pack: IPackageJson): Promise<void> => {
  const dev: boolean = pack.version.includes("-dev.");
  if ((tag === "next" || tag === "patch") && !dev)
    throw new Error(`${tag} tag can only be used for dev versions.`);
  else if (tag === "latest" && dev)
    throw new Error("latest tag can only be used for non-dev versions.");

  delete pack.private;
  await fs.promises.writeFile(
    `${ROOT_PATH}/package.json`,
    JSON.stringify(pack, null, 2),
  );
  cp.execSync(`npm publish --tag ${tag}`, { stdio: "inherit" });

  pack.private = true;
  await fs.promises.writeFile(
    `${ROOT_PATH}/package.json`,
    JSON.stringify(pack, null, 2),
  );
};

const replica = async (tag: string, pack: IPackageJson): Promise<void> => {
  const copy = (file: string) =>
    fs.promises.copyFile(`${ROOT_PATH}/${file}`, `${ALIAS_PATH}/${file}`);
  const link = async (lib: string, src: string): Promise<void> => {
    const directory: string[] = await fs.promises.readdir(lib);
    for (const file of directory) {
      const from: string = `${lib}/${file}`;
      const to: string = `${src}/${file}`;
      const stat: fs.Stats = fs.statSync(from);

      if (stat.isDirectory() && file !== "executable") {
        await fs.promises.mkdir(to);
        await link(from, to);
      } else if (file.substring(file.length - 5) === ".d.ts")
        await fs.promises.writeFile(
          to.substring(0, to.length - 5) + ".ts",
          from === `${LIB_PATH}/index.d.ts`
            ? `import wofs from "@wrtnio/openai-function-schema";\n` +
                `export default wofs;\n` +
                `export * from "@wrtnio/openai-function-schema";\n`
            : `export * from "@wrtnio/openai-function-schema/lib${from.substring(
                LIB_PATH.length,
                from.length - 5,
              )}";`,
          "utf8",
        );
    }
  };

  if (fs.existsSync(`${ALIAS_PATH}/src`))
    await fs.promises.rm(`${ALIAS_PATH}/src`, { recursive: true });
  await fs.promises.mkdir(`${ALIAS_PATH}/src`);
  await link(LIB_PATH, `${ALIAS_PATH}/src`);

  await copy("LICENSE");
  await copy("tsconfig.json");
  await fs.promises.writeFile(
    `${ALIAS_PATH}/README.md`,
    [
      "> ## Deprecated",
      "> `openai-function-schema` has been renamed to `@wrtnai/openai-function-schema`",
      "",
      await fs.promises.readFile(`${ROOT_PATH}/README.md`, "utf8"),
    ].join("\n"),
    "utf8",
  );
  await fs.promises.writeFile(
    `${ALIAS_PATH}/package.json`,
    JSON.stringify(
      {
        ...pack,
        name: "openai-function-schema",
        dependencies: {
          "@wrtnai/openai-function-schema": pack.version,
        },
        private: undefined,
        devDependencies: undefined,
        module: undefined,
      },
      null,
      2,
    ),
    "utf8",
  );

  if (fs.existsSync(`${ALIAS_PATH}/lib`))
    await fs.promises.rm(`${ALIAS_PATH}/lib`, { recursive: true });
  try {
    cp.execSync("npx tsc", { stdio: "ignore", cwd: ALIAS_PATH });
  } catch {}
  cp.execSync(`npm publish --tag ${tag}`, {
    stdio: "inherit",
    cwd: ALIAS_PATH,
  });
};

const main = async (): Promise<void> => {
  const args: string[] = process.argv.slice(2);
  const {
    values: { tag },
  } = util.parseArgs({
    args,
    options: {
      tag: { type: "string", short: "t" },
    },
  });
  if (tag === undefined) {
    console.log("specify tag name like latest or next");
    process.exit(-1);
  }

  const pack: IPackageJson = JSON.parse(
    await fs.promises.readFile(`${ROOT_PATH}/package.json`, "utf8"),
  );
  cp.execSync("npm run build", { stdio: "inherit", cwd: ROOT_PATH });
  cp.execSync("npm run test", { stdio: "inherit", cwd: ROOT_PATH });
  await publish(tag, pack);
  await replica(tag, pack);
};
main().catch((err) => {
  console.error(err);
  process.exit(-1);
});
