const express = require('express');
const messageApp = express.Router();

messageApp.use((req,res,next)=>{
    userscollection = req.app.get('messagecollection')
    console.log("in message api")
    next();
})



module.exports = messageApp ;