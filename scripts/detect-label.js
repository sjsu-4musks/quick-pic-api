const AWS = require("aws-sdk");

const bucket = ""; // the bucketname without s3://
const photo = "the_hunger_games.jpeg"; // the name of file

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
  MaxLabels: 10
};

client.detectLabels(params, (err, response) => {
  if (err) {
    console.log(err, err.stack); // if an error occurred
  } else {
    console.log(`Detected labels for: ${photo}`);
    response.Labels.forEach(label => {
      console.log(`Label:      ${label.Name}`);
      console.log(`Confidence: ${label.Confidence}`);
      console.log("Instances:");
      label.Instances.forEach(instance => {
        const box = instance.BoundingBox;
        console.log("  Bounding box:");
        console.log(`    Top:        ${box.Top}`);
        console.log(`    Left:       ${box.Left}`);
        console.log(`    Width:      ${box.Width}`);
        console.log(`    Height:     ${box.Height}`);
        console.log(`  Confidence: ${instance.Confidence}`);
      });
      console.log("Parents:");
      label.Parents.forEach(parent => {
        console.log(`  ${parent.Name}`);
      });
      console.log("------------");
      console.log("");
    }); // for response.labels
  } // if
});
