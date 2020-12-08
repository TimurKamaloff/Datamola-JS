createCalendar = (elem, year, month) => {
    let element = document.getElementById(elem)
    let date = new Date (year, month-1);
    let day = date.getDay();
    if (day === 0) day = 7;
    let dayCount = Math.round((new Date(year, month, 1) - new Date(year, month - 1, 1)) / 1000 / 3600 / 24);
    element.innerHTML = `   <thead>
                                <tr>
                                <td>пн</td><td>вт</td><td>ср</td><td>чт</td><td>пт</td><td>сб</td><td>вс</td>
                                </tr>
                            </thead>`;
    let tableStr = '<tr>';
    for (let j = 0; j < day - 1; j++) {
        tableStr += `<td></td>`
    }
    for (let i = 1; i <= dayCount; i++) {
        if ((day + i - 2) % 7 === 0) {
            tableStr += `</tr><tr>`
        }
        tableStr += `<td>${i}</td>`
    }
    tableStr += `</tr>`
    console.log(tableStr);
    element.innerHTML += tableStr
}

createCalendar('calendar',2020,11);

