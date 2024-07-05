const express = require("express")
const app=express()
const router = require("./router");


app.use(express.json())
app.use("/api/v1",router);
app.get("/",(req,res)=>{
    res.send("Hello World");
})


app.listen(3000,()=>{console.log("Server is running");})