const express = require("express")
const app=express()
const router = require("./router");
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use("/api/v1",router);
app.get("/",(req,res)=>{
    res.send("Hello World");
})

const port = process.env.PORT || 3000
app.listen(port,()=>{console.log("Server is running ",port);})