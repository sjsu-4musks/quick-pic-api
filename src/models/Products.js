const mongoose = require("mongoose");

const collection = "Products";

const { Schema } = mongoose;

const ProductsSchema = new Schema(
  {
    name: {
      type: String
    },
    price: {
      type: Number
    },
    quantity: {
      type: Number
    },
    barcode: {
      type: String
    },
    images: {
      type: Array,
      default: []
    },
    tags: {
      type: Array,
      default: []
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Products = mongoose.model(collection, ProductsSchema);

module.exports = Products;
