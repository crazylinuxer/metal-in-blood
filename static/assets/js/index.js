const user_id = sessionStorage.getItem("user_id");
const lang = sessionStorage.getItem("lang");
handle_url();

const en = {
    exit: "exit",
    plang: "Preferable language",
    lang: "Switch language",
    add_thread: "Add thread",
    add_comment: "Add comment",
    add_news: "Add news",
    delete: "Delete",
    hide: "Hide"
};

const ua = {
    exit: "вийти",
    plang: "Бажана мова",
    lang: "Змінити мову",
    add_thread: "Додати тред",
    add_comment: "Додати коментар",
    add_news: "Додати новину",
    delete: "Видалити",
    hide: "Сховати"
};

var voc;

if(lang === "en" || lang==="null")
{
    voc = en;
}
else
{
    voc = ua;
}



function handle_url()
{
    let url = location.href;
    if (url.indexOf("lang=") === -1)
    {
        if(url.lastIndexOf('?') === -1)
        {
            url += `?lang=${lang}`;
        }
        else
        {
            url += `&lang=${lang}`;
        }
        window.location = url;
    }

    if(isLogged())
    {
        postData(`/api/v1/user?id=${user_id}`, {}, 'GET')
            .then((data) => {
                console.log(data);
                reloadPageWithCorrectLanguage(data.language, url);
    
            }).catch((data) => {
                console.error(data);
                console.trace();
            });
    }
}


function controller() {

    const url = location.href;
    const main_url = 'index.html';
    const global_url = url.slice(0, url.lastIndexOf('/') + 1);
    localStorage.setItem('global', global_url)
    let current_url = url.slice(url.lastIndexOf('/') + 1, url.length);
    current_url = current_url.indexOf('#') == -1 ? current_url : current_url.slice(0, current_url.length - 1);
    if (current_url !== main_url || current_url !== "") {
        drawMenuButton(document.body);
        drawMenu(document.body);
        drawUser(document.body);
        addListenerOnMenu();
    }
}


controller();


function reloadPageWithCorrectLanguage(language, url) {

    if(language !== lang)
    {
        const loc = url.slice(0, url.lastIndexOf('?')) + `?lang=${language}`;
        sessionStorage.setItem('lang', language);
        window.location = loc;
    }
}

function drawMenuButton(body) {
    const btn = `
        <div class="menu">
            <div></div>
            <div></div>
            <div></div>
        </div>
    `;

    body.innerHTML += btn;

}

function drawMenu(body) {
    const user = sessionStorage.getItem('current_user');

    const menu =
        `
    <div id="menu">
        <div class="menu__controls">
            <div>
                <div class="menu__controls-language"><img src="static/metal-in-blood/lang.png" alt="" class="menu-img"> ${voc.lang}</div>
                <div class="menu__controls-login"><img src="static/metal-in-blood/exit.png" alt="" class="menu-img"><span id="wr"><a href=/profile.html>${isLogged() ? user + ', ' + '  ' + ` </a><a href="#" id="logout"> ${voc.exit}</a>` : ' <a href="signin.html">Login</a>'}</span></div>
            </div>
            <div class="menu__controls-arrow"><img src="static/metal-in-blood/arrows.png" alt="" class="menu-img"></div>
        </div>
        <div class="menu__nav">
            <h3>Sections</h3>
            <nav class="main__navigation">
                <a href="news.html">
                    <div class="main__navigation-item">
                        <div class="main__navigation-item__img"><img src="https://thewarriorledger.com/wp-content/uploads/2019/02/william-krause-697816-unsplash-900x600.jpg" alt=""></div>
                        <div class="main__navigation-item__text">News</div>
                    </div>
                </a>
                <a href="tips.html">
                    <div class="main__navigation-item">
                        <div class="main__navigation-item__img"><img src="https://i.pinimg.com/originals/80/62/a2/8062a205dce6229d2f3259c33bfe27ec.jpg" alt=""></div>
                        <div class="main__navigation-item__text">Tips</div>
                    </div>
                </a>
                <a href="compilations.html">
                    <div class="main__navigation-item">
                        <div class="main__navigation-item__img"><img src="https://www.straitstimes.com/sites/default/files/styles/article_pictrure_780x520_/public/articles/2019/03/22/jtoncert220319.jpg?itok=x-woy2uM&timestamp=1553254399" alt=""></div>
                        <div class="main__navigation-item__text">Compilations</div>
                    </div>
                </a>
                <a href="forum.html">
                    <div class="main__navigation-item">
                        <div class="main__navigation-item__img"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQaLO9_p9WGyooVBroRlHgSsDAA6jGuYeQ4ch3CixSr1qZRrizG&usqp=CAU" alt=""></div>
                        <div class="main__navigation-item__text">Forum</div>
                    </div>
                </a>
            </nav>
        </div>
    </div>
    `
    body.innerHTML += menu;
}

function addListenerOnMenu() {
    const btn_outro = document.querySelector('.menu');
    const btn_exit = document.querySelector('.menu__controls-arrow');
    const btn_lang = document.querySelector('.menu__controls-language');
    const menu = document.querySelector('#menu');
    [btn_outro, btn_exit].forEach(el => el.addEventListener('click', () => {
        menu.classList.toggle('active');
        console.log('work')
    }));
    if (document.querySelector('#logout')) {
        document.querySelector('#logout').onclick = () => {
            logOut()
            document.querySelector('#wr').innerHTML = ' <a href="signin.html">Login</a>';
            document.querySelector('#hello').remove();
        }
    }
    btn_lang.onclick = () => {
        changeLanguage();
    }
}

function changeLanguage()
{
    if(lang === "en")
    {
        const send = {language: "ua"};
        postData(`/api/v1/user?id=${user_id}`, send, 'PUT').then((data) => {
            console.log(data);
            window.location = location.href;

        }).catch((data) => {
            console.error(data);
            console.trace();
        });
        //window.location = location.href;
    }
    else // lang === "ua"
    {
        const send = {language: "en"};
        postData(`/api/v1/user?id=${user_id}`, send, 'PUT').then((data) => {
            console.log(data);
            window.location = location.href;

        }).catch((data) => {
            console.error(data);
            console.trace();
        });
        //window.location = location.href;
    }
}


function drawUser(body) {
    const user = JSON.parse(localStorage.getItem('current_user'));
    const pattern = `
        <span id="hello">Hello, <b style="color:#8DC714">${user ? user.login : null}</b></span>
    `;

    user ? body.innerHTML += pattern : null;
}