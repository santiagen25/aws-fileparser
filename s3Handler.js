"use strict";

const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

class S3Handler {
  constructor() {
  }

  async read(bucketName, fileName) {
    try {

      const s3Client = new S3Client({
        region: "eu-west-1",
        maxAttempts: 5
      });

      const data = await s3Client.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: fileName
      }));

      const result = await data.Body?.transformToString("utf-8")
      return result
    } catch (error) {
      if (error.Code === "NoSuchKey") {
        throw new Error(`File ${fileName} not found in bucket ${bucketName}`)
      }

      throw new Error("Error reading file", { key: fileName, error })
    }
  }
}

module.exports = S3Handler;

