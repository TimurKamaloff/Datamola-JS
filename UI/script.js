const addModule = (function () {
  let count = 16; // потому что последний id  в объекте 23
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

  set id(newId) {
    return false;
  }

  set createdAt(newCreatedAt) {
    return false;
  }

  set author(newAuthor) {
    return false;
  }
}

class MessageList {
  constructor(msgs) {
    this._collection = msgs;
    this._user = 'author #3';
  }

  _msgs = [
    new Message({
      id: '1', text: 'Как уже ясно из названия, цель', createdAt: new Date(), author: 'author #0', isPersonal: false
    }),
    new Message({
      id: '2', text: 'такого материала – максимально', createdAt: new Date('2020-09-11T16:18:00'), author: 'author #1', isPersonal: false
    }),
    new Message({
      id: '3', text: 'полно информировать пользователя', createdAt: new Date('2020-09-11T17:18:00'), author: 'author #2', isPersonal: false
    }),
    new Message({
      id: '4', text: 'afawfs', createdAt: new Date('2020-09-11T16:19:00'), author: 'author #3', isPersonal: true, to: 'author #199'
    }),
    new Message({
      id: '5', text: 'afawfs', createdAt: new Date('2020-09-05T16:18:00'), author: 'author #4', isPersonal: false
    }),
    new Message({
      id: '6', text: 'afawfs', createdAt: new Date('2020-10-10T16:28:00'), author: 'author #5', isPersonal: true, to: 'author #3'
    }),
    new Message({
      id: '7', text: 'afawfs', createdAt: new Date('2020-10-10T16:18:00'), author: 'author #6', isPersonal: false
    }),
    new Message({
      id: '8', text: 'afawfs', createdAt: new Date('2020-11-10T16:58:00'), author: 'author #7', isPersonal: true, to: 'author #2'
    }),
    new Message({
      id: '9', text: 'afawfs', createdAt: new Date('2020-11-10T16:18:00'), author: 'author #8', isPersonal: false
    }),
    new Message({
      id: '10', text: 'afawfs', createdAt: new Date('2020-12-10T16:18:00'), author: 'author #9', isPersonal: false
    }),
    new Message({
      id: '11', text: 'afawfs', createdAt: new Date('2020-12-11T16:18:00'), author: 'author #10', isPersonal: false
    }),
    new Message({
      id: '12', text: 'afawfs', createdAt: new Date('2020-12-12T16:18:00'), author: 'author #11', isPersonal: false
    }),
    new Message({
      id: '13', text: 'afawfs', createdAt: new Date('2021-01-10T16:18:00'), author: 'author #12', isPersonal: false
    }),
    new Message({
      id: '14', text: 'afawfs', createdAt: new Date('2021-01-08T16:18:00'), author: 'author #13', isPersonal: true, to: 'author #12412412'
    }),
    new Message({
      id: '15', text: 'afawfs', createdAt: new Date('2021-01-09T16:18:00'), author: 'author #14', isPersonal: false
    }),
    new Message({
      id: '17', text: 'afawfs', createdAt: new Date('2021-02-10T16:18:00'), author: 'author #15', isPersonal: false
    }),
    new Message({
      id: '18', text: 'test new getPage()', createdAt: new Date('2019-02-10T16:18:00'), author: 'author #15', isPersonal: true, to: 'author #5'
    }),
    // два невалидных сообщ
    new Message({
      id: '19', text: 'test new getPage()', author: 'author #15', isPersonal: true, to: 'author #5'
    }),
    new Message({
      text: 'test new getPage()', createdAt: new Date('2019-02-10T16:18:00'), author: 'author #15', isPersonal: true, to: 'author #5'
    })
  ];

  get user() {
    return this._user;
  }

  set user(value) {
    return false;
  }

  getPage(skip = 0, top = 10, filterConfig = {}) {
    let resultArr = [];
    let isEmpty = true; // флаг того, что resultArr побывал на какой-либо из фильтраций,
    if (Object.keys(filterConfig).length === 0) {
      this._msgs.sort((a, b) => {
        return (Date.parse(b.createdAt) - Date.parse(a.createdAt));
      });
      for (let i = skip; (resultArr.length < top || i < top); i++) {
        if (this._msgs[i] === undefined) break;
        if (!((this._msgs[i].isPersonal === true && this._msgs[i].to !== this._user) || (resultArr.length > top - 1))) {
          resultArr.push(this._msgs[i]);
        }
      }
      return resultArr;
    }

    if ('author' in filterConfig) {
      isEmpty = false;
      let wantedAuthor = filterConfig.author.toLowerCase();
      for (let i = 0; i < this._msgs.length; i++) {
        let author = this._msgs[i].author.toLowerCase();
        if (author.includes(wantedAuthor)) {
          resultArr.push(this._msgs[i]);
        }
      }
      if (resultArr.length === 0) {
        return false;
      }
      // массив побывал на фильтрации и подходящих сообщ нет - return false
    }
    if (('dateFrom' in filterConfig || 'dateTo' in filterConfig)) {
      isEmpty = false;
      if (Date.parse(filterConfig.dateFrom) > (Date.parse(filterConfig.dateTo))) return false; // некорректный ввод даты
      filterConfig.dateFrom = filterConfig.dateFrom || new Date('January 1, 1970 00:00:00'); // дефолтные значения, можно написать и в аргументы,
      filterConfig.dateTo = filterConfig.dateTo || new Date('January 1, 2970 00:00:00'); // но пускай будут тут
      if (resultArr.length === 0) { // проверка на то, что массив попал на первую фильтрацию
        for (let i = 0; i < this._msgs.length; i++) {
          if ((Date.parse(this._msgs[i].createdAt) > Date.parse(filterConfig.dateFrom)) && (Date.parse(this._msgs[i].createdAt) < Date.parse(filterConfig.dateTo))) {
            resultArr.push(this._msgs[i]);
          }
        }
        if (!isEmpty && resultArr.length === 0) return false;
      } else {
        let length = resultArr.length;
        for (let i = 0; i < length; i++) {
          if (resultArr[i] === undefined) {
            break;
          }
          let date = Date.parse(resultArr[i].createdAt);
          if ((date > Date.parse(filterConfig.dateTo) || date < Date.parse(filterConfig.dateFrom))) {
            resultArr.splice(i, 1);
            if (resultArr.length === 1) {
              i = 0; // тут был очень неприятный баг : если все сообщ НЕ подходят по дате, то все удаляются кроме самого первого, пришлось делать такой костыль
              if ((date > Date.parse(filterConfig.dateTo) || date < Date.parse(filterConfig.dateFrom))) resultArr.splice(i, 1);
            }
            i = -1; // на всякий случай после каждого удаления цикл пойдёт с 0
          }
        }
        if (!isEmpty && resultArr.length === 0) return false;
      }
    }
    if ('text' in filterConfig) {
      if (resultArr.length === 0) {
        for (let i = 0; i < this._msgs.length; i++) {
          let text = this._msgs[i].text.toLowerCase();
          let wantedText = filterConfig.text.toLowerCase();
          if (text.includes(wantedText)) resultArr.push(this._msgs[i]);
        }
        if (!isEmpty && resultArr.length === 0) return false;
      } else {
        for (let i = 0; i < resultArr.length; i++) {
          let text = resultArr[i].text.toLowerCase();
          let wantedText = filterConfig.text.toLowerCase();
          if (!text.includes(wantedText)) {
            resultArr.splice(i, 1);
            i = -1;
          }
          if (!isEmpty && resultArr.length === 0) return false;
        }
      }
    }
    resultArr.sort((a, b) => {
      return (Date.parse(b.createdAt) - Date.parse(a.createdAt));
    });
    let lastRes = []; // новая переменная для отборки только общих сообщ или ЛС для _user
    for (let i = skip; i < resultArr.length; i++) {
      if (this._msgs[i] === undefined || lastRes.length > top) {
        break;
      }
      if (this._msgs[i].isPersonal && this._msgs[i].to !== this._user) {
        continue;
      } else if (MessageList._validate(resultArr[i])) {
        lastRes.push(resultArr[i]);
      }
    }
    return lastRes;
  }

  get(id = '') {
    if (id === '' || Number(id) < 0) return false;
    Object.keys(this._msgs).forEach(function (key) {
      if (this._msgs[key].id === id) return this._msgs[key];
    });
    return false;
  }

  add(msg = {}) {
    if (arguments[0] === undefined || myMsgList.user === undefined) return false;
    // автризован ли пользователь и может ли он писать сообщ
    for (let i = 0; i < this._msgs.length; i++) {
      if (!myMsgList.user) {
        return false;
      }
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
              newMsg[key] = true;
              if (!MessageList._user) console.log(false);
              newMsg.to = 'Какой-то пользователь';
            }
            break;
          }
          case ('to'): {
            console.log('to');
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
    let newMsg = {};
    // Проверка на то, что пользователь является автором этого сообщ и может его редачит
    for (let i = 0; i < this._msgs.length; i++) {
      if (this._msgs[i].id === id && this._msgs[i].author !== myMsgList.user) {
        return false;
      }
    }
    Object.keys(msg).forEach(function (key) {
      if (key !== 'id' && key !== 'createdAt' && key !== 'author') {
        switch (key) {
          case ('text'): {
            if (msg[key].length < 200) newMsg[key] = msg[key]; break;
          }
          case ('isPersonal'): {
            if (msg[key]) {
              newMsg[key] = true;
              newMsg.to = addModule.currentRecipient;
              break;
            }
          }
          default: {
            break;
          }
        }
      }
    });
    for (let i = 0; i < this._msgs.length; i++) {
      if (this._msgs[i].id === id) {
        let msg = this._msgs[i];
        Object.keys(newMsg).forEach(function (key) {
          msg[key] = newMsg[key];
        });
        return true;
      }
    }
    return false;
  }

  remove(id = '') {
    if (id === '' || Number(id) < 0) return false;
    // та же проверка что и в edit
    for (let i = 0; i < this._msgs.length; i++) {
      if (this._msgs[i].id === id && this._msgs[i].author !== myMsgList.user) {
        console.log(myMsgList.user);
        console.log(this._msgs[i].author !== myMsgList.user);
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
    // eslint ругается на этот цикл, но с заменой его через Object.keys появляется баг,
    for (let key in exampleMsg) { //  когда отоборажаются ненужные для пользователя сообщение (isPersonal === true)
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

let myMsgList = new MessageList();

// массив для addAll();
let msgs = [
  new Message({
    id: '1', text: 'Как уже ясно из названия, цель', createdAt: new Date(), author: 'author #0', isPersonal: false
  }),
  new Message({
    id: '2', text: 'такого материала – максимально', createdAt: new Date('2020-09-11T16:18:00'), author: 'author #1', isPersonal: false
  }),
  new Message({
    id: '3', text: 'полно информировать пользователя', createdAt: new Date('2020-09-11T17:18:00'), author: 'author #2', isPersonal: false
  }),
  new Message({
    id: '4', text: 'afawfs', createdAt: new Date('2020-09-11T16:19:00'), author: 'author #3', isPersonal: true, to: 'author #199'
  }),
  new Message({
    id: '5', text: 'afawfs', createdAt: new Date('2020-09-05T16:18:00'), author: 'author #4', isPersonal: false
  }),
  new Message({
    id: '6', text: 'afawfs', createdAt: new Date('2020-10-10T16:28:00'), author: 'author #5', isPersonal: true, to: 'author #3'
  }),
  new Message({
    id: '7', text: 'afawfs', createdAt: new Date('2020-10-10T16:18:00'), author: 'author #6', isPersonal: false
  }),
  new Message({
    id: '8', text: 'afawfs', createdAt: new Date('2020-11-10T16:58:00'), author: 'author #7', isPersonal: true, to: 'author #2'
  }),
  new Message({
    id: '9', text: 'afawfs', createdAt: new Date('2020-11-10T16:18:00'), author: 'author #8', isPersonal: false
  }),
  new Message({
    id: '10', text: 'afawfs', createdAt: new Date('2020-12-10T16:18:00'), author: 'author #9', isPersonal: false
  }),
  new Message({
    id: '11', text: 'afawfs', createdAt: new Date('2020-12-11T16:18:00'), author: 'author #10', isPersonal: false
  }),
  new Message({
    id: '12', text: 'afawfs', createdAt: new Date('2020-12-12T16:18:00'), author: 'author #11', isPersonal: false
  }),
  new Message({
    id: '13', text: 'afawfs', createdAt: new Date('2021-01-10T16:18:00'), author: 'author #12', isPersonal: false
  }),
  new Message({
    id: '14', text: 'afawfs', createdAt: new Date('2021-01-08T16:18:00'), author: 'author #13', isPersonal: true, to: 'author #12412412'
  }),
  new Message({
    id: '15', text: 'afawfs', createdAt: new Date('2021-01-09T16:18:00'), author: 'author #14', isPersonal: false
  }),
  new Message({
    id: '17', text: 'afawfs', createdAt: new Date('2021-02-10T16:18:00'), author: 'author #15', isPersonal: false
  }),
  new Message({
    id: '18', text: 'test new getPage()', createdAt: new Date('2019-02-10T16:18:00'), author: 'author #15', isPersonal: true, to: 'author #5'
  }),
  // два невалидных сообщ
  new Message({
    id: '19', text: 'test new getPage()', author: 'author #15', isPersonal: true, to: 'author #5'
  }),
  new Message({
    text: 'test new getPage()', createdAt: new Date('2019-02-10T16:18:00'), author: 'author #15', isPersonal: true, to: 'author #5'
  })
];

console.log(myMsgList.getPage(0, 15, { author: '#1' })); // 6 msgs
console.log(myMsgList.getPage(0, 15)); // 13 msgs
console.log(myMsgList.getPage()); // выведет по дефолту skip = 0 top = 10
console.log(myMsgList.getPage(0, 15, { author: '#1', text: 'А' })); // 1 сообщ
console.log(myMsgList.getPage(0, 15, { author: '#1', dateFrom: '2020-11-10T16:58:00' })); // 5 msgs
console.log(myMsgList.getPage(0, 15, { author: 'author #1', dateFrom: '2000-11-10T16:58:00' })); // 7 msgs
console.log(myMsgList.getPage(0, 15, { author: '#1', dateFrom: '2025-11-10T16:58:00' })); // такой даты нет => false
console.log(myMsgList.getPage(0, 15, { author: 'aut', dateTo: '2020-11-10T16:58:00' })); // 7 msgs
console.log(myMsgList.getPage(0, 15, { author: 'aut', dateTo: '2025-11-10T16:58:00' })); // 13 msgs
console.log(myMsgList.getPage(0, 15, { author: 'aut', dateTo: '2021-01-09T16:58:00', dateFrom: '2020-11-10T16:58:00' })); // 6 msgs
console.log(myMsgList.getPage(0, 15, { author: '#1', dateTo: '2025-11-10T16:58:00', dateFrom: '2020-11-10T16:58:00' })); // 5 msgs
console.log(myMsgList.getPage(0, 15, { author: '#1', dateFrom: '2025-11-10T16:58:00', dateTo: '2020-11-10T16:58:00' })); // false : dateTo < dateFrom
console.log(myMsgList.edit('5', {
  text: 'new msg' //= > false, тк в _user записан author #3, а его сообщение под id = 4
}));
console.log(myMsgList.edit('4', {
  text: 'new msg' //= > true, тк в _user записан author #3, а его сообщение под id = 4
}));
console.log(MessageList.addAll(msgs));
console.log(MessageList.collection);
console.log(MessageList.clear());
console.log(MessageList.collection);
