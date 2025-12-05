/**
 작성자:    최대현
 작성일:    2025-11-24
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/
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
        {title: "출고일자", field: "outDate", hozAlign: "center"},
        {title: "거래처", field: "kcustom", hozAlign: "center", },
        {title: "OrderNO", field: "orderNo", hozAlign: "center", widthGrow: 1,  visible: false},
        {title: "관리번호", field: "orderID", hozAlign: "center", widthGrow: 1},
        {title: "출고구분", field: "outClssName", hozAlign: "center"},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "박스번호", field: "labelID", hozAlign: "left"},
        {title: "수량", field: "outQty", hozAlign: "right", formatter:"number"},
        {title: "단위", field: "unitClssName", hozAlign: "center"},
        {title: "금액", field: "outPrice", hozAlign: "right", formatter: "number"},

        {title: "출고번호", field: "outWareID", hozAlign: "center",},
        {title: "비고", field: "remark", hozAlign: "left", },

    ],

    rowFormatter: function(row){
        let data = row.getData();
        let numCell = row.getCell("outDate");
        switch(data.depth) {
            case 1:
                row.getElement().style.backgroundColor = "#D8D8D8";
                numCell.getElement().textContent = "일계";
                break;
            case 2:
                row.getElement().style.backgroundColor = "#F79F81";
                numCell.getElement().textContent = "총계";
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
        {title: "건수", field: "totalCount", hozAlign: "center", formatter: "number"},
        {title: "출고수량", field: "outQty", hozAlign: "center", formatter: "number"},
        {title: "금액", field: "outPrice", hozAlign: "center", formatter: "number"},

    ],
});



document.getElementById('btnSearch').addEventListener('click', search)
btnExcel.addEventListener("click", function (){
    mainTable.download("xlsx", "제품 출하 실적 조회.xlsx");
})


function returnRbnInt(){
    const chkOrderNo = document.getElementById('chkOrderNo');
    const rbnOrderID = document.getElementById('rbnOrderID');
    const rbnOrderNo = document.getElementById('rbnOrderNo');

    if(chkOrderNo.checked){
        if(rbnOrderID.checked){
            return 1
        }
        else if(rbnOrderNo.checked){
            return 2
        }
    }

    return 0
}

async function search() {
    let param = {
        ChkDate: getChecked('chkDate') ? 1 : 0,
        SDate: document.getElementById('sDate').value.replaceAll('-',''),
        EDate: document.getElementById('eDate').value.replaceAll('-',''),

        ChkCustomID: getChecked('chkCustom') ? 1 : 0,
        CustomID: document.getElementById('txtCustom').dataset.id ?? "",

        ChkArticleID: getChecked('chkArticle') ? 1 : 0,
        ArticleID: document.getElementById('txtArticle').dataset.id ?? "",

        ChkBuyerArticleNo: 0,
        BuyerArticleNo : '',

        ChkOrderID : returnRbnInt(),
        OrderID : document.getElementById('txtOrderNo').value,
    }

    loading.visible();

    try {

        const response = await fetch("/order/result/outwareDetail/search", {
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
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        const count = data.filter(item => item.depth !== 1 && item.depth !== 2).length;
        const mainData = data.filter(item => item.depth !== 2);  // depth 2가 아닌 것
        const totalData = data.filter(item => item.depth === 2); // depth 2인 것 (총계)

        totalData[0].totalCount = count;
        // 테이블에 설정
        mainTable.setData(mainData);
        subTable.setData(totalData);

        // mainTable.setData(data);
        //subTable.setData(data.total || []);
        // setNo(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

document.querySelectorAll('input[name="ordType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const labelElement = document.querySelector('label[for="chkOrderNo"]');
        const inputElement = document.getElementById('txtOrderNo');

        if (document.getElementById('rbnOrderNo').checked) {
            // OrderNo 선택 시
            labelElement.textContent = '오더번호';
            inputElement.placeholder = '오더번호 찾기';
            mainTable.hideColumn('orderID');
            mainTable.showColumn('orderNo');
        } else if (document.getElementById('rbnOrderID').checked) {
            // 관리번호 선택 시
            labelElement.textContent = '관리번호';
            inputElement.placeholder = '관리번호 찾기';
            mainTable.showColumn('orderID');
            mainTable.hideColumn('orderNo');
        }
    });
});

function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    const labelElement = document.querySelector('label[for="chkOrderNo"]');
    const inputElement = document.getElementById('txtOrderNo');

    labelElement.textContent = '관리번호';
    inputElement.placeholder = '관리번호 찾기';
}