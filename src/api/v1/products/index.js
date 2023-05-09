const router = require("express").Router({ mergeParams: true });
const fs = require("fs");

const ProductsModel = require("../../../models/Products");
const BooksModel = require("../../../models/Books");
const { client } = require("../../../services/aws");
const { createChatCompletion } = require("../../../services/openai");
const { validateToken } = require("../../../utils/common");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../../constants/App");
const logger = require("../../../utils/logger");

router.get("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const products = await ProductsModel.find({
      user: token.user._id
    });

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    logger.error("GET /v1/products -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const token = await validateToken(req.headers);

//     if (token.error) {
//       return res
//         .status(token.status)
//         .json({ success: false, message: token.message });
//     }

//     const { id } = req.params;

//     if (!id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "ID is required." });
//     }

//     const product = await ProductsModel.findOne({
//       _id: id,
//       user: token.user._id
//     });

//     return res.status(200).json({ success: true, data: product });
//   } catch (error) {
//     logger.error("GET /v1/products/:id -> error : ", error);
//     return res
//       .status(500)
//       .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { name, price, quantity, barcode, images = [], tags = [] } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    if (!price) {
      return res
        .status(400)
        .json({ success: false, message: "Price is required." });
    }

    if (!quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity is required." });
    }

    if (!barcode) {
      return res
        .status(400)
        .json({ success: false, message: "Barcode is required." });
    }

    const product = await new ProductsModel({
      name,
      price,
      quantity,
      barcode,
      images,
      tags,
      user: token.user._id
    }).save();

    return res.status(200).json({
      success: true,
      message: "Product created successfully!",
      data: product
    });
  } catch (error) {
    logger.error("POST /v1/products -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.put("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const {
      id,
      name,
      price,
      quantity,
      barcode,
      images = [],
      tags = []
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    }

    if (!price) {
      return res
        .status(400)
        .json({ success: false, message: "Price is required." });
    }

    if (!quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity is required." });
    }

    if (!barcode) {
      return res
        .status(400)
        .json({ success: false, message: "Barcode is required." });
    }

    const product = await ProductsModel.findByIdAndUpdate(
      {
        _id: id
      },
      {
        name,
        price,
        quantity,
        barcode,
        images,
        tags
      },
      {
        new: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: product
    });
  } catch (error) {
    logger.error("PUT /v1/products -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.delete("/", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { id } = req.query;

    await ProductsModel.findOneAndRemove({ _id: id, user: token.user._id });

    return res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    logger.error("DELETE /v1/products -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.get("/search", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { q } = req.query;

    const products = await BooksModel.find({
      name: new RegExp(q, "i")
    });

    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    logger.error("GET /v1/products/search -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/detect", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { imageBase64 } = req.body;
    const image = Buffer.from(imageBase64, "base64");
    // const image = fs.readFileSync(`public/bottle_Image.jpeg`);

    client.detectText(
      {
        Image: {
          Bytes: image
        },
        Filters: {
          WordFilter: {
            MinConfidence: 90
          }
        }
      },
      async (err, response) => {
        if (err) {
          throw err;
        } else {
          // console.log("response : ", response);

          // const detectedTextLines = [];

          // for (let i = 0; i < 3; i++) {
          //   const elem = response.TextDetections[i];

          //   detectedTextLines.push(elem.DetectedText);
          // }

          // const query = detectedTextLines.join(" ");

          // console.log("query : ", query);

          const barcodeNumberRegex = /\d+/; // Regular expression to identify numbers
          let barcodeNumber;

          for (const elem of response.TextDetections) {
            const match = elem.DetectedText.match(barcodeNumberRegex);
            if (match) {
              barcodeNumber = match[0];
              break;
            }
          }

          if (!barcodeNumber) {
            return res.status(200).json({
              success: false,
              message: "No barcode number detected in the image"
            });
          }

          const products = await ProductsModel.find({
            barcode: new RegExp(barcodeNumber, "i")
            // name: new RegExp(query, "i")
          });

          return res.status(200).json({ success: true, products });
        }
      }
    );
  } catch (error) {
    logger.error("POST /v1/products/detect -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const token = await validateToken(req.headers);

    if (token.error) {
      return res
        .status(token.status)
        .json({ success: false, message: token.message });
    }

    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    // const book = await BooksModel.findById(id);

    // const prompt = `Provide a summary of the movie named ${book.name}`;

    const product = await ProductsModel.findById(id);
    console.log("Product found: ", product);

    const prompt = `Provide a summary of the Product named ${product.name}`;

    const chatCompletionResponse = await createChatCompletion(prompt);

    console.log(
      "chatCompletionResponse : ",
      JSON.stringify(chatCompletionResponse)
    );

    return res.status(200).json({
      success: true,
      data: chatCompletionResponse.choices[0].message.content
    });
  } catch (error) {
    logger.error("POST /v1/products/summarize -> error : ", error);
    return res
      .status(500)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
});

module.exports = router;
