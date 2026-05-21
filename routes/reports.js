const express = require("express");

const router = express.Router();

const db = require("../db");


// TOTAL SALES

router.get("/total-sales",(req,res)=>{

db.query(

"SELECT SUM(total) AS totalSales FROM sales",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result[0]);

}

});

});


// TODAY SALES

router.get("/today-sales",(req,res)=>{

db.query(

`SELECT SUM(total) AS todaySales
FROM sales
WHERE DATE(created_at)=CURDATE()`,

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result[0]);

}

});

});


// MONTH SALES

router.get("/month-sales",(req,res)=>{

db.query(

`SELECT SUM(total) AS monthSales
FROM sales
WHERE MONTH(created_at)=MONTH(CURRENT_DATE())
AND YEAR(created_at)=YEAR(CURRENT_DATE())`,

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result[0]);

}

});

});


// LOW STOCK

router.get("/low-stock",(req,res)=>{

db.query(

"SELECT * FROM products WHERE stock <= 5",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result);

}

});

});


// TOTAL PRODUCTS

router.get("/total-products",(req,res)=>{

db.query(

"SELECT COUNT(*) AS totalProducts FROM products",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result[0]);

}

});

});
// PROFIT / LOSS

router.get("/profit-loss",(req,res)=>{

db.query(

`SELECT
(
(SELECT IFNULL(SUM(total),0) FROM sales)
-
(SELECT IFNULL(SUM(amount),0) FROM expenses)
) AS profit`,

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result[0]);

}

});

});
// SALES HISTORY

router.get("/sales-history",(req,res)=>{

db.query(

"SELECT * FROM sales ORDER BY id DESC",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result);

}

});

});


module.exports = router;