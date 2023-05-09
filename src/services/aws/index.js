const AWS = require("aws-sdk");

new AWS.Config({
  accessKeyId: "",
  secretAccessKey: ""
});

AWS.config.update({ region: "us-east-1" });

const client = new AWS.Rekognition();

module.exports = { client };
