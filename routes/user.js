const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js')
const passport=require("passport");
const { TopologyDescription } = require('mongodb');



router.get("/signup", async(req ,res)=>{
    res.render("./users/signup.ejs");
});

router.post("/signup" , async (req,res)=>{
    try{
        
        let {username ,email , password,phone,location,country}=req.body;
        let newUser = new User({
            username,
            email,
            phone,
            location,
            country
        });

        const registeredUser = await User.register(newUser , password);
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
            }
            req.flash("success" , "Logined Successfully");
            res.redirect("/index");
        })
    }
    catch(e)
    {
        console.log(e);
        req.flash("error" , e.message);
        res.redirect("/user/signup");
    }
})

router.get("/login",async(req,res)=>{
    res.render("./users/login.ejs");
})

router.post("/login",
    passport.authenticate("local",
    {
    failureRedirect:"/user/login", 
    failureFlash:true,
    }),
    async(req,res)=>{
        req.flash("success" , "Logined Successfully");
        let redirectUrl = res.locals.redirectUrl || "/index";
        res.redirect(redirectUrl);
});

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            console.log(err);
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/index");
    });
});

module.exports = router; 