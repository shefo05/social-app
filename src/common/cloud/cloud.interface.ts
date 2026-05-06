export interface ICloudProvider {
  uploadFile(file: Express.Multer.File, path: string): Promise<string>;

  deleteFile(key: string): Promise<boolean | undefined>;

  getFile(key: string): Promise<NodeJS.ReadableStream | undefined>;
}
