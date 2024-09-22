const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let pages = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("create_page", (page) => {
    pages.push(page);
    io.emit("page_created", page);
  });

  socket.on("update_page", (updatedPage) => {
    const index = pages.findIndex((page) => page.id === updatedPage.id);
    if (index !== -1) {
      pages[index] = updatedPage;
      io.emit("page_updated", updatedPage);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
