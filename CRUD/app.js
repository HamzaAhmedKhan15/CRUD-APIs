import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();

// //////////////////  using Middleware   /////////////////////

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hi, I am live!..");
});

/////////////////////////////////// mongoose schema //////////////////////////////////////////

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "restapi",
  })
  .then(() => console.log("Database Connected Succesfully! "))
  .catch((e) => console.log(e));

const Productschema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = new mongoose.model("Product", Productschema);

///////////////////////////////////////////////////////////////////////////////////////////////////

//////// Create product api ////////////////
app.post("/api/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//////// Read product api ////////////////
app.get("/api/v1/products", async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//////// Update product api ////////////////
app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: "Product not found!",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//////// Delete product api ////////////////
app.delete("/api/v1/product/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found!",
        });
      }
  
      await product.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Product is deleted successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Product not Found!",
      });
    }
  });
  

//////////////////////////////////////////////////////////////////////////////////////////////

app.listen(3000, () => {
  console.log("Server is working!");
});
