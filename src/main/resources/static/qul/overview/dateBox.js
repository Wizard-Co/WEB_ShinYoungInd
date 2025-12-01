window.addEventListener('DOMContentLoaded', function () {
    init();
});


document.querySelectorAll('input[name="ordType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const labelElement = document.querySelector('label[for="chkOrderNo"]');
        const inputElement = document.getElementById('txtOrderNo');

        if (document.getElementById('rbnOrderNo').checked) {
            // OrderNo 선택 시
            labelElement.textContent = '오더번호';
            inputElement.placeholder = '오더번호 찾기';
        } else if (document.getElementById('rbnOrderID').checked) {
            // 관리번호 선택 시
            labelElement.textContent = '관리번호';
            inputElement.placeholder = '관리번호 찾기';
        }
    });
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
        {title: "검사일자", field: "examDate", hozAlign: "center"},
        {title: "거래처", field: "kcustom", hozAlign: "center", },
        {title: "오더번호", field: "orderNo", hozAlign: "center"},
        {title: "관리번호", field: "orderID", hozAlign: "center"},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "수주량", field: "orderQty", hozAlign: "right", formatter: "number"},
        {title: "박스번호", field: "inBoxID", hozAlign: "center"},
        {title: "검사량", field: "realQty", hozAlign: "right", formatter:"number"},
        {title: "합격량", field: "ctrlQty", hozAlign: "right", formatter:"number"},
        {title: "불량수량", field: "defectQty", hozAlign: "right", formatter:"number"},
        {title: "단위", field: "unitClssName", hozAlign: "center"},
        {title: "검사자", field: "name", hozAlign: "center"},

    ],
    rowFormatter: function(row){
        let data = row.getData();
        let examDateCell = row.getCell("examDate");
        switch(data.gbn) {
            case 2:
                row.getElement().style.backgroundColor = "#D8D8D8";
                examDateCell.getElement().textContent = "";
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
        {title: "검사수량", field: "totalRealQty", hozAlign: "center", formatter: "number"},
        {title: "합격수량", field: "totalCtrlQty", hozAlign: "center", formatter: "number"},
        {title: "불량수량", field: "totalDefectQty", hozAlign: "center", formatter: "number"},

    ],
});

async function search() {
    let param = {
        ChkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-',''),
        eDate: document.getElementById('eDate').value.replaceAll('-',''),

        ChkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1 : 0,
        BuyerArticleHo: document.getElementById('txtBuyerArticleNo').value,

        ChkArticleID: getChecked('chkArticle') ? 1 : 0,
        ArticleID: document.getElementById('txtArticle').value,

        ChkCustomID : getChecked('chkCustomID') ? 1:0,
        CustomID : document.getElementById('txtCustomID').value,

        ChkdefectGrpID: getChecked('chkDefectGrpID') ? 1:0,
        DefectGrpID : document.getElementById('cboDefectGrpID').value,

        ChkBoxID : getChecked('chkBoxLabel')? 1:0,
        BoxID : document.getElementById('txtBoxLabel').value,

        ChkLabelID : 0,
        LabelID : "",

        ChkOrderID : returnRbnInt(),
        OrderID : document.getElementById('txtOrderNo').value,
    }

    loading.visible();

    try {

        const response = await fetch("/qul/result/dateBox/search", {
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

        // const count = data.filter(item => item.depth !== 1 && item.depth !== 2).length;
        // const mainData = data.filter(item => item.depth !== 2);  // depth 2가 아닌 것
        // const totalData = data.filter(item => item.depth === 2); // depth 2인 것 (총계)

        // totalData[0].totalCount = count;
        // 테이블에 설정
        mainTable.setData(data);
        const totalData = calculateStats(data);
        subTable.setData(totalData);



    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

function calculateStats(dataSet) {
    const outData = dataSet.filter(d => d.gbn == 2);
    const dataCount = dataSet.filter(d=> d.gbn == 1).length;

    const result = [{
        totalCount: dataCount,
        totalDefectQty: outData.reduce((sum, d) => sum + (d.defectQty || 0), 0),
        totalRealQty: outData.reduce((sum, d) => sum + (d.realQty || 0), 0),
        totalCtrlQty: outData.reduce((sum, d) => sum + (d.ctrlQty || 0), 0)

    }];
    return result;
}

document.getElementById('btnSearch').addEventListener('click', search)
document.getElementById('btnExcel').addEventListener("click", function () {
    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});

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

