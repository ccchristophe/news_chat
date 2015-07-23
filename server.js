var express = require("express");
var app = express();
var path = require("path");

app.set("views", path.join(__dirname, "./client"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "./client")));

app.get("/", function (req, res){
	res.render("main");
});

//config socket.io
var server = app.listen(3011);
var io = require("socket.io").listen(server);

// var messamessages = [];
var users = [];
io.sockets.on("connection", function (socket){

	console.log("socket on" + socket.id);

	//prompt socket
	socket.on("newUser", function (user){
		console.log(user)
		users.push(user.name);
		io.emit("loginIn", {username: user.name});
		socket.emit("newUserLogingIn", {username: user.name});
	});

	//message socket
	socket.on("newMessage", function (userMessage){
		console.log(userMessage);
		// io.emit("messages", {messages : userMessage});
		socket.broadcast.emit("everyone_message", {messages : userMessage});
		socket.emit("one_message", {messages : userMessage});
	});
});