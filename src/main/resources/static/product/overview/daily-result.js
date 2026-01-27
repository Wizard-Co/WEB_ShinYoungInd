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


let selectedRow;
const mainTb = new DataTable('#tbMain', {
    searching: false,
    // 테이블이 비었을 때 옵션 추가
    language: {
        emptyTable: "검색된 항목이 없습니다.",
        zeroRecords: "검색된 항목이 없습니다.",
        infoEmpty: "검색된 항목이 없습니다.",
    },
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
        if(data.cls == 2){          // 일반데이터
            row.style.backgroundColor = '#b8d6f6';
        } else if(data.cls == 3){   // 날짜계
            row.style.backgroundColor = '#6aacfa';
        }
        else if(data.cls == 4){   // 공정계(공정 + 날짜)
            row.style.backgroundColor = '#419bf6';
        } 
        // 이건 안쓰는 기능
        else if(data.cls == 9){
            row.classList.add('total');
        }
    },
    scrollX: true
})
const subTb = new DataTable('#tbSub', {
    searching: false,

    // 테이블이 비었을 때 옵션 추가
    language: {
        emptyTable: "불량이 있는 생산현황을 클릭해주세요.",
        zeroRecords: "불량이 있는 생산현황을 클릭해주세요.",
        infoEmpty: "불량이 있는 생산현황을 클릭해주세요.",
    },
    columns: [
        {data: "num", className: 'center'},
        {data: "defect", className: 'left'},
        {data: "defectQty", className: 'left'},
    ]
})
const sumTb = new DataTable('#sumTb', {
    searching: false,
    pagination: false,

    // 테이블이 비었을 때 옵션 추가
    language: {
        emptyTable: "검색된 항목이 없습니다.",
        zeroRecords: "검색된 항목이 없습니다.",
        infoEmpty: "검색된 항목이 없습니다.",
    },
    columns: [
        { data: "workCnt", className: 'center'},
        { data: "workQty", className: 'left'},
        { data: "defectQty", className: 'left'},
    ]
});

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
            mainTb.clear().draw();
            subTb.clear().draw();
            sumTb.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        setNo(list);    // 넘버링 왜여기있는지모르겠긴한데..
        mainTb.clear().rows.add(list).draw();

        // 총계테이블
        sumTb.clear();
        if (summary) sumTb.rows.add([summary]);
        sumTb.draw();

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

