const { mockClient } = require('aws-sdk-client-mock');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const lambdaLocal = require('lambda-local');
const path = require('path');
const fs = require("fs");

const s3Mock = mockClient(S3Client);

const event = {
  Records: [
    {
      s3: {
        bucket: { name: "mocked-read-bucket" },
        object: { key: "test-file.txt" },
      },
    },
  ],
};


describe("countLinesFromS3", () => {
  beforeAll(() => {
    process.env.WRITE_BUCKET_NAME = 'mocked-write-bucket';
  });

  beforeEach(() => {
    s3Mock.reset();
  });

  it("should process S3 event and count lines", async () => {
    //cuando no queremos usar el archivo, podemos simular el contenido con esto
    /*s3Mock.on(GetObjectCommand).resolves({
      Body: Buffer.from("Line 1\nLine 2\nLine 3")
    });*/
    s3Mock.on(GetObjectCommand).resolves({
      Body: Buffer.from(
        fs.readFileSync(path.join(__dirname, "test-file.txt"), "utf-8")
      )
    });

    // Mock de escritura en S3
    s3Mock.on(PutObjectCommand).resolves({});

    const response = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../handler.js'),
      lambdaHandler: 'countLinesFromS3',
    });
    console.log("the response:")
    console.log(response)

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)[0].lineCount).toBe(11);
  });

  it("should return an error if WRITE_BUCKET_NAME is not defined", async () => {
    delete process.env.WRITE_BUCKET_NAME;
  
    const response = await lambdaLocal.execute({
      event,
      lambdaPath: path.join(__dirname, '../handler.js'),
      lambdaHandler: 'countLinesFromS3',
    });
  
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).error).toContain("Error processing S3 event");
  });
});
