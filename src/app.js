const express = require("express");
const path = require("path")
const hbs = require('hbs');
const {pool} = require('./dbConfig');
const bcrypt =require('bcrypt');
const { getEnabledCategories } = require("trace_events");
const app =express();
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const https = require('https');
const fs = require('fs');

const initializePassport= require("./passportConfig");
initializePassport(passport);

const port =process.env.PORT || 8000;
const staticpath= (path.join(__dirname,"../public"));
const templatePath= path.join(__dirname,"../templates/views");
const partialPath =path.join(__dirname,"../templates/partials");
app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialPath);
app.use(express.urlencoded({extended:false}));
 app.use(express.static(staticpath));
 app.use(
     session({
         secret: "secret",
         resave: false,
         saveUninitialized: false
     })
 );
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(flash());

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
app.get("/register",checkAuthenticated,(req,res)=>{
    res.render("register")
})
app.get("/dashboard",checkNotAuthenticated,(req,res)=>{
    console.log("I am inside dashboard");
    res.render("dashboard", {user: req.user.name})
})
app.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success_msg","you have logged out");
    res.redirect("/login");
})
app.get("/*",(req,res)=>{
    res.render("404error",{errMsg:"Oops page not found"})
})
app.get("*",(req,res)=>{
    res.render("404error",{errMsg:"Oops page not found"})
})
app.post('/register',async(req,res)=>{
    // let datahide = getElementById()
    let{name,email,password,password2}=req.body;
    console.log({
        name,
        email,
        password,
        password2
    });
    let errors=[];
    let emailerror=[];
    const format=/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; 
    const number=/\d/;
    const lowercase=/[a-z]/;
    const uppercase=/[A-Z]/;
    const email1 = /[@]/;
    cssobj= {};
    cssobj1={};
    
    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
      }
      if(!(email1.test(email))){
        cssobj1= {
          color:'3px solid red',
          flag: true,
          
        };
        emailerror.push({message: "email must contain @ symbol" })
      }else{
        cssobj1={flag: false}
      }
    
      if (password.length < 8) {
        errors.push({ message: "Password must be a least 8 characters long" });
      }
    
      if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
      }
      if(!(format.test(password))){
        errors.push({message: "Password must contain at least one special character"})
      }
      if(!(lowercase.test(password))){
        errors.push({message: "Password must contain at least one lowercase character"})
      }
      if(!(uppercase.test(password))){
        errors.push({message: "Password must contain at least one uppercase character"})
      }
      if(!(number.test(password))){
          errors.push({message:"password must contain at least one number"})
      }
      if (errors.length > 0) {
        cssobj= {
          color:'3px solid red',
          flag: true,
          
        };
      }
      
      if(errors.length > 0 || emailerror.length>0){
        res.render("register", {emailerror,cssobj1, cssobj,errors, name, email, password, password2 });
      } else{
        cssobj={
          flag: false
        };
        cssobj1={flag:false};

hashedPassword = await bcrypt.hash(password, 3);
    console.log(hashedPassword);
    pool.query(
        `SELECT * FROM users
          WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results.rows);
        
        if (results.rows.length > 0) {
          errors.push({message:"Email already registered"})
           res.render("register",{errors})
          } else {
            pool.query(
              `INSERT INTO users (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`,
              [name, email, hashedPassword],
              (err, results) => {
                if (err) {
                  throw err;
                }
                console.log(results.rows);
                req.flash("success_msg", "You are now registered. Please log in");
            
                res.redirect("/login");
                
              }
            )
             
        }
    
        })  
       } })
app.post("/login",passport.authenticate("local",{
    successRedirect: "/dashboard",
    failureRedirect:"/login",
    failureFlash: true
}))
function checkAuthenticated(req,res,next){
    console.log("I am in checkauthenticated");
    if(req.isAuthenticated()){
        console.log("I am after isAuthenticated is true");
        return res.redirect("/dashboard");
    }
    next();
} 
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        console.log("iam in checknotauthenticated")
     return next();
    }
    res.redirect("/login");
    
}
const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname,"../cert/key.pem")),
    cert:fs.readFileSync(path.join(__dirname,"../cert/cert.pem"))
  },app)
sslServer.listen(3443,()=>console.log("secure server running on port 3443"))

// app.listen(port,()=>{
//     console.log(`listening to ${port} `);
// })