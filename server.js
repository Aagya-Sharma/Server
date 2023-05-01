const express = require('express')
require('dotenv/config')
require('./config/databaseConnection')
const cors= require('cors');
const morgan = require("morgan");
const app = express();
const http = require("http");
const{Server} = require("socket.io");
const path = require("path")
const fileUpload = require('express-fileupload')

app.use(morgan("tiny"));
app.use(express.json())
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
  useTempFiles: true
}))


//routes
const authorizeRoute = require('./Routes/authorizeRoute')
app.use('/', authorizeRoute)

const userRoute = require('./Routes/userRoute')
app.use('/', userRoute)

const reviewRoute = require('./Routes/reviewsRoutes')
app.use('/',reviewRoute)

const doctorCategoryRoute = require('./Routes/doctorCategoryRouter')
app.use('/', doctorCategoryRoute)

const doctor = require('./Routes/doctorRouter')
app.use('/',doctor)

const upload = require('./Routes/upload')
app.use('/', upload)


// Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


//Port for Server
server.listen(8080, (req, res, next)=> {
    console.log("Listening the server")
}
);

