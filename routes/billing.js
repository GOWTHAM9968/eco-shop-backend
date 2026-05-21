const express = require("express");

const router = express.Router();

const db = require("../db");


// SAVE BILL

router.post("/save",(req,res)=>{

const {

cart,
total

} = req.body;


// BILL NUMBER

let billNumber =
"INV-" + Date.now();


// SAVE SALE

db.query(

"INSERT INTO sales(bill_number,total) VALUES(?,?)",

[billNumber,total],

(err,result)=>{

if(err){

res.send(err);

}
else{

let saleId = result.insertId;


// SAVE ITEMS

cart.forEach(item=>{

let subtotal =
item.price * item.qty;


// SAVE ITEM

db.query(

`INSERT INTO sale_items
(sale_id,product_id,product_name,quantity,price,subtotal)

VALUES(?,?,?,?,?,?)`,

[
saleId,
item.id,
item.name,
item.qty,
item.price,
subtotal
]

);


// AUTO STOCK REDUCE

db.query(

"UPDATE products SET stock = stock - ? WHERE id=?",

[item.qty,item.id]

);

});

res.send({

message:"✅ Bill Saved",

billNumber

});

}

});

});


module.exports = router;