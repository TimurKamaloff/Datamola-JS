const addModule = (function () {
    let count = 24; // потому что последний id  в объекте 23
    let currentAuthor = 'автор';
    function nextCount () {
        return ++count;
    }
    function dropCount () {
        count=0;
    }
    function getCount () {
        return count;
    }

    return {
        next:nextCount,
        init:dropCount,
        get:getCount,
        currentAuthor
    }
})();
const messages = [
    {
        id: '0',
        text: 'Как уже ясно из названия, цель',
        createdAt: new Date('2020-09-10T16:18:00'),
        author: 'user1login',
        isPersonal: false,
    },
    {
        id: '1',
        text: 'такого материала – максимально',
        createdAt: new Date('2020-09-10T16:19:00'),
        author: 'user2login',
        isPersonal: true,
        to: 'user4login'
    },    
    {
        id: '2',
        text: 'полно информировать пользователя',
        createdAt: new Date('2020-09-10T16:20:00'),
        author: 'user3login',
        isPersonal: false,
    },
    {
        id: '3',
        text: 'о том, что представляет',
        createdAt: new Date('2020-10-10T16:22:00'),
        author: 'user4login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '4',
        text: 'собой конкретный сайт.',
        createdAt: new Date('2020-10-10T16:24:00'),
        author: 'user5login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '5',
        text: 'Естественно, материал также может',
        createdAt: new Date('2020-10-10T16:30:00'),
        author: 'user6login',
        isPersonal: false,
    },
    {
        id: '6',
        text: 'быть оптимизирован, но чаще',
        createdAt: new Date('2020-09-10T16:35:00'),
        author: 'user7login',
        isPersonal: false,
    },
    {
        id: '7',
        text: 'это все-таки какая-то щадящая оптимизация.',
        createdAt: new Date('2020-09-10T16:48:00'),
        author: 'user8login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '8',
        text: 'То есть без многократного повторения',
        createdAt: new Date('2020-11-10T16:49:00'),
        author: 'user9login',
        isPersonal: false,
    },
    {
        id: '9',
        text: 'одних и тех же ключей ',
        createdAt: new Date('2020-09-10T16:50:00'),
        author: 'user10login',
        isPersonal: false,
    },
    {
        id: '10',
        text: 'текст',
        createdAt: new Date('2020-09-10T16:58:00'),
        author: 'user11login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '11',
        text: '(особенно сложных)',
        createdAt: new Date('2020-11-10T17:18:00'),
        author: 'user12login',
        isPersonal: false,
    },
    {
        id: '12',
        text: 'которые слишком уж убивают читабельность материала.',
        createdAt: new Date('2020-09-10T17:19:00'),
        author: 'user13login',
        isPersonal: false,
    },
    {
        id: '13',
        text: 'Преимущество информационных текстов',
        createdAt: new Date('2020-11-10T17:28:00'),
        author: 'user14login',
        isPersonal: false,
    },
    {
        id: '14',
        text: 'на главной странице в том, ',
        createdAt: new Date('2020-09-11T16:18:00'),
        author: 'user15login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '15',
        text: 'то они содержат реально полезную информацию,',
        createdAt: new Date('2020-12-11T16:28:00'),
        author: 'user16login',
        isPersonal: false,
    },
    {
        id: '16',
        text: 'текст',
        createdAt: new Date('2020-09-11T16:38:00'),
        author: 'user17login',
        isPersonal: false,
    },
    {
        id: '17',
        text: 'а не стандартный набор штампов',
        createdAt: new Date('2020-09-11T17:18:00'),
        author: 'user18login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '18',
        text: 'для сокрытия ключевых запросов.',
        createdAt: new Date('2021-09-11T17:28:00'),
        author: 'user19login',
        isPersonal: false,
    },
    {
        id: '19',
        text: 'Поскольку информация по-настоящему полезна, ',
        createdAt: new Date('2020-09-11T17:38:00'),
        author: 'user20login',
        isPersonal: false,
    },
    {
        id: '20',
        text: 'читатели задерживаются на главной странице',
        createdAt: new Date('2021-09-11T18:18:00'),
        author: 'user11login',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '21',
        text: 'Объекты для теста случаев с',
        createdAt: new Date('2020-09-12T17:38:00'),
        author: 'test1',
        isPersonal: false,
    },
    {
        id: '22',
        text: 'несколькими фильтрами',
        createdAt: new Date('2021-09-13T18:18:00'),
        author: 'test1',
        isPersonal: true,
        to: 'user4login'
    },
    {
        id: '23',
        text: 'несколькими фильтрами',
        createdAt: new Date('1021-09-13T18:18:00'),
        author: 'test1',
        isPersonal: true,
        to: 'user4login'
    }
];

const messagesFunc = (function () {

    function getMessages (skip = 0, top = 10, filterConfig = 'date') {
        let resultArr = [];
        let isEmpty = true; // флаг того, что resultArr побывал на какой-либо из фильтраций, 
        if (typeof(arguments[0])==='object') {  // т.к. после фильтрации может не найтись подходящих сообщ и тогда нужно делать return сразу
            filterConfig = arguments[2];
        }
        console.log (skip + '   ' + top);
        if (typeof(filterConfig)==='object') {
            if ('author' in filterConfig) {
                isEmpty = false;
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].author.includes(filterConfig.author)) {
                        resultArr.push(messages[i]);
                    }
                }
                if (!isEmpty && resultArr.length === 0) return false; // массив побывал на фильтрации и подходящих сообщ нет - return false 
            }
            if (('dateFrom' in filterConfig || 'dateTo' in filterConfig)) {
                isEmpty = false;
                if (Date.parse(filterConfig.dateFrom) > (Date.parse(filterConfig.dateTo))) return false; // некорректный ввод даты
                filterConfig.dateFrom = filterConfig.dateFrom || new Date ('January 1, 1970 00:00:00'); // дефолтные значения, можно написать и в аргументы,
                filterConfig.dateTo = filterConfig.dateTo || new Date ('January 1, 2970 00:00:00'); // но пускай будут тут
                if (resultArr.length === 0) { // проверка на то, что массив попал на первую фильтрацию
                    for (let i = 0; i < messages.length; i++) {
                        if ((Date.parse(messages[i].createdAt) > Date.parse(filterConfig.dateFrom)) && (Date.parse(messages[i].createdAt) < Date.parse(filterConfig.dateTo))) {
                            resultArr.push(messages[i]);
                        }
                    }   
                    if (!isEmpty && resultArr.length === 0) return false;
                }
                else {
                    for (let i = 0; i < resultArr.length; i++) {
                        let date = Date.parse(resultArr[i].createdAt);
                        if ((date > Date.parse(filterConfig.dateTo) || date < Date.parse(filterConfig.dateFrom))) { 
                            resultArr.splice(i,1);
                            i = -1; // на всякий случай после каждого удаления цикл пойдёт с 0
                        }
                    }
                    if (!isEmpty && resultArr.length === 0) return false;
                }

            }
            if ('text' in filterConfig) {
                if (resultArr.length === 0) { 
                    for (let i = 0; i < messages.length; i++) {
                        if (messages[i].text.includes(filterConfig.text)) resultArr.push(messages[i]);
                    }
                    if (!isEmpty && resultArr.length === 0) return false;
                }
                else { 
                    for (let i = 0; i < resultArr.length; i++) {
                        let text = resultArr[i].text.toLowerCase();
                        let wantedText = filterConfig.text.toLowerCase();
                        if (!text.includes(wantedText)) {
                            resultArr.splice(i,1); 
                            i = -1;
                        }
                        if (!isEmpty && resultArr.length === 0) return false;
                    }
                }
            }
            resultArr.sort((a,b) => {
                return (Date.parse(b.createdAt)-Date.parse(a.createdAt));
            });
            return resultArr.slice(skip, (skip+top));
        }
        else {
            messages.sort((a,b) => {
                return (Date.parse(b.createdAt)-Date.parse(a.createdAt));
            });
            for (let i = skip; i < (top + skip); i++) {
                if (messages[i]===undefined) break
                resultArr.push(messages[i]);
            }
            return resultArr;
        }
    };
    function getMessage (id) {
        if (id ==='' || Number(id) < 0) return false;
        for (let key in messages) {
            if (messages[key].id === id) return messages[key];
        }
    };
    function validateMessage(msg) {
        if (arguments[0] === undefined) return false;
        let propsObj = {
            id : 'string',
            text : 'string',
            createdAt : 'object',
            author : 'string'
        }
        for (let key in propsObj) {
            if (!(key in msg)  || typeof(msg[key])!==propsObj[key]) return false
        }
        return true;
    }
    function addMessage (msg) {
        if (arguments[0] === undefined) return false;
        let newMsg = {};
        newMsg.id = `${addModule.next()}`;
        for (let key in msg) {
            if (key !== 'id' && key !== 'createdAt' && key !== 'author'){
                if (key === 'text' && msg[key].length < 200) newMsg[key] = msg[key];
                else return false
            } 
        }
        newMsg.createdAt = new Date();
        newMsg.author = addModule.currentAuthor;
        messages.push(newMsg);
        console.log(messages);
        return true;
    };
    function editMessage (id, msg = {}) {
        let newMsg = Object.assign({}, getMessage(id));
        for (let key in newMsg) {
            if (key !== '' && key in msg) newMsg[key] = msg[key];
        }
        console.log(newMsg);
        console.log(getMessage(id));
        console.log(validateMessage(newMsg));
        if (validateMessage(newMsg)){
            for (let key in msg) {
                if (key !== 'id' && key !== 'author' && key !== 'createdAt') getMessage(id)[key] = msg[key];
            }
            return true;
        } 
        console.log('false')
        return false;
    };
    return {
        getMessages,
        getMessage,
        validateMessage,
        addMessage,
        editMessage
    }
})();


messagesFunc.getMessages(0,10, {text:'то', dateTo:"2020-01-11T18:18:00", dateFrom: '2021-09-11T18:18:00'});
messagesFunc.getMessages(-10,-10000);
messagesFunc.getMessages(1,10);
messagesFunc.getMessages();
messagesFunc.getMessages({text:'то', dateTo:"2020-01-11T18:18:00", dateFrom: '2021-09-11T18:18:00'});
messagesFunc.getMessages({text:'то', author:'user16login', dateTo:"2021-01-11T18:18:00", dateFrom: '2020-09-11T18:18:00'});
messagesFunc.getMessages({text:'то', author:'user16login', dateTo:"2021-01-11T18:18:00", dateFrom: '2020-09-11T18:18:00'});
messagesFunc.getMessages({text:'такого текста точно нет', author:'user15login', dateTo:"2021-01-11T18:18:00", dateFrom: '2020-09-11T18:18:00'});
//////////////////////////////////////////////////////////////
messagesFunc.getMessage('23');
messagesFunc.getMessage('23fa');
messagesFunc.getMessage('afa');
messagesFunc.getMessage('-5235af');
messagesFunc.getMessage('-5235');
//////////////////////////////////////////////////////////////
messagesFunc.validateMessage({
    id: '123',
    text: 'Поскольку информация по-настоящему полезна, ',
    createdAt: new Date('2020-09-11T17:38:00'),
    isPersonal: false,
});
messagesFunc.validateMessage({
    id: '123',
    text: 'Поскольку информация по-настоящему полезна, ',
    createdAt: new Date('2020-09-11T17:38:00'),
    author: 'test1',
    isPersonal: false,
});
messagesFunc.validateMessage({
    id: '123',
    text: 'Поскольку информация по-настоящему полезна, ',
    createdAt: new Date('2020-09-11T17:38:00'),
    author: 'test1',
    isPersonal: false,
});
//////////////////////////////////////////////////////////////
// messagesFunc.addMessage({
//     id: '23',
//   text: 'несколькими фильтрами',
//   createdAt: new Date('1021-09-13T18:18:00'),
//   isPersonal: true,  
// });
// messagesFunc.addMessage({
//     id: '23',
//   text: 'несколькими фильтрами',
//   createdAt: new Date('1021-09-13T18:18:00'),
//   author : '123123',
//   isPersonal: true,  
// });
// messagesFunc.addMessage({
//     id: '23'  
// });
// messagesFunc.addMessage();
// messagesFunc.addMessage({});
//////////////////////////////////////////////////////////////
messagesFunc.editMessage(2,{
    text : '123131312',
    id : '213'
});
messagesFunc.editMessage(2,{});
messagesFunc.editMessage(2);
