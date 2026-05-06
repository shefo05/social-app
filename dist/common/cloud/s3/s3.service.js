"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CloudProvider = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../../../config");
class S3CloudProvider {
    _client;
    constructor(config) {
        this._client = new client_s3_1.S3Client({
            region: config.region,
            credentials: config.credentials,
        });
    }
    async uploadFile(file, path) {
        let command = new client_s3_1.PutObjectCommand({
            Bucket: config_1.S3_BUCKET_NAME,
            Key: `social-app/${path}/${Date.now()}_${file.originalname}`, //floder path name
            ACL: "public-read",
            ContentType: file.mimetype,
            Body: file.buffer,
        });
        await this._client.send(command);
        return command.input.Key;
    }
    async deleteFile(key) {
        let command = new client_s3_1.DeleteObjectCommand({
            Key: key,
            Bucket: config_1.S3_BUCKET_NAME,
        });
        const { DeleteMarker } = await this._client.send(command);
        return DeleteMarker;
    }
    async getFile(key) {
        let command = new client_s3_1.GetObjectCommand({
            Key: key,
            Bucket: config_1.S3_BUCKET_NAME,
        });
        const { Body } = await this._client.send(command);
        return Body;
    }
}
exports.S3CloudProvider = S3CloudProvider;
