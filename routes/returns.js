const express = require("express");

const router = express.Router();

const db = require("../db");


// GET RETURNS

router.get("/",(req,res)=>{

db.query(

"SELECT * FROM returns ORDER BY id DESC",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result);

}

});

});


// ADD RETURN

router.post("/add",(req,res)=>{

const {

product_name,
quantity,
reason,
loss_amount

} = req.body;

db.query(

`INSERT INTO returns
(product_name,quantity,reason,loss_amount)

VALUES(?,?,?,?)`,

[
product_name,
quantity,
reason,
loss_amount
],

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send("✅ Return Added");

}

});

});


// TOTAL LOSS

router.get("/total-loss",(req,res)=>{

db.query(

"SELECT SUM(loss_amount) AS totalLoss FROM returns",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result[0]);

}

});

});


module.exports = router;