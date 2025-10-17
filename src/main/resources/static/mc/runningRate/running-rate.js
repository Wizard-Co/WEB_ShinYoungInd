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

let selectedRow;
let graph;
const table = new DataTable('#table', {
    searching: false,
    paging: false,
    columns: [
        {data: "process"},
        {data: "machineNo"},
        {data: "dayBaseHour"},
        {data: "dayWorkHour"},
        {data: "dayNonWorkHour"},
        {data: "dayWorkRate"},
    ],
    scrollY: true
})

let tbody = document.querySelector('#table tbody');
tbody.addEventListener('dblclick', moveDetail);

function init() {
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    document.getElementById('btnSearch').addEventListener("click", function () {
        search();
    });
}

async function search() {
    loading.visible();

    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),
    }

    try {
        const response = await fetch("/mc/runningrate/search", {
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
        draw(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}
function draw(data) {
    const div = document.getElementById('graph');
    const labels = data.map(x => x.machineNo);
    const values = data.map(x => x.dayWorkRate);;
    const values2 = data.map(x => x.monthWorkRate);;

    if(graph){
        graph.destroy();
    }

    graph = new Chart(div, {
        data: {
            datasets: [{
                type: 'line',
                label: "일",
                data: values,
                borderWidth: 1
            }, {
                type: 'line',
                label: "월",
                data: values2,
                borderWidth: 1
            }],
            labels: labels
        }
    })
}

function moveDetail(){
    window.location.href = '/mc/runningrate/detail';
}
