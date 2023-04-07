const mongoose = require("mongoose");

const collection = "Users";

const { UserRoles } = require("../constants/Users");

const { Schema } = mongoose;

const UsersSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    avatar: {
      type: String
    },
    role: {
      type: String,
      enum: Object.values(UserRoles)
    }
  },
  { timestamps: true, collection }
);

const Users = mongoose.model(collection, UsersSchema);

module.exports = Users;
