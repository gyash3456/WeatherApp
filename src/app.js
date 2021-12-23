const express = require("express");
const path = require("path")
const hbs = require('hbs');
const app =express();

const port =process.env.PORT || 8000;
const staticpath= (path.join(__dirname,"../public"));
const templatePath= path.join(__dirname,"../templates/views");
const partialPath =path.join(__dirname,"../templates/partials");
app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialPath);
 app.use(express.static(staticpath));

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.get("/weather",(req,res)=>{
    res.render("weather")
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/*",(req,res)=>{
    res.render("404error",{errMsg:"Oops page not found"})
})
app.get("*",(req,res)=>{
    res.render("404error",{errMsg:"Oops page not found"})
})
app.listen(port,()=>{
    console.log(`listening to ${port} `)
})