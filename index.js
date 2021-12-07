const express = require("express");
var http = require("http");
const app = express();
var cors = require('cors')
const port = process.env.PORT || 5000;
var server = http.createServer(app);
var io = require("socket.io")(server, {
	cors: {
		origin: "*",
	}
})

//middleware
app.use(express.json());
app.use(cors());

app.get('/products/', (req, res, next) => {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

io.on("connection", (socket) => {
	console.log("connected");
	console.log(socket.id, "has joined")
	
	
	socket.on("/test", (data)=>{
		console.log(data)
		socket.emit("jest", {
			"author": {
			  "firstName": "John",
			  "id": "b4878b96-efbc-479a-8291-474ef323dec7",
			  "imageUrl": "https://avatars.githubusercontent.com/u/14123304?v=4"
			},
			"createdAt": 1598438786000,
			"id": "8fa70836-3309-4d09-a777-4d9603e1f123",
			"status": "seen",
			"text": data.text,
			"type": "text"
		}, (res) => {
			console.log(">>> " + res)
		})
	})
});


server.listen(port, "0.0.0.0", () => {
	console.log("server started");
});