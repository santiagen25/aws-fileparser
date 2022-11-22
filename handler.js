'use strict';
const BadRequestError = require("./badRequestError");
const CountLines = require("./countLines")
const HttpStatus = require("http-status-codes");

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

