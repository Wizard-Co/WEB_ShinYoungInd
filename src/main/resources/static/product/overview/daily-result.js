/**
 작성자:    김수정
 작성일:    2025-02-11
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


window.addEventListener('DOMContentLoaded', function () {
    init();
    updateMachineEnabled();
});

// 메인테이블 생성
let mainTbColumns = [
    { title: "순번", field: "num", hozAlign: "center" },
    { title: "생산일자", field: "workDate", hozAlign: "center" },
    { title: "공정", field: "process", hozAlign: "center" },
    { title: "오더번호", field: "orderID", hozAlign: "center" },
    { title: "품번", field: "buyerArticleNo", hozAlign: "center" },

    { title: "품명", field: "article", hozAlign: "center" },
    { title: "규격", field: "spec", hozAlign: "left" },
    { title: "거래처", field: "custom", hozAlign: "center" },
    { title: "수주량", field: "orderQty", hozAlign: "right" },
    { title: "작업시작", field: "workStartTime", hozAlign: "right" },
    { title: "작업종료", field: "workEndTime", hozAlign: "right" },

    { title: "생산량", field: "workQty", hozAlign: "right" },
    { title: "작업자", field: "worker", hozAlign: "center" },
    { title: "작업구분", field: "jobType", hozAlign: "center" },
    { title: "비가동사유", field: "noWorkType", hozAlign: "center" },
    { title: "원자재로트번호", field: "startSaveLabelID", hozAlign: "center" },

    { title: "도수", field: "colorCount", hozAlign: "center" },
    { title: "색상", field: "colorCode", hozAlign: "center" },
    { title: "동판사이즈", field: "cylinderSize", hozAlign: "right" },
    { title: "풀림방향", field: "unlavelDir", hozAlign: "center" },
    { title: "인쇄방식", field: "printThod", hozAlign: "center" },

    { title: "지시특이사항", field: "remark", hozAlign: "left" },
];
let mainTb = createMainTabulator("#tbMain", mainTbColumns);

// 서브테이블 생성
let subTbColumns = [
    { title: "순번", field: "num", hozAlign: "center" },
    { title: "불량명", field: "defect", hozAlign: "left" },
    { title: "불량수량", field: "defectQty", hozAlign: "right" },
];
let subTb = createSummaryTabulator("#tbSub", subTbColumns);

// 합계테이블 생성
let sumTbColumns = [
    { title: "건수", field: "workCnt", hozAlign: "right" },
    { title: "생산량", field: "workQty", hozAlign: "right" },
    { title: "불량수량", field: "defectQty", hozAlign: "right" },
];
let sumTb = createSummaryTabulator("#sumTb", sumTbColumns);


mainTb.on("rowSelectionChanged", function(data, rows){
    if (!rows.length) return;
    let main = rows[0].getData();
    getDefect(main.jobID);
});

document.getElementById('btnExcel').addEventListener("click", function () {
    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
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
        processID: getCombo('cboProcess').value,
        chkMachine: getChecked('chkMachine') ? 1 : 0,
        machineID: getCombo('cboMachine').value,

        chkWorker: getChecked('chkWorker') ? 1 : 0,
        worker: document.getElementById('txtWorker').dataset.id,
        chkJobType: getChecked('chkJobType') ? 1 : 0,
        jobTypeID: getCombo('cboJobType').value,
        chkDefect: getChecked('chkDefect') ? 1 : 0,

        mappedProcessId : cboMachine.options[cboMachine.selectedIndex]?.dataset.mappedProcessId || ''

    }

    loading.visible();

    try {

        const response = await fetch("/product/result/daily/search", {
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

        if (!list.length) {
            mainTb.clearData();
            subTb.clearData();
            sumTb.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        setNo(list);    // 넘버링 왜여기있는지모르겠긴한데..
        mainTb.setData(list);

        // 총계테이블
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

