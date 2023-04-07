const mongoose = require("mongoose");
const xlsx = require("node-xlsx");

const BooksModel = require("../src/models/Books");

const seed = async () => {
  try {
    const data = xlsx.parse(`${__dirname}/books.xlsx`);

    console.log("data : ", data[0].data[1]);

    for (let i = 0; i < data[0].data.length; i++) {
      await new BooksModel({
        name: data[0].data[i][1]
      }).save();
    }
  } catch (error) {
    console.error(error);
  }
};

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/quickpic");

// On Connection
mongoose.connection.on("connected", async () => {
  try {
    await seed();

    mongoose.disconnect();
  } catch (error) {
    mongoose.disconnect();
  }
});

// On Error
mongoose.connection.on("error", error => {
  console.error(error);
  mongoose.disconnect();
});
