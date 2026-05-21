const express = require("express");

const router = express.Router();

const db = require("../db");


// GET CUSTOMERS

router.get("/",(req,res)=>{

db.query(

"SELECT * FROM customers ORDER BY id DESC",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result);

}

});

});


// ADD CUSTOMER

router.post("/add",(req,res)=>{

const {

name,
phone,
address

} = req.body;

db.query(

"INSERT INTO customers(name,phone,address) VALUES(?,?,?)",

[name,phone,address],

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send("✅ Customer Added");

}

});

});


// DELETE CUSTOMER

router.delete("/delete/:id",(req,res)=>{

let id = req.params.id;

db.query(

"DELETE FROM customers WHERE id=?",

[id],

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send("✅ Customer Deleted");

}

});

});


module.exports = router;