function createList (title, list) {
   let myListStr = `<ul>`;
   let recursionCount = 0;
   for (let i = 0; i < list.length; i++) {
      myListStr += `<li><p style="font-size:100%">${list[i].value}</li>`;
      if (list[i].children) {
         let el = list[i].children;
         myListStr += createList(title, el); 
         recursionCount++;
         continue
      }
   }
   myListStr += `</ul>`;
   document.body.innerHTML = '';
   let myList = document.createElement('div');
   let listTitle = document.createElement('h2');
   listTitle.innerHTML = `${title}`
   myList.innerHTML = myListStr;
   document.body.appendChild(listTitle);
   document.body.appendChild(myList);
   console.log(recursionCount);
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

let child = [];

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
 