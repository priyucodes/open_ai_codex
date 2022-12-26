import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
}

// typewriter effect
function typeText(element, text) {
  let i = 0;

  let interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
    }
    // element.textContent += text[i];
    // i++;

    // if (i === text.length) {
    //   clearInterval(typeInterval);
    // }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
  <div class='wrapper ${isAi && 'ai'}'>
    <div class='chat'>
    <div class='profile'>
    <img src='${isAi ? bot : user}' alt='${isAi ? 'bot' : 'user'}' />
    </div>
    <div class='message' id=${uniqueId}>${value}</div>
    </div>
  </div>
  `;
}

const handleSubmit = async e => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();

  // empty space for loader
  chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

  // https://stackoverflow.com/questions/25505778/automatically-scroll-down-chat-div
  // scrollHeight: total container size.
  // scrollTop: amount of scroll user has done.
  // clientHeight: amount of container a user sees.
  // put new message in view
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // fetch data from server -> bot's response

  const response = await fetch('http://localhost:5000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: data.get('prompt') }),
  });
  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = `Something went wrong`;
    alert(err);
  }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});