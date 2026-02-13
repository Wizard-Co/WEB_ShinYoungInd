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

        {title: "순번", field: "num", hozAlign: "center", headerSort: true , width: "auto"},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center" , width: "auto"},
        {title: "품명", field: "article", hozAlign: "center", width: "auto"},
        {title: "일자", field: "ioDate", hozAlign: "center", width: "10%"},
        {title: "창고", field: "locName", hozAlign: "center", width: "10%"},
        {title: "입고<br>발주번호", field: "req_ID", hozAlign: "center", width: "auto"},
        {title: "입고<br>수량", field: "stuffQty", hozAlign: "center" , formatter: "number", width: "auto"},
        {title: "출고<br>오더번호", field: "orderNo", hozAlign: "center", width: "10%"},
        {title: "출고<br>수량", field: "outQty", hozAlign: "center" , formatter: "number", width: "auto"},
        {title: "입출고구분", field: "inoutClssname", hozAlign: "center", width: "auto"},
        {title: "단위", field: "unitClssName", hozAlign: "center", width: "auto"},
        {title: "입출고처", field: "relLocName", hozAlign: "center", width: "10%"},
        {title: "재고량", field: "stockQty", hozAlign: "center", formatter: "number", width: "auto"},
        {title: "비고", field: "remark", hozAlign: "center", width: "30%"},



    ],

    rowFormatter: function(row){
        let data = row.getData();
        switch(data.cls) {
            case "6":
                row.getElement().style.backgroundColor = "#D8D8D8"; // cls 4 배경색
                break;
            case "7":
                row.getElement().style.backgroundColor = "#F79F81"; // cls 4 배경색
                break;



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
        // {title: "총계", field: "합 계", hozAlign: "center", headerSort: true },
        // {title: "이월", field: "NmstockQty", hozAlign: "center"},
        {title: "입고", field: "stuffQty", hozAlign: "center", formatter: "number"},
        {title: "출고", field: "outQty", hozAlign: "center", formatter: "number"},
        {title: "재고", field: "stockQty", hozAlign: "center", formatter: "number"},

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
        nChkOutClss: getChecked('chkOutGbn') ? 1 : 0,
        sOutClss: document.getElementById('cboOutGbn').value,
        nChkInClss: getChecked('chkInGbn') ? 1 : 0,

        sInClss: document.getElementById('cboInGbn').value,
        nChkReqID: getChecked('chkOrderNum') ? 1 : 0,
        sReqID: document.getElementById('txtOrderNum').value,
        incNotApprovalYN: getChecked('chkIn_NotApprovedIncloud') ? "Y" : "N",
        incAutoInOutYN: getChecked('chkAutoInOutItemsIncloud') ? "Y" : "N",

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

        const response = await fetch("/material/result/subulQ/search", {
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
        console.log("받은 데이터:", data)

        if (!data || (!data.main?.length && !data.total?.length)) {
            mainTable.clearData();
            subTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        // if (!data?.length) {
        //     mainTable.clearData();
        //     toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
        //     return;
        // }
        // setNo(data);
        // mainTable.setData(data);

        console.log("data:", JSON.stringify(data));
        console.table("data:",data);

        mainTable.setData(data.main || []);
        subTable.setData(data.total || []);


        setNo(data.main || []);


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