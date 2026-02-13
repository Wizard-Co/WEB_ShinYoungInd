/**
 작성자:    HD
 작성일:    2025-11-21
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

//#region 🔹테이블 선언 및 함수
let mainTable = new Tabulator("#main-table", {
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
    // layout: "fitColumns",
    layout: "fitDataTable",
    height: "100%",
    width: "100%",
    validationMode: "highlight",
    selectableRows: 1,
    pagination: "local",
    paginationSize: 20,
    paginationSizeSelector: [5, 10, 20, 50, 100],

    columnDefaults: {
        headerSort: false
    },
    columns: [
        {title: "순", field: "num", hozAlign: "center", headerSort: true, width: "auto" },
        {title: "거래처", field: "customName", hozAlign: "center", headerSort: true, width: "auto" },
        {title: "입고일자", field: "stuffDate", hozAlign: "center", width: "10%"},
        {title: "발주번호", field: "req_ID", hozAlign: "center", width: "auto"},
        {title: "발주명", field: "reqName", hozAlign: "center", width: "auto"},

        {title: "품번", field: "buyerArticleNo", hozAlign: "center", width: "auto"},
        {title: "품명", field: "article", hozAlign: "center", width: "auto"},
        {title: "입고구분", field: "stuffClssName", hozAlign: "center", formatter: "number", width: "10%"},
        {title: "입고후창고", field: "toLocName", hozAlign: "center", width: "auto"},
        {title: "입고처명", field: "custom", hozAlign: "center", width: "auto"},

        {title: "입고수량", field: "stuffQty", hozAlign: "right", formatter: "money", formatterParams: {thousand: ",", precision: 0} , width: "auto"},
        {title: "단가", field: "unitPrice", hozAlign: "right", formatter: "money", formatterParams: {thousand: ",", precision: 0}, width: "auto"},
        {title: "금액", field: "amount", hozAlign: "right", formatter: "money", formatterParams: {thousand: ",", precision: 0}, width: "auto"},

        //
        // {title: "입고수량", field: "stuffQty", hozAlign: "center", formatter: "number"},
        // {title: "단가", field: "unitPrice", hozAlign: "center", formatter: "number"},
        // {title: "금액", field: "amount", hozAlign: "center", formatter: "number"},
        {title: "입고단위", field: "unitClssName", hozAlign: "center", width: "auto"},
        {title: "부가세", field: "vat_Ind_YN", hozAlign: "center", width: "auto"},

        {title: "비고", field: "remark", hozAlign: "center", width: "auto"},
        {title: "LotID", field: "lotid", hozAlign: "center", width: "10%"},
        {title: "입고번호", field: "stuffInID", hozAlign: "center", width: "10%"},
        {title: "검사일자", field: "inspectDate", hozAlign: "center", width: "auto"},
        {title: "검사결과", field: "inspectApprovalYN", hozAlign: "center"},

        {title: "검사자", field: "inspector", hozAlign: "center", width: "10%"},

    ],
    rowFormatter: function(row){
        let data = row.getData();

        if (data.cls == 1) {
            row.getElement().style.backgroundColor = "#b8d6f6";
        } else if (data.cls == 9) {
            row.getElement().classList.add("total");
        }
    },
});



let subTable = new Tabulator("#sub-table", {
    locale: "ko-kr",
    layout: "fitColumns",
    height: "100%",
    columnDefaults: {
        headerSort: false
    },
    columns: [
        {
            title: "",       // 컬럼 헤더
            field: "dummyField",  // 실제 데이터 키 (사용 안 해도 됨, 그냥 placeholder)
            hozAlign: "center",
            formatter: function(cell, formatterParams, onRendered){
                return "합   계";  // 항상 이 글자만 표시
            }
        },
        {title: "입고건수", field: "num", hozAlign: "center", formatter: "number"},
        {title: "입고수량", field: "sumStuffInCount", hozAlign: "center", formatter: "number"},
        {title: "금액", field: "unitPrice", hozAlign: "center", formatter: "number"},

        // {title: "재고수량", field: "stockQty", hozAlign: "center", formatter: "number"},
    ],



});


//#endregion
window.addEventListener('DOMContentLoaded', function () {
    init();
});

function init() {
    document.getElementById('btnSearch').addEventListener("click", Search);
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());
}

async function Search() {
    let param = {
        nChkDate: getChecked('nChkDate') ? 1 : 0,
        sSDate: document.getElementById('sDate').value.replaceAll('-', ''),
        sEDate: document.getElementById('eDate').value.replaceAll('-', ''),
        nChkCustom: 0,
        sCustom: '',

        nChkArticleID: getChecked('chkArticleSrh') ? 1 : 0,
        sArticleID: document.getElementById('txtArticleSrh').dataset.id,

        nChkStuffClss: getChecked('chkStuffClssSrh') ? 1 : 0,
        sStuffClss: document.getElementById('cboStuffClssSrh').value,
        nChkIncStuffIN: 0,

        nChkArticleGrp: getChecked('chkArticleGrpSrh') ? 1 : 0,
        articleGrpID: document.getElementById('cboArticleGrpSrh').value, // 수정
        chkInspect: getChecked('chksInspectApprovalYN') ? 1 : 0,
        sInspect: document.getElementById('cbosInspectApprovalYN').value,

        nChkBuyCustom: getChecked('chkBuyCustomSrh') ? 1 : 0,
        sBuyCustom: document.getElementById('txtBuyCustomSrh').dataset.id,

        orderrByClss: '',
        InspectBasisID: '', // 수정

        sToLocID: getChecked('chkToLocSrh') ? document.getElementById('cboToLocSrh').value : '',

        nBuyArticleNo: getChecked('chkArticleNoSrh') ? 1 : 0,
        buyArticleNo: document.getElementById('txtArticleNo').value, // 수정

        nChkLotID: 0,
        sLotID: ''

        // nChkStuffClss: getChecked('sStuffClss') ? 1 : 0,
        // sStuffClss: document.getElementById('cboStuffClssSrh').value,



    }

    loading.visible();

    try {

        const response = await fetch("/material/result/stuffinQ/search", {
            method: "POST",
            body: JSON.stringify(param),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        // if (!data?.length) {
        //     mainTable.clearData();
        //     toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
        //     return;
        // }
        // --------------------------
        // 조회 결과 없음 췍
        // --------------------------
        if (!data || (!data.main?.length && !data.total?.length)) {
            mainTable.clearData();
            subTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        // mainTable 순번 채우기
        data.main.forEach((row, index) => row.num = index + 1);

        // 테이블 데이터 세팅
        mainTable.setData(data.main);
        subTable.setData(data.total);

        // // --------------------------
        // //  main, total 각각 세팅
        // // --------------------------
        // mainTable.setData(data.main || []);
        // subTable.setData(data.total || []);
        //
        // setNo(data);
        // mainTable.setData(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
