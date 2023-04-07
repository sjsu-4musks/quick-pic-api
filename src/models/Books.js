const mongoose = require("mongoose");

const collection = "Books";

const { Schema } = mongoose;

const BooksSchema = new Schema(
  {
    name: {
      type: String
    }
  },
  { timestamps: true, collection }
);

const Books = mongoose.model(collection, BooksSchema);

module.exports = Books;
