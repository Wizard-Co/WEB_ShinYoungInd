window.addEventListener('DOMContentLoaded', function () {
    init();
});

document.getElementById('cboProcessID').addEventListener('change', function() {
    const processID = this.value;
    console.log(processID);

    fetch(`/qul/result/dateProd/getMachineList?processID=${processID}`)
        .then(response => response.json())
        .then(data => {
            const cboMachine = document.getElementById('cboMachineID');
            cboMachine.innerHTML = '';
            if(data.length === 0) {
                cboMachine.innerHTML = '<option value="">전체</option>';
            } else {
                data.forEach(item => {
                    cboMachine.innerHTML +=
                        `<option value="${item.code_ID}">${item.code_Name}</option>`;
                });
            }

        })
        .catch(error => console.error('오류:', error));
});

function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

}

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
        {title: "생산일자", field: "scanDate", hozAlign: "center"},
        {title: "공정", field: "process", hozAlign: "center", },
        {title: "호기", field: "mcname", hozAlign: "center"},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center"},
        {title: "불량유형", field: "kdefect", hozAlign: "center"},
        {title: "발생수량", field: "defectQty", hozAlign: "right", formatter: "number"},
        {title: "작업자", field: "workPersonName", hozAlign: "center"},
        {title: "생산량", field: "workQty", hozAlign: "right", formatter:"number"},

    ],
    rowFormatter: function(row){
        let data = row.getData();
        let dateCell = row.getCell("scanDate");
        let processCell = row.getCell('process');
           switch(data.gbn) {
            case 3:
                row.getElement().style.backgroundColor = "#D8D8D8";
                dateCell.getElement().textContent = "일계";
                processCell.getElement().textContent = "";
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
        {title: "불량수량", field: "totalDefectQty", hozAlign: "center", formatter: "number"},
        {title: "초도불량", field: "totalInitialDefectQty", hozAlign: "center", formatter: "number"},

    ],
});

async function search() {
    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-',''),
        eDate: document.getElementById('eDate').value.replaceAll('-',''),

        chkProcessID: getChecked('chkProcessID') ? 1 : 0,
        ProcessID: document.getElementById('cboProcessID').value,

        chkArticleID: getChecked('chkArticle') ? 1 : 0,
        ArticleID: document.getElementById('txtArticle').dataset.id ?? "",

        chkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1:0,
        BuyerArticleNo : document.getElementById('txtBuyerArticleNo').dataset.id ?? "",

        chkMachineID : getChecked('chkMachineID')? 1:0,
        MachineID : document.getElementById('cboMachineID').value,

        chkExceptInitialDefect : getChecked('chkExceptInitialDefect') ? 1:0,
    }

    loading.visible();

    try {

        const response = await fetch("/qul/result/dateProd/search", {
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
    const prdData = dataSet.filter(d => d.gbn === 3);
    const totalCount = prdData.length;
    const totalDefectQty = prdData.reduce((sum, d) => sum + (d.defectQty || 0), 0);
    const totalInitialDefectQty = prdData
        .filter(d => d.kdefect && d.kdefect.includes("초도"))
        .reduce((sum, d) => sum + (d.defectQty || 0), 0);
    const result = [{
        totalCount: totalCount,
        totalDefectQty: totalDefectQty,
        totalInitialDefectQty : totalInitialDefectQty
    }];
    return result;
}

document.getElementById('btnSearch').addEventListener('click', search)
document.getElementById('btnExcel').addEventListener("click", function () {
    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});