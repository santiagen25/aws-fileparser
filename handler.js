'use strict';
const BadRequestError = require("./badRequestError");
const CountLines = require("./countLines")
const CountWords = require("./countWords")
const HttpStatus = require("http-status-codes");
const S3Handler = require("./s3Handler");
const AWS = require("aws-sdk");
const S3 = new AWS.S3();
const { buildReponse } = require('./utils');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require("fs");

//para test
if (process.env.IS_LOCAL === 'true') {
  const { mockClient } = require('aws-sdk-client-mock');
  
  const s3Mock = mockClient(S3Client);

  //cuando no queremos usar el archivo, podemos simular el contenido con esto
  /*s3Mock.on(GetObjectCommand).resolves({
    Body: Buffer.from('Line 1\nLine 2\nLine 3')
  });*/
  s3Mock.on(GetObjectCommand).resolves({
    Body: Buffer.from(
      fs.readFileSync(path.join(__dirname, "test-file.txt"), "utf-8")
    )
  });

  s3Mock.on(PutObjectCommand).resolves({});
}


module.exports.hello = async event => {
  return buildReponse(HttpStatus.OK,"Hello there")
};

module.exports.countLines = async event => {
  try {
    if (!event.pathParameters || !event.pathParameters.url) {
      throw new BadRequestError("URL is required");
    }

    const url = event.pathParameters.url;
    console.log(url);

    const countLines = new CountLines(url);
    const result = await countLines.execute();

    return buildReponse(HttpStatus.OK, result);
  } catch (error) {
    if (error instanceof BadRequestError) {
      return buildReponse(HttpStatus.BAD_REQUEST, error.message);
    }
    return buildErrorResponse(error);
  }
};


module.exports.countWordsS3 = async event => {

  try {
    var fileName = event["pathParameters"]["fileName"];
  } catch (error) {
    throw new BadRequestError("Missing fileName parameter");
  }

  var s3Handler = new S3Handler();
  var countWordsInstance = new CountWords(s3Handler);

  var numberOfWords = await countWordsInstance.execute(process.env.BUCKET_NAME, fileName);
  console.log(`File ${fileName} has ${numberOfWords} words`)

  return buildReponse(HttpStatus.OK, numberOfWords);
};

module.exports.countLinesFromS3 = async (event) => {
  try {
    const records = event.Records;
    const results = [];

    for (const record of records) {
      const bucketName = record.s3.bucket.name;
      const fileName = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

      console.log(`Processing file: ${fileName} from bucket: ${bucketName}`);
      
      const fileContent = await getFileContent(bucketName, fileName);
      const lineCount = countLines(fileContent);
      console.log(`File ${fileName} has ${lineCount} lines`);

      const writeBucketName = process.env.WRITE_BUCKET_NAME;
      await writeResultToBucket(writeBucketName, fileName, lineCount);
      console.log(`Result written to bucket: ${writeBucketName}`);

      results.push({ fileName, lineCount });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing S3 event" }),
    };
  }
};



function buildErrorResponse(error) {
  console.error(error);

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: "There was an error"
    })
  };
}

async function getFileContent(bucketName, fileName) {
  const client = new S3Client();
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  const data = await client.send(new GetObjectCommand(params));

  //console.log("S3 GetObject response:", data); 
  
  if (!data?.Body) {
    throw new Error("File content is empty or undefined");
  }

  if (Buffer.isBuffer(data.Body)) {
    return data.Body.toString("utf-8");
  } else {
    return await streamToString(data.Body);
  }
}

function countLines(content) {
  return content.split("\n").length;
}

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
});

async function writeResultToBucket(bucketName, fileName, lineCount) {
  const client = new S3Client();
  const params = {
    Bucket: bucketName,
    Key: `${fileName}.result.txt`.replace(/\/+/g, "_"), 
    Body: `Number of lines: ${lineCount}`,
  };

  await client.send(new PutObjectCommand(params));
}

