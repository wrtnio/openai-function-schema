import { tags } from "typia/lib";

/**
 * Query DTO of `@TypedQuery()`.
 *
 * @author Samchon
 */
export interface IQuery {
  limit?: number;
  enforce: boolean;
  values: string[] & tags.MinItems<1>;
  atomic: string | null;
}
