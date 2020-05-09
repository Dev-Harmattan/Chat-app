const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const  Chat  = require("./models/Chat");
const connect = require("./dbconnect");
const chatrouter = require("./route/chatroute");



app.use(express.static("public"));
//body parser middleware
app.use(bodyParser.json());

//route
app.use("/chats", chatrouter);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on("disconnect", () => {
        console.log("user disconnect");
    });

    socket.on("typing", data => {
        socket.broadcast.emit("notifyTyping", {
          user: data.user,
          message: data.message
        });
      });
    
      //when soemone stops typing
      socket.on("stopTyping", () => {
        socket.broadcast.emit("notifyStopTyping");
      });

    //listen t client message
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);

        //broadcast message to everyone in the chat room
        socket.broadcast.emit("recieved", {message: msg});

        //save chat to the database
        connect.then( db => {
            console.log("connect to database");

            let chatMessage = new Chat({
                message: msg,
                sender: "Anonymous"
            });
            chatMessage.save();
        });
    });
});



http.listen(3000, () => {
    console.log("Server start at port: 3000");
});