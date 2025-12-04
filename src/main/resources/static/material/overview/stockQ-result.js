/**
 작성자:    HD
 작성일:    2025-11-24
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
    layout: "fitColumns",
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

        {title: "순번", field: "num", hozAlign: "center", headerSort: true },
        {title: "품명코드", field: "articleID", hozAlign: "center", headerSort: true},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "이월", field: "initStockQty", hozAlign: "center", formatter: "number"},

        {title: "입고", field: "stuffQty", hozAlign: "center" , formatter: "number"},
        {title: "출고", field: "outQty", hozAlign: "center" , formatter: "number"},
        {title: "단위", field: "unitClssName", hozAlign: "center" },
        {title: "재고량", field: "stockQty", hozAlign: "center", formatter: "number"},
        {title: "적정재고량", field: "needstockQty", hozAlign: "center", formatter: "number"},

        {title: "과부족", field: "overQty", hozAlign: "center", formatter: "number"},
        {title: "재고율(%)", field: "stockRate", hozAlign: "center", formatter: "number"},



    ],

    rowFormatter: function(row){
        let data = row.getData();
        // 숫자 변환 (쉼표 제거, 공백 제거)
        let stockQty = Number(String(data.stockQty).replace(/,/g,'').trim());
        let needstockQty = Number(String(data.needstockQty).replace(/,/g,'').trim());

        // 재고 부족이면 stockQty 글자 빨강
        if (!isNaN(stockQty) && !isNaN(needstockQty) && stockQty < needstockQty) {
            let cell = row.getCell("stockQty"); // 컬럼 필드명
            if (cell) {
                cell.getElement().style.color = "red"; // 글자색 빨강
            }
        }

        switch(data.cls) {
            case "4":
                row.getElement().style.backgroundColor = "LightGreen"; // cls 4 배경색
                break;
            default:
                row.getElement().style.backgroundColor = ""; // 기타 초기화

        }
    },


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

    document.getElementById("chkIn_NotApprovedIncloud").checked = true;
    document.getElementById("chkAutoInOutItemsIncloud").checked = true;

}

async function Search() {
    let param = {
        nChkDate: getChecked('nChkDate') ? 1 : 0,
        sSDate: document.getElementById('sDate').value.replaceAll('-', ''),
        sEDate: document.getElementById('eDate').value.replaceAll('-', ''),
        nChkCustom: getChecked('chkCustomer') ? 1 : 0,
        sCustomID: document.getElementById('txtCustomer').dataset.id,

        nChkArticleID: 0,
        sArticleID: '',
        nChkOrder: 0,
        sOrder: '',
        articleGrpID: getChecked('chkArticleGroup') ? document.getElementById('cboArticleGroup').value : '',

        sFromLocID: getChecked('chkWareHouse') ? document.getElementById('cboWareHouse').value : '',
        sToLocID: '',
        nChkOutClss: 0,
        sOutClss: '',
        // nChkOutClss: getChecked('chkOutGbn') ? 1 : 0,        //wpf는 숨겨져있음 사용x
        // sOutClss: document.getElementById('cboOutGbn').value,//wpf는 숨겨져있음 사용x

        nChkInClss: 0,
        sInClss: '',
        // nChkInClss: getChecked('chkInGbn') ? 1 : 0,          //wpf는 숨겨져있음 사용x
        // sInClss: document.getElementById('cboInGbn').value,  //wpf는 숨겨져있음 사용x
        nChkReqID: 0,
        sReqID: '',
        incNotApprovalYN: getChecked('chkIn_NotApprovedIncloud') ? "Y" : "N",
        incAutoInOutYN: getChecked('chkAutoInOutItemsIncloud') ? "Y" : "N",

        sArticleIDS: '',
        sMissSafelyStockQty: '',
        sProductYN: '',

        nMainItem: getChecked('chkMainInterestItemsSee') ? 1 : 0,
        nCustomItem: getChecked('chkRegistItemsByCustomer') ? 1 : 0,

        nSupplyType: getChecked('chkSupplyType') ? 1 : 0,
        sSupplyType: document.getElementById('cboSupplyType').value,

        jaturiNoYN	: 'Y',

        nBuyerArticleNo: getChecked('chkArticle') ? 1 : 0,
        buyerArticleNo: document.getElementById('txtArticle').value, // 수정




    }

    // console.log("전송 파라메터:", JSON.stringify(param));

    loading.visible();

    try {

        const response = await fetch("/material/result/stockQ/search", {
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

        console.log("전송 파라메터:", JSON.stringify(param));

        if (!data?.length) {
            mainTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        mainTable.setData(data);

        console.log("data:", JSON.stringify(data));
        console.table("data:",data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
function customNumberFormatter(cell) {
    let val = parseFloat(cell.getValue());
    if (isNaN(val)) return ""; // 숫자가 아니면 빈칸
    return val.toFixed(2);     // 소수점 2자리로 표시
}