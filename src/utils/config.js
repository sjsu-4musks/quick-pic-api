const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 7000,
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
};
