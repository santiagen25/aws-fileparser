'use strict';
const BadRequestError = require("./badRequestError");
const CountLines = require("./countLines")
const CountWords = require("./countWords")
const HttpStatus = require("http-status-codes");
const S3Handler = require("./s3Handler");

module.exports.hello = async event => {
  return buildReponse(HttpStatus.OK,"Hello there")
};

module.exports.countLines = async event => {
  
  try {
    var url = event["pathParameters"]["url"];
  } catch (error) {
    throw new BadRequestError("Missing url");
  }

  console.log(url)

  var countLines = new CountLines(url);
  var result=await countLines.execute();
  
  return buildReponse(HttpStatus.OK,result);
};

module.exports.countWordsS3 = async event => {

  try {
    var fileName = event["pathParameters"]["fileName"];
  } catch (error) {
    throw new BadRequestError("Missing url");
  }

  var s3Handler = new S3Handler();
  var countWordsInstance = new CountWords(s3Handler);

  var numberOfWords = await countWordsInstance.execute(process.env.BUCKET_NAME, fileName);
  console.log(`File ${fileName} has ${numberOfWords} words`)

  return buildReponse(HttpStatus.OK, numberOfWords);
};


function buildReponse(httpStatusCode, body) {
  return {
    statusCode: httpStatusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body
  };
}

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

