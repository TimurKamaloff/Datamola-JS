const addModule = (function () {
  let count = 19; // потому что последний id  в объекте 23
  let currentAuthor = 'автор';
  let currentRecipient = 'получатель';
  function nextCount() {
    return ++count;
  }
  function dropCount() {
    count = 0;
  }
  function getCount() {
    return count;
  }
  return {
    next: nextCount,
    init: dropCount,
    get: getCount,
    currentAuthor,
    currentRecipient
  };
}());

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

class MessageList {
  constructor(msgs) {
    this._collection = null;
    this._user = 'Тимур';
    this._msgs = msgs;
  }

  get user() {
    return this._user;
  }

  getPage(skip = 0, top = 10, filterConfig = {}) {
    let resultArr = [];
    let accessMsgs = this._msgs.filter((msg) => {
      if ((msg.author === this._user) || !((msg.isPersonal === true && msg.to !== this._user))) {
        return msg;
      }
    });
    if (Object.keys(filterConfig).length === 0) {
      accessMsgs.sort((a, b) => {
        return -(Date.parse(a.createdAt) - Date.parse(b.createdAt));
      });
      resultArr = accessMsgs.slice(skip, skip + top);
      return resultArr.reverse();
    }

    if ('author' in filterConfig) {
      let wantedAuthor = filterConfig.author.toLowerCase();
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
      return -(Date.parse(b.createdAt) - Date.parse(a.createdAt));
    });
    return resultArr.slice(skip, skip + top).reverse();
  }

  get(id = '') {
    if (id === '' || Number(id) < 0) return false;
    Object.keys(this._msgs).forEach(function (key) {
      if (this._msgs[key].id === id) return this._msgs[key];
    });
    return false;
  }

  add(msg = {}) {
    if (!myMsgList.user) {
      return false;
    }
    let newMsg = {};
    newMsg.id = `${addModule.next()}`;
    Object.keys(msg).forEach(function (key) {
      if (key !== 'id' && key !== 'createdAt' && key !== 'author') {
        switch (key) {
          case ('text'): {
            if (msg[key].length < 200) newMsg[key] = msg[key]; break;
          }
          case ('isPersonal'): {
            if (msg[key]) {
              newMsg.isPersonal = true;
              if (!MessageList._user) newMsg.to = undefined;
              newMsg.to = 'Какой-то пользователь';
            }
            if (!msg[key]) {
              newMsg.isPersonal = false;
            }
            break;
          }
          case ('to'): {
            newMsg.isPersonal = true;
            newMsg.to = msg.to;
            break;
          }
          default: {
            break;
          }
        }
      }
    });
    newMsg.createdAt = new Date();
    newMsg.author = this._user;
    this._msgs.push(new Message(newMsg));
    return true;
  }

  edit(id = '', msg = {}) {
    if (id === '' || Number(id) < 0 || arguments[0] === undefined) return false;
    let userMsg;
    // Проверка на то, что пользователь является автором этого сообщ и может его редачить
    for (let i = 0; i < this._msgs.length; i++) {
      if (this._msgs[i].id === id) {
        if (this._msgs[i].author !== this._user) {
          return false;
        }
        userMsg = this._msgs[i];
      }
    }
    let newMsg = {};
    if ('text' in msg && msg['text'].length < 200) {
      userMsg.text = msg.text;
    } 
    if ('isPersonal' in msg) {
      if (msg.isPersonal) {
        userMsg.isPersonal = true;
        userMsg.to = msg.to;
      } else {
        userMsg.isPersonal = false;
      }
    }
    if ('id' in msg || 'createAt' in msg || 'author' in msg) {
      return false;
    }
    return true;
  }

  remove(id = '') {
    if (id === '' || Number(id) < 0) return false;
    // та же проверка что и в edit
    for (let i = 0; i < this._msgs.length; i++) {
      if (this._msgs[i].id === id && this._msgs[i].author !== myMsgList.user) {
        return false;
      }
    }
    for (let i = 0; i < this._msgs.length; i++) {
      if (this._msgs[i].id === id) {
        this._msgs.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  static _validate(msg = {}) {
    if (Object.keys(msg).length === 0) return false;
    let exampleMsg = {
      id: '',
      text: '',
      createdAt: new Date(),
      author: '',
      isPersonal: true
    };
    for (let key in exampleMsg) {
      if (!(key in msg) || (typeof (exampleMsg[key]) !== typeof (msg[key]))) return false;
    }
    return true;
  }

  static addAll(arrMsg) {
    let invalidMsg = [];
    let myCollect = [];
    for (let i = 0; i < arrMsg.length; i++) {
      if (MessageList._validate(arrMsg[i])) {
        myCollect.push(arrMsg[i]);
      } else {
        invalidMsg.push(arrMsg[i]);
      }
    }
    this.collection = myCollect;
    return invalidMsg;
  }

  static clear() {
    this.collection = null;
    return true;
  }
}

let msgs = [
  new Message({
    id: '1', text: 'Как уже ясно из названия, цель', createdAt: new Date(), author: 'Александр', isPersonal: false
  }),
  new Message({
    id: '2', text: 'такого материала – максимально', createdAt: new Date('2020-09-11T16:18:00'), author: 'Матвей', isPersonal: false
  }),
  new Message({
    id: '3', text: 'полно информировать пользователя', createdAt: new Date('2020-09-11T17:18:00'), author: 'София', isPersonal: false
  }),
  new Message({
    id: '4', text: 'Извещатель автономный ИП 212-52Т предназначен для установки в бытовые, офисные, промышленные помещения. Незаменим при обнаружении задымленности окружающего воздуха, при котором выдается тревожный сигнал в виде мигания встроенного светодиода и длительных звуковых сигналов. Защищаемая площадь до 85 м2.', createdAt: new Date('2020-09-11T16:19:00'), author: 'Анна', isPersonal: true, to: 'Тимур'
  }),
  new Message({
    id: '5', text: 'Монтируется на потолок или стену, температурный диапазон от -10 до +55С.', createdAt: new Date('2020-09-05T16:18:00'), author: 'Мария', isPersonal: false
  }),
  new Message({
    id: '6', text: 'afЧувствительность извещателя соответствует задымленности среды с оптической плотностью, дБ/м от 0,01 до 0,2. Напряжение питания от 7,5 до 10В. awfs', createdAt: new Date('2020-10-10T06:28:00'), author: 'Ксения', isPersonal: true, to: 'Тимур'
  }),
  new Message({
    id: '7', text: 'Выравнивание текста по центру. Текст помещается по центру горизонтали окна браузера или контейнера, где расположен текстовый блок. Строки текста словно нанизываются на невидимую ось, которая проходит по центру веб-страницы. Подобный способ выравнивания активно используется в заголовках и различных подписях, вроде подрисуночных, он придает официальный и солидный вид оформлению текста. Во всех других случаях выравнивание по центру применяется редко по той причине, что читать большой объем такого текста неудобно.', createdAt: new Date('2020-10-10T16:18:00'), author: 'Анастасия', isPersonal: false
  }),
  new Message({
    id: '8', text: 'Потребляемый ток в дежурном режиме не более 15 мкА. Габаритные размеры — 45х98 мм.', createdAt: new Date('2020-11-10T16:58:00'), author: 'Тимур', isPersonal: true, to: 'Cаня'
  }),
  new Message({
    id: '9', text: 'afawfs', createdAt: new Date('2020-11-10T16:18:00'), author: 'Мария', isPersonal: false
  }),
  new Message({
    id: '10', text: 'Аналогично значению right, если текст идёт слева направо и left, когда текст идёт справа налево', createdAt: new Date('2020-12-10T16:18:00'), author: 'Ольга', isPersonal: false
  }),
  new Message({
    id: '11', text: 'afawfs', createdAt: new Date('2020-12-11T16:18:00'), author: 'Ксения', isPersonal: false
  }),
  new Message({
    id: '12', text: 'Выравнивание текста по центру. Текст помещается по центру горизонтали окна браузера или контейнера, где расположен текстовый блок. Строки текста словно нанизываются на невидимую ось, которая проходит по центру веб-страницы. Подобный способ выравнивания активно используется в заголовках и различных подписях, вроде подрисуночных, он придает официальный и солидный вид оформлению текста. Во всех других случаях выравнивание по центру применяется редко по той причине, что читать большой объем такого текста неудобно.', createdAt: new Date('2020-12-12T16:18:00'), author: 'Анна', isPersonal: false
  }),
  new Message({
    id: '13', text: 'afawfs', createdAt: new Date('2020-01-10T16:18:00'), author: 'author #12', isPersonal: false
  }),
  new Message({
    id: '14', text: 'Не изменяет положение элемента.', createdAt: new Date('2019-01-08T16:18:00'), author: 'Матвей', isPersonal: true, to: 'Александр'
  }),
  new Message({
    id: '15', text: 'afawfs', createdAt: new Date('2029-01-09T16:18:00'), author: 'Максим', isPersonal: false
  }),
  new Message({
    id: '17', text: 'afawfs', createdAt: new Date('2011-02-10T16:18:00'), author: 'Александр', isPersonal: false
  }),
  new Message({
    id: '18', text: 'test new getPage()', createdAt: new Date('2029-02-10T16:18:00'), author: 'Анастасия', isPersonal: true, to: 'Мария'
  }),
  // два невалидных сообщ
  new Message({
    id: '19', text: 'Наследует значение родителя', author: 'Максим', isPersonal: true, to: 'Мария'
  }),
  new Message({
    text: 'test new getPage()', createdAt: new Date('2019-02-10T16:18:00'), author: 'Александр', isPersonal: true, to: 'Анастасия'
  })
];

let myMsgList = new MessageList(msgs);

let users = ['Максим','Артем','Михаил','Александр','Матвей','София','Анна','Мария','Ксения','Анастасия','Тимур','Елена','Ольга'];
let activeUsers = ['Максим','Михаил','Матвей','Анна','Мария','Тимур'];
let usersColors = {};

class UserList {
  constructor (users, activeUsers) {
    this.users = users;
    this.activeUsers = activeUsers;
  }
}

let myUserList = new UserList (users, activeUsers);

class HeaderView {
  constructor (id) {
    this.element = document.getElementById(id)
  }
  display() {
    this.element.innerHTML = `Вы вошли как ${myMsgList._user}`;
  }
}

let myHeader = new HeaderView('user-name');

class MessageView {
  constructor (id) {
    this.element = document.getElementById(id);
  }

  display(arrMsg, currentUser) {
    if (Object.keys(usersColors).length === 0) {
      setUserColor(); // генерирует цвета для пользователей
    }
    this.element.innerHTML = '';
    let msgStr = ``
    for (let i = 0; i < arrMsg.length; i++) {
      let firstLetters = arrMsg[i].author.slice(0,2).toUpperCase();
      if (arrMsg[i].author === currentUser && !arrMsg[i].isPersonal) {
        msgStr += document.getElementById('my-msg')
                                  .innerHTML.replace('<span>userText</span>', `<span>${arrMsg[i].text}</span>`)
                                  .replace('<p>ЛОГ', `<p>${firstLetters}`)
                                  .replace('<i>FROM', `<i>${arrMsg[i].author}`)
                                  .replace('background-color', `background-color:${usersColors[arrMsg[i].author]}`)
                                  .replace('DATE', formatDate(arrMsg[i].createdAt));
        continue;
      }
      if (arrMsg[i].isPersonal && arrMsg[i].author === currentUser) {
        msgStr += document.getElementById('my-personal-msg')
                                  .innerHTML.replace('<span>userText</span>', `<span>${arrMsg[i].text}</span>`)
                                  .replace('<p>ЛОГ', `<p>${firstLetters}`)
                                  .replace('<i>FROM', `<i>от Вас для <span class="bold">${arrMsg[i].to}</span>`)
                                  .replace('background-color', `background-color:${usersColors[arrMsg[i].author]}`)
                                  .replace('DATE', formatDate(arrMsg[i].createdAt));
        continue;
      }
      if (arrMsg[i].isPersonal && arrMsg[i].to === currentUser) {
        msgStr += document.getElementById('for-me')
                                  .innerHTML.replace('<span>userText</span>', `<span>${arrMsg[i].text}</span>`)
                                  .replace('<p>ЛОГ', `<p>${firstLetters}`)
                                  .replace('<i>FROM', `<i>от ${arrMsg[i].author} для вас`)
                                  .replace('background-color', `background-color:${usersColors[arrMsg[i].author]}`)
                                  .replace('DATE', formatDate(arrMsg[i].createdAt));
        continue;
      }
      else {
        msgStr += document.getElementById('for-all')
                                  .innerHTML.replace('<span>userText</span>', `<span>${arrMsg[i].text}</span>`)
                                  .replace('<i>FROM', `<i>${arrMsg[i].author}`)
                                  .replace('<p>ЛОГ', `<p>${firstLetters}`)
                                  .replace('background-color', `background-color:${usersColors[arrMsg[i].author]}`)
                                  .replace('DATE', formatDate(arrMsg[i].createdAt));
        continue;
      }
    }
    this.element.innerHTML = msgStr;
  }
}

let myMessageView = new MessageView('message-list');

class ActiveUsersView {
  constructor (id) {
    this.element = document.getElementById(id); 
  }
  display(arrUser) {
    if (Object.keys(usersColors).length === 0) {
      setUserColor(); // генерирует цвета для пользователей
    }
    this.element.innerHTML = '';
    let userStr = '';
    for (let i = 0; i < arrUser.length; i++) {
      let firstLetters = arrUser[i].slice(0,2).toUpperCase();
      userStr += document.getElementById('user')
                                  .innerHTML
                                  .replace('<p>ЛОГ', `<p>${firstLetters}`)
                                  .replace('background-color', `background-color: ${usersColors[arrUser[i]]}`)
                                  .replace('Логин пользователя', `${arrUser[i]}`)
    }
    this.element.innerHTML = userStr;
  }
}

let myActiveUserList = new ActiveUsersView ('users');

addMessage = (text, isPersonal = false, to) => {
  let msg = {
    text: text,
    isPersonal: isPersonal
  }
  if (isPersonal) {
    msg.to = to;
  }
  myMsgList.add(msg);
  showMessages();
}

editMessage = (id, params) => {
  if(myMsgList.edit(id, params)) {
    showMessages();
  }
}

removeMessage = (id) => {
  if(myMsgList.remove(id)) {
    showMessages();
  }
}

function showMessages  (skip = 0, top = 10, filterConfig = {})  {
  myMessageView.display(myMsgList.getPage(arguments[0], arguments[1], arguments[2]), myMsgList.user);
}

showActiveUsers = () => {
  myActiveUserList.display(activeUsers);
}

setCurrenUser = (user) => {
  myMsgList._user = user;
  myHeader.display();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////



formatDate = (date) => {
  return `${addNull(date.getDate())}.${addNull(date.getMonth()+1)}.${addNull(date.getFullYear())} ${addNull(date.getHours())}:${addNull(date.getMinutes())}`
}

addNull = (numb) => {
  return (numb > 9) ? numb : `0${numb}`
}

randomColor = () => {
  let a = Math.random()*255;
  let b = Math.random()*255;
  let c = Math.random()*255;
  return `rgb(${a}, ${b}, ${c})`;
}

function setUserColor () {
  for (let i = 0; i < users.length; i++) {
    usersColors[`${users[i]}`] = randomColor();
  }
}





