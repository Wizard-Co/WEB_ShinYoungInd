const loginBtnElem = document.querySelector('#loginBtn');
const loginFormElem = document.querySelector('#loginForm');
const UserIDElem = document.querySelector('#userID');
const passwordElem = document.querySelector('#password');

// ===============================
// 간단 암호화 / 복호화
// ===============================
function encrypt(text) {
    return btoa(unescape(encodeURIComponent(text)));
}

function decrypt(text) {
    return decodeURIComponent(escape(atob(text)));
}

// ===============================
// URL 파라미터 자동 로그인 (유지)
// ===============================
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.addEventListener('DOMContentLoaded', function () {
    const userID = getQueryParameter("userID");
    const password = getQueryParameter("password");

    if (userID && password) {
        UserIDElem.value = userID;
        passwordElem.value = password;

        // URL 자동 로그인 시에는 저장 안 함
        loginProc(new Event("submit"));
    }
});

// ===============================
// 로그인 처리
// ===============================
function loginProc(e) {
    if (e) e.preventDefault();

    const currentID = UserIDElem.value.trim();
    const password = passwordElem.value;
    const saveId = document.getElementById("saveIdChk").checked;

    if (!currentID || !password) {
        alert("아이디와 비밀번호를 입력해 주세요.");
        return;
    }

    fetch('/sysMgmt/userLogin/', {
        method: 'POST',
        body: new URLSearchParams({
            userID: currentID,
            password: password
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.json())
        .then(result => {
            if (result.redirectUrl) {

                // ✅ 자동 로그인 체크 시에만 localStorage 저장
                if (saveId) {
                    localStorage.setItem("autoLogin", "Y");
                    localStorage.setItem("autoUserID", encrypt(currentID));
                    localStorage.setItem("autoPassword", encrypt(password));
                }

                window.location.href = result.redirectUrl;
            }
            else if (result.error) {
                alert(result.error);
            }
        })
        .catch(err => console.error('Login failed:', err));
}

// ===============================
// localStorage 기반 자동 로그인 (confirm)
// ===============================
window.addEventListener("load", function () {

    // URL 자동 로그인이 있으면 localStorage 자동 로그인은 실행 안 함
    if (getQueryParameter("userID") && getQueryParameter("password")) {
        return;
    }

    const autoLogin = localStorage.getItem("autoLogin");
    const encUserID = localStorage.getItem("autoUserID");
    const encPassword = localStorage.getItem("autoPassword");

    if (autoLogin === "Y" && encUserID && encPassword) {

        const userID = decrypt(encUserID);
        const password = decrypt(encPassword);

        const confirmLogin = confirm(
            "이전에 로그인한 기록이 있습니다.\n같은 아이디로 로그인하시겠습니까?"
        );

        if (confirmLogin) {
            fetch('/sysMgmt/userLogin/', {
                method: 'POST',
                body: new URLSearchParams({
                    userID: userID,
                    password: password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .then(res => res.json())
                .then(result => {
                    if (result.redirectUrl) {
                        window.location.href = result.redirectUrl;
                    } else if (result.error) {
                        alert(result.error);
                    }
                });
        }
    }
});

// ===============================
// 버튼 / 엔터 이벤트
// ===============================
loginBtnElem.addEventListener('click', (e) => {
    loginProc(e);
});

loginFormElem.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        loginProc(e);
    }
});
