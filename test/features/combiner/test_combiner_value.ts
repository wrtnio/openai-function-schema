import { TestValidator } from "@nestia/e2e";
import { OpenAiDataCombiner } from "@wrtnio/openai-function-schema";

export const test_combiner_value = (): void => {
  TestValidator.equals("number")(OpenAiDataCombiner.value(1, 2))(2);
  TestValidator.equals("nullable")(OpenAiDataCombiner.value(0, null))(0);
  TestValidator.equals("optional")(OpenAiDataCombiner.value(0, undefined))(0);
  TestValidator.equals("object")(
    OpenAiDataCombiner.value(
      {
        a: "A",
        array: [1, 2, 3],
        nestedArray: [{ alpha: "alpha" }, { alpha: "alpha" }],
        object: { x: "X" },
      },
      {
        b: "B",
        array: [3, 4, 5],
        nestedArray: [{ beta: "beta" }, { beta: "beta" }],
        object: { y: "Y" },
      },
    ),
  )({
    a: "A",
    b: "B",
    array: [3, 4, 5],
    nestedArray: [
      {
        alpha: "alpha",
        beta: "beta",
      },
      {
        alpha: "alpha",
        beta: "beta",
      },
    ],
    object: { x: "X", y: "Y" },
  });
  TestValidator.equals("membership")(
    OpenAiDataCombiner.value(
      {
        name: "Wrtn Technologies",
        email: "master@wrtn.io",
        password: "1234",
        age: 20,
        gender: 1,
      },
      {
        picture: "https://wrtn.io/logo.png",
        secret: "something",
      },
    ),
  )({
    name: "Wrtn Technologies",
    email: "master@wrtn.io",
    password: "1234",
    age: 20,
    gender: 1,
    picture: "https://wrtn.io/logo.png",
    secret: "something",
  });
};
