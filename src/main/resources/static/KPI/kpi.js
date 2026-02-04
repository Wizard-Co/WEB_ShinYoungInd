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

let tablePColumns = [
    { title: "년월", field: "yyyyMM", hozAlign: "center" },
    { title: "품번", field: "buyerArticleNo", visible: false },
    { title: "품번", field: "article", visible: false },
    { title: "생산량(EA)", field: "workQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "작업시간(Hr)", field: "workTime", hozAlign: "right",
        formatter: function (cell) {
            const v = cell.getValue();
            if (v == null || v === "") return "";
            const n = Number(v);
            if (Number.isNaN(n)) return v;
            return n.toFixed(1);
        }
    },
    { title: "시간당 생산량(EA/Hr)", field: "workQtyPerHour", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "목표달성률(%)", field: "workGoalRate", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: 2 } },
    { title: "개선률(%)", field: "workUpRate", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: 2 } },
];

let tableP = createMainTabulator("#tableP", tablePColumns);
tableP.setData = (function (orig) {
    return function (data) {
        if (Array.isArray(data)) {
            data.forEach(r => {
                if (r && r.sort == 9) r._tabulatorRowClass = "total";
            });
        }
        return orig.call(this, data);
    };
})(tableP.setData);

let tableDColumns = [
    { title: "년월", field: "yyyyMM", hozAlign: "center" },
    { title: "검사수량(EA)", field: "defectWorkQty", hozAlign: "right",
        formatter: "money", formatterParams: { thousand: ",", precision: false }
    },
    { title: "불량수량(EA)", field: "defectQty", hozAlign: "right",
        formatter: "money", formatterParams: { thousand: ",", precision: false }
    },
    { title: "불량률(%)", field: "defectRate", hozAlign: "right",
        formatter: function (cell) {
            const v = cell.getValue();
            if (v == null || v === "") return "";
            const n = Number(v);
            if (Number.isNaN(n)) return v;
            return n.toFixed(1);
        }
    },
    { title: "목표달성률(%)", field: "defectGoalRate", hozAlign: "right",
        formatter: "money", formatterParams: { thousand: ",", precision: 2 }
    },
    { title: "개선률(%)", field: "defectUpRate", hozAlign: "right",
        formatter: "money", formatterParams: { thousand: ",", precision: 2 }
    },
];

let tableD = createMainTabulator("#tableD", tableDColumns);

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

document.getElementById('btnExcel').addEventListener("click", function () {
    // tableP.download("xlsx", "KPI조회.xlsx");
    const excelModal = new bootstrap.Modal(document.getElementById('excelModal'));
    excelModal.show();
});
const tables = {
    tableP: tableP,
    tableD: tableP,
};

document.querySelectorAll('#excelModal button[data-table-id]').forEach(button => {
    button.addEventListener('click', function () {
        const tableID = this.getAttribute('data-table-id');
        const tb = tables[tableID];

        tb.download("xlsx", tableID + ".xlsx");

        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('excelModal'));
        modalInstance.hide();
    });
});

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
            tableP.clearData()
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        tableP.setData(data);
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
            tableD.clearData()
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        tableD.setData(data)
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