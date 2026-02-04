/**
 작성자:    김수정
 작성일:    2025-10-12
 내용: 천공 작업일보 js
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

window.addEventListener('DOMContentLoaded', function () {
    init();
});

let selectedRow;
let tbMainColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "라벨", field: "labelID", hozAlign: "left" },
    { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
    { title: "품명", field: "article", hozAlign: "left" },
    { title: "생산일자", field: "workDate", hozAlign: "center" },
];

let tbSubColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "불량명", field: "defect", hozAlign: "left" },
    { title: "불량수량", field: "defectQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
];

let tbSumColumns = [
    { title: "건수", field: "workCnt", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "생산량", field: "workQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "불량수량", field: "defectQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
];


let mainTb = createMainTabulator("#tbMain", tbMainColumns);
let subTb = createSummaryTabulator("#tbSub", tbSubColumns);
let sumTb = createSummaryTabulator("#tbSum", tbSumColumns);

mainTb.on("rowClick", function (e, row) {
    let main = row.getData();
    getDefect(main.jobID);
});
document.getElementById('btnExcel').addEventListener("click", function () {
    mainTb.download("xlsx", "천공작업일보조회.xlsx");
});
function init() {
    document.getElementById('btnSearch').addEventListener("click", Search);
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    getMachine('');
}

async function Search() {
    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-',''),
        eDate: document.getElementById('eDate').value.replaceAll('-',''),

        chkCustom: getChecked('chkCustom') ? 1 : 0,
        customID: document.getElementById('txtCustom').dataset.id,

        chkArticle: getChecked('chkArticle') ? 1 : 0,
        articleID: document.getElementById('txtArticle').dataset.id,
        chkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1 : 0,
        buyerArticleNo: document.getElementById('txtBuyerArticleNo').dataset.id,

        chkProcess: getChecked('chkProcess') ? 1 : 0,
        processID: getCombo('cboProcess')?.value ?? "",
        chkMachine: getChecked('chkMachine') ? 1 : 0,
        machineID: getCombo('cboMachine')?.value ?? "",

        chkWorker: getChecked('chkWorker') ? 1 : 0,
        worker: document.getElementById('txtWorker').dataset.id,
        chkJobType: getChecked('chkJobType') ? 1 : 0,
        jobTypeID: document.getElementById('cboJobType').value,
        chkDefect: getChecked('chkDefect') ? 1 : 0,

        chkSpec: getChecked('chkSpec') ? 1 : 0,
        spec: document.getElementById('txtSpec').value,

        mappedProcessId : cboMachine.options[cboMachine.selectedIndex]?.dataset.mappedProcessId || ''
    }
    loading.visible();

    try {

        const response = await fetch("/product/result/daily/drilling/search", {
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

        const list = data?.list ?? [];
        const summary = data?.summary ?? null;

        mainTb.clearData();
        sumTb.clearData();

        if (!list?.length) {
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(list);
        // mainTb.clear().rows.add(list).draw();
        mainTb.setData(list);

        // 총계테이블
        // sumTb.clear();
        // if (summary) sumTb.rows.add([summary]);
        // sumTb.draw();
        sumTb.clearData();
        sumTb.setData([data.summary]);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function getDefect(jobID) {
    loading.visible();

    try {
        const response = await fetch("/product/result/daily/search/defect", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: jobID
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        setNo(data);
        subTb.clearData();
        subTb.setData(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
