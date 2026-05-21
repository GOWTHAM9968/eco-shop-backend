const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// ======================
// DATABASE (MongoDB Atlas)
// ======================
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ecoshop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected");
}).catch((err) => {
    console.log("❌ DB Error:", err);
});

// ======================
// PRODUCT MODEL
// ======================
const Product = mongoose.model("Product", {
    name: String,
    price: Number,
    stock: Number,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ======================
// ROUTES
// ======================

// 🟢 TEST ROUTE
app.get("/", (req, res) => {
    res.send("✅ Eco Shop Backend Running");
});


// 🟢 GET ALL PRODUCTS
app.get("/products", async (req, res) => {
    let products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});


// 🟢 ADD PRODUCT
app.post("/products/add", async (req, res) => {
    let { name, price, stock, image } = req.body;

    let product = new Product({
        name,
        price,
        stock,
        image
    });

    await product.save();

    res.json({
        message: "✅ Product Added",
        product
    });
});


// 🟢 DELETE PRODUCT
app.delete("/products/delete/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑 Product Deleted" });
});


// ======================
// BILLING SYSTEM (simple)
// ======================
app.post("/billing/create", (req, res) => {
    let bill = req.body;

    res.json({
        message: "🧾 Bill Created",
        bill
    });
});


// ======================
// CUSTOMERS (basic)
// ======================
app.get("/customers", (req, res) => {
    res.json([]);
});


// ======================
// EXPENSES (basic)
// ======================
app.get("/expenses", (req, res) => {
    res.json([]);
});


// ======================
// RETURNS (basic)
// ======================
app.get("/returns", (req, res) => {
    res.json([]);
});


// ======================
// SERVER (RENDER READY)
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("🚀 Server Running On Port " + PORT);
});