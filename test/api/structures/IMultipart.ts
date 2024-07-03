/**
 * DTO of multipart form data with files' uploading.
 *
 * @author Samchon
 */
export interface IMultipart extends IMultipart.IContent {
  blob: Blob;
  blobs: Blob[];
  file: File;
  files: File[];
}
export namespace IMultipart {
  /**
   * Content of the multipart form data.
   */
  export interface IContent {
    title: string;
    description: null | string;
    flags: number[];
    notes?: string[];
  }
}
