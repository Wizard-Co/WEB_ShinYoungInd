/**
 작성자:    김수정
 작성일:    2025-02-13
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

import {cols} from './total-result-columns.js';

let table = {};

window.addEventListener('DOMContentLoaded', function () {
    init();
});

function init() {
    document.getElementById('btnSearch').addEventListener("click", search);
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());
}

function getTab() {
    let tab = document.querySelector('.nav-link.active');
    return tab;
}

async function search() {
    let type = getTab().dataset.type;

    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),

        chkCustom: getChecked('chkCustom') ? 1 : 0,
        customID: document.getElementById('txtCustom').value,

        chkArticle: getChecked('chkArticle') ? 1 : 0,
        articleID: document.getElementById('txtArticle').value,
        chkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1 : 0,
        buyerArticleNo: document.getElementById('txtBuyerArticleNo').value,

        chkProcess: getChecked('chkProcess') ? 1 : 0,
        processID: document.getElementById('cboProcess').value,
        chkMachine: getChecked('chkMachine') ? 1 : 0,
        machineID: document.getElementById('cboMachine').value,

        chkWorker: getChecked('chkWorker') ? 1 : 0,
        worker: document.getElementById('txtWorker').value,
        chkLike: getChecked('chkLike') ? 1 : 0,
    }

    loading.visible();

    try {
        const response = await fetch(`/product/result/total/${type}`, {
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
            toastr.warning('조회된 데이터가 없습니다','',{ positionClass: 'toast-bottom-center' });
            return;
        }

        setNo(data);
        setTable(data, type);

    } catch (e) {
        console.error("Fetch error:", e);
    } finally {
        loading.invisible();
    }

}


function setTable(dataSet, type) {
    let tableID = `#${type}Tb`;
    let select = cols[type];

    let col = Object.entries(select).map(([key, meta]) => {
        const classList = meta.className?.split(" ") || [];
        const hasComma = classList.includes("comma");

        return {
            data: key,
            title: meta.title,
            className: meta.className || "left",
            width: meta.width || null,
            orderable: meta.orderable || "false",
            render: hasComma
                ? $.fn.dataTable.render.number(",", ".", 0)
                : null
        };
    });

    let datalst = dataSet.map(a => {
        let filtered = Object.fromEntries(
            Object.keys(select).map(key => [key, a[key] ?? null])
        );
        filtered.cls = a.cls ?? null;
        return filtered;
    });

    if (DataTable.isDataTable(tableID)) {
        table[type].clear().rows.add(datalst).draw();
    } else {
        table[type] = new DataTable(tableID, {
            searching: false,
            autoWidth: false,
            columns: col,
            data: datalst,
            buttons: [
                {
                    extend: 'excel',
                    title: type,
                    filename: type,
                }
            ],
            rowCallback: function (row, data, index) {
                if (data.cls == 2) {
                    row.style.backgroundColor = "#b8d6f6";
                } else if (data.cls == 3) {
                    row.style.backgroundColor = "#419bf6";
                } else if (data.cls == 9) {
                    row.classList.add("total");
                }
            }
        });
    }
}

document.getElementById('btnExcel').addEventListener("click", function () {
    let type = getTab().dataset.type;
    if (table[type]) {
        table[type].buttons('.buttons-excel').trigger();
    }
});