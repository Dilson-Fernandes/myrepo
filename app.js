require("dotenv").config();

const express = require("express");
const app = express();
const axios = require('axios');
const mongoose = require("mongoose");
const path = require("path");
const MongoStore = require("connect-mongo");

const userRouter =require("./routes/user.js");
const session = require("express-session");
const flash =require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js')

const port = 3000;
async function main() {
  await mongoose.connect(process.env.DB_URL);
}
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("unable to connect to database");
  });


const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60, //1 day
});

store.on("error",()=>{
    console.log("Error in mongo session store"); 
})

const sessionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/",(req,res)=>{
    res.send("you are in the root page");
})

app.get("/index",(req,res)=>{
    const user = req.user;
    res.render("index",{user});
})
app.use("/user",userRouter);


app.get('/api/map', async (req, res) => {
    res.render("./map/map.ejs")
 });

app.all('*',(req,res,next)=>{
    res.send("page not found");
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="async function error"}=err;
    res.status(statusCode).render("./error.ejs",{message});
})
app.listen(port,()=>{
    console.log("server is running on port " + port);
})
