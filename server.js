const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ======================
// DATABASE
// ======================
mongoose.connect("mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/ecoshop")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));


// ======================
// MODELS
// ======================

// PRODUCT
const Product = mongoose.model("Product", {
    name: String,
    price: Number,
    stock: Number,
    image: String,
    createdAt: { type: Date, default: Date.now }
});

// CUSTOMER
const Customer = mongoose.model("Customer", {
    name: String,
    phone: String,
    address: String
});

// EXPENSE
const Expense = mongoose.model("Expense", {
    expense_name: String,
    amount: Number
});

// RETURN
const Return = mongoose.model("Return", {
    product_name: String,
    quantity: Number,
    reason: String,
    loss_amount: Number
});

// BILL
const Bill = mongoose.model("Bill", {
    cart: Array,
    total: Number,
    billNumber: String,
    createdAt: { type: Date, default: Date.now }
});


// ======================
// PRODUCTS
// ======================
app.get("/products", async (req, res) => {
    let data = await Product.find();
    res.json(data);
});

app.post("/products/add", async (req, res) => {
    let product = await Product.create(req.body);
    res.json(product);
});

app.delete("/products/delete/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
});


// ======================
// CUSTOMERS
// ======================
app.get("/customers", async (req, res) => {
    res.json(await Customer.find());
});

app.post("/customers/add", async (req, res) => {
    res.json(await Customer.create(req.body));
});

app.delete("/customers/delete/:id", async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
});


// ======================
// EXPENSES
// ======================
app.get("/expenses", async (req, res) => {
    res.json(await Expense.find());
});

app.post("/expenses/add", async (req, res) => {
    res.json(await Expense.create(req.body));
});

app.delete("/expenses/delete/:id", async (req, res) => {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
});

app.get("/expenses/total", async (req, res) => {
    let data = await Expense.find();
    let total = data.reduce((sum, e) => sum + Number(e.amount), 0);
    res.json({ totalExpense: total });
});


// ======================
// RETURNS
// ======================
app.get("/returns", async (req, res) => {
    res.json(await Return.find());
});

app.post("/returns/add", async (req, res) => {
    res.json(await Return.create(req.body));
});

app.get("/returns/total-loss", async (req, res) => {
    let data = await Return.find();
    let total = data.reduce((sum, r) => sum + Number(r.loss_amount), 0);
    res.json({ totalLoss: total });
});


// ======================
// REPORTS
// ======================
app.get("/reports/total-products", async (req, res) => {
    let count = await Product.countDocuments();
    res.json({ totalProducts: count });
});

app.get("/reports/low-stock", async (req, res) => {
    let data = await Product.find({ stock: { $lte: 5 } });
    res.json(data);
});

app.get("/reports/sales-history", async (req, res) => {
    res.json(await Bill.find());
});

app.get("/reports/total-sales", async (req, res) => {
    let data = await Bill.find();
    let total = data.reduce((sum, b) => sum + Number(b.total), 0);
    res.json({ totalSales: total });
});

app.get("/reports/month-sales", async (req, res) => {
    res.json({ monthSales: 0 });
});

app.get("/reports/today-sales", async (req, res) => {
    res.json({ todaySales: 0 });
});


// ======================
// BILLING
// ======================
app.post("/billing/save", async (req, res) => {

    let billNumber = "BILL" + Date.now();

    let bill = await Bill.create({
        cart: req.body.cart,
        total: req.body.total,
        billNumber
    });

    res.json({ billNumber, bill });
});


// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("🚀 Server Running On Port " + PORT);
});