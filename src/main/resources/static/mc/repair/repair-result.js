/**
 작성자:    김수정
 작성일:    2025-07-30
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
        filename: '설비 수리 조회',
        title: '설비 수리 조회',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num"},
        {data: "repairType"},
        {data: "mcName"},
        {data: "repairDate"},
        {data: "repairPrice"},
        {data: "repairRemark"},

        {data: "mcPart"},
        {data: "custom"},
        {data: "partQty"},
        {data: "partPrice"},

        {data: "reason"},
        {data: "partRemark"},
    ],
    rowCallback: function (row, data, index) {
        if (data.cls == 1) {
            row.style.backgroundColor = '#b8d6f6';
        }  else if (data.cls == 9) {
            row.classList.add('total');
        }
    },
    scrollX: true
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
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),

        chkMCName: getChecked('chkMCName') ? 1 : 0,
        mcName: document.getElementById('txtMCName').value,

        chkMCPart: getChecked('chkMCPart') ? 1 : 0,
        mcPartID: document.getElementById('txtMCPart').value,
    }

    loading.visible();

    try {

        const response = await fetch("/mc/repair/result/search", {
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
            mainTb.clear().draw();
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
