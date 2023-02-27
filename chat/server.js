import express from "express";
import { Server } from "socket.io";

const PORT = 3000;
const app = express();
const options = {
  cors: true,
  origin: ['http://localhost:3000']
}

const server = app.listen(PORT, () => {
  console.log('server is started')
})

const io = new Server(server, options);

const messages = {}

function genMessageId() {
  const genPart = () => {
    return Math.floor((1 + Math.random()) * 0x999)
        .toString(16)
        .substring(1);
  }
  return genPart() + genPart() + '-' + genPart();
}

app.use(express.static('./dist'));

app.get('/', (req, res) => {
  res.sendFile("index.html");
})

io.on("connection", socket => {
  socket.emit('welcome', socket.id)
  socket.join('room1');
  socket.on('message', (message, userName) => {
    let messageID = genMessageId()
    io.to("room1").emit('receiveMessage', {
      userId: socket.id,
      message: message,
      messageId: messageID,
      userName: userName
    })
    messages[messageID] = message;
  })
  socket.on('deleteMessage', messageId => {
    delete messages[messageId];
    io.to('room1').emit('removeMessage', messageId);
  })
  socket.on('editMessage', (data) => {
    if (messages[data.messageId]) {
      messages[data.messageId] = data.message;
    }

    io.to('room1').emit('updateMessage', {
      messageId: data.messageId,
      message: messages[data.messageId]
    });
  })
})
