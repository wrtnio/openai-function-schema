import { IConnection, IPropagation } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import { IMigrateRoute } from "@samchon/openapi";

import { IOpenAiDocument } from "./structures/IOpenAiDocument";
import { IOpenAiFunction } from "./structures/IOpenAiFunction";

/**
 * Function call executors for OpenAI.
 *
 * `OpenAiFetcher` is a module for function call execution with target function's
 * metadata {@link IOpenAiFunction} and OpenAI composed arguments.
 *
 * Also, `OpenAiFetcher` is designed to consider
 * {@link IOpenAiDocument.IOptions.keyword} option, so that it can unwrap the
 * composed arguments into the function call arguments automatically.
 *
 * However, about the {@link IOpenAiDocument.IOptions.separate} case, you have
 * to use {@link OpenAiDataCombiner.parameters} function to combine the LLM and
 * human arguments into one, by yourself manually.
 *
 * @author Samchon
 */
export namespace OpenAiFetcher {
  export interface IProps {
    /**
     * Document of the OpenAI function call schemas.
     */
    document: IOpenAiDocument;

    /**
     * Function schema to call.
     */
    function: IOpenAiFunction;

    /**
     * Connection info to the server.
     */
    connection: IConnection;

    /**
     * Arguments for the function call.
     */
    arguments: any[];
  }

  /**
   * Execute the function call.
   *
   * `OpenAiFetcher.execute()` is a function executing the target API endpoint with
   * the operation's metadata {@link IOpenAiFunction} and OpenAI composed arguments.
   *
   * Also, `OpenAiFetcher.execute()` is designed to consider
   * {@link IOpenAiDocument.IOptions.keyword} option, so that it can unwrap the
   * composed arguments into the function call arguments automatically.
   *
   * However, about the {@link IOpenAiDocument.IOptions.separate} case, you have
   * to use {@link OpenAiDataCombiner.parameters} function to combine the LLM and
   * human arguments into one, by yourself manually.
   *
   * @param props Function call properties.
   * @returns Response of the function call.
   */
  export const execute = (props: IProps): Promise<any> =>
    PlainFetcher.fetch(...getFetcherArguments(props));

  /**
   * Propagate the function call.
   *
   * `OpenAiFetcher.propagate()` is a function propagating the target API endpoint with
   * the operation's metadata {@link IOpenAiFunction} and OpenAI composed arguments.
   *
   * Also, `OpenAiFetcher.execute()` is designed to consider
   * {@link IOpenAiDocument.IOptions.keyword} option, so that it can unwrap the
   * composed arguments into the function call arguments automatically.
   *
   * However, about the {@link IOpenAiDocument.IOptions.separate} case, you have
   * to use {@link OpenAiDataCombiner.parameters} function to combine the LLM and
   * human arguments into one, by yourself manually.
   *
   * > For reference, the propagation means always returning the response even if the
   * > request is failled, with the response's status code. About detailed concept
   * > of the propagation, refer to the {@link IPropagation} type.
   *
   * @param props Function call properties.
   * @returns Propagation of the function call.
   */
  export const propagate = (
    props: IProps,
  ): Promise<IPropagation.IBranch<boolean, number, any>> =>
    PlainFetcher.propagate(...getFetcherArguments(props)) as Promise<
      IPropagation.IBranch<boolean, number, any>
    >;

  const getFetcherArguments = (props: IProps) => {
    const route = props.function.route();
    return [
      props.connection,
      {
        method: props.function.method.toUpperCase() as "POST",
        path:
          props.document.options.keyword === true
            ? getKeywordPath({
                function: props.function,
                input: props.arguments[0],
              })
            : getPositionalPath(props),
        template: props.function.path,
        status: null,
        request: route.body
          ? { type: route.body.type, encrypted: false }
          : null,
        response: {
          type: route.success?.type ?? "application/json",
          encrypted: false,
        },
      },
      route.body
        ? props.document.options.keyword
          ? props.arguments[0].body
          : props.arguments[route.parameters.length + (route.query ? 1 : 0)]
        : undefined,
    ] as const;
  };

  const getKeywordPath = (props: {
    function: IOpenAiFunction;
    input: Record<string, any>;
  }): string => {
    const route: IMigrateRoute = props.function.route();
    let path: string = route.emendedPath;
    for (const p of route.parameters)
      path = path.replace(`:${p.key}`, props.input[p.key] ?? "null");
    if (route.query) path += getvariable(props.input.query ?? {});
    return path;
  };

  const getPositionalPath = (props: {
    function: IOpenAiFunction;
    arguments: any[];
  }): string => {
    const route: IMigrateRoute = props.function.route();
    let path: string = route.emendedPath;
    route.parameters.forEach((pp, i) => {
      path = path.replace(`:${pp.key}`, props.arguments[i]);
    });
    if (route.query)
      path += getvariable(props.arguments[route.parameters.length]);
    return path;
  };

  const getvariable = (query: any): string => {
    const variables: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
      if (undefined === value) continue;
      else if (Array.isArray(value))
        value.forEach((elem: any) => variables.append(key, String(elem)));
      else variables.set(key, String(value));
    return 0 === variables.size ? "" : `?${variables.toString()}`;
  };
}
