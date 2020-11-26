function createList (title, list) {
   let myListStr = `<ul id="list">`;
   for (let i = 0; i < list.length; i++) {
      myListStr += `<li>${list[i].value}`;
      if (list[i].children) {
         let el = list[i].children;
         myListStr += createList(title, el); 
         myListStr += '</li>'
         continue;
      }
      myListStr += '</li>'
   }
   myListStr += `</ul>`;
   document.body.innerHTML = '';
   let myList = document.createElement('div');
   let listTitle = document.createElement('h2');
   listTitle.innerHTML = `${title}`
   myList.innerHTML = myListStr;
   document.body.appendChild(listTitle);
   document.body.appendChild(myList);
   return myListStr;
}
viewList =  (title, strList) => {
   let body = document.getElementsByTagName('body');
   document.body.innerHTML = '';
   let myList = document.createElement('div');
   let listTitle = document.createElement('h2');
   listTitle.innerHTML = `${title}`
   myList.innerHTML = strList;
   document.body.appendChild(listTitle);
   document.body.appendChild(myList);
}

createList('my List', [
   {
      value: 'Пункт 1.',
      children: null,
   },
   {
      value: 'Пункт 2.',
      children: [
         {
            value: 'Подпункт 2.1.',
            children: null,
         },
         {
            value: 'Подпункт 2.2.',
            children: [
               {
                  value: 'Подпункт 2.2.1.',
                  children: null,
               },
               {
                  value: 'Подпункт 2.2.2.',
                  children: null,
               }
            ],
         },
         {
            value: 'Подпункт 2.3.',
            children: null,
         }
      ]
   },
   {
      value: 'Пункт 3.',
      children: null,
   }
 ])
 
function handleClick (event) {
   let target = event.target;
   for (let i = 1; i < target.childNodes.length; i++) { // цикл с 1, потому что 0 элемент li, а 1 - ul
      if (target.childNodes[i].classList == 'hide') {
         target.childNodes[i].classList = '';
         break;
      }
      target.childNodes[i].classList = 'hide';
   }
}
document.getElementById('list').addEventListener('click', handleClick);