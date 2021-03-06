if (isLogged()) {
    const user = sessionStorage.getItem('current_user');
    document.querySelector('.mainSignIn__dialog').innerHTML = `<h1>${user}, do you want <a href="#">logout</a>?</h1>`;

    document.querySelector('.mainSignIn__dialog a').addEventListener('click', e => {
        e.preventDefault();
        logOut();
        location.href = '/';
    })
}

function formatData(data) {
    return JSON.stringify(data)
}

function authorization(login, password) {

    try {
        const info = {
            login,
            password
        }

        postData('/api/v1/user/signin', info)
            .then((data) => {
                console.log(data);

                if (data.access_token) {
                    document.cookie = `token=${data.access_token}`;
                    document.cookie = `refreshToken=${data.refresh_token}`;
                    sessionStorage.setItem('current_user', info.login)
                    sessionStorage.setItem('user_id', data.user_id);

                    postData(`/api/v1/user?id=${data.user_id}`, {}, 'GET')
                        .then((data) => {
                            console.log(data);
                            sessionStorage.setItem('lang', data.language);
                        }).catch((data) => {
                            console.error(data);
                            console.trace();
                        });
                    location.href = '/';
                } else {
                    document.cookie = `token=null`;
                    alert(data.message);                                                                                                                                                      
                }
                console.log(document.cookie); // JSON data parsed by `response.json()` call

            }).catch((data) => {
                console.error(data);
                console.trace();
            });
    } catch (e) {
        console.log(e);
    }
}

(function() {
    const form = document.querySelector('#login');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        authorization(form.login.value, form.pass.value);
    })
})();

const main_url = '/';