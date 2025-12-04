/**
 작성자:    HD
 작성일:    2025-11-25
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
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "자재 LotID", field: "lotID", hozAlign: "center"},
        {title: "구분", field: "gubun", hozAlign: "center"},
        {title: "일자", field: "ioDate", hozAlign: "center"},
        {title: "입고수량", field: "stuffQty", hozAlign: "center" , formatter: "number"},
        {title: "단위", field: "unitClssName", hozAlign: "center"},
        {title: "출고수량", field: "outQty", hozAlign: "center" , formatter: "number"},
        {title: "재고수량", field: "stockQty", hozAlign: "center", formatter: "number"},
        {title: "비고", field: "remark", hozAlign: "center"},
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
        // {title: "총계", field: "num", hozAlign: "center", headerSort: true },
        {title: "입고수량", field: "stuffQty", hozAlign: "center", formatter: "number"},
        {title: "출고수량", field: "outQty", hozAlign: "center", formatter: "number"},
        {title: "재고수량", field: "stockQty", hozAlign: "center", formatter: "number"},

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

    document.getElementById("chkIncNotApproval").checked = true;
    document.getElementById("chkIncAutoInOutWare").checked = true;
    document.getElementById("chknIncZeroQty").checked = true;

}

async function Search() {
    let param = {
        nChkDate: getChecked('nChkDate') ? 1 : 0,
        sSDate: document.getElementById('sDate').value.replaceAll('-', ''),
        sEDate: document.getElementById('eDate').value.replaceAll('-', ''),
        nChkArticleID: getChecked('chkMtrArticleSrh') ? 1 : 0,
        sArticleID: document.getElementById('txtMtrArticleSrh').dataset.id, // 수정

        nChkParentArticleID: getChecked('chkProdArticleSrh') ? 1 : 0,
        sParentArticleID: document.getElementById('txtProdArticleSrh').dataset.id, // 수정
        nChkCustom: getChecked('chkCustomSrh') ? 1 : 0,
        sCustomID: document.getElementById('txtCustomSrh').dataset.id,
        incNotApprovalYN: getChecked('chkIncNotApproval') ? "Y" : "N",

        incAutoInOutYN: getChecked('chkIncAutoInOutWare') ? "Y" : "N",
        nMainItem: getChecked('chkMainItem') ? 1 : 0,
        nCustomItem: getChecked('chkCustomItem') ? 1 : 0,
        nIncZeroQty: getChecked('chknIncZeroQty') ? 1 : 0,
        sFromLocID: getChecked('chkWareHouse') ? document.getElementById('cboWareHouse').value : '',

        sToLocID: '',
        nChkLotID: getChecked('chkMtrLOTIDSrh') ? 1 : 0,
        sLotID: document.getElementById('txtMtrLOTIDSrh').value,


    }

    // console.log("전송 파라메터:", JSON.stringify(param));

    loading.visible();

    try {

        const response = await fetch("/material/result/lotSubulQ/search", {
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
function customNumberFormatter(cell) {
    let val = parseFloat(cell.getValue());
    if (isNaN(val)) return ""; // 숫자가 아니면 빈칸
    return val.toFixed(2);     // 소수점 2자리로 표시
}