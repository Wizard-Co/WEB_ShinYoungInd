const loginBtnElem = document.querySelector('#loginBtn');
const loginFormElem = document.querySelector('#loginForm');
const UserIDElem = document.querySelector('#userID');
const passwordElem = document.querySelector('#password');

// 정규식
let chkPw = /(?=.*[~`!@#$%\^&*()-+=]{2,50}).{8,50}$/;

function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
window.addEventListener('DOMContentLoaded',function () {

    // URL에서 userID와 password 값을 가져오기
    const userID = getQueryParameter("userID");
    const password = getQueryParameter("password");

    // 콘솔에 userID와 password 값을 출력하여 확인
    console.log(`userID from URL: ${userID}`);
    console.log(`password from URL: ${password}`);

    // userID와 password가 URL에 있다면 폼에 채우기
    if (userID && password) {
        UserIDElem.value = userID;
        passwordElem.value = password;

        document.getElementById("loginBtn").click();

    } else {
        console.error("userID or password missing in URL parameters.");
    }
})

// 세션, 쿠키 아이디 저장
$(document).ready(function () {
    if (sessionStorage.length !== 0) {
        sessionStorage.clear();
        console.log(sessionStorage.length);
    }

    // 쿠키에서 userID와 password 값을 가져옴
    const UserID = getCookie("userID");
    const password = getCookie("password");
    $("input[name='userID']").val(UserID);
    $("input[name='password']").val(password);

    if ($("input[name='userID']").val() !== "" && $("input[name='password']").val() !== "") {
        $("#saveIdChk").attr("checked", true);
        if ($("#saveIdChk").is(":checked")) {
            loginProc();
        }
    }

    $("#saveIdChk").change(function () {
        if ($("#saveIdChk").is(":checked")) {
            const UserID = $("input[name='userID']").val();
            const password = $("input[name='password']").val();
            setCookie("userID", UserID, 365);
            setCookie("password", password, 365);
        } else {
            deleteCookie("userID");
            deleteCookie("password");
        }
    });

    $("input[name='userID']").keyup(function () {
        if ($("#saveIdChk").is(":checked")) {
            const UserID = $("input[name='userID']").val();
            setCookie("userID", UserID, 365);
        }
    });

    $("input[name='password']").keyup(function () {
        if ($("#saveIdChk").is(":checked")) {
            const password = $("input[name='password']").val();
            setCookie("password", password, 365);
        }
    });
});



// 로그인 실패 횟수를 추적하고 메시지 표시
function loginProc(e) {
    const currentID = document.loginForm.userID.value;
    const password = document.loginForm.password.value;

    // 로그인 정보가 비어있으면 처리
    if (!currentID || !password) {
        alert("아이디와 비밀번호를 입력해 주세요.");
        e.preventDefault(); // 기본 동작(폼 제출) 막기
        return;
    }

    // 로그인 시도
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
        .then(response => response.json()) // 응답을 JSON으로 처리
        .then(result => {
            if (result.redirectUrl) {
                // 로그인 성공 시 리디렉션 처리
                window.location.href = result.redirectUrl; // /main으로 리디렉션
            } else if (result.error) {
                // DB에서 에러 메시지가 있는 경우 경고창 출력
                alert(result.error);
            }
        })
        .catch(error => console.error('Login failed:', error));
}

// 로그인 버튼 클릭 시 로그인 처리
loginBtnElem.addEventListener('click', (e) => {
    loginProc(e);
});

// 엔터 키로 로그인 처리
loginFormElem.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) { // Enter 키가 눌렸을 때
        loginProc(e);
    }
});