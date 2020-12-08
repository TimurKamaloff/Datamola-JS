import {
  showMainAuth, showRegWindow, showExitWindow, showErrorWindow
} from './showPage.js';
window.showMainAuth = showMainAuth;
window.showRegWindow = showRegWindow;
window.showExitWindow = showExitWindow;
window.showErrorWindow = showErrorWindow;

class ChatApiService {
  constructor(url) {
    this.url = url;
    this.getMessagesTimeout = null;
  }

  login(name, pass) {
    let formData = new FormData();
    formData.append('name', name);
    formData.append('pass', pass);
    fetch(`${this.url}/auth/login`, {
      method: 'POST',
      body: formData
    }).then((res) => {
      return res.json();
    }).then((res) => {
      if (res.token) {
        localStorage.setItem('currentPage', 'main');
        localStorage.setItem('token', res.token);
        localStorage.setItem('currentUser', name);
        location.reload();
      } else {
        let inp = document.querySelectorAll('input');
        inp[0].classList = 'invalid-input';
        inp[1].classList = 'invalid-input';
        document.querySelectorAll('.invalid-info')[0].innerHTML = 'Вы ввели неверный логин или пароль';
      }
    });
  }

  registr(name, pass) {
    let formData = new FormData();
    formData.append('name', name);
    formData.append('pass', pass);
    fetch(`${this.url}/auth/register`, {
      method: 'POST',
      body: formData
    }).then(() => {
      localStorage.setItem('currentPage', 'enter');
      location.reload();
    });
  }

  getMessages = function (skip, top, filterConfig) {
    if (this.getMessagesTimeout) {
      clearTimeout(this.getMessagesTimeout);
    }
    let msgs = [];
    let fullUrl = `${this.url}/messages?skip=${skip}&top=${top}`;

    if (filterConfig.author) {
      fullUrl += `&author=${filterConfig.author}`;
    }
    if (filterConfig.text) {
      fullUrl += `&text=${filterConfig.text}`;
    }
    if (filterConfig.dateFrom) {
      let date = filterConfig.dateFrom.replace('-', '');
      date = date.replace('-', '');
      fullUrl += `&dateFrom=${date}`;
    }
    if (filterConfig.dateTo) {
      let date = filterConfig.dateTo.replace('-', '');
      date = date.replace('-', '');
      fullUrl += `&dateTo=${date}`;
    }
    return fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  get() {
    return fetch(`${this.url}/messages?skip=0&top=999999999999999&author=${localStorage.getItem('currentUser')}`, {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getActiveUsers() {
    return fetch(`${this.url}/users`);
  }

  addMessage(text, author, isPersonal, to) {
    let data = {
      text: text,
      isPersonal: isPersonal
    };
    if (data.isPersonal) {
      data.to = to;
    }
    data = JSON.stringify(data);
    return fetch(`${this.url}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: data
    });
  }

  removeMessage(id) {
    return fetch(`${this.url}/messages/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  editMessage(editedMsg) {
    let data = {
      text: editedMsg.text,
      isPersonal: editedMsg.isPersonal
    };
    if (data.isPersonal) {
      data.to = editedMsg.to;
    }
    data = JSON.stringify(data);
    return fetch(`${this.url}/messages/${editedMsg.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: data
    }).then(()=> {
      myController.showMessages();
    });
  }

  exit() {
    return fetch(`${this.url}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}

class MessageList {
  constructor() {
    this._user = null;
    this._msgs = [];
    this.idCount = 25;
  }

  get user() {
    return this._user;
  }

  set user(newUser) {
    this._user = newUser;
  }

  getPage(skip = 0, top = 10, filterConfig = {}) {
    if (this._msgs.length === 0) {
      this.restore();
    }
    for (let i = 0; i < this._msgs.length; i++) {
      this._msgs[i]._createdAt = new Date(this._msgs[i]._createdAt);
    }
    let resultArr = [];
    let accessMsgs = this._msgs.filter((msg) => {
      if ((msg.author === this.user) || !((msg.isPersonal === true && msg.to !== this.user))) {
        return msg;
      }
    });
    if (Object.keys(filterConfig).length === 0) {
      accessMsgs.sort((a, b) => {
        return -(a.createdAt - b.createdAt);
      });
      resultArr = accessMsgs.slice(skip, skip + top);
      return resultArr.reverse();
    }

    if ('author' in filterConfig) {
      let wantedAuthor = filterConfig.author.toLowerCase();
      for (let i = 0; i < accessMsgs.length; i++) {
      }
      resultArr = accessMsgs.filter(msg => msg.author.toLowerCase().includes(wantedAuthor));
      if (resultArr.length === 0) return false;
    }

    if (('dateFrom' in filterConfig || 'dateTo' in filterConfig)) {
      if (Date.parse(filterConfig.dateFrom) > (Date.parse(filterConfig.dateTo))) return false; // некорректный ввод даты
      filterConfig.dateFrom = filterConfig.dateFrom || new Date('January 1, 1970 00:00:00'); // дефолтные значения, можно написать и в аргументы,
      filterConfig.dateTo = filterConfig.dateTo || new Date('January 1, 2970 00:00:00'); // но пускай будут тут
      if (resultArr.length === 0) { // проверка на то, что массив попал на первую фильтрацию
        resultArr = accessMsgs.filter((msg) => {
          if ((Date.parse(msg.createdAt) > Date.parse(filterConfig.dateFrom)) && (Date.parse(msg.createdAt) < Date.parse(filterConfig.dateTo))) {
            return msg;
          }
        });
      } else {
        resultArr = resultArr.filter((msg) => {
          if ((Date.parse(msg.createdAt) > Date.parse(filterConfig.dateFrom)) && (Date.parse(msg.createdAt) < Date.parse(filterConfig.dateTo))) {
            return msg;
          }
        });
        if (resultArr.length === 0) return false;
      }
    }

    if ('text' in filterConfig) {
      if (resultArr.length === 0) {
        resultArr = accessMsgs.filter((msg) => {
          if (msg.text.toLowerCase().includes(filterConfig.text.toLowerCase())) return msg;
        });
        if (resultArr.length === 0) return false;
      } else {
        resultArr = resultArr.filter((msg) => {
          if (msg.text.toLowerCase().includes(filterConfig.text.toLowerCase())) return msg;
        });
      }
    }

    resultArr.sort((a, b) => {
      return -(b.createdAt - a.createdAt);
    });
    return resultArr.slice(skip, skip + top);
  }

  get(id = '') {
    if (id === '' || Number(id) < 0) return false;
    return this._msgs.find(msg => msg.id === id);
  }

  add(msg = {}) {
    if (!this.user) {
      return false;
    }
    let newMsg = new Message({
      id: `${this.idCount++}`, text: msg.text, createdAt: new Date(), author: this.user, isPersonal: msg.isPersonal
    });
    if (msg.isPersonal) {
      newMsg.to = msg.to;
    }
    if (MessageList.validate(newMsg)) {
      this._msgs.push(newMsg);
      this.save(newMsg);
      return true;
    }
    return false;
  }

  edit(id = '', msg = {}) {
    if (id === '' || Number(id) < 0 || arguments[0] === undefined) return false;
    const userMsg = this._msgs.find(msg => msg.id === id);
    if (userMsg.author !== this.user) {
      return false;
    }
    let newMsg = new Message({
      id: userMsg.id, text: msg.text, createdAt: userMsg.createdAt, author: userMsg.author, isPersonal: userMsg.isPersonal
    });
    if (newMsg.isPersonal) {
      newMsg.to = userMsg.to;
    }
    if (MessageList.validate(newMsg)) {
      this._msgs.splice(this._msgs.lastIndexOf(userMsg), 1, newMsg);
      this.save();
      return true;
    }
    return false;
  }

  remove(id = '') {
    if (id === '' || +id < 0) return false;
    // та же проверка что и в edit
    const userMsg = this._msgs.find(msg => msg.id === id);
    if (userMsg.author !== this.user) {
      return false;
    }
    this._msgs.splice(this._msgs.lastIndexOf(userMsg), 1);
    return true;
  }

  static validate(msg = {}) {
    if (Object.keys(msg).length === 0) return false;
    let exampleMsg = {
      id: '',
      text: '',
      createdAt: new Date(),
      author: '',
      isPersonal: true
    };
    if (msg.text.length < 1 || msg.text.length > 200) {
      return false;
    }
    for (let key in exampleMsg) {
      if (!(key in msg) || (typeof (exampleMsg[key]) !== typeof (msg[key]))) return false;
    }
    return true;
  }

  addAll(arrMsg) {
    let invalidMsg = [];
    let myMsgs = [];
    for (let i = 0; i < arrMsg.length; i++) {
      if (MessageList.validate(arrMsg[i])) {
        myMsgs.push(arrMsg[i]);
      } else {
        invalidMsg.push(arrMsg[i]);
      }
    }
    this._msgs = myMsgs;
    this.idCount = (+this._msgs[this._msgs.length - 1].id + 1).toString();
    return invalidMsg;
  }

  clear() {
    this._msgs = null;
    this.idCount = 0;
    return true;
  }
}

class Message {
  constructor(options) {
    this._id = options.id;
    this.text = options.text;
    this._createdAt = options.createdAt;
    this._author = options.author;
    this.isPersonal = options.isPersonal;
    this.to = options.to || null;
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get author() {
    return this._author;
  }
}

window.myApi = new ChatApiService('https://jslabdb.datamola.com');

if (localStorage.getItem('currentPage') === 'main') {
  showMainAuth();
  window.randomColor = () => {
    let a = Math.random() * 255;
    let b = Math.random() * 255;
    let c = Math.random() * 255;
    return `rgb(${a}, ${b}, ${c})`;
  };
  const setUserColor = function () {
    let usersColors = {};
    let userArr = myApi.getActiveUsers();
    userArr.then(res => {
      return res.json();
    }).then((res) => {
      for (let user in res) {
        let userName = res[user].name;
        usersColors[userName] = randomColor();
        localStorage.setItem('usersColors', JSON.stringify(usersColors));
      }
    });
  };
  class UserList {
    constructor(users, activeUsers) {
      this.users = JSON.parse(localStorage.getItem('users'));
      this.activeUsers = JSON.parse(localStorage.getItem('activeUsers'));
    }

    save() {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  class HeaderView {
    constructor(id) {
      this.element = document.getElementById(id);
    }

    display(currentUser) {
      if (localStorage.getItem('currentUser')) {
        this.element.innerHTML = `Вы вошли как ${currentUser}`;
      }
      if (localStorage.getItem('currentUser') == 'null' || localStorage.getItem('currentUser') == 'undefined') {
        this.element.innerHTML = 'Вы не авторизованы';
      }
    }
  }

  class MessageView {
    constructor(id) {
      this.element = document.getElementById(id);
    }

    display(arrMsg, currentUser) {
      if (!localStorage.getItem('usersColors')) {
        let obj = setUserColor();
        localStorage.setItem('usersColor', JSON.stringify(obj));
      }
      this.element.innerHTML = '';
      let msgStr = '';
      for (let i = 0; i < arrMsg.length; i++) {
        if (arrMsg[i].author === currentUser && !arrMsg[i].isPersonal) {
          msgStr += makeReplace('my-msg', arrMsg[i]).replace('<i>FROM', `<i>${arrMsg[i].author}`);
          continue;
        }
        if (arrMsg[i].isPersonal && arrMsg[i].author === currentUser) {
          msgStr += makeReplace('my-personal-msg', arrMsg[i]).replace('<i>FROM', `<i>от вас для <span style="font-weight:bold">${arrMsg[i].to}</span>`);
          continue;
        }
        if (arrMsg[i].isPersonal && arrMsg[i].to === currentUser) {
          msgStr += makeReplace('for-me', arrMsg[i]).replace('<i>FROM', `<i>от ${arrMsg[i].author} для <span style="font-weight:bold">Вас</span>`);
          continue;
        } else {
          msgStr += makeReplace('for-all', arrMsg[i]).replace('<i>FROM', `<i>${arrMsg[i].author}`);
          continue;
        }
      }
      this.element.innerHTML = msgStr;
    }
  }

  class ActiveUsersView {
    constructor(id) {
      this.element = document.getElementById(id);
    }

    display(arrUser, currentUser) {
      this.element.innerHTML = '';
      let userStr = '';
      for (let i = 0; i < arrUser.length; i++) {
        let firstLetters = arrUser[i].slice(0, 2).toUpperCase();
        let color = randomColor();
        if (arrUser[i] !== currentUser) {
          userStr += document.getElementById('user')
            .innerHTML
            .replace('<p>ЛОГ', `<p>${firstLetters}`)
            .replace('background-color', `background-color: ${color}`)
            .replace('Логин пользователя', `${arrUser[i]}`)
            .replace('<i data-to="to"', `<i data-to=${arrUser[i]}`);
        }
      }
      this.element.innerHTML = userStr;
    }
  }

  const makeReplace = (templateId, msg) => {
    let firstLetters = msg._author.slice(0, 2).toUpperCase();
    let color = randomColor();
    let str = document.getElementById(`${templateId}`)
      .innerHTML.replace('<span>userText</span>', `<span>${msg.text}</span>`)
      .replace('<p>ЛОГ', `<p>${firstLetters}`)
      .replace('background-color', `background-color:${color}`)
      .replace('DATE', formatDate(msg._createdAt))
      .replace('button data-delete="id"', `button data-delete=${msg.id}`)
      .replace('button data-edit="id"', `button data-edit=${msg.id}`);
    return str;
  };

  const formatDate = (date) => {
    return `${addNull(date.getDate())}.${addNull(date.getMonth() + 1)}.${addNull(date.getFullYear())} ${addNull(date.getHours())}:${addNull(date.getMinutes())}`;
  };

  const addNull = (numb) => {
    return (numb > 9) ? numb : `0${numb}`;
  };

  function clearFilt() {
    textFilter.value = '';
    authorFilter.value = '';
    dateFilter[0].value = dateFilter[1].value = '';
    myController.currentFilter = {};
    myController.msgCount = 10;
    myController.showMessages();
  }

  const usersColors = {};
  class ChatController {
    constructor() {
      this.header = new HeaderView('user-name');
      this.messageView = new MessageView('message-list');
      this.activeUserList = new ActiveUsersView('users');
      this.currentRecipient = null;
      this.msgCount = 10;
      this.currentFilter = {};
      this.currentEditMsg = {};
      this.getMessagesTimeout = null;
      this.activeUsersTimeout = null;
    }

    addMessage = (text, isPersonal = false, to) => {
      let msg = myApi.addMessage(text, localStorage.getItem('currentuser'), isPersonal, to);
      return true;
    };

    editMessage = (msg) => {
      myApi.editMessage(msg);
      return true;
    };

    downloadMoreMsg = () => {
      this.msgCount += 10;
      this.showMessages(0, this.msgCount, this.currentFilter);
    }

    removeMessage = (id) => {
      myApi.removeMessage(id);
      this.showMessages(0, this.msgCount, this.currentFilter);
      return true;
    };

    showActiveUsers = () => {
      if (this.activeUsersTimeout) {
        clearTimeout(this.activeUsersTimeout);
      }
      let users = myApi.getActiveUsers();
      let activeUsers = [];
      users.then(res=> {
        return res.json();
      }).then(res=> {
        res.forEach(element => {
          if (element.isActive) {
            activeUsers.push(element.name);
          }
        });
        myController.activeUserList.display(activeUsers, localStorage.getItem('currentUser'));
        this.activeUsersTimeout = setTimeout(()=>{
          this.showActiveUsers();
        }, 60 * 1000);
      });
      return true;
    };

    setCurrenUser = (user) => {
      myApi.user = user;
      this.header.display(localStorage.getItem('currentUser'));
      localStorage.setItem('currentUser', user);
      this.showActiveUsers();
      this.showMessages(0, 10);
      return true;
    };

    showMessages(skip = 0, top = 10, filterConfig = {}) {
      if (this.getMessagesTimeout) {
        clearTimeout(this.getMessagesTimeout);
      }
      let msgsArr = [];
      let msgs = myApi.getMessages(skip, top, filterConfig);
      msgs.then(res=> {
        return res.json();
      }).then(res => {
        res.forEach(element => {
          msgsArr.push(new Message({
            id: element.id, text: element.text, createdAt: new Date(element.createdAt), author: element.author, isPersonal: element.isPersonal, to: element.to
          }));
        });
        this.messageView.display(msgsArr.reverse(), localStorage.getItem('currentUser'));
        this.getMessagesTimeout = setTimeout(()=>{
          this.showMessages(skip, top, filterConfig);
        }, 60 * 1000);
      });
      return true;
    }
  }

  let msgInput = document.querySelector('.write-message input');
  const activeUsersList = document.querySelector('.active-users');
  const downloadMore = document.querySelector('.download');
  const textFilter = document.getElementById('text-filter');
  const authorFilter = document.getElementById('author-filter');
  const dateFilter = document.querySelectorAll('.date-filter input');
  const clearFilterOptions = document.getElementById('clear-filter-options');
  const controlMyMsgs = document.getElementById('message-list');
  let confirmEdit = document.querySelector('.confirm-edit');
  const exitBtn = document.querySelector('.exit button');
  let sendBtn = document.getElementsByClassName('send-btn')[0];
  window.myController = new ChatController();

  exitBtn.onclick = function () {
    myController.setCurrenUser(null);
    localStorage.setItem('currentPage', 'enter');
    localStorage.setItem('token', null);
    myApi.exit().then(()=> {
      localStorage.removeItem('currentUser');
      localStorage.setItem('currentPage', 'enter');
      location.reload();
    });
  };

  sendBtn.onclick = function () {
    if (myController.currentRecipient) {
      myController.addMessage(msgInput.value, true, myController.currentRecipient);
      msgInput.value = '';
      document.getElementById('to').innerHTML = '';
      myController.currentRecipient = null;
      myController.showMessages();
    } else {
      myController.addMessage(msgInput.value, false, null);
      msgInput.value = '';
      document.getElementById('to').innerHTML = '';
      myController.showMessages();
    }
    myController.showMessages();
  };
  msgInput.addEventListener('keydown', (btn) => {
    if (btn.keyCode === 13) {
      if (myController.currentEditMsg.id) {
        myController.currentEditMsg.text = msgInput.value;
        myController.editMessage(myController.currentEditMsg);
        msgInput.value = '';
        myController.currentEditMsg = {};
        sendBtn.style.display = 'block';
        confirmEdit.style.display = 'none';
      }
      if (myController.currentRecipient) {
        myController.addMessage(msgInput.value, true, myController.currentRecipient);
        msgInput.value = '';
        document.getElementById('to').innerHTML = '';
        myController.currentRecipient = null;
        myController.showMessages();
      }
      if (!myController.currentRecipient) {
        myController.addMessage(msgInput.value, false, null);
        msgInput.value = '';
        document.getElementById('to').innerHTML = '';
        myController.showMessages();
        return;
      }
      myController.showMessages();
    }
  });

  confirmEdit.onclick = function () {
    myController.currentEditMsg.text = msgInput.value;
    myController.editMessage(myController.currentEditMsg);
    msgInput.value = '';
    myController.currentEditMsg = {};
    sendBtn.style.display = 'block';
    confirmEdit.style.display = 'none';
  };

  authorFilter.addEventListener('input', () => {
    myController.currentFilter.author = authorFilter.value;
    if (authorFilter.value === '') {
      delete myController.currentFilter.author;
    }
    myController.showMessages(0, 10, myController.currentFilter);
  });

  textFilter.addEventListener('input', () => {
    myController.currentFilter.text = textFilter.value;
    if (textFilter.value === '') {
      delete myController.currentFilter.text;
    }
    myController.showMessages(0, 10, myController.currentFilter);
  });

  clearFilterOptions.addEventListener('click', clearFilt);

  downloadMore.addEventListener('click', myController.downloadMoreMsg);
  dateFilter[0].addEventListener('input', function () {
    myController.currentFilter.dateFrom = dateFilter[0].value;
    myController.showMessages(0, 10, myController.currentFilter);
  });
  dateFilter[1].addEventListener('input', function () {
    if (dateFilter[1].value === '') {
      delete myController.currentFilter.dateTo;
    }
    myController.currentFilter.dateTo = dateFilter[1].value;
    myController.showMessages(0, 10, myController.currentFilter);
  });

  controlMyMsgs.addEventListener('click', function (event) {
    let target = event.target;
    if ('delete' in target.dataset) {
      myController.removeMessage(target.dataset.delete);
    }
    if ('edit' in target.dataset) {
      sendBtn.style.display = 'none';
      confirmEdit.style.display = 'block';
      let editMessage = myApi.get(target.dataset.edit);
      editMessage.then(res => {
        return res.json();
      }).then(res => {
        for (let key in res) {
          if (res[key].id === target.dataset.edit) {
            let msg = res[key];
            msgInput.value = msg.text;
            myController.currentEditMsg = msg;
          }
        }
      }).then(()=>{
        myController.showMessages();
      });
    }
    myController.showMessages();
  });

  activeUsersList.addEventListener('click', function (event) {
    let target = event.target;
    if (target.tagName === 'I') {
      document.getElementById('to').innerHTML = `Вы пишите личное сообщение для ${target.dataset.to} <span class="cancel-pers">ОТМЕНИТЬ</span>`;
      document.querySelector('.cancel-pers').onclick = function () {
        myController.currentRecipient = null;
        msgInput.value = '';
        document.getElementById('to').innerHTML = '';
      };
      myController.currentRecipient = target.dataset.to;
      msgInput = document.querySelector('.write-message input');
    }
  });
  myController.setCurrenUser(localStorage.getItem('currentUser'));
}
/// ////// если не залогинен
if (localStorage.getItem('currentPage') === 'registr' || !localStorage.getItem('currentPage')) {
  showRegWindow();
  const regBtn = document.querySelector('.regist-btn');
  const regInputs = document.querySelectorAll('.input');
  const a = document.querySelectorAll('.reg-info a');
  a[0].addEventListener('click', function () {
    localStorage.setItem('currentPage', 'enter');
    location.reload();
  });
  a[1].addEventListener('click', function () {
    localStorage.setItem('currentUser', undefined);
    location.reload();
  });
  regBtn.addEventListener('click', function () {
    if (regInputs[0].value === '') {
      regInputs[0].classList = 'invalid-input';
      document.querySelectorAll('.invalid-info')[0].innerHTML = 'Введите ваш логин';
    }
    if (regInputs[1].value === '' || regInputs[2].value === '') {
      regInputs[1].classList = 'invalid-input';
      regInputs[2].classList = 'invalid-input';
      document.querySelectorAll('.invalid-info')[1].innerHTML = 'Нужно ввести пароль, а затем повторить его';
    } else if (regInputs[1].value !== regInputs[2].value) {
      regInputs[1].classList = 'invalid-input';
      regInputs[2].classList = 'invalid-input';
      document.querySelectorAll('.invalid-info')[1].innerHTML = 'Пароли не совпадают';
    } else {
      myApi.registr(regInputs[0].value, regInputs[1].value);
    }
  });
  document.querySelectorAll('.main-window-reg')[0].addEventListener('keydown', (btn) => {
    if (btn.keyCode === 13) {
      if (regInputs[0].value === '') {
        regInputs[0].classList = 'invalid-input';
        document.querySelectorAll('.invalid-info')[0].innerHTML = 'Введите ваш логин';
      }
      if (regInputs[1].value === '' || regInputs[2].value === '') {
        regInputs[1].classList = 'invalid-input';
        regInputs[2].classList = 'invalid-input';
        document.querySelectorAll('.invalid-info')[1].innerHTML = 'Нужно ввести пароль, а затем повторить его';
      } else if (regInputs[1].value !== regInputs[2].value) {
        regInputs[1].classList = 'invalid-input';
        regInputs[2].classList = 'invalid-input';
        document.querySelectorAll('.invalid-info')[1].innerHTML = 'Пароли не совпадают';
      } else {
        myApi.registr(regInputs[0].value, regInputs[1].value);
      }
    }
  });
}
if (localStorage.getItem('currentPage') === 'enter') {
  showExitWindow();
  let enterInp = document.querySelectorAll('input');
  let enterBtn = document.querySelectorAll('button');
  let a = document.querySelectorAll('span a');

  enterBtn[0].addEventListener('click', function () {
    myApi.login(enterInp[0].value, enterInp[1].value);
  });
  a[0].addEventListener('click', function () {
    localStorage.setItem('currentPage', 'registr');
    location.reload();
  });
  a[1].addEventListener('click', function () {
    localStorage.setItem('currentPage', 'main');
    location.reload();
  });
  document.querySelector('.enter-window').addEventListener('keydown', (btn) => {
    if (btn.keyCode === 13) {
      myApi.login(enterInp[0].value, enterInp[1].value);
    }
  });
}
if (localStorage.getItem('currentPage') === 'error') {
  showErrorWindow(localStorage.getItem('error'), localStorage.getItem('error'));
  document.querySelectorAll('.text a')[0].onclick = function () {
    localStorage.setItem('currentPage', 'main');
    localStorage.setItem('error', 'null');
    location.reload();
  };
}
