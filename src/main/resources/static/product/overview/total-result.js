/**
 작성자:    김수정
 작성일:    2025-02-13
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

import {cols} from './total-result-columns.js';



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

    // 첫 탭 테이블 만들기
    const type = getTab().dataset.type;
    table[type] = createMainTabulator('#'+ type + 'Tb', buildColumns(type));
}

function getTab() {
    return document.querySelector('#nav-tab .nav-link.active');
}

async function search() {
    const type = getTab().dataset.type;

    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),

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
        chkLike: getChecked('chkLike') ? 1 : 0,
    }

    loading.visible();

    try {
        const response = await fetch('/product/result/total/' + type, {
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

let table = {};
function setTable(data, type) {
    if (!table[type]) {
        table[type] = createMainTabulator('#' + type + 'Tb', buildColumns(type));
    }
    table[type].replaceData(data || []);
}

// 탭클릭시 테이블 만들기
document.querySelectorAll('#nav-tab .nav-link').forEach(btn => {
    btn.addEventListener('shown.bs.tab', function () {
        const type = this.dataset.type;
        const selector = `#${type}Tb`;

        if (!table[type]) {
            table[type] = createMainTabulator(selector, buildColumns(type));
        }
    });
});



document.getElementById('btnExcel').addEventListener("click", function () {
    let type = getTab().dataset.type;
    if (table[type]) {
        table[type].buttons('.buttons-excel').trigger();
    }
});


function buildColumns(type) {
    if (type === "process") {
        return [
            { title: "순번", field: "num", hozAlign: "center" },
            { title: "공정", field: "process", hozAlign: "center" },
            { title: "호기", field: "machineNo", hozAlign: "center" },
            { title: "모델", field: "model", hozAlign: "center" },
            { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
            { title: "품명", field: "article", hozAlign: "left" },
            { title: "거래처", field: "custom", hozAlign: "left" },
            { title: "생산량", field: "workQty", hozAlign: "right" },
            { title: "작업시간", field: "workTime", hozAlign: "right" },
            { title: "박스당 장입량", field: "qtyPerBox", hozAlign: "right" },
        ];
    }

    if (type === "article") {
        return [
            { title: "순번", field: "num", hozAlign: "center" },
            { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
            { title: "품명", field: "article", hozAlign: "left" },
            { title: "거래처", field: "custom", hozAlign: "left" },
            { title: "모델", field: "model", hozAlign: "center" },
            { title: "생산량", field: "workQty", hozAlign: "right" },
            { title: "박스당 장입량", field: "qtyPerBox", hozAlign: "right" },
        ];
    }

    if (type === "worker") {
        return [
            { title: "순번", field: "num", hozAlign: "center" },
            { title: "작업자", field: "worker", hozAlign: "center" },
            { title: "공정", field: "process", hozAlign: "center" },
            { title: "호기", field: "machineNo", hozAlign: "center" },
            { title: "모델", field: "model", hozAlign: "center" },
            { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
            { title: "품명", field: "article", hozAlign: "left" },
            { title: "거래처", field: "custom", hozAlign: "left" },
            { title: "생산량", field: "workQty", hozAlign: "right" },
            { title: "박스당 장입량", field: "qtyPerBox", hozAlign: "right" },
        ];
    }

    if (type === "daily") {
        return [
            { title: "순번", field: "num", hozAlign: "center" },
            { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
            { title: "품명", field: "article", hozAlign: "left" },
            { title: "생산량", field: "totalQty", hozAlign: "right" },
            { title: "1일", field: "day01", hozAlign: "right" },
            { title: "2일", field: "day02", hozAlign: "right" },
            { title: "3일", field: "day03", hozAlign: "right" },
            { title: "4일", field: "day04", hozAlign: "right" },
            { title: "5일", field: "day05", hozAlign: "right" },
            { title: "6일", field: "day06", hozAlign: "right" },
            { title: "7일", field: "day07", hozAlign: "right" },
            { title: "8일", field: "day08", hozAlign: "right" },
            { title: "9일", field: "day09", hozAlign: "right" },
            { title: "10일", field: "day10", hozAlign: "right" },
            { title: "11일", field: "day11", hozAlign: "right" },
            { title: "12일", field: "day12", hozAlign: "right" },
            { title: "13일", field: "day13", hozAlign: "right" },
            { title: "14일", field: "day14", hozAlign: "right" },
            { title: "15일", field: "day15", hozAlign: "right" },
            { title: "16일", field: "day16", hozAlign: "right" },
            { title: "17일", field: "day17", hozAlign: "right" },
            { title: "18일", field: "day18", hozAlign: "right" },
            { title: "19일", field: "day19", hozAlign: "right" },
            { title: "20일", field: "day20", hozAlign: "right" },
            { title: "21일", field: "day21", hozAlign: "right" },
            { title: "22일", field: "day22", hozAlign: "right" },
            { title: "23일", field: "day23", hozAlign: "right" },
            { title: "24일", field: "day24", hozAlign: "right" },
            { title: "25일", field: "day25", hozAlign: "right" },
            { title: "26일", field: "day26", hozAlign: "right" },
            { title: "27일", field: "day27", hozAlign: "right" },
            { title: "28일", field: "day28", hozAlign: "right" },
            { title: "29일", field: "day29", hozAlign: "right" },
            { title: "30일", field: "day30", hozAlign: "right" },
            { title: "31일", field: "day31", hozAlign: "right" },
        ];
    }

    return [];
}
