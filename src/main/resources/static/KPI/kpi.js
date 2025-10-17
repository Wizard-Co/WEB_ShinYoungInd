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
let graphP;
let graphD;
const tableP = new DataTable('#tableP', {
    searching: false,
    paging: false,
    columns: [
        {data: "yyyyMM"},
        {data: "buyerArticleNo"},
        {data: "article"},
        {data: "workQty"},
        {data: "workTime"},
        {data: "workQtyPerHour"},
        {data: "workUpRate"},
        {data: "workGoalRate"},
    ],
    rowCallback: function (row, data, index) {
        if (data.sort == 9) {
            row.classList.add('total');
        }
    },
    scrollY: true
})

const tableD = new DataTable('#tableD', {
    searching: false,
    paging: false,
    columns: [
        {data: "yyyyMM"},
        {data: "defectWorkQty"},
        {data: "defectQty"},
        {data: "defectRate"},
        {data: "defectUpRate"},
        {data: "defectGoalRate"}
    ],
    rowCallback: function (row, data, index) {
        if (data.sort == 9) {
            row.classList.add('total');
        }
    },
    scrollY: true
})

function init() {
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    document.getElementById('btnSearch').addEventListener("click", function () {

        let param = {
            chkDate: getChecked('chkDate') ? 1 : 0,
            sDate: document.getElementById('sDate').value.replaceAll('-', ''),
            eDate: document.getElementById('eDate').value.replaceAll('-', ''),
            chkArticle: getChecked('chkArticle') ? 1 : 0,
            articleID: document.getElementById('txtArticle').value,
        }

        getProd(param);
        getDefect(param);
    });
}

async function getProd(param) {
    loading.visible();

    try {
        const response = await fetch("/kpi/prod", {
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
            tableP.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        tableP.clear().rows.add(data).draw();
        drawP(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function getDefect(param) {
    loading.visible();

    try {
        const response = await fetch("/kpi/defect", {
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
            tableD.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        tableD.clear().rows.add(data).draw();
        drawD(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

function drawP(data) {
    const div = document.getElementById('graphP');
    const labels = data.slice(0, -1).map(x => x.yyyyMM);
    const values = data.slice(0, -1).map(x => x.workQtyPerHour);;

    if(graphP){
        graphP.destroy();
    }

    graphP = new Chart(div, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '생산량 증가',
                    data: values,
                    borderWidth: 1
                },
            ]
        }
    })
}
function drawD(data) {
    const div = document.getElementById('graphD');
    const labels = data.slice(0, -1).map(x => x.yyyyMM);
    const values = data.slice(0, -1).map(x => x.defectRate);;

    if(graphD){
        graphD.destroy();
    }

    graphD = new Chart(div, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '불량량 증가',
                    data: values,
                    borderColor: '#FF6666',
                    pointBackgroundColor: '#FF6666',
                    backgroundColor: '#FF9999',
                    borderWidth: 1
                }
            ]
        }
    });

}