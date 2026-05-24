require("dotenv").config();

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
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch(err => {
    console.log("❌ DB Error:", err);
});

// ======================
// MODELS
// ======================

// PRODUCT
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ======================
// HOME ROUTE
// ======================
app.get("/", (req, res) => {
    res.send("✅ Eco Shop Backend Running");
});

// ======================
// PRODUCTS
// ======================
app.get("/products", async (req, res) => {

    try {

        let data = await Product.find().sort({
            createdAt: -1
        });

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/products/add", async (req, res) => {

    try {

        let product = await Product.create(req.body);

        res.json(product);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.delete("/products/delete/:id", async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "🗑 Product Deleted"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ======================
// CUSTOMERS
// ======================
app.get("/customers", async (req, res) => {

    try {

        let data = await Customer.find();

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/customers/add", async (req, res) => {

    try {

        let customer = await Customer.create(req.body);

        res.json(customer);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.delete("/customers/delete/:id", async (req, res) => {

    try {

        await Customer.findByIdAndDelete(req.params.id);

        res.json({
            message: "🗑 Customer Deleted"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ======================
// EXPENSES
// ======================
app.get("/expenses", async (req, res) => {

    try {

        let data = await Expense.find();

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/expenses/add", async (req, res) => {

    try {

        let expense = await Expense.create(req.body);

        res.json(expense);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.delete("/expenses/delete/:id", async (req, res) => {

    try {

        await Expense.findByIdAndDelete(req.params.id);

        res.json({
            message: "🗑 Expense Deleted"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/expenses/total", async (req, res) => {

    try {

        let data = await Expense.find();

        let total = data.reduce((sum, e) =>
            sum + Number(e.amount), 0);

        res.json({
            totalExpense: total
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ======================
// RETURNS
// ======================
app.get("/returns", async (req, res) => {

    try {

        let data = await Return.find();

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.post("/returns/add", async (req, res) => {

    try {

        let item = await Return.create(req.body);

        res.json(item);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/returns/total-loss", async (req, res) => {

    try {

        let data = await Return.find();

        let total = data.reduce((sum, r) =>
            sum + Number(r.loss_amount), 0);

        res.json({
            totalLoss: total
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ======================
// REPORTS
// ======================
app.get("/reports/total-products", async (req, res) => {

    try {

        let count = await Product.countDocuments();

        res.json({
            totalProducts: count
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/reports/low-stock", async (req, res) => {

    try {

        let data = await Product.find({
            stock: { $lte: 5 }
        });

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/reports/sales-history", async (req, res) => {

    try {

        let data = await Bill.find();

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/reports/total-sales", async (req, res) => {

    try {

        let data = await Bill.find();

        let total = data.reduce((sum, b) =>
            sum + Number(b.total), 0);

        res.json({
            totalSales: total
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/reports/month-sales", async (req, res) => {

    res.json({
        monthSales: 0
    });

});

app.get("/reports/today-sales", async (req, res) => {

    res.json({
        todaySales: 0
    });

});

// ======================
// BILLING
// ======================
app.post("/billing/save", async (req, res) => {

    try {

        let billNumber = "BILL" + Date.now();

        let bill = await Bill.create({

            cart: req.body.cart,
            total: req.body.total,
            billNumber

        });

        res.json({
            billNumber,
            bill
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("🚀 Server Running On Port " + PORT);
});