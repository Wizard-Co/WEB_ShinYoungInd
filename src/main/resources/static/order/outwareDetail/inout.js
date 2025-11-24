import {cols, multiHeaders} from "./inout-columns.js";
let table = {};

const tabData = {
    period: null,
    daily: null,
    monthV: null,
    monthH: null
};

const excelTitle={
    period : "기간집계",
    daily : "일일집계",
    monthV : "월별집계(세로)",
    monthH: "월별집계(가로)",
}

window.addEventListener('DOMContentLoaded', function () {
    table.tbSub = new DataTable('#tbSub', {
        searching: false,
        paging: false,
        info: false,
        ordering: false,
        autoWidth: false,
        columns: [
            {data: 'roll', className: 'right comma',
                render: $.fn.dataTable.render.number(",", ".", 0)},
            {data: 'totQty', className: 'right comma',
                render: $.fn.dataTable.render.number(",", ".", 0)}
        ],
        data: []
    });

    // 월별 통계 테이블
    table.tbSubMonth = new DataTable('#tbSubMonth', {
        searching: false,
        paging: false,
        info: false,
        ordering: false,
        autoWidth: false,
        columns: [
            {data: 'totalRoll', className: 'right comma'},
            {data: 'totalQty', className: 'right comma'},
            {data: 'baseMonthRoll', className: 'right comma'},
            {data: 'baseMonthQty', className: 'right comma'},
            {data: 'add1MonthRoll', className: 'right comma'},
            {data: 'add1MonthQty', className: 'right comma'},
            {data: 'add2MonthRoll', className: 'right comma'},
            {data: 'add2MonthQty', className: 'right comma'}
        ].map(col => ({...col, render: $.fn.dataTable.render.number(",", ".", 0)})),
        data: []
    });
    // 처음엔 월별 숨김
    $('#tbSubMonth_wrapper').hide();

    const navTabHeight = $('#nav-tab').outerHeight();
    $('.stats-container').css('height', navTabHeight + 'px');

    init();

});

function updateStatsTable(type, data) {
    if (type === 'monthH') {
        $('#tbSub_wrapper').hide();
        $('#tbSubMonth_wrapper').show();

        const statsData = calculateStatsMonthH(data);
        table.tbSubMonth.clear().rows.add(statsData).draw();
    } else {
        $('#tbSubMonth_wrapper').hide();
        $('#tbSub_wrapper').show();

        const statsData = calculateStats(data);
        table.tbSub.clear().rows.add(statsData).draw();
    }
}

function updateMonthHeaders() {
    const months = getMonthHeaders();

    document.getElementById('month0Header').textContent = months[0] ?? '기준월';
    document.getElementById('month1Header').textContent = months[1] ?? '기준+1월';
    document.getElementById('month2Header').textContent = months[2] ?? '기준+2월';
}

document.querySelectorAll('#nav-tab button').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(e) {
        const type = e.target.dataset.type;

        // 해당 탭에 데이터가 있으면 통계 업데이트
        if (tabData[type] && tabData[type].length > 0) {
            updateStatsTable(type, tabData[type]);
        } else {
            // 데이터 없으면 통계 테이블 비우기
            table.tbSub?.clear().draw();
            table.tbSubMonth?.clear().draw();
        }

        const chkDate = document.getElementById('chkDate');

        if (type.includes('month')) {
            if(!chkDate.checked){
                console.log("들어옴")
                chkDate.checked = true;
            }
            chkDate.disabled = true;
        } else {
            chkDate.disabled = false;
        }
    });
});

function getTab() {
    let tab = document.querySelector('.nav-link.active');
    return tab;
}

function setTable(dataSet, type) {
    let tableID = `#${type}Tb`;
    let select = cols[type];
    let multiHeader = multiHeaders[type];  // 멀티헤더 정보 가져오기

    // 멀티헤더인 경우 동적으로 월 생성
    if (multiHeader && type === 'monthH') {
        const months = getMonthHeaders();

        // multiHeader를 복사해서 동적으로 수정
        multiHeader = {
            row1: [
                {title: "순번", rowspan: 2},
                {title: "구분", rowspan: 2},
                {title: "거래처", rowspan: 2},
                {title: "품번", rowspan: 2},
                {title: "품명", rowspan: 2},
                {title: "단위", rowspan: 2},
                {title: "합계", colspan: 2},
                {title: months[0], colspan: 2},  // 동적 월
                {title: months[1], colspan: 2},  // 동적 월
                {title: months[2], colspan: 2}   // 동적 월
            ],
            row2: [
                {title: "건수"},
                {title: "수량"},
                {title: "건수"},
                {title: "수량"},
                {title: "건수"},
                {title: "수량"},
                {title: "건수"},
                {title: "수량"}
            ]
        };
    }

    // 멀티헤더가 있는 경우
    if (multiHeader) {
        createMultiHeaderTable(tableID, select, dataSet, type, multiHeader);
    } else {
        createNormalTable(tableID, select, dataSet, type);
    }
}

function getMonthHeaders() {
    const sDate = document.getElementById('sDate').value;
    const baseDate = new Date(sDate);

    function formatYearMonth(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}.${month}`;
    }

    const months = [];
    for (let i = 0; i < 3; i++) {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() + i);
        months.push(formatYearMonth(date));
    }

    return months;
}

function createMultiHeaderTable(tableID, select, dataSet, type, multiHeader) {
    // 첫 번째 행
    let headerRow1 = '<tr>';
    multiHeader.row1.forEach(h => {
        let attrs = '';
        if (h.rowspan) attrs += ` rowspan="${h.rowspan}"`;
        if (h.colspan) attrs += ` colspan="${h.colspan}"`;
        headerRow1 += `<th${attrs}>${h.title}</th>`;
    });
    headerRow1 += '</tr>';

    // 두 번째 행
    let headerRow2 = '<tr>';
    multiHeader.row2.forEach(h => {
        headerRow2 += `<th>${h.title}</th>`;
    });
    headerRow2 += '</tr>';

    // 기존 테이블이 있으면 destroy
    if (DataTable.isDataTable(tableID)) {
        table[type].destroy();  // ← 추가
    }

    // 테이블 HTML 재구성
    $(tableID).html(`
        <thead>${headerRow1}${headerRow2}</thead>
        <tbody></tbody>
    `);

    // columns 생성
    let col = Object.entries(select).map(([key, meta]) => {
        const classList = meta.className?.split(" ") || [];
        const hasComma = classList.includes("comma");
        const hasDots = classList.some(c => ["double", "float", "decimal"].includes(c));

        let columnDef = {
            data: key,
            title : meta.title,
            className: meta.className || "left",
            width: meta.width || null,
            orderable: meta.orderable ?? false,
        };

        if (hasComma) {
            const decimal = meta.decimal ?? 0;
            columnDef.render = $.fn.dataTable.render.number(",", ".", decimal);
        }else if (hasDots) {
            columnDef.render = function(data, type, row) {
                if (type === 'display' && data != null) {
                    return parseFloat(data).toFixed(2);
                }
                return data;
            };
        }

        return columnDef;
    });

    // 데이터 필터링
    let datalst = dataSet
        .filter(a => a.gbn != 1)
        .map(a => {
            let filtered = Object.fromEntries(
                Object.keys(select).map(key => [key, a[key] ?? null])
            );
            filtered.cls = a.cls ?? null;
            return filtered;
        });

    // DataTable 생성
    table[type] = new DataTable(tableID, {
        searching: false,
        autoWidth: false,
        columns: col,
        data: datalst,
        buttons: [
            {
                extend: 'excel',
                title: excelTitle[type],
                filename: excelTitle[type],
            }
        ],
        rowCallback: function (row, data, index) {
            if(type == "period"){
                if (data.gbn == 2) {
                    $('td:eq(1)', row).html("출고");
                } else if (data.gbn == 3) {
                    row.style.backgroundColor = "#419bf6";
                    $('td:eq(1)', row).html("");
                    $('td:eq(2)', row).html("");
                } else if(data.gbn == 4){
                    row.style.backgroundColor = "#b8d6f6";
                    $('td:eq(1)', row).html("");
                    $('td:eq(2)', row).html("");
                }
            }
            else if(type == "daily"){
                if (data.gbn == 2) {
                    $('td:eq(2)', row).html("출고");
                }
            }else if(type == "monthV"){
                if (data.gbn == 2) {
                    $('td:eq(2)', row).html("출고");
                }
                else if (data.gbn == 3) {
                    row.style.backgroundColor = "#419bf6";
                    $('td:eq(1)', row).html("");
                    $('td:eq(2)', row).html("");
                }
            }else if(type == "monthH"){
                if(data.gbn == 2){
                    $('td:eq(1)', row).html("출고");
                }else if(data.gbn == 3){
                    $('td:eq(1)', row).html("");
                    row.style.backgroundColor = "#b8d6f6";
                }
            }

        }
    });
}

function createNormalTable(tableID, select, dataSet, type) {
    // 기존 코드 그대로...
    let col = Object.entries(select).map(([key, meta]) => {
        const classList = meta.className?.split(" ") || [];
        const hasComma = classList.includes("comma");
        const hasDots = classList.some(c => ["double", "float", "decimal"].includes(c));

        let columnDef = {
            data: key,
            title: meta.title,
            className: meta.className || "left",
            width: meta.width || null,
            orderable: meta.orderable ?? false,
        };

        if (hasComma) {
            const decimal = meta.decimal ?? 0;
            columnDef.render = $.fn.dataTable.render.number(",", ".", decimal);
        }else if (hasDots) {
            columnDef.render = function(data, type, row) {
                if (type === 'display' && data != null) {
                    return parseFloat(data).toFixed(2);
                }
                return data;
            };
        }

        return columnDef;
    });

    let datalst = dataSet
        .filter(a => a.gbn != 1)
        .map(a => {
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
                    title: excelTitle[type],
                    filename: excelTitle[type],
                }
            ],
            rowCallback: function (row, data, index) {
                if(type == "period"){
                    if(data.gbn == 2){
                        $('td:eq(1)', row).html("출고");
                    } else if (data.gbn == 3) {
                        row.style.backgroundColor = "#419bf6";
                        $('td:eq(1)', row).html("");
                        $('td:eq(2)', row).html("");
                    } else if(data.gbn == 4){
                        row.style.backgroundColor = "#b8d6f6";
                        $('td:eq(1)', row).html("");
                        $('td:eq(2)', row).html("");
                    }
                }
                else if(type == "daily"){
                    if (data.gbn == 2) {
                        $('td:eq(2)', row).html("출고");
                    }
                    else if (data.gbn == 3) {
                        row.style.backgroundColor = "#419bf6";
                        $('td:eq(1)', row).html("");
                        $('td:eq(2)', row).html("");
                    }
                }
                else if(type == "monthV"){
                    if (data.gbn == 2) {
                        $('td:eq(2)', row).html("출고");
                    }
                    else if (data.gbn == 3) {
                        row.style.backgroundColor = "#419bf6";
                        $('td:eq(1)', row).html("");
                        $('td:eq(2)', row).html("");
                    }
                }else if(type == "monthH"){
                    if(data.gbn == 2){
                        $('td:eq(1)', row).html("출고");
                    }else if(data.gbn == 3){
                        $('td:eq(1)', row).html("");
                        row.style.backgroundColor = "#b8d6f6";
                    }
                }

            }
        });
    }
}

document.getElementById('btnSearch').addEventListener('click', search);
document.getElementById('btnExcel').addEventListener("click", function () {
    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});

function returnRbnInt(){
    const chkOrderNo = document.getElementById('chkOrderNo');
    const rbnOrderID = document.getElementById('rbnOrderID');
    const rbnOrderNo = document.getElementById('rbnOrderNo');

    if(chkOrderNo.checked){
        if(rbnOrderID.checked){
            return 1
        }
        else if(rbnOrderNo.checked){
            return 2
        }
    }

    return 0
}

async function search() {

    let type = getTab().dataset.type;

    let param = {
        ChkDate: getChecked('chkDate') ? 1 : 0,
        SDate: document.getElementById('sDate').value.replaceAll('-',''),
        EDate: document.getElementById('eDate').value.replaceAll('-',''),

        ChkCustomID: getChecked('chkCustom') ? 1 : 0,
        CustomID: document.getElementById('txtCustom').value,

        ChkArticleID: getChecked('chkArticle') ? 1 : 0,
        ArticleID: document.getElementById('txtArticle').value,

        ChkBuyerArticleNo: 0,
        BuyerArticleNo : '',

        ChkOrderID : returnRbnInt(),
        OrderID : document.getElementById('txtOrderNo').value,
    }



    loading.visible();

    try {
        const response = await fetch(`/order/result/inout/${type}`, {
            method: "POST",
            body: JSON.stringify(param),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await response.json();

        if (!data?.length) {
            toastr.warning('조회된 데이터가 없습니다');

            if (table[type]) {
                table[type].clear().draw();
            }
            table.tbSub?.clear().draw();
            table.tbSubMonth?.clear().draw();

            return;
        }

        setNo(data);
        setTable(data, type);

        // 통계 업데이트
        if (type === 'monthH') {
            updateMonthHeaders();
            $('#tbSub_wrapper').hide();
            $('#tbSubMonth_wrapper').show();

            const statsData = calculateStatsMonthH(data);
            table.tbSubMonth.clear().rows.add(statsData).draw();
        } else {
            $('#tbSubMonth_wrapper').hide();
            $('#tbSub_wrapper').show();

            const statsData = calculateStats(data);
            table.tbSub.clear().rows.add(statsData).draw();
        }

    } catch (error) {
        console.error("Fetch error:", error);

        // 에러 시에도 통계 테이블 비우기
        table.tbSub?.clear().draw();
        table.tbSubMonth?.clear().draw();

    } finally {
        loading.invisible();
    }
}

function calculateStats(dataSet) {
    const outData = dataSet.filter(d => d.gbn == 2);
    const totalRoll = outData.reduce((sum, d) => sum + (d.roll || 0), 0);
    const totalQty = outData.reduce((sum, d) => sum + (d.totQty || 0), 0);

    const result = [{
        roll: totalRoll,
        totQty: totalQty
    }];
    return result;
}

function calculateStatsMonthH(dataSet) {
    const outData = dataSet.filter(d => d.gbn == 2);

    const result = [{
        totalRoll: outData.reduce((sum, d) => sum + (d.totalRoll || 0), 0),
        totalQty: outData.reduce((sum, d) => sum + (d.totalQty || 0), 0),
        baseMonthRoll: outData.reduce((sum, d) => sum + (d.baseMonthRoll || 0), 0),
        baseMonthQty: outData.reduce((sum, d) => sum + (d.baseMonthQty || 0), 0),
        add1MonthRoll: outData.reduce((sum, d) => sum + (d.add1MonthRoll || 0), 0),
        add1MonthQty: outData.reduce((sum, d) => sum + (d.add1MonthQty || 0), 0),
        add2MonthRoll: outData.reduce((sum, d) => sum + (d.add2MonthRoll || 0), 0),
        add2MonthQty: outData.reduce((sum, d) => sum + (d.add2MonthQty || 0), 0)
    }];
    return result;
}



function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());
}