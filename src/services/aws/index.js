const AWS = require("aws-sdk");

// const bucket = "cherry-staging-images"; // the bucketname without s3://
// const photo = "mocking_bird.jpeg"; // the name of file

new AWS.Config({
  accessKeyId: "",
  secretAccessKey: ""
});

AWS.config.update({ region: "us-east-1" });

const client = new AWS.Rekognition();

module.exports = { client };
