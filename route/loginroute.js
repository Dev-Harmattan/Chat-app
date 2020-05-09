const express = require("express");
const router = express.Router();
const Chat = require("./../models/Chat");
const connect = require("./../dbconnect");


router.route("/login").post( (req, res, next) => {
    let chatMessage = new Chat({
        sender: req.body.username,
        password: req.body.password
    });
    
    req.login(chatMessage, function(err){
        if(err){
            console.log(err);
            res.redirect(__dirname + "/register");
        }else{
            passport.authenticate("local")(req, res, function(){
                console.log(req);
               res.sendFile(__dirname + "/index.html");
            })
        }
    });
});

module.exports = router;