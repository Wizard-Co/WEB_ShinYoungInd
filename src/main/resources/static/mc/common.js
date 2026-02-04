/**
 작성자:    김수정
 작성일:    2025-12-30
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

const cboProcess = document.getElementById('cboProcess');
const cboMachine = document.getElementById('cboMachine');

function updateMachineEnabled() {
    cboMachine.disabled = (cboProcess.value === "");
}



if (cboProcess) {
    cboProcess.addEventListener('change', function () {
        const select = cboProcess.value;
        getMachine(select);
    });
}

function getMachine(processID) {
    fetch(`/machine/machine?processID=${processID}`)
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) setCboMachine(data);
        })
        .catch(err => {
            console.error('process fetch error', err);
        });
}

function setCboMachine(data) {
    cboMachine.innerHTML = '';

    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.machineID;
        option.dataset.mappedProcessId = item.processId;          // 커스텀 속성 추가
        option.textContent = item.process + ' : ' + item.machineNo.trim();   // 생산불량일보 화면처럼 나오게 했음
        cboMachine.appendChild(option);
    });

    updateMachineEnabled();
}

/**
 * @since 2026.01.29
 * @author 강현선
 *
 * @param selector  // 엘리먼트 아이디
 * @param columns   // 들어갈 컬럼명들
 * @param options   // 나중에 설정할 타뷸레이터 옵션들
 *
 * 타뷸레이터 메인테이블 공통함수입니다. 페이지네이션이 기본설정돼있습니다.
 */
function createMainTabulator(selector, columns, options = {}) {
    return new Tabulator(selector, {
        locale: "ko-kr",
        langs: {
            "ko-kr": {
                "pagination": {
                    "first": "처음",
                    "first_title": "첫 페이지로 이동",
                    "prev": "이전",
                    "prev_title": "이전 페이지로 이동",
                    "next": "다음",
                    "next_title": "다음 페이지로 이동",
                    "last": "마지막",
                    "last_title": "마지막 페이지로 이동",
                    "page_size": "페이지 크기",
                    "rows": "%start-%end / %total 건"
                }
            }
        },
        layout: "fitDataStretch",
        responsiveLayout: false,
        // autoResize: true,
        height: "100%",
        validationMode: "highlight",
        selectableRows: 1,
        pagination: "local",
        paginationSize: 20,
        paginationSizeSelector: [5, 10, 20, 50, 100],
        columnDefaults: {
            headerSort: false
        },
        columns: columns,
        rowFormatter: function(row){
            let data = row.getData();

            if (data.cls == 1) {                                    // depth1
                // 아직지정하지않음
            } else if (data.cls == 2) {
                row.getElement().style.backgroundColor = "#D3D3D3"; // depth2
            }else if (data.cls == 3) {
                row.getElement().style.backgroundColor = "#D3D3D3"; // depth3
            } else if (data.cls == 9) {
                row.getElement().style.backgroundColor = "#808080"; // 총계
            }
        }
    });
}

/**
 * @since 2026.01.29
 * @author 강현선
 * 타뷸레이터 서브테이블 공통함수입니다. 페이지네이션을 제거하였습니다.
 */
function createSummaryTabulator(selector, columns, options = {}) {
    return new Tabulator(selector, {
        layout: "fitColumns",
        height: null,
        selectableRows: false,
        columnDefaults: {
            headerSort: false
        },
        columns: columns,
        ...options,
    });
}
