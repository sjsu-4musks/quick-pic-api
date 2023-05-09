const express = require("express");
const morgan = require("morgan");
const expressRequestId = require("express-request-id")();
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, MONGO_URL } = require("./src/utils/config");
const logger = require("./src/utils/logger");

const app = express();

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

app.use(expressRequestId);

morgan.token("requestId", request => request.id);

app.use(
  morgan(":requestId :method :url :status :response-time ms", {
    stream: {
      write: message => logger.http(message)
    }
  })
);

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({ verify: rawBodySaver, limit: "50mb" }));
app.use(
  express.urlencoded({ verify: rawBodySaver, extended: true, limit: "50mb" })
);
app.use(express.raw({ verify: rawBodySaver, type: "*/*", limit: "50mb" }));

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      return callback(null, true);
    },
    exposedHeaders: "x-access-token"
  })
);

const users = require("./src/api/v1/users");
const products = require("./src/api/v1/products");

// ROUTES
app.use("/v1/users", users);
app.use("/v1/products", products);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Howdy!!!" });
});

app.listen(PORT, () => {
  try {
    mongoose.set("strictQuery", true);

    mongoose
      .connect(MONGO_URL)
      .then(() => logger.info("SERVER - MongoDB Connected"))
      .catch(error =>
        logger.error("SERVER - MongoDB Connection Failed : ", error)
      );

    logger.info(`SERVER - Running on port ${PORT}`);
  } catch (error) {
    logger.error("Failed to start server -> error : ", error);
  }
});
