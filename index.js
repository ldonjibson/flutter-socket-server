const express = require("express");
var http = require("http");
const app = express();
var cors = require('cors')
var ApiCalls = require('./apicall')
const port = process.env.PORT || 3000;
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
	
	socket.emit("connected", {socket: socket.id})

	//on landing of the visitor
	socket.on("visitor_on_page", async (data) => {
		console.log(data)
		let call = new ApiCalls(data.api_token)
		let res = await call.postApi(`visitor_info/${data.api_token}`, {
			api_token: data.api_token,
			room_id: data.room_id
		})
		// console.log(res, "re>>>>>")

		//broadcast to all agent under that apitoken and return the visitor's details
		if (res.status == "success"){
			io.emit(`visitor_on_page_${data.api_token}`, {
				details: res.visitor,
			})
		}		
	})

	socket.on("visitor_register", async (data) => {
		console.log(data)
		let call = new ApiCalls(data.api_token)
		let res = await call.postApi(`visitor_info/${data.api_token}`, {
			api_token: data.api_token,
			visitor_name: data.visitor_name,
			visitor_email: data.visitor_email,
			status: data.status,
			room_id: data.room_id
		})
		// console.log(res, "re>>>>>")
		if (res.status == "success"){
			socket.emit(data.room_id, {
				details: res.visitor,
			})
		}
	})

	//send message to agent ot visitor
	socket.on("send_message", async (data) => {
		console.log(data)

		let call = new ApiCalls(data.api_token)
		let res = await call.postApi(`send_message/${data.api_token}`, {
			api_token: data.api_token,
			visitor_id: data.visitor_id || null,
			agent_id: data.agent_id || null,
			message: data.message || null,
			room_id: data.room_id
		})
		console.log(res, "re>>>>>")
		if (res.status == "success"){
			socket.emit(data.room_id, {
				details: res.chat,
			})
		}
	})
		
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