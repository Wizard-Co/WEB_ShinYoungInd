/**
 작성자:    김수정
 작성일:    2025-02-11
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

//#region 변수
let selectedRow;
const table = new DataTable('#tbMain', {
    paging: false,
    searching: false,
    buttons: [{
        extend: 'excel',
        filename: '작업지시 목록',
        title: '작업지시 목록',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "orderDate", className: 'center'},
        {data: "custom", className: 'left'},
        {data: "buyerArticleNo", className: 'left'},
        {data: "article", className: 'center', orderable: false},
        {data: "model", className: 'center', orderable: false},

        {data: "orderNo", className: 'center', orderable: false},
        {data: "notOrderQty", className: 'center', orderable: false},
        {data: "orderQty", className: 'right', orderable: false},
        {data: "instQty", className: 'right', orderable: false},
        {data: "inspectQty", className: 'right', orderable: false},

        {data: "outQty", className: 'right', orderable: false},
        {data: "pattern", className: 'center', orderable: false},
        {data: "articleType", className: 'center', orderable: false},
        {data: "remark", className: 'center', orderable: false},
        {data: "completeYN", className: 'center', orderable: false},

        {data: "closeYN", className: 'right', orderable: false},
    ],
    drawCallback: function (settings) {
        let api = this.api();
        if (api.row().count() == 0) {
            let tbody = api.table().body();
            tbody.innerHTML = '';
        }
    },
    scrollX: true
})
const subTable = new DataTable('#tbSub', {
    paging: false,
    searching: false,
    ordering: false,
    columns: [
        {data: "process", className: 'center'},
        {data: "buyerArticleNo", className: 'left'},
        {data: "article", className: 'left'},
        {data: "childBuyerArticleNo", className: 'center'},
        {data: "childArticle", className: 'center'},

        {data: "qty", className: 'center'},
        {data: "startDate", className: 'center'},
        {data: "endDate", className: 'right'},
        {data: "instRemark", className: 'right'},
        {data: "machine", className: 'right'},

        {data: "mtrExceptYN", className: 'right'},
        {data: "fifoYN", className: 'center'},
    ],
    columnDefs: [
        {
            targets: [2], // 예: 3번째 열만
            createdCell: function (td) {
                td.setAttribute('contenteditable', 'true');
            }
        }
    ],
    drawCallback: function (settings) {
        let api = this.api();
        if (api.row().count() == 0) {
            let tbody = api.table().body();
            tbody.innerHTML = '';
        }
    },
    scrollX: true
})

const tbody = document.querySelector('#tbMain tbody');
const instDate = document.getElementById('txtInstDate');
const expectDate = document.getElementById('txtExpectDate');

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
toastr.options = {
    "positionClass": "toast-top-right",
    "timeOut": "3000",
}
//#endregion
window.addEventListener('DOMContentLoaded', function () {
    init();
});

function init() {
    document.getElementById('btnSearch').addEventListener("click", search);
    hideElementsByID('disabled', 'btnCancel', 'btnAdd', 'btnInst');
    // 지시일자, 작업완료일 오늘로 세팅
    const dm = new DateManager();
    instDate.value = dm.formatDate(dm.getToday());
    expectDate.value = dm.formatDate(dm.getLastDayOfThisMonth());
}


/**
 * 수주목록 선택시 UI, 공정패턴 set
 * @type {Element}
 */
tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;
    selectedRow = table.row(row).data();
    // 행 선택하면 추가버튼 활성화
    showElementsByID('disabled', 'btnAdd');
    //공정패턴 set
    setPattern(selectedRow.articleTypeID);
    //지시수량
    document.getElementById('txtInstQty').value = selectedRow.orderQty;

});

//#region 버튼
btnAdd.addEventListener("click", function () {
    if (checkData()) {
        let patternID = getCombo('cboPattern').value
        searchPatternDetail(patternID, selectedRow.articleID);
    }
})

//#endregion

/**
 * 메인 테이블 수주목록 조회
 * @returns {Promise<void>}
 */
async function search() {
    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value,
        eDate: document.getElementById('eDate').value,

        chkCustom: getChecked('chkCustom') ? 1 : 0,
        customID: document.getElementById('txtCustom').value,

        chkArticle: getChecked('chkArticle') ? 1 : 0,
        articleID: document.getElementById('txtArticle').value,

        chkOrderNo: getChecked('chkOrderNo') ? 1 : 0,
        orderNo: document.getElementById('txtOrderNo').value,

        chkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1 : 0,
        buyerArticleNo: document.getElementById('txtBuyerArticleNo').value,

        // chkComplete: 지시완료포함 (1이면 다나오고 0이면 수주량-지시량이 0보다 큰것,미완료건만 나옴)
        chkComplete: getChecked('chkComplete') ? 1 : 0,
        chkClose: getChecked('chkClose') ? 1 : 0,

    }

    try {
        loading.visible();
        const response = await fetch("/product/plan/search", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        setNo(data);
        table.clear().rows.add(data).draw();
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }

}

/**
 * 공정작업 상세 조회
 * @param patternID
 * @param articleID
 * @returns {Promise<void>}
 */
async function searchPatternDetail(patternID, articleID) {
    let param = {
        patternID: patternID,
        articleID: articleID,
        outMessage: ''
    }
    try {
        loading.visible();
        const response = await fetch("/product/plan/pattern/detail", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });
        if (!response.ok) {
            const errorText = await response.text();
            toastr.warning(errorText);
        }
        const data = await response.json();

        for (let i = 0; i < data.length; i++) {
            data[i].startDate = instDate.value;
            data[i].endDate = expectDate.value;
        }

        subTable.clear().rows.add(data).draw();
    } catch (error) {
        console.log(error.message);
    } finally {
        loading.invisible();
    }
}

/**
 * articleTypeID로 공정패턴 조회
 * @param articleTypeID
 * @returns {Promise<void>}
 */
async function setPattern(articleTypeID) {
    let param = {
        articleTypeID: articleTypeID
    }
    try {
        loading.visible();
        const response = await fetch("/product/plan/pattern", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();
        setDropDown(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

function editMode() {
    showElementsByID('disabled', 'btnCancel', 'btnAdd', 'btnInst');
    hideElementsByID('disabled', 'tbMain');
}

/**
 * 유효성 검사
 * @returns {boolean}
 */
function checkData() {
    if (!getCombo('cboPattern')) {
        toastr.warning('공정패턴을 선택해주세요.', '오류');
        return false;
    }
    if (!selectedRow.articleID) {
        toastr.warning('해당 수주에 품명 정보가 없습니다.', '오류');
        return false;
    }
    if (!instDate.value) {
        toastr.warning('지시일자를 선택해주세요.', '오류');
        return false;
    }
    if (!expectDate.value) {
        toastr.warning('작업완료일을 선택해주세요.', '오류');
        return false;
    }
    return true;
}

function setDropDown(options) {
    const select = document.getElementById('cboPattern');
    select.innerHTML = '';
    for (let [id, value] of Object.entries(options)) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = value;
        select.appendChild(option);
    }

}