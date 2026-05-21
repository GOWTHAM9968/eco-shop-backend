const express = require("express");

const router = express.Router();

const db = require("../db");


// GET EXPENSES

router.get("/",(req,res)=>{

db.query(

"SELECT * FROM expenses ORDER BY id DESC",

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send(result);

}

});

});


// ADD EXPENSE

router.post("/add",(req,res)=>{

const {

expense_name,
amount

} = req.body;

db.query(

"INSERT INTO expenses(expense_name,amount) VALUES(?,?)",

[expense_name,amount],

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send("✅ Expense Added");

}

});

});


// DELETE EXPENSE

router.delete("/delete/:id",(req,res)=>{

let id = req.params.id;

db.query(

"DELETE FROM expenses WHERE id=?",

[id],

(err,result)=>{

if(err){

res.send(err);

}
else{

res.send("✅ Expense Deleted");

}

});

});


// TOTAL EXPENSE

router.get("/total",(req,res)=>{

db.query(

"SELECT SUM(amount) AS totalExpense FROM expenses",

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