//#region dataTable.js 라이브러리 관련
/**
 *  dataTable.js는 숫자타입일 경우 자동으로 class가 numeric으로 지정되면서 정렬이 바뀜
 */
// DataTable.type('num', 'className', '');

/**
 * 김수정, 2024
 * dataTable 라이브러리 공통 초기화
 */
$.extend($.fn.dataTable.defaults, {
    select: true,
    dom: '<"d-none"B><"mb-2 right"f>t<"mt-2 center"p>',
    language: {
        lengthMenu: "페이지당 _MENU_ 개의 목록 표시",
        search: "통합 검색:",
        zeroRecords: "검색된 항목이 없습니다.",
        info: "_PAGES_ / _PAGE_ 페이지",
        infoEmpty: "검색된 항목이 없습니다.",
        infoFiltered: "(전체 _MAX_개의 항목에서 검색)",
        paginate: {
            previous: "<<",
            next: ">>"
        }
    },
    /**
     * 김수정, th class="comma" 일시 천자리 콤마 적용
     *        th: class="ceter/left/right" 텍스트 정렬 적용
     */
    columnDefs: [
        {
            targets: '_all',
            orderable: true
        },
        {
            targets: 'comma',
            render: $.fn.dataTable.render.number(',', '.', 0)
        },
        {
            targets: 'center',
            className: 'center'
        },
        {
            targets: 'left',
            className: 'left'
        },
        {
            targets: 'right',
            className: 'right'
        }
    ],
    /**
     * 김수정, 숫자타입이면 다 천자리 적용
     */
    // columnDefs: [
    //     {
    //         targets: '_all',
    //         render: function (data, type, row) {
    //             if ($.isNumeric(data)) {
    //                 return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //             }
    //             return data;
    //         }
    //     }
    // ],
    scrollY: true
})
//#endregion

//#region 공통 변수(CRUD버튼, 날짜)
/*
공통 버튼 변수
 */
const btnSearch = document.getElementById('btnSearch') ?? '';
const btnAdd = document.getElementById('btnAdd') ?? '';
const btnUpdate = document.getElementById('btnUpdate') ?? '';
const btnDelete = document.getElementById('btnDelete') ?? '';
const btnSave = document.getElementById('btnSave') ?? '';
const btnCancel = document.getElementById('btnCancel') ?? '';
const btnPrint = document.getElementById('btnPrint') ?? '';
const btnExcel = document.getElementById('btnExcel') ?? '';
//#endregion

/**
 * 김수정, 2024
 * DOM 로드 공통
 * loading 이미지, 폼 유효성 검사 추가
 */
document.addEventListener('DOMContentLoaded', function () {
    let loading = document.getElementById('loading');
    validate();
    bindCheckbox();
})

document.addEventListener('keydown', function () {
    if(event.keyCode === 13){
        event.preventDefault();
    }
})

/**
 * 김수정, 2024
 * 추가.저장 버튼
 * @type {URLSearchParams}
 */
const urlParam = new URLSearchParams(window.location.search);
const mode = urlParam.get('mode');

if (mode === 'add') {
    hideElementsByID('display','btnUpdate', 'btnDelete');
} else if (mode === 'update') {
    hideElementsByID('display','btnSave');
}

/**
 * 김수정, 2024
 * classname으로 숨김 처리
 * @param classname
 */
function hideElementesByClass(classname) {
    let icon = document.querySelectorAll(classname);
    icon.forEach(x => x.disabled = true);
}

/**
 * 김수정, 2024
 * classname으로 보임 처리
 * @param classname
 */
function showElementsByClass(classname) {
    let icon = document.querySelectorAll(classname);
    icon.forEach(x => x.disabled = false);
}

/**
 * 김수정, 2024
 * ID로 보임 처리
 * @param id
 */
function showElementsByID(style, ...id) {
    id.forEach(x => {
        let btn = document.getElementById(x);
        if(style === 'display'){
            btn.style.display = '';
        } else if(style === 'visible'){
            btn.style.visibility = 'visible'
        } else if(style === 'disabled'){
            btn.disabled = false;
        }
    })
}
/**
 * 김수정, 2024
 * ID로 숨김 처리
 * @param id
 */
function hideElementsByID(style, ...id) {
    id.forEach(x => {
        let btn = document.getElementById(x);
        if(style === 'display'){
            btn.style.display = 'none';
        } else if(style === 'visible'){
            btn.style.visibility = 'hidden'
        } else if(style === 'disabled'){
            btn.disabled = true;
        }
    })
}
/**
 * 김수정, 2024
 * ID로 체크여부 가져오기
 * @param id
 * @returns {boolean|boolean|*}
 */
function getChecked(id) {
    let isChecked;

    if (typeof id == 'string') {
        let ele = document.getElementById(id);
        isChecked = ele.checked;
    } else {
        isChecked = id.checked;
    }
    return isChecked;
}
/**
 * 김수정, 2024
 * classname으로 input 초기화 하기
 * @param classname
 */
function initInput(selector) {
    const area = document.querySelector(selector);
    if (!area) {
        console.warn(`initInput 함수 오류: '${selector}' 요소가 없습니다.`);
        return;
    }
    const inputs = area.querySelectorAll('input');
    inputs.forEach(input => {
        console.log(input);
        if ('value' in input) input.value = '';
    });
}

/**
 * 김수정, 2024
 * @param classname
 * @constructor disabled 시키기
 */
function readOnly(classname) {
    let lst = document.querySelectorAll(classname);
    lst.forEach(x => x.disabled = true);
}
function formDisabled(formID, isDisabled){
    let form = document.getElementById(formID);
    for(let ele of form.elements){
        ele.disabled = isDisabled;
    }
}
/**
 * 김수정, 2024
 * ID로 콤보박스 선택된 인덱스 가져오기 -> return 값의 text,value로 활용
 * @param id
 * @returns {*}
 */
function getCombo(id) {
    let obj;

    if(typeof id == 'string'){
        let cbo = document.getElementById(id);
        obj = cbo.options[cbo.selectedIndex];
    } else {
        obj = id.options[id.selectedIndex];
    }
    return obj;
}
/**
 * 김수정, 2024
 * pop up post형식으로 열기
 * @param popName
 * @param url
 * @param param
 * @param option
 */
function openForm(popName, url, param, option) {
    if (option === '') {
        option = 'width=950, height=700';
    }

    let pop = window.open('', popName, option);

    let form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = popName;

    for (let key in param) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.id = key;
        input.name = key;
        input.value = param[key];
        form.appendChild(input);
    }

    pop.document.body.appendChild(form);
    form.submit();

}
/**
 * 김수정, 2024
 * 유효성 검사 (부트스트랩 참조)
 */
function validate() {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
}
/**
 * 김수정, 2024
 * 유효성검사 제거
 */
function refreshForm() {
    form.classList.remove('was-validated');
}

/**
 * 김수정, 2024
 * string null, 공백, undefined 체크
 * @param str
 * @returns {boolean}
 */
function isEmpty(str){
    return !str || str.trim().length === 0;
}

/**
 * 김수정, 2024
 * 플러스파인더
 * @param txtID
 * @param txtName
 * @param nLarge
 * @param sMiddle
 * @constructor
 */
//#region 플러스파인더
function PlusFinder(txtID, txtName, nLarge, sMiddle) {

    let baseurl = "pages/common/plusFinder";
    let url = baseurl + "?txtID=" + txtID + "&txtName=" + txtName + "&nLarge=" + nLarge + "&sMiddle=" + sMiddle;
    let encodeUrl = encodeURI(url);
    let name = "plusfinder";

    let _width = 400;
    let _height = 600;
    let _left = Math.ceil((window.screen.width - _width) / 2);
    let _top = Math.ceil((window.screen.height - _height) / 2);
    let option = "width=" + _width + ", height=" + _height + ", top=" + _top + ", left=" + _left;
    let openPf = window.open(encodeUrl, name, option);

}
//#endregion

/**
 * 김수정, 2024
 * 다음 우편찾기 제공 메서드
 */
function sample4_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var roadAddr = data.roadAddress; // 도로명 주소 변수
            var extraRoadAddr = ''; // 참고 항목 변수

            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if (data.buildingName !== '' && data.apartment === 'Y') {
                extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if (extraRoadAddr !== '') {
                extraRoadAddr = ' (' + extraRoadAddr + ')';
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('zipCode').value = data.zonecode;
            document.getElementById("address").value = roadAddr;
            document.getElementById("addressJibun").value = data.jibunAddress;

            // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
            if (roadAddr !== '') {
                document.getElementById("sample4_extraAddress").value = extraRoadAddr;
            } else {
                document.getElementById("sample4_extraAddress").value = '';
            }

            var guideTextBox = document.getElementById("guide");
            // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
            if (data.autoRoadAddress) {
                var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                guideTextBox.style.display = 'block';

            } else if (data.autoJibunAddress) {
                var expJibunAddr = data.autoJibunAddress;
                guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                guideTextBox.style.display = 'block';
            } else {
                guideTextBox.innerHTML = '';
                guideTextBox.style.display = 'none';
            }
        }
    }).open();
}

/**
 * 김수정, 2024.12.05
 * MES 프로그램 바로가기
 * 이준협, 2024.01.09 MES 자동로그인 위해서 로직수정
 */
function goMES() {
    // 세션에서 userID와 password를 가져오기 위한 GET 요청
    fetch('/sysMgmt/userLogin/getSessionInfo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
    })
        .then(response => response.json())
        .then(data => {
            // 세션에서 userID와 password를 가져왔다면
            if (data.userID && data.Password) {
                const userID = data.userID;
                const Password = data.Password;

                console.log("Received userID:", userID, "Received Password:", Password); // 디버깅용 로그

                // wizardMES2:// 프로토콜 호출
                const url = `wizardMES2://login?userID=${encodeURIComponent(userID)}&Password=${encodeURIComponent(Password)}`;

                window.location.href = url; // 해당 프로토콜 호출
            } else {
                console.error("로그인 정보가 부족합니다.");
            }
        })
        .catch(error => {
            console.error("API 호출 실패:", error);
        });
}

/**
 * 로그아웃
 * 이준협
 */
function logOut(){
    // 로그아웃을 위한 POST 요청을 보냄
    fetch('/sysMgmt/userLogin/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/login";
            } else {
                alert("로그아웃 중 오류가 발생했습니다.");
            }
        })
        .catch(error => {
            console.error("로그아웃 요청 실패:", error);
            alert("로그아웃 중 문제가 발생했습니다.");
        });
}

/**
 * 김수정, 2025.03.11
 * input에 name과 맞는 데이터 넣기
 */
function setData(data, selector) {
    const area = document.querySelector(selector);
    if (!area) {
        console.warn(`setData 메서드 오류: '${selector}' 없음.`);
        return;
    }

    Object.keys(data).forEach((key) => {
        const inputs = area.querySelectorAll(`[name="${key}"]`);
        if (!inputs.length) return;

        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                input.checked = data[key] === 'Y';
            } else {
                input.value = data[key];
            }
        });
    });
}

function delay() {
    setTimeout(function () {
        window.open('', '_self').close();
    }, 2000);
}

/**
 *  로그
 */
let isMenu = false;
document.querySelectorAll('.menu-dropdown a').forEach(anchor => {
    anchor.addEventListener('click', async function (e) {
        e.preventDefault();
        isMenu = true;
        let currentMenu = this.dataset.id;
        await insertLog(currentMenu);
        location.href = this.href;
    });
});

window.addEventListener("beforeunload", function (e) {
    if (isMenu) return;
    const lastLogID = parseInt(sessionStorage.getItem('lastLogID') || '0', 10);

    let log = {
        logID: lastLogID,
        workFlag: 'E'
    };

    const blob = new Blob([JSON.stringify(log)], {type: "application/json"});
    navigator.sendBeacon("/log/update", blob);

});

async function insertLog(currentMenu) {
    // 이전 메뉴 logID - 이전 log 종료 업데이트해야되니까
    let log = {
        logID: '',
        menuID: currentMenu ?? '',
        workFlag: 'S',
        lastLogID: parseInt(sessionStorage.getItem('lastLogID') || '0', 10)
    };

    try {
        const response = await fetch("/log/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(log)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const result = await response.json();
        sessionStorage.setItem('lastLogID', result);

    } catch (error) {
        console.log(error);
    }
}

/**
 *  김수정, 체크박스 누르면 data-target 활성화
 */
function bindCheckbox(){
    const chks = document.querySelectorAll('.search-condition input[type="checkbox"]');

    chks.forEach(chk => {
        const targetIds = chk.dataset.target;
        if (!targetIds) return;

        const targets = targetIds
            .split(',')
            .map(id => id.trim())
            .map(id => document.getElementById(id))
            .filter(el => el !== null);

        targets.forEach(target => {
            if (target) {
                target.disabled = !chk.checked;
            }
        });

        chk.addEventListener('change', function () {
            targets.forEach(target => {
                if (target) {
                    target.disabled = !this.checked;
                }
            });
        });
    });
}

/**
 * 김수정, num 달기
 * @param data
 */
function setNo(data) {
    for (let i = 0; i < data.length; i++) {
        data[i]['num'] = i + 1;
    }
}

