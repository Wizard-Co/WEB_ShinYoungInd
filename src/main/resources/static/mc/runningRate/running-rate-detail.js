/**
 작성자:    김수정
 작성일:    2025-06-17
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

window.addEventListener('DOMContentLoaded', function () {
    init();
});

const workTable = new DataTable('#workTable', {
    searching: false,
    paging: true,
    columns: [
        {data: "workDate"},
        {data: "article"},
        {data: "workPerson"},
        {data: "eduCount"},
        {data: "license"},
        {data: "licenseCount"},
        {data: "startDate"}
    ],
    scrollY: true
})

const machineTable = new DataTable('#machineTable', {
    searching: false,
    paging: true,
    columns: [
        {data: "mcName"},
        {data: "machineNo"},
        {data: "lastInspectDate"},
        {data: "inspectCount"},
        {data: "defectContents"}
    ],
    scrollY: true
})
const noWorkTable = new DataTable('#noWorkTable', {
    searching: false,
    paging: true,
    columns: [
        {data: "workDate"},
        {data: "noWorkReason"}
    ],
    scrollY: true
})

function init() {
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    document.getElementById('btnSearch').addEventListener("click", function () {
        search('work', workTable);
        search('machine', machineTable);
        search('nowork', noWorkTable);
    });
}

async function search(type, table) {
    loading.visible();

    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),
        chkProcess: getChecked('chkProcess') ? 1 : 0,
        processID: document.getElementById('cboProcess').value,
        chkMachine: getChecked('chkMachine') ? 1 : 0,
        machineID: document.getElementById('cboMachine').value
    }

    let url = `/mc/runningrate/detail/search/${type}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
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
            table.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        table.clear().rows.add(data).draw();

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
