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
});

let selectedRow;
const mainTb = new DataTable('#tbMain', {
    searching: false,
    buttons: [{
        extend: 'excel',
        filename: '일 생산 현황',
        title: '일 생산 현황',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num"},
        {data: "workDate"},
        {data: "process"},
        {data: "orderID"},
        {data: "buyerArticleNo"},

        {data: "article"},
        {data: "spec"},
        {data: "custom"},
        {data: "orderQty"},
        {data: "workStartTime"},
        {data: "workEndTime"},

        {data: "workQty"},
        {data: "worker"},
        {data: "jobType"},
        {data: "noWorkType"},
        {data: "startSaveLabelID"},

        {data: "colorCount"},
        {data: "colorCode"},
        {data: "cylinderSize"},
        {data: "unlavelDir"},
        {data: "printThod"},

        {data: "remark"},
    ],
    rowCallback: function (row, data, index){
        if(data.cls == 2){
            row.style.backgroundColor = '#b8d6f6';
        } else if(data.cls == 4){
            row.style.backgroundColor = '#419bf6';
        } else if(data.cls == 9){
            row.classList.add('total');
        }
    },
    scrollX: true
})
const subTb = new DataTable('#tbSub', {
    searching: false,
    columns: [
        {data: "num", className: 'center'},
        {data: "defect", className: 'left'},
        {data: "defectQty", className: 'left'},
    ]
})

mainTb.on('select', function (e, dt, type, indexes) {
    let main = mainTb.row(indexes).data();
    getDefect(main.jobID);
})
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
}

async function Search() {
    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-',''),
        eDate: document.getElementById('eDate').value.replaceAll('-',''),

        chkCustom: getChecked('chkCustom') ? 1 : 0,
        customID: document.getElementById('txtCustom').value,

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

        if (!data?.length) {
            table.clear().draw(); // 기존 데이터 지워주기
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        mainTb.clear().rows.add(data).draw();

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
        subTb.clear().rows.add(data).draw();

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
