const lambdaLocal = require("lambda-local");
const path = require("path");

const executeLambda = async payload => {
  return await lambdaLocal.execute({
    event: payload,
    lambdaPath: path.join(__dirname, "../handler.js"),
    lambdaHandler: "countLines",
    timeoutMs: 60000,
    verboseLevel: 0
  });
};

const validUrlPayload = {
  pathParameters: {
    url: "https%3A%2F%2Fwww.w3.org%2FTR%2FPNG%2Fiso_8859-1.txt"
  },
};

describe("CountLines", ()=>{
  it("should return 200 when the payload is valid ", async () => {
    const response = await executeLambda(validUrlPayload);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(105);
  });

  //TODO: What if there's not a URL in the payload?

  //TODO: What if the URL specified is invalid?

});

