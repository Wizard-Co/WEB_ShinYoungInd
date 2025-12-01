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

Tabulator.extendModule("format", "formatters", {
    number: function(cell, formatterParams) {
        let value = cell.getValue();
        if (value === null || value === undefined || value === "") return "";
        return Number(value).toLocaleString('ko-KR');
    }
});



window.addEventListener('DOMContentLoaded', function () {
    table.tbSub = new Tabulator('#tbSub', {
        locale: "ko-kr",
        layout: "fitColumns",
        height: "auto",
        validationMode: "highlight",
        selectableRows: 0,
        renderVertical: "basic",
        columnDefaults: {
            headerSort: false
        },
        columns: [
            {
                title: "출고건수",
                field: 'roll',
                hozAlign: 'center',
                formatter: "number",
                formatterParams: {
                    thousand: ",",
                    precision: 0
                }
            },
            {
                title: "출고수량",
                field: 'totQty',
                hozAlign: 'center',
                formatter: "number",
                formatterParams: {
                    thousand: ",",
                    precision: 0
                }
            }
        ],
        data: []
    });

    // 월별 통계 테이블 - 초기에는 기본값으로 생성
    table.tbSubMonth = new Tabulator('#tbSubMonth', {
        locale: "ko-kr",
        layout: "fitColumns",
        height: "auto",
        validationMode: "highlight",
        selectableRows: 0,
        renderVertical: "basic",
        columnDefaults: {
            headerSort: false
        },
        columns: getMonthColumns(),
        data: [],
    });

    requestAnimationFrame(() => {
        $('#tbSubMonth').hide();
    });

    const navTabHeight = $('#nav-tab').outerHeight();
    $('.stats-container').css('height', navTabHeight + 'px');

    init();
});

// 월별 컬럼 생성 함수
function getMonthColumns(months = ['기준월', '기준+1월', '기준+2월']) {
    return [
        {
            title: "합계",
            columns: [
                {
                    title: "건수",
                    field: 'totalRoll',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                },
                {
                    title: "수량",
                    field: 'totalQty',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                }
            ]
        },
        {
            title: months[0],
            columns: [
                {
                    title: "건수",
                    field: 'baseMonthRoll',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                },
                {
                    title: "수량",
                    field: 'baseMonthQty',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                }
            ]
        },
        {
            title: months[1],
            columns: [
                {
                    title: "건수",
                    field: 'add1MonthRoll',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                },
                {
                    title: "수량",
                    field: 'add1MonthQty',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                }
            ]
        },
        {
            title: months[2],
            columns: [
                {
                    title: "건수",
                    field: 'add2MonthRoll',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                },
                {
                    title: "수량",
                    field: 'add2MonthQty',
                    hozAlign: 'center',
                    formatter: "number",
                    formatterParams: {thousand: ",", precision: 0}
                }
            ]
        }
    ];
}

// updateMonthHeaders 함수 수정
function updateMonthHeaders() {
    const months = getMonthHeaders();
    const columns = getMonthColumns(months);
    table.tbSubMonth.setColumns(columns);
}

function updateStatsTable(type, data) {
    if (type === 'monthH') {
        $('#tbSub').hide();
        $('#tbSubMonth').show();

        const statsData = calculateStatsMonthH(data);
        table.tbSubMonth.setData(statsData);
    } else {
        $('#tbSubMonth').hide();
        $('#tbSub').show();

        const statsData = calculateStats(data);
        table.tbSub.setData(statsData);  // ← 수정
    }
}



document.querySelectorAll('#nav-tab button').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(e) {
        const type = e.target.dataset.type;

        if (tabData[type] && tabData[type].length > 0) {
            updateStatsTable(type, tabData[type]);
        } else {
            // 데이터 없으면 통계 테이블 비우기
            table.tbSub?.clearData();      // ← 수정
            table.tbSubMonth?.clearData(); // ← 수정
        }

        const chkDate = document.getElementById('chkDate');

        if (type.includes('month')) {
            if(!chkDate.checked){
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
    let multiHeader = multiHeaders[type];

    // 멀티헤더인 경우 동적으로 월 생성
    if (multiHeader && type === 'monthH') {
        const months = getMonthHeaders();

        multiHeader = {
            row1: [
                {title: "순번", rowspan: 2},
                {title: "구분", rowspan: 2},
                {title: "거래처", rowspan: 2},
                {title: "품번", rowspan: 2},
                {title: "품명", rowspan: 2},
                {title: "단위", rowspan: 2},
                {title: "합계", colspan: 2},
                {title: months[0], colspan: 2},
                {title: months[1], colspan: 2},
                {title: months[2], colspan: 2}
            ],
            row2: [
                {title: "건수"}, {title: "수량"},
                {title: "건수"}, {title: "수량"},
                {title: "건수"}, {title: "수량"},
                {title: "건수"}, {title: "수량"}
            ]
        };
    }

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
    // Tabulator 컬럼 정의 생성
    let columns = [];

    // 먼저 rowspan=2인 컬럼들 (단일 컬럼)
    let row2Index = 0;

    multiHeader.row1.forEach(header => {
        const fieldKeys = Object.keys(select);

        if (header.rowspan === 2) {
            // 단일 컬럼
            const fieldKey = fieldKeys[columns.length];
            const meta = select[fieldKey];
            const classList = meta?.className?.split(" ") || [];

            let hozAlign = "left";
            if (classList.includes("center")) hozAlign = "center";
            if (classList.includes("right")) hozAlign = "right";

            columns.push({
                title: header.title,
                field: fieldKey,
                hozAlign: hozAlign,
                columnHeaderVertAlign: "middle",
                width: meta?.width,
                formatter: classList.includes("comma") ? "number" : undefined,
                formatterParams: classList.includes("comma") ? {
                    thousand: ",",
                    precision: meta?.decimal ?? 0
                } : undefined
            });
        } else if (header.colspan) {
            // 컬럼 그룹
            let subColumns = [];

            for (let i = 0; i < header.colspan; i++) {
                const subHeader = multiHeader.row2[row2Index++];
                // 6은 rowspan=2인 기본 컬럼 개수
                const fieldIndex = 6 + (columns.length - 6) + i;
                const fieldKey = fieldKeys[fieldIndex];
                const meta = select[fieldKey];
                const classList = meta?.className?.split(" ") || [];

                let hozAlign = "left";
                if (classList.includes("center")) hozAlign = "center";
                if (classList.includes("right")) hozAlign = "right";

                subColumns.push({
                    title: subHeader.title,
                    field: fieldKey,
                    hozAlign: hozAlign,
                    formatter: classList.includes("comma") ? "number" : undefined,
                    formatterParams: classList.includes("comma") ? {
                        thousand: ",",
                        precision: meta?.decimal ?? 0
                    } : undefined
                });
            }

            columns.push({
                title: header.title,
                columns: subColumns
            });
        }
    });

    // 데이터 필터링
    let datalst = dataSet
        .filter(a => a.gbn != 1)
        .map(a => {
            let filtered = Object.fromEntries(
                Object.keys(select).map(key => [key, a[key] ?? null])
            );
            filtered.cls = a.cls ?? null;
            filtered.gbn = a.gbn ?? null;
            return filtered;
        });

    // 기존 테이블이 있으면 데이터만 업데이트
    if (table[type]) {
        table[type].setColumns(columns);
        table[type].setData(datalst);
    } else {
        // 처음 생성
        table[type] = new Tabulator(tableID, {
            locale: "ko-kr",
            langs: {
                "ko-kr": {
                    "pagination": {
                        "first": "처음",
                        "first_title": "첫 페이지로 이동",
                        "prev": "이전",
                        "prev_title": "이전 페이지로 이동",
                        "next": "다음",
                        "next_title": "다음 페이지로 이동",
                        "last": "마지막",
                        "last_title": "마지막 페이지로 이동",
                        "page_size": "페이지 크기",
                        "rows": "%start-%end / %total 건"
                    }
                }
            },
            layout: "fitColumns",
            height: "100%",
            validationMode: "highlight",
            selectableRows: 1,
            pagination: "local",
            paginationSize: 20,
            paginationSizeSelector: [5, 10, 20, 50, 100],
            renderVertical: "basic",
            columnDefaults: {
                headerSort: false
            },
            data: datalst,
            columns: columns,
            rowFormatter: function(row) {
                let data = row.getData();

                if (type == "monthH") {
                    if (data.gbn == 2) {
                        row.getCell("gbn").getElement().textContent = "출고";
                    } else if (data.gbn == 3) {
                        row.getCell("gbn").getElement().textContent = "";
                        row.getElement().style.backgroundColor = "#D8D8D8";
                    }
                }
            }
        });
    }
}

function createNormalTable(tableID, select, dataSet, type) {
    // Tabulator 컬럼 정의 생성
    let columns = Object.entries(select).map(([key, meta]) => {
        const classList = meta.className?.split(" ") || [];
        const hasComma = classList.includes("comma");
        const hasDots = classList.some(c => ["double", "float", "decimal"].includes(c));

        // hozAlign 결정
        let hozAlign = "left";
        if (classList.includes("center")) hozAlign = "center";
        if (classList.includes("right")) hozAlign = "right";

        let columnDef = {
            title: meta.title,
            field: key,
            hozAlign: hozAlign,
            width: meta.width || undefined,
            headerSort: meta.orderable ?? false,
        };

        // formatter 설정
        if (hasComma) {
            columnDef.formatter = "number";
            columnDef.formatterParams = {
                thousand: ",",
                precision: meta.decimal ?? 0
            };
        } else if (hasDots) {
            columnDef.formatter = function(cell) {
                let value = cell.getValue();
                if (value != null) {
                    return parseFloat(value).toFixed(2);
                }
                return value;
            };
        }

        return columnDef;
    });

    // 데이터 필터링
    let datalst = dataSet
        .filter(a => a.gbn != 1 || a.gbn != 4)
        .map(a => {
            let filtered = Object.fromEntries(
                Object.keys(select).map(key => [key, a[key] ?? null])
            );
            filtered.cls = a.cls ?? null;
            filtered.gbn = a.gbn ?? null;
            return filtered;
        });

    // 기존 테이블이 있으면 데이터만 업데이트
    if (table[type]) {
        table[type].setData(datalst);
    } else {
        // 처음 생성
        table[type] = new Tabulator(tableID, {
            locale: "ko-kr",
            langs: {
                "ko-kr": {
                    "pagination": {
                        "first": "처음",
                        "first_title": "첫 페이지로 이동",
                        "prev": "이전",
                        "prev_title": "이전 페이지로 이동",
                        "next": "다음",
                        "next_title": "다음 페이지로 이동",
                        "last": "마지막",
                        "last_title": "마지막 페이지로 이동",
                        "page_size": "페이지 크기",
                        "rows": "%start-%end / %total 건"
                    }
                }
            },
            layout: "fitColumns",
            height: "100%",
            validationMode: "highlight",
            selectableRows: 1,
            pagination: "local",
            paginationSize: 20,
            paginationSizeSelector: [5, 10, 20, 50, 100],
            renderVertical: "basic",
            columnDefaults: {
                headerSort: false
            },
            data: datalst,
            columns: columns,
            rowFormatter: function(row) {
                let data = row.getData();

                if (type == "period") {
                    if (data.gbn == 2) {
                        row.getCell("gbn").getElement().textContent = "출고";
                    } else if (data.gbn == 3) {
                        row.getElement().style.backgroundColor = "#D8D8D8";
                        row.getCell("gbn").getElement().textContent = "";
                        row.getCell("kcustom").getElement().textContent = "";
                    } else if (data.gbn == 4) {
                        row.getElement().style.backgroundColor = "#D8D8D8";
                        row.getCell("gbn").getElement().textContent = "";
                        row.getCell("kcustom").getElement().textContent = "";
                    }
                } else if (type == "daily") {
                    if (data.gbn == 2) {
                        row.getCell("gbn").getElement().textContent = "출고";
                    } else if (data.gbn == 3) {
                        row.getElement().style.backgroundColor = "#D8D8D8";
                        row.getCell("iodate").getElement().textContent = "";
                        row.getCell("gbn").getElement().textContent = "";
                    }
                } else if (type == "monthV") {
                    if (data.gbn == 2) {
                        row.getCell("gbn").getElement().textContent = "출고";
                    } else if (data.gbn == 3) {
                        row.getElement().style.backgroundColor = "#D8D8D8";
                        row.getCell("iodate").getElement().textContent = "";
                        row.getCell("kcustom").getElement().textContent = "";
                        row.getCell("gbn").getElement().textContent = "";
                    }
                }
            }
        });
    }
}

document.getElementById('btnSearch').addEventListener('click', search);
document.getElementById('btnExcel').addEventListener("click", function () {
    const activeTab = getTab();
    const type = activeTab.dataset.type;

    if (table[type]) {
        table[type].download("xlsx", `${excelTitle[type]}.xlsx`, {
            sheetName: excelTitle[type]
        });
    }
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
                table[type].clearData();
            }
            table.tbSub?.clearData();
            table.tbSubMonth?.clearData();

            return;
        }

        setNo(data);
        setTable(data, type);

        // 통계 업데이트
        if (type === 'monthH') {
            updateMonthHeaders();
            $('#tbSub').hide();
            $('#tbSubMonth').show();

            console.log('tbSubMonth 존재:', table.tbSubMonth);
            console.log('tbSubMonth element:', $('#tbSubMonth'));

            const statsData = calculateStatsMonthH(data);
            table.tbSubMonth.setData(statsData);
        } else {
            $('#tbSubMonth').hide();
            $('#tbSub').show();

            const statsData = calculateStats(data);
            console.log('statsData:', statsData);

            table.tbSub.setData(statsData);
        }

    } catch (error) {
        console.error("Fetch error:", error);

        // 에러 시에도 통계 테이블 비우기
        table.tbSub?.clearData();
        table.tbSubMonth?.clearData();

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

document.querySelectorAll('input[name="ordType"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const labelElement = document.querySelector('label[for="chkOrderNo"]');
        const inputElement = document.getElementById('txtOrderNo');

        if (document.getElementById('rbnOrderNo').checked) {
            // OrderNo 선택 시
            labelElement.textContent = '오더번호';
            inputElement.placeholder = '오더번호 찾기';
        } else if (document.getElementById('rbnOrderID').checked) {
            // 관리번호 선택 시
            labelElement.textContent = '관리번호';
            inputElement.placeholder = '관리번호 찾기';
        }
    });
});

function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    const labelElement = document.querySelector('label[for="chkOrderNo"]');
    const inputElement = document.getElementById('txtOrderNo');

    labelElement.textContent = '관리번호';
    inputElement.placeholder = '관리번호 찾기';
}