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
    layout: "fitDataTable",
    height: "100%",
    validationMode: "highlight",
    selectableRows: 1,
    pagination: "local",
    paginationSize: 20,
    paginationSizeSelector: [5, 10, 20, 50, 100],
    columnDefaults: {
        headerSort: false
    },
    columns: [
        {title: "순", field: "num", hozAlign: "center", headerSort: true },
        {title: "출고일자", field: "outDate", hozAlign: "center", headerSort: true},
        {title: "출고처명", field: "kCustom", hozAlign: "center", width: "10%"},

        {title: "품번", field: "buyerArticleNo", hozAlign: "center", width:"auto"},
        {title: "품명", field: "article", hozAlign: "center", width:"auto"},

        {title: "Order No", field: "orderNo", hozAlign: "center" , width: "10%"},
        {title: "출고구분", field: "outClssname", hozAlign: "center" , width: "10%"},
        {title: "이전창고", field: "fromLocName", hozAlign: "center", width: "10%"},
        {title: "이후창고", field: "toLocname", hozAlign: "center", width: "10%"},

        {title: "출고수량", field: "outQty", hozAlign: "center", formatter: "number", width: "10%"},
        {title: "단가", field: "unitPrice", hozAlign: "center", formatter: "number", width: "10%"},
        {title: "금액", field: "amount", hozAlign: "center", formatter: "number", width: "10%"},
        {title: "단위", field: "unitClssName", hozAlign: "center"},

        {title: "비고", field: "remark", hozAlign: "center", width:"auto"},
        {title: "출고번호", field: "outwareiD", hozAlign: "center" , width: "10%"},
        {title: "깊이", field: "depth", hozAlign: "center", visible: false  },


    ],
    rowFormatter: function(row){
        let data = row.getData();
        // #F5A9A9
        if (data.depth == 1) {
            row.getElement().style.backgroundColor = "#b8d6f6";
        } else if (data.depth == 2) {
            row.getElement().style.backgroundColor = "#E0F2F7";
            // row.getElement().classList.add("total");
        }else if (data.depth == 3) {
            row.getElement().style.backgroundColor = "#D8D8D8";
            // row.getElement().classList.add("total");
        } else if (data.depth == 4) {
            row.getElement().style.backgroundColor = "#D8D8D8";
            // row.getElement().classList.add("total");
        } else if (data.depth == 5) {
            row.getElement().style.backgroundColor = "#F5A9A9";
            // row.getElement().classList.add("total");
        } else if (data.depth == 6) {
            row.getElement().style.backgroundColor = "#F5A9A9";
            // row.getElement().classList.add("total");
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
        {title: "건수", field: "num", hozAlign: "center", formatter: "money", formatterParams: {thousand: ",", precision: 0}},
        {title: "출고수량", field: "sumOutQty", hozAlign: "center", formatter: "money", formatterParams: {thousand: ",", precision: 0}},
        {title: "금액", field: "sumAmount", hozAlign: "center", formatter: "money", formatterParams: {thousand: ",", precision: 0}},

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
        chkDate: getChecked('nChkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),
        chkCustomID: 0,
        customID: '',

        custom: document.getElementById('txtCustomSrh').value,


        chkArticleID: getChecked('chkArticleSrh') ? 1 : 0,
        articleID: document.getElementById('txtArticleSrh').dataset.id,

        chkOrder: getChecked('chkOrderID') ? 1 : 0,
        order: document.getElementById('txtOrderID').value,

        orderFlag: 0,

        articleGrpID: getChecked('chkArticleGroup') ? document.getElementById('cboArticleGroup').value : '',
        fromLocID: getChecked('chkFromLoc') ? document.getElementById('cboFromLoc').value : '',
        toLocID: getChecked('chkToLoc') ? document.getElementById('cboToLoc').value : '',
        outClss: getChecked('chkOutClss') ? document.getElementById('cboOutClss').value : '',

        sProductYN : '',
        nBuyerArticleNo: getChecked('chkArticleNoSrh') ? 1 : 0,
        buyerArticleNo: document.getElementById('txtArticleNo').value, // 수정




    }

    // console.log("전송 파라메터:", JSON.stringify(param));

    loading.visible();

    try {

        const response = await fetch("/material/result/outwareQ/search", {
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
        const data = await response.json();  //

        console.log("전송 파라메터:", JSON.stringify(param));
        console.log("받은 데이터:", data);

        // --------------------------
        // 조회 결과 없음 췍
        // --------------------------
        if (!data || (!data.main?.length && !data.total?.length)) {
            mainTable.clearData();
            subTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }



        // --------------------------
        //  main, total 각각 세팅
        // --------------------------
        mainTable.setData(data.main || []);
        subTable.setData(data.total || []);

        // --------------------------
        //  순번 부여도 main 기준으로
        // --------------------------
        setNo(data.main || []);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
