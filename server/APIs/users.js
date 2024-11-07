const express = require('express');
const usersApp = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// let verifyToken = require('../Middlewares/verifyToken'); 

usersApp.use((req,res,next)=>{
    userscollection = req.app.get('userscollection')
    console.log("in users api")
    next();
})

//login api for user
usersApp.get('/login',async(req,res)=>{
    let userData = req.body;
    let loginData = await userscollection.findOne({username: userData.username});
    if(loginData === null){
        res.send({message : "user does not exists"});
    }
    else{
        const pass = await bcrypt.compare(userData.password,loginData.password);
        if(pass === false){ 
            res.send({message: "invalid password"});
        }
        else{
            const signedToken  = jwt.sign({username : loginData.username},'lekhansecretkey', {expiresIn : '1d'})
            const resLoginData = {
                ...loginData,
                password: ""
            }
            res.send({message: "login success", token: signedToken, user: resLoginData});
        }
    }
})

//register api for user
usersApp.post('/register', async (req, res) => {
    try {
        const userData = req.body;
        
        // Check if user already exists
        const registerData = await userscollection.findOne({ username: userData.username });
        
        if (registerData) {
            return res.status(409).send({ message: "User already exists" });
        }

        // Hash the password
        const encryptPass = await bcrypt.hash(userData.password, 10);

        // Insert new user
        await userscollection.insertOne({
            username: userData.username,
            password: encryptPass
        });

        res.send({ message: "Registration successful" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = usersApp 