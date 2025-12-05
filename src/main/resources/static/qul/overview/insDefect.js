window.addEventListener('DOMContentLoaded', function () {
    init();
});

let leftMainTable = new Tabulator("#left-main-table", {
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
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center", },
        {title: "검사수량", field: "realQty", hozAlign: "center"},
        {title: "불량유형", field: "kdefect", hozAlign: "center"},
        {title: "불량수량", field: "defectQty", hozAlign: "center"},
        {title: "불량률(%)", field: "defectRate", hozAlign: "center"},

    ],
    rowFormatter: function(row){
        let data = row.getData();
        let articleCell = row.getCell("article");
        switch(data.gbn) {
            case 3:
                row.getElement().style.backgroundColor = "#D8D8D8";
                articleCell.getElement().textContent = "";
                break;
            case 4:
                row.getElement().style.backgroundColor = "#8f8c8c";
                articleCell.getElement().textContent = "";
                break;
        }
    },
});


let rightMainTable = new Tabulator("#right-main-table", {
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
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "불량유형", field: "kdefect", hozAlign: "center", },
        {title: "불량수량", field: "defectQty", hozAlign: "center"},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "검사수량", field: "realQty", hozAlign: "center"},
        {title: "불량율(%)", field: "defectRate", hozAlign: "center"},

    ],
    rowFormatter: function(row){
        let data = row.getData();
        let articleCell = row.getCell("article");
        let buyerArticleNo = row.getCell("buyerArticleNo");
        let kdefectCell = row.getCell("kdefect");
        switch(data.gbn) {
            case 3:
                row.getElement().style.backgroundColor = "#D8D8D8";
                articleCell.getElement().textContent = "";
                buyerArticleNo.getElement().textContent = "";
                kdefectCell.getElement().textContent = "";
                break;
            case 4:
                row.getElement().style.backgroundColor = "#8f8c8c";
                articleCell.getElement().textContent = "";
                buyerArticleNo.getElement().textContent = "";
                kdefectCell.getElement().textContent = "";
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
        {title: "검사수량", field: "realQty", hozAlign: "center", formatter: "number"},
        {title: "불량수량", field: "defectQty", hozAlign: "center", formatter: "number"},
        {title: "불량률", field: "defectRate", hozAlign: "center", formatter: "number"},
    ],
});

document.getElementById('btnSearch').addEventListener('click', search)
btnExcel.addEventListener("click", function (){
    mainTable.download("xlsx", "최종 검사 집계 조회.xlsx");
})

async function search() {

    let leftData, rightData;

    for(let i = 0; i < 2; i++){
        let param = {
            ChkDate: getChecked('chkDate') ? 1 : 0,
            SDate: document.getElementById('sDate').value.replaceAll('-',''),
            EDate: document.getElementById('eDate').value.replaceAll('-',''),

            ChkCustomID : getChecked('chkCustomID') ?  1: 0,
            CustomID : document.getElementById('txtCustomID').value,

            ChkInCustomID : 0,
            InCustomID : "",

            ChkBuyerArticleNo : getChecked('chkBuyerArticleNo') ?  1:0,
            BuyerArticleNo : document.getElementById('txtBuyerArticleNo').dataset.id,

            ChkArticleID : getChecked('chkArticle') ? 1:0,
            ArticleID : document.getElementById('txtArticle').dataset.id,

            nClss : i,

        }

        loading.visible();

        try {

            const response = await fetch("/qul/result/insDefect/search", {
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

            if(i === 0)
                leftData = data;
            else
                rightData = data;

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            loading.invisible();
        }
    }

    try{
        if (!leftData?.length || !rightData?.length) {
            leftMainTable.clearData();
            rightMainTable.clearData();
            subTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        else{
            leftMainTable.setData(leftData);
            rightMainTable.setData(rightData);
        }

        const subData = leftData.filter(item => item.gbn == 4);
        subTable.setData(subData);
    }
    catch (error){
        console.error("Data Binding", error);
    }
    finally {
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