const express = require("express");

const router = express.Router();

const db = require("../db");


// GET PRODUCTS

router.get("/",(req,res)=>{

db.query(

"SELECT * FROM products ORDER BY id DESC",

(err,result)=>{

if(err){

console.log(err);

}
else{

res.send(result);

}

});

});


// ADD PRODUCT

router.post("/add",(req,res)=>{

const {

name,
price,
stock,
image

} = req.body;

db.query(

`INSERT INTO products
(name,price,stock,image)

VALUES(?,?,?,?)`,

[
name,
price,
stock,
image
],

(err,result)=>{

if(err){

console.log(err);

res.send(err);

}
else{

res.send("✅ Product Added");

}

});

});


// DELETE PRODUCT

router.delete("/delete/:id",(req,res)=>{

let id = req.params.id;

db.query(

"DELETE FROM products WHERE id=?",

[id],

(err,result)=>{

if(err){

console.log(err);

}
else{

res.send("✅ Product Deleted");

}

});

});


module.exports = router;