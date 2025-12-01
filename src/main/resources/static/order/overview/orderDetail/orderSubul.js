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
        {title: "품명", field: "article", hozAlign: "left"},
        {title: "Spec", field: "spec", hozAlign: "center", },
        {title: "일자", field: "iodate", hozAlign: "center"},
        {title: "창고", field: "locName", hozAlign: "center"},
        {title: "입고발주번호", field: "req_ID", hozAlign: "left"},
        {title: "입고량", field: "stuffQty", hozAlign: "right", formatter: "number"},
        {title: "출고오더번호", field: "orderID", hozAlign: "left"},
        {title: "출고량", field: "outQty", hozAlign: "right", formatter : "number"},
        {title: "입출고구분", field: "inOutClssName", hozAlign: "center"},
        {title: "단위", field: "unitClssName", hozAlign: "center"},
        {title: "입출고처", field: "customName", hozAlign: "center",},
        {title: "재고량", field: "stockQty", hozAlign: "right",formatter:"number"},
        {title: "비고", field: "remark", hozAlign: "left", },

    ],

    rowFormatter: function(row){
        let data = row.getData();
        let iodateCell = row.getCell("iodate");
        let specCell = row.getCell("spec");
        let locNameCell = row.getCell("locName");
        switch(data.cls) {
            case "0":
                iodateCell.getElement().textContent = "이월";
                specCell.getElement().textContent = "";
                break;
            case "6":
                row.getElement().style.backgroundColor = "#D8D8D8";
                iodateCell.getElement().textContent = "품명계";
                specCell.getElement().textContent = "";
                locNameCell.getElement().textContent = "";
                break;
            case "7":
                row.getElement().style.backgroundColor = "#F79F81";
                iodateCell.getElement().textContent = "총계";
                specCell.getElement().textContent = "";
                locNameCell.getElement().textContent = "";
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
        {title: "입고", field: "stuffQty", hozAlign: "center", formatter: "number"},
        {title: "출고", field: "outQty", hozAlign: "center", formatter: "number"},
        {title: "재고", field: "stockQty", hozAlign: "center", formatter: "number"},

    ],
});
document.getElementById('btnSearch').addEventListener('click', search)
btnExcel.addEventListener("click", function (){
    mainTable.download("xlsx", "제품 수불 조회.xlsx");
})

$('#chkHideInOutReasonNumber').on('change', function() {


    if ($(this).is(':checked') && mainTb !== null) {
        mainTable.column(5).visible(false);
        mainTable.column(7).visible(false);
    } else {
        mainTable.column(5).visible(true);  // 보임
        mainTable.column(7).visible(true);  // 보임
    }
});

async function search() {
    let param = {
        nChkDate: getChecked('chkDate') ? 1 : 0,
        sSDate: document.getElementById('sDate').value.replaceAll('-',''),
        sEDate: document.getElementById('eDate').value.replaceAll('-',''),

        nChkCustom: getChecked('chkCustom') ? 1 : 0,
        sCustomID: document.getElementById('txtCustom').value,

        nChkArticleID: getChecked('chkArticle') ? 1 : 0,
        sArticleID: document.getElementById('txtArticle').value,

        nChkOrder : getChecked('chkOrderID') ? 1:0,
        sOrder : document.getElementById('txtOrderID').value,
        ArticleGrpID : "05",

        sFromLocID : "",
        sToLocID : document.getElementById('cboLocID').value,

        nChkOutClss :0,
        sOutClss : "",
        nChkInClss : 0,
        sInClss : "",

        nChkReqID : getChecked('chkReqID')  ? 1:0,
        sReqID : document.getElementById('txtReqID').value,
        incNotApprovalYN : getChecked('chkIn_NotApprovedIncloud') ? "Y" : "",
        incAutoInOutYN : getChecked('chkAutoInOutItemsIncloud') ? "Y" : "",

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

        const response = await fetch("/order/result/orderSubul/search", {
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

        const filteredData = data.filter(row => row.cls != "7");
        const totalRow = data.filter(row => row.cls == "7");
        mainTable.setData(filteredData);
        subTable.setData(totalRow);


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