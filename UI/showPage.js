export default function showMainAuth() {
  document.getElementsByTagName('body')[0].innerHTML = `        <template id="personal-msg-input">
    <i>Вы пишите личное сообщение для TO</i>
    <input type="text" placeholder="Введите ваше сообщение ...">
    </template>
    <template id="my-msg-input">
        <input type="text" placeholder="Введите ваше сообщение ...">
    </template>

    <template id="my-msg">
        <tr>
            <td>
                <div class="my">
                    <div class="message">
                        <div class="icons">
                            <button data-delete="id">
                                <span class="iconify" data-inline="false" data-icon="icomoon-free:bin"></span>
                            </button>
                            <button data-edit="id">
                                <span class="iconify" data-inline="false" data-icon="icomoon-free:pencil"></span>
                            </button>
                        </div>
                        <span>userText</span>
                        <div class="my-circle circle" style="background-color"><p>ЛОГ</p></div>
                    </div>
                    <table>
                        <tr>
                            <div class="my-info">
                                <i>FROM, DATE</i>
                            </div>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        
    </template>

    <template id="my-personal-msg">
        <tr>
            <td>
                <div class="my">
                    <div class="message">
                        <div class="icons">
                            <button data-delete="id">
                                <span class="iconify" data-inline="false" data-icon="icomoon-free:bin"></span>
                            </button>
                            <button data-edit="id">
                                <span class="iconify" data-inline="false" data-icon="icomoon-free:pencil"></span>
                            </button>
                        </div>
                        <span>userText</span>
                        <div class="my-circle circle" style="background-color"><p>ЛОГ</p></div>
                    </div>
                    <table>
                        <tr>
                            <div class="my-info">
                                <i>FROM, DATE</i>
                            </div>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
    </template>

    <template id="for-me">
        <tr>
            <td>
                <div class="full-message">
                    <div class="message">
                        <div class="circle" style="background-color"><p>ЛОГ</p></div>
                        <span>userText</span>
                        <div class="personal circle"></div>
                    </div>
                    <div class="info">
                        <i>FROM, DATE</i>
                    </div>
                    
                </div>
            </td>
        </tr>
    </template>

    <template id="for-all">
        <tr>
            <td>
                <div class="full-message">
                    <div class="message">
                        <div class="circle" style="background-color"><p>ЛОГ</p></div>
                        <span>userText</span>
                    </div>
                    <div class="info">
                        <i>FROM, DATE</i>
                    </div>
                </div>
            </td>
        </tr>
    </template>

    <template id="user">
        <div class="user">
            <div class="circle" style="background-color"><p>ЛОГ</p></div>
            <div>
                Логин пользователя<br/>
                <i data-to="to">Личное сообщение</i>
            </div>
        </div>
    </template>
    <header class="header">
        <a href="#" target="_blank">v0.2.0</a>
        <a href="#" target="_blank">Новости проекта</a>
        <a href="#" target="_blank">Список обновлений</a>
        <a href="#" target="_blank">О проекте</a>
    </header>

    <div class="btns">
        <button class="download">Загрузить ещё ...</button>
        <div class="exit">
                <i id="user-name"></i>
                <button>
                    <span class="iconify" data-inline="false" data-icon="icomoon-free:exit"></span>
                </button>
        </div>
    </div>

    <div class="main-window">
        <div class="active-users" id="users">
        
        </div>

        <div class="chat">

            <div class="messages">
            <table id ="message-list">

            </table>      
            </div>

            <div class="write-message">
                <div class="main-personal-div">
                    <div class="personal-msg-input">
                        <i id="to"></i>
                        <input type="text" placeholder="Введите ваше сообщение ...">
                    </div>
                    <div>
                        <button class="send-btn">
                            <span class="iconify" data-inline="false" data-icon="icomoon-free:forward"></span>
                        </button>
                        <button class="confirm-edit">
                            <span class="iconify" data-inline="false" data-icon="icomoon-free:checkmark"></span>
                        </button>
                    </div>
                </div>
            </div>
    </div>
        <div class="filter">
            <div class="options">
                <p>Фильтрация</p>
                <input id="author-filter" type="search" placeholder="По имени автора">
                <input id="text-filter" type="search" placeholder="По тексту"/>
                <div class="date-filter">
                    <table>
                        <tr>
                            <td>По дате: </td>
                        </tr>
                        <tr>
                            <td>
                                С:<input type="date">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                По: <input type="date">
                            </td>
                        </tr>
                    </table>
                </div>
                <button id="clear-filter-options">Удалить все фильтры</button>
            </div>
        </div>
    </div>
    <footer class="footer">
        <a href="#" target="_blank">DatamolaChat</a>
        <a href="https://vk.com/timka_ufimka" target="_blank">Камалов Тимур</sa>
        <a href="#" target="_blank">kamalow.t@yandex.by</a>
        <a href="#" target="_blank">17.11.2020</a>
    </footer>`;
}

function showRegWindow() {
  document.getElementsByTagName('body')[0].innerHTML = `<header class="header">
    <a href="#" target="_blank">v0.2.0</a>
    <a href="#" target="_blank">Новости проекта</a>
    <a href="#" target="_blank">Список обновлений</a>
    <a href="#" target="_blank">О проекте</a>
</header>
<div class="main-window-reg">
    <div class="invalid-info"></div>
    <input class="input" type="text" placeholder="Введите ваш логин">
    <input class="input" type="password" placeholder="Введите ваш пароль">
    <div class="invalid-info"></div>
    <input class="input" type="password" placeholder="Повторите пароль">
    <button class="regist-btn">Регистрация</button>
    <div class="reg-info">
        <span>Уже есть аккаунт? <a href="#">Войти</a></span>
        <span><a href="#">На главную</a></span>
    </div>
</div>
<footer class="footer">
    <a href="#" target="_blank">DatamolaChat</a>
    <a href="https://vk.com/timka_ufimka" target="_blank">Камалов Тимур</sa>
    <a href="#" target="_blank">kamalow.t@yandex.by</a>
    <a href="#" target="_blank">17.11.2020</a>
</footer>`;
}

function showExitWindow() {
  document.getElementsByTagName('body')[0].innerHTML = `<header class="header">
    <a href="#" target="_blank">v0.2.0</a>
    <a href="#" target="_blank">Новости проекта</a>
    <a href="#" target="_blank">Список обновлений</a>
    <a href="#" target="_blank">О проекте</a>
</header>
<div class="enter-window">
    <i class="invalid-info"></i>
    <input class="input" type="text" placeholder="Введите ваш логин">
    <input class="input" type="password" placeholder="Введите ваш пароль">
    <button class="enter-btn">Войти</button>
    <div class="enter-info">
        <span>Нет аккаунта? <a href="#">Зарегистрироваться</a></span>
        <span><a href="#">На главную</a></span>
    </div>
</div>
<footer class="footer">
    <a href="#" target="_blank">DatamolaChat</a>
    <a href="https://vk.com/timka_ufimka" target="_blank">Камалов Тимур</sa>
    <a href="#" target="_blank">kamalow.t@yandex.by</a>
    <a href="#" target="_blank">17.11.2020</a>
</footer>
`;
}

function showErrorWindow (status, errorMsg) {
    document.getElementsByTagName('body')[0].innerHTML = `
    <header class="header">
        <a href="#" target="_blank">v0.2.0</a>
        <a href="#" target="_blank">Новости проекта</a>
        <a href="#" target="_blank">Список обновлений</a>
        <a href="#" target="_blank">О проекте</a>
    </header>
    <div class="error-window">
        <span class="iconify" data-inline="false" data-icon="icomoon-free:sad"></span>
        <div class="text">
            <div>Error : page not found</div>
            <a href="#">На главную</a>
        </div>
    </div>
    <footer class="footer">
        <a href="#" target="_blank">DatamolaChat</a>
        <a href="https://vk.com/timka_ufimka" target="_blank">Камалов Тимур</sa>
        <a href="#" target="_blank">kamalow.t@yandex.by</a>
        <a href="#" target="_blank">17.11.2020</a>
    </footer>`.replace('Error : page not found', errorMsg);
}
export { showMainAuth, showRegWindow, showExitWindow, showErrorWindow };
