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
    this._user = 'Тимур';
    this._msgs = msgs;
    this.idCount = 20;
  }

  get user() {
    return this._user;
  }

  set user(newUser) {
    this._user = newUser;
  }

  getPage(skip = 0, top = 10, filterConfig = {}) {
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
    return resultArr.slice(skip, skip + top).reverse();
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
    if ('isPersonal' in msg) {
      newMsg.isPersonal = msg.isPersonal;
      newMsg.to = msg.to || userMsg.to;
    }
    if (MessageList.validate(newMsg)) {
      this._msgs.splice(this._msgs.lastIndexOf(userMsg), 1, newMsg);
      return true;
    }
    return false;
  }

  remove(id = '') {
    if (id === '' || +id < 0 || +id > +this.idCount) return false;
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

class UserList {
  constructor(users, activeUsers) {
    this.users = users;
    this.activeUsers = activeUsers;
  }
}

class HeaderView {
  constructor(id) {
    this.element = document.getElementById(id);
  }

  display() {
    this.element.innerHTML = `Вы вошли как ${myMsgList._user}`;
  }
}

class MessageView {
  constructor(id) {
    this.element = document.getElementById(id);
  }

  display(arrMsg, currentUser) {
    if (Object.keys(usersColors).length === 0) {
      setUserColor(); // генерирует цвета для пользователей
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

  display(arrUser) {
    if (Object.keys(usersColors).length === 0) {
      setUserColor(); // генерирует цвета для пользователей
    }
    this.element.innerHTML = '';
    let userStr = '';
    for (let i = 0; i < arrUser.length; i++) {
      let firstLetters = arrUser[i].slice(0, 2).toUpperCase();
      userStr += document.getElementById('user')
        .innerHTML
        .replace('<p>ЛОГ', `<p>${firstLetters}`)
        .replace('background-color', `background-color: ${usersColors[arrUser[i]]}`)
        .replace('Логин пользователя', `${arrUser[i]}`);
    }
    this.element.innerHTML = userStr;
  }
}

const addMessage = (text, isPersonal = false, to) => {
  let msg = {
    text: text,
    isPersonal: isPersonal
  };
  if (isPersonal) {
    msg.to = to;
  }
  if (myMsgList.add(msg)) {
    showMessages();
    return true;
  }

  return false;
};

const editMessage = (id, params) => {
  if (myMsgList.edit(id, params)) {
    showMessages();
    return true;
  }
  return false;
};

const removeMessage = (id) => {
  if (myMsgList.remove(id)) {
    showMessages();
    return true;
  }
  return false;
};

function showMessages(skip = 0, top = 10, filterConfig = {}) {
  myMessageView.display(myMsgList.getPage(skip, top, filterConfig), myMsgList.user);
  return true;
}

const showActiveUsers = () => {
  myActiveUserList.display(activeUsers);
  return true;
};

const setCurrenUser = (user) => {
  myMsgList.user = user;
  myHeader.display();
  showMessages();
  return true;
};

const makeReplace = (templateId, msg) => {
  let firstLetters = msg.author.slice(0, 2).toUpperCase();
  let str = document.getElementById(`${templateId}`)
    .innerHTML.replace('<span>userText</span>', `<span>${msg.text}</span>`)
    .replace('<p>ЛОГ', `<p>${firstLetters}`)
    .replace('background-color', `background-color:${usersColors[msg.author]}`)
    .replace('DATE', formatDate(msg.createdAt));
  return str;
};

const formatDate = (date) => {
  return `${addNull(date.getDate())}.${addNull(date.getMonth() + 1)}.${addNull(date.getFullYear())} ${addNull(date.getHours())}:${addNull(date.getMinutes())}`;
};

const addNull = (numb) => {
  return (numb > 9) ? numb : `0${numb}`;
};

const randomColor = () => {
  let a = Math.random() * 255;
  let b = Math.random() * 255;
  let c = Math.random() * 255;
  return `rgb(${a}, ${b}, ${c})`;
};

const setUserColor = () => {
  for (let i = 0; i < users.length; i++) {
    usersColors[`${users[i]}`] = randomColor();
  }
};

const msgs = [
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
    id: '4', text: 'Извещатель автономный ИП 212-52Т предназначен для установки в бытовые, офисные, промышленные помещения. Незаменим при обнаружении задымленности окружающего воздуха, при котором выдается тревожный сигнал в виде мигания встроенного светодиода и длительных звуковых сигналов. Защищаемая площадь до 85 м2.', createdAt: new Date('2020-09-11T19:19:00'), author: 'Анна', isPersonal: true, to: 'Тимур'
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
const myMsgList = new MessageList(msgs);
const users = ['Максим', 'Артем', 'Михаил', 'Александр', 'Матвей', 'София', 'Анна', 'Мария', 'Ксения', 'Анастасия', 'Тимур', 'Елена', 'Ольга'];
const activeUsers = ['Максим', 'Михаил', 'Матвей', 'Анна', 'Мария', 'Тимур'];
const myUserList = new UserList(users, activeUsers);
const myHeader = new HeaderView('user-name');
const myMessageView = new MessageView('message-list');
const myActiveUserList = new ActiveUsersView('users');
let usersColors = {};
showMessages();
showActiveUsers();
setCurrenUser('Тимур');

/*
ФИКСЫ:
1. убрал ненужное поле colletction в MessageList (вместо него у меня _msgs)
2. убрал лишний модуль для генерации id, теперь id - поле класса MessageList;
3. передел get с помощью find;
4. переделал add, edit, remove, addAll;
5. привел в норм вид MessageView.display;
6. добавил showMessages() в setCurrentUser;
7. editMessage возвращает true при успшеном изменении сообщ и false в противном случае;
*/
