const AWS = require("aws-sdk");

const bucket = ""; // the bucketname without s3://
const photo = "mocking_bird.jpeg"; // the name of file

new AWS.Config({
  accessKeyId: "",
  secretAccessKey: ""
});

AWS.config.update({ region: "us-east-1" });

const client = new AWS.Rekognition();

const params = {
  Image: {
    S3Object: {
      Bucket: bucket,
      Name: photo
    }
  },
  Filters: {
    WordFilter: {
      MinConfidence: 90
    }
  }
};

client.detectText(params, (err, response) => {
  if (err) {
    console.log(err, err.stack); // handle error if an error occurred
  } else {
    console.log(`Detected Text for: ${photo}`);
    console.log(JSON.stringify(response));

    response.TextDetections.forEach(label => {
      console.log(`Detected Text: ${label.DetectedText}`);
      console.log(`Type: ${label.Type}`);
      console.log(`ID: ${label.Id}`);
      console.log(`Parent ID: ${label.ParentId}`);
      console.log(`Confidence: ${label.Confidence}`);
      console.log(`Polygon: `);
      console.log(label.Geometry.Polygon);
    });
  }
});
