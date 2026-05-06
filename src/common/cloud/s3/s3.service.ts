import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ICloudProvider } from "../cloud.interface";
import { S3_BUCKET_NAME } from "../../../config";

interface S3Config {
  region: string;
  credentials: {
    secretAccessKey: string;
    accessKeyId: string;
  };
}

export class S3CloudProvider implements ICloudProvider {
  private _client: S3Client;

  constructor(config: S3Config) {
    this._client = new S3Client({
      region: config.region,
      credentials: config.credentials,
    });
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    let command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `social-app/${path}/${Date.now()}_${file.originalname}`, //floder path name
      ACL: "public-read",
      ContentType: file.mimetype,
      Body: file.buffer,
    });
    await this._client.send(command);
    return command.input.Key as string;
  }

  async deleteFile(key: string): Promise<boolean | undefined> {
    let command = new DeleteObjectCommand({
      Key: key,
      Bucket: S3_BUCKET_NAME,
    });
    const { DeleteMarker } = await this._client.send(command);
    return DeleteMarker;
  }

  async getFile(key: string): Promise<NodeJS.ReadableStream > {
    let command = new GetObjectCommand({
      Key: key,
      Bucket: S3_BUCKET_NAME,
    });
    const { Body } = await this._client.send(command);
    return Body as NodeJS.ReadableStream;
  }
}
