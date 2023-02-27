import io from 'socket.io-client';
import moment from 'moment';

const socket = io('http://localhost:3000');

const button = document.getElementById('send');
const input = document.getElementById('input');
let userId;
let userName;

button.addEventListener('click', () => {
  if(input.value === '') {
    return;
  }
  socket.emit('message', input.value, userName);
  input.value = '';
})

socket.on('welcome', id => {
  userId = id;
  userName = prompt('Enter user name')
  console.log(userId, userName)
})

socket.on('receiveMessage', response => {
  const isMessageFromUser = response.userId === userId;

  const chatContainer = document.createElement('div');
  chatContainer.classList.add('chatContainer');
  chatContainer.classList.add(isMessageFromUser ? 'right' : 'left')
  chatContainer.id = response.messageId

  const message = document.createElement('div');
  message.classList.add('message');
  if(!isMessageFromUser) {
    message.classList.add('friend')
  }

  const username = document.createElement('p');
  username.innerText = response.userName;
  username.classList.add('username');

  const date = document.createElement('p');
  date.innerText = moment().format('MM.DD.YYYY HH:mm');
  date.classList.add('date');

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message_container');

  const editImage = document.createElement('img')
  editImage.src = 'img/edit.png'
  editImage.classList.add('icons')
  editImage.classList.add('edit')
  editImage.onclick = () => handleEdit(response.messageId, response.message);

  const deleteImage = document.createElement('img')
  deleteImage.src = 'img/delete.png'
  deleteImage.classList.add('icons')
  deleteImage.addEventListener('click', () => socket.emit('deleteMessage', response.messageId))

  const iconsContainer = document.createElement('div')
  iconsContainer.classList.add('icons-container')

  iconsContainer.append(editImage, deleteImage)

  const messageInfo = document.createElement('div');
  messageInfo.classList.add('message_box')

  const textParagraph = document.createElement('p');
  textParagraph.innerText = response.message;
  chatContainer.appendChild(message);
  messageInfo.appendChild(username);
  message.appendChild(messageInfo);
  messageInfo.appendChild(date);
  messageContainer.append(textParagraph)
  isMessageFromUser ? messageInfo.append(iconsContainer) : ''
  message.appendChild(messageContainer);

  const chatMessageContainer = document.getElementsByClassName('chat')[0];
  chatMessageContainer.appendChild(chatContainer);
})

socket.on('removeMessage', (messageId) => {
  let messageContainerId = document.getElementById(messageId)
  messageContainerId.remove()
})

socket.on('updateMessage', ({messageId, message}) => {
  const messageContainer = document.querySelector(`div[id="${messageId}"] > div > div.message_container > p`)
  messageContainer.innerHTML = message
  document.querySelector(`div[id="${messageId}"] .edit`).onclick = () => handleEdit(messageId, message)
})

function handleEdit(id, message) {
  const messageContainer = document.querySelector(`div[id="${id}"] > div > div.message_container`)
  messageContainer.innerHTML = ''
  const editInput = document.createElement('input');
  editInput.value = message
  editInput.classList.add('edit-input')
  editInput.addEventListener('blur', () => {
    socket.emit('editMessage', {messageId: id, message: editInput.value})
    messageContainer.innerHTML = ''
    messageContainer.appendChild(document.createElement('p'))
  })
  messageContainer.appendChild(editInput);
}
