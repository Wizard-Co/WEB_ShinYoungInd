window.addEventListener('DOMContentLoaded', function () {
    init();
});

Tabulator.extendModule("format", "formatters", {
    number: function(cell, formatterParams) {
        let value = cell.getValue();
        if (value === null || value === undefined || value === "") return "";
        return Number(value).toLocaleString('ko-KR');
    }
});

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
    renderVertical: "basic",
    columnDefaults: {
        headerSort: false
    },
    columns: [

        {title: "순번", field: "num", hozAlign: "center", headerSort: true,
            formatter: function(cell, formatterParams, onRendered) {
                // 페이지 정보 가져오기
                let page = cell.getTable().getPage();
                let pageSize = cell.getTable().getPageSize();
                let rowIndex = cell.getRow().getPosition();

                // 전체 순번 계산 (페이지 시작 번호 + 현재 행 위치)
                return ((page - 1) * pageSize) + rowIndex;
            }},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "Spec", field: "spec", hozAlign: "left"},
        {title: "OrderNO", field: "orderNo", hozAlign: "center"},
        {title: "이월", field: "initStockQty", hozAlign: "right", formatter:"number"},
        {title: "입고", field: "stuffQty", hozAlign: "right", formatter:"number"},
        {title: "출고", field: "outQty", hozAlign: "right", formatter:"number"},
        {title: "단위", field: "unitClssName", hozAlign: "center"},
        {title: "재고", field: "stockQty",  hozAlign: "right", formatter:"number"},
        {title: "적정재고", field: "needstockQty", hozAlign: "right", formatter:"number"},
        {title: "과부족", field: "overQty", hozAlign: "right", formatter: "number"},

        {title: "재고율", field: "stockRate", hozAlign: "right",formatter:"number"},

    ],

    rowFormatter: function(row){
        let data = row.getData();
        let specCell = row.getCell("spec");
        let articleCell = row.getCell("article");
        switch(data.cls) {
            case "3":
                row.getElement().style.backgroundColor = "#D8D8D8"
                articleCell.getElement().textContent = "품명계";
                specCell.getElement().textContent = "";
                break;
            case "4":
                row.getElement().style.backgroundColor = "#F79F81";
                articleCell.getElement().textContent = "총계";
                specCell.getElement().textContent = "";
                break;
        }
    },
});

let subTable = new Tabulator("#sub-table", {
    locale: "ko-kr",
    layout: "fitColumns",
    height: "auto",
    columnDefaults: {
        headerSort: false
    },
    columns: [
        {title: "이월", field: "initStockQty", hozAlign: "center", formatter: "number"},
        {title: "입고", field: "stuffQty", hozAlign: "center", formatter: "number"},
        {title: "출고", field: "outQty", hozAlign: "center", formatter: "number"},
        {title: "재고", field: "stockQty", hozAlign: "center", formatter: "number"},

    ],
});


document.getElementById('btnSearch').addEventListener('click', search)
btnExcel.addEventListener("click", function (){
    mainTable.download("xlsx", "제품 재고 조회.xlsx");
})


async function search() {
    let param = {
        nChkDate: getChecked('chkDate') ? 1 : 0,
        sSDate: document.getElementById('sDate').value.replaceAll('-',''),
        sEDate: document.getElementById('eDate').value.replaceAll('-',''),

        nChkCustom: getChecked('chkCustom') ? 1 : 0,
        sCustomID: document.getElementById('txtCustom').value,

        nChkArticleID: getChecked('chkArticle') ? 1 : 0,
        sArticleID: document.getElementById('txtArticle').value,

        nChkOrder : 0,
        sOrder : "",
        ArticleGrpID : "05",

        sFromLocID : "",
        sToLocID : document.getElementById('cboLocID').value,

        nChkOutClss :0,
        sOutClss : "",
        nChkInClss : 0,
        sInClss : "",

        nChkReqID : 0,
        sReqID : "",
        incNotApprovalYN : getChecked('chkIn_NotApprovedIncloud') ? "Y" : "",
        incAutoInOutYN : getChecked('chkAutoInOutItemsIncloud') ? "Y" : "",

        sArticleIDS : "",
        sMissSafelyStockQty : getChecked('chkOptimumStockBelowSee') ? "Y" : "",
        sProductYN : "Y",

        nMainItem : getChecked("chkMainInterestItemsSee") ? 1 : 0,
        nCustomItem : 0,

        nSupplyType : getChecked('chkSuppleType') ? 1:0,
        sSupplyType : document.getElementById('cboSuppleType').value,

        JaturiNoYN : "",
        nBuyerArticleNo : 0,
        sBuyerArticleNo : ""


    }

    loading.visible();

    try {

        const response = await fetch("/order/result/orderStock/search", {
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

        if (!data?.length) {
            mainTable.clearData();
            subTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }


        const mainData = data.filter(item => item.cls !== "3"|| item.cls !== "4");
        const totalData = data.filter(item => item.cls === "4");


        mainTable.setData(mainData);
        subTable.setData(totalData);


    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

}