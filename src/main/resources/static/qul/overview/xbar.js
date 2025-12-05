window.addEventListener('DOMContentLoaded', function () {
    init();
});

let mainTable = new Tabulator("#main-table", {
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
    columns: [

        {title: "순번", field: "num", hozAlign: "center", headerSort: true,
            formatter: function(cell, formatterParams, onRendered) {
                // 페이지 정보 가져오기
                let page = cell.getTable().getPage();
                let pageSize = cell.getTable().getPageSize();
                let rowIndex = cell.getRow().getPosition();

                // 전체 순번 계산 (페이지 시작 번호 + 현재 행 위치)
                return ((page - 1) * pageSize) + rowIndex;
            }},
        {title: "품번", field: "buyerArticleNo", hozAlign: "center"},
        {title: "품명", field: "article", hozAlign: "center", },
        {title: "EcoNo", field: "ecoNo", hozAlign: "center"},
        {title: "검사항목", field: "insItemName", hozAlign: "center"},

    ],
});

let subTable = new Tabulator("#sub-table", {
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
    paginationSize: 10,
    paginationSizeSelector: [5, 10, 20, 50, 100],
    renderVertical: "basic",
    columnDefaults: {
        headerSort: false
    },
    columns: [

        {title: "측정값", field: "seq", hozAlign: "center", minWidth : 100},
        {title: "1일", field: "inspectValue1", hozAlign: "center"},
        {title: "2일", field: "inspectValue2", hozAlign: "center"},
        {title: "3일", field: "inspectValue3", hozAlign: "center"},
        {title: "4일", field: "inspectValue4", hozAlign: "center"},
        {title: "5일", field: "inspectValue5", hozAlign: "center"},
        {title: "6일", field: "inspectValue6", hozAlign: "center"},
        {title: "7일", field: "inspectValue7", hozAlign: "center"},
        {title: "8일", field: "inspectValue8", hozAlign: "center"},
        {title: "9일", field: "inspectValue9", hozAlign: "center"},
        {title: "10일", field: "inspectValue10", hozAlign: "center"},
        {title: "11일", field: "inspectValue11", hozAlign: "center"},
        {title: "12일", field: "inspectValue12", hozAlign: "center"},
        {title: "13일", field: "inspectValue13", hozAlign: "center"},
        {title: "14일", field: "inspectValue14", hozAlign: "center"},
        {title: "15일", field: "inspectValue15", hozAlign: "center"},
        {title: "16일", field: "inspectValue16", hozAlign: "center"},
        {title: "17일", field: "inspectValue17", hozAlign: "center"},
        {title: "18일", field: "inspectValue18", hozAlign: "center"},
        {title: "19일", field: "inspectValue19", hozAlign: "center"},
        {title: "20일", field: "inspectValue20", hozAlign: "center"},
        {title: "21일", field: "inspectValue21", hozAlign: "center"},
        {title: "22일", field: "inspectValue22", hozAlign: "center"},
        {title: "23일", field: "inspectValue23", hozAlign: "center"},
        {title: "24일", field: "inspectValue24", hozAlign: "center"},
        {title: "25일", field: "inspectValue25", hozAlign: "center"},
        {title: "26일", field: "inspectValue26", hozAlign: "center"},
        {title: "27일", field: "inspectValue27", hozAlign: "center"},
        {title: "28일", field: "inspectValue28", hozAlign: "center"},
        {title: "29일", field: "inspectValue29", hozAlign: "center"},
        {title: "30일", field: "inspectValue30", hozAlign: "center"},
        {title: "31일", field: "inspectValue31", hozAlign: "center"},
    ],
    rowFormatter: function(row){
        // let data = row.getData();
        let seqCell = row.getCell("seq");
        seqCell.getElement().textContent = "측정"+seqCell.getValue();
    },
});

mainTable.on("rowSelectionChanged", async function(data, rows){
    if(rows.length > 0) {
        let selectedRow = rows[0];
        let rowData = selectedRow.getData();

        //alert(`선택하신 데이터의 SubSeq" : ${rowData.subSeq}, 검사기준번호 : ${rowData.inspectBasisID}`);
        // console.log(rowData.subSeq);

        if(!rowData.inspectBasisID || !rowData.subSeq){
            toastr.warning('해당 검사건은 데이터가 부족합니다.', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        try{
            let param ={
                FromDate :toDateString(document.getElementById('sDate').value,'yyyyMM')+ "01",
                ToDate :toDateString(document.getElementById('eDate').value,'yyyyMM')+ "31",
                InspectPoint: rowData.inspectPoint,
                sMonth : toDateString(document.getElementById('sDate').value,'yyyyMM'),
                InspectBasisID:  rowData.inspectBasisID,
                InsepctSubSeq: rowData.subSeq,
                SubSeq : rowData.subSeq,

                CustomID: "",
            }

            loading.visible();

            const response = await fetch("/qul/result/xbar/search/detail", {
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
            if(data.inputUiData.length > 0 && data.subTableData.length > 0){
                fillDataInputs(data);
                subTable.setData(data.subTableData);
            }

        }catch (error){
            console.error("Fetch error:", error);
        }finally {

        }

    }
});

function fillDataInputs(dataArray) {
    try {
        if (!dataArray.inputUiData || dataArray.inputUiData.length === 0) {
            console.log('입력 데이터가 없습니다.');
            return;
        }

        if (window.xBarChart) {
            window.xBarChart.destroy();
        }
        if (window.rChart) {
            window.rChart.destroy();
        }

        // 초기화
        let xBar_UCL = 0, xBar_CL = 0, xBar_LCL = 0;
        let R_UCL = 0, R_CL = 0;
        let RaMin = 0, RaMax = 0;
        let Avg = 0, StanDev = 0;

        // 배열을 순회하면서 cls에 따라 값 채우기
        dataArray.inputUiData.forEach(item => {
            switch(item.cls) {
                case "04":
                    xBar_UCL = item.inspectValue1;
                    break;
                case "05":
                    xBar_CL = item.inspectValue1;
                    break;
                case "06":
                    xBar_LCL = item.inspectValue1;
                    break;
                case "07":
                    R_UCL = item.inspectValue1;
                    break;
                case "08":
                    R_CL = item.inspectValue1;
                    break;
                case "09":
                    RaMax = item.inspectValue1;
                    break;
                case "10":
                    RaMin = item.inspectValue1;
                    break;
                case "12":
                    Avg = item.inspectValue1;
                    break;
                case "13":
                    StanDev = item.inspectValue1;
                    break;
            }
        });

        // console.log('=== 추출된 값 ===');
        // console.log('Avg (평균):', Avg);
        // console.log('StanDev (표준편차):', StanDev);
        // console.log('RaMax (관리상한):', RaMax);
        // console.log('RaMin (관리하한):', RaMin);

        // input에 값 채우기
        document.getElementById('txtXbarUCL').value = Number(xBar_UCL).toFixed(3);
        document.getElementById('txtXbarCL').value = Number(xBar_CL).toFixed(3);
        document.getElementById('txtXbarLCL').value = Number(xBar_LCL).toFixed(3);
        document.getElementById('txtRUCL').value = Number(R_UCL).toFixed(3);
        document.getElementById('txtRCL').value = Number(R_CL).toFixed(3);
        document.getElementById('txtMaxValue').value = Number(RaMax).toFixed(3);
        document.getElementById('txtMinValue').value = Number(RaMin).toFixed(3);
        document.getElementById('txtAverage').value = Number(Avg).toFixed(3);
        document.getElementById('txtStandardDeviation').value = Number(StanDev).toFixed(3);

        // CPK 계산
        // if (!Avg || !StanDev || StanDev === 0) {
        //     console.log('평균 또는 표준편차가 유효하지 않습니다.');
        //     return;
        // }
        //
        // if (!dataArray.raMinAndMaxData || dataArray.raMinAndMaxData.length === 0) {
        //     console.log('raMinAndMaxData가 없습니다.');
        //     return;
        // }
        if(!StanDev){
            document.getElementById('txtCPU').value = 0;
            document.getElementById('txtCPL').value = 0;
            document.getElementById('txtCP').value = 0;
            document.getElementById('txtCPK').value =0;

            toastr.warning('해당 검사건은 샘플 데이터가 부족합니다.', '', {positionClass: 'toast-bottom-center'});
        }
        else{
            const dAvr = Avg;
            const dUSL = dataArray.raMinAndMaxData[0].insRASpecMax;
            const dLSL = dataArray.raMinAndMaxData[0].insRASpecMin;
            const dSTDev = StanDev;

            // console.log('\n=== CPK 계산 입력값 ===');
            // console.log('dAvr (평균):', dAvr);
            // console.log('dUSL (규격상한):', dUSL);
            // console.log('dLSL (규격하한):', dLSL);
            // console.log('dSTDev (표준편차):', dSTDev);

            const CPU = (dUSL - dAvr) / (3 * dSTDev); //품질 CPK계산이라는데 3면 널널하게 6이면 빡세게 보는거라 함
            const CPL = (dAvr - dLSL) / (3 * dSTDev);
            const CP = (dUSL - dLSL) / (6 * dSTDev);
            const CPK = Math.min(CPU, CPL);

            // console.log('\n=== CPK 계산 결과 ===');
            // console.log('CPU 계산:', `(${dUSL} - ${dAvr}) / (3 × ${dSTDev}) = ${(dUSL - dAvr)} / ${(3 * dSTDev)} = ${CPU}`);
            // console.log('CPL 계산:', `(${dAvr} - ${dLSL}) / (3 × ${dSTDev}) = ${(dAvr - dLSL)} / ${(3 * dSTDev)} = ${CPL}`);
            // console.log('CP 계산:', `(${dUSL} - ${dLSL}) / (6 × ${dSTDev}) = ${(dUSL - dLSL)} / ${(6 * dSTDev)} = ${CP}`);
            // console.log('CPK:', `min(${CPU}, ${CPL}) = ${CPK}`);
            //
            // console.log('\n=== 최종 출력값 (toFixed(3)) ===');
            // console.log('CPU:', CPU.toFixed(3));
            // console.log('CPL:', CPL.toFixed(3));
            // console.log('CP:', CP.toFixed(3));
            // console.log('CPK:', CPK.toFixed(3));

            document.getElementById('txtCPU').value = CPU.toFixed(3);
            document.getElementById('txtCPL').value = CPL.toFixed(3);
            document.getElementById('txtCP').value = CP.toFixed(3);
            document.getElementById('txtCPK').value = CPK.toFixed(3);

            drawCharts(dataArray);
        }



    } catch (error) {
        console.error('Xbar 상/하한 데이터 채우는 도중 실패', error);
    }
}

function drawCharts(dataArray) {
    // cls 02, 03 데이터 추출
    let xBarData = null;
    let rChartData = null;

    dataArray.inputUiData.forEach(item => {
        if (item.cls === "02") {
            xBarData = item;
        } else if (item.cls === "03") {
            rChartData = item;
        }
    });

    if (!xBarData || !rChartData) {
        console.log('차트 데이터가 없습니다.');
        return;
    }

    // UCL, CL, LCL 값 가져오기
    const X_chart_UCL = parseFloat(document.getElementById('txtXbarUCL').value);
    const X_chart_CL = parseFloat(document.getElementById('txtXbarCL').value);
    const X_chart_LCL = parseFloat(document.getElementById('txtXbarLCL').value);
    const R_chart_UCL = parseFloat(document.getElementById('txtRUCL').value);
    const R_chart_CL = parseFloat(document.getElementById('txtRCL').value);

    // X-Bar 차트 데이터 준비
    const xBarValues = [];
    const xLabels = [];
    const xUCL = [];
    const xCL = [];
    const xLCL = [];

    let seq = 0;
    for (let i = 1; i <= 31; i++) {
        const value = xBarData[`inspectValue${i}`];
        if (value != null && value > 0) {
            seq++;
            xBarValues.push(value);
            xUCL.push(X_chart_UCL);
            xCL.push(X_chart_CL);
            xLCL.push(X_chart_LCL);
            xLabels.push(`순${seq} - ${i}일`);
        }
    }

    // R 차트 데이터 준비
    const rChartValues = [];
    const rLabels = [];
    const rUCL = [];
    const rCL = [];

    seq = 0;
    for (let i = 1; i <= 31; i++) {
        const value = rChartData[`inspectValue${i}`];
        if (value != null && value > 0) {
            seq++;
            rChartValues.push(value);
            rUCL.push(R_chart_UCL);
            rCL.push(R_chart_CL);
            rLabels.push(`순${seq} - ${i}일`);
        }
    }

    // X-Bar 차트 그리기
    const xBarCtx = document.getElementById('graphXbar').getContext('2d');

    // 기존 차트가 있으면 파괴
    if (window.xBarChart) {
        window.xBarChart.destroy();
    }

    window.xBarChart = new Chart(xBarCtx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [
                {
                    label: 'UCL',
                    data: xUCL,
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'CL',
                    data: xCL,
                    borderColor: 'green',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'LCL',
                    data: xLCL,
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: '측정값',
                    data: xBarValues,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.4,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // R 차트 그리기
    const rChartCtx = document.getElementById('graphRchart').getContext('2d');

    if (window.rChart) {
        window.rChart.destroy();
    }

    window.rChart = new Chart(rChartCtx, {
        type: 'line',
        data: {
            labels: rLabels,
            datasets: [
                {
                    label: 'UCL',
                    data: rUCL,
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'CL',
                    data: rCL,
                    borderColor: 'green',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: '측정값',
                    data: rChartValues,
                    borderColor: 'blue',
                    backgroundColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.4,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

document.getElementById('btnSearch').addEventListener('click', search)
$('#btnExcel').on('click', function() {
    const wb = XLSX.utils.book_new();

    // ===== 첫 번째 시트: Summary + 메인 테이블 =====
    const sheet1Data = [];

    // 제목
    sheet1Data.push(['X-Bar R 관리도 보고서']);
    sheet1Data.push(['작성일자', new Date().toLocaleDateString('ko-KR')]);
    sheet1Data.push(['']);

    // Summary
    sheet1Data.push(['=== 통계 Summary ===']);
    sheet1Data.push(['CPK', $('#txtCPK').val()]);
    sheet1Data.push(['CPU', $('#txtCPU').val()]);
    sheet1Data.push(['CPL', $('#txtCPL').val()]);
    sheet1Data.push(['CP', $('#txtCP').val()]);
    sheet1Data.push(['최대값', $('#txtMaxValue').val()]);
    sheet1Data.push(['최소값', $('#txtMinValue').val()]);
    sheet1Data.push(['평균', $('#txtAverage').val()]);
    sheet1Data.push(['표준편차', $('#txtStandardDeviation').val()]);
    sheet1Data.push(['']);

    // X-BAR
    sheet1Data.push(['=== X-BAR ===']);
    sheet1Data.push(['UCL', $('#txtXbarUCL').val()]);
    sheet1Data.push(['CL', $('#txtXbarCL').val()]);
    sheet1Data.push(['LCL', $('#txtXbarLCL').val()]);
    sheet1Data.push(['']);

    // R Chart
    sheet1Data.push(['=== R Chart ===']);
    sheet1Data.push(['UCL', $('#txtRUCL').val()]);
    sheet1Data.push(['CL', $('#txtRCL').val()]);
    sheet1Data.push(['']);
    sheet1Data.push(['']);

    // 메인 테이블 데이터
    sheet1Data.push(['=== 측정 데이터 ===']);
    const columns = mainTable.getColumns();
    const headerRow = columns.map(col => col.getDefinition().title);
    sheet1Data.push(headerRow);

    mainTable.getData().forEach(row => {
        const rowData = columns.map(col => row[col.getDefinition().field] || '');
        sheet1Data.push(rowData);
    });

    const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
    XLSX.utils.book_append_sheet(wb, ws1, "X-Bar Report");


    // ===== 두 번째 시트: subTable 데이터 =====
    const sheet2Data = [];

    sheet2Data.push(['=== Sub Table 상세 데이터 ===']);
    sheet2Data.push(['']);

    // subTable 헤더
    const subColumns = subTable.getColumns();
    const subHeaderRow = subColumns.map(col => col.getDefinition().title);
    sheet2Data.push(subHeaderRow);

    // subTable 데이터
    subTable.getData().forEach(row => {
        const rowData = subColumns.map(col => row[col.getDefinition().field] || '');
        sheet2Data.push(rowData);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
    XLSX.utils.book_append_sheet(wb, ws2, "상세 데이터");


    // ===== 파일 저장 =====
    const today = new Date();
    const filename = `XBar-Rchart 조회.xlsx`;

    XLSX.writeFile(wb, filename);
});

async function search() {

        const occurStepValue = document.getElementById('cboOccurStep').value;

        const pointMap = {
            '3': '9',
            '4': '3',
            '6': '5'
        };

        const insPoint = pointMap[occurStepValue] || occurStepValue

        let param = {

            InspectPoint : insPoint,

            ChkDate: getChecked('chkDate') ? 1 : 0,
            FromDate: document.getElementById('sDate').value.replaceAll('-',''),
            TODate: document.getElementById('eDate').value.replaceAll('-',''),

            ChkCustomID : getChecked('chkCustomID') ?  1: 0,
            CustomID : document.getElementById('txtCustomID').dataset.id,

            ChkArticleID : getChecked('chkArticle') ? 1:0,
            ArticleID : document.getElementById('txtArticle').dataset.id,

            ChkBuyerArticleNo :0,
            BuyerArticleNo : ''


        }

        loading.visible();

    try {

        const response = await fetch("/qul/result/xbar/search", {
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
        if(data.length > 0){
            mainTable.setData(data);
        }
        else{
            mainTable.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
        }


    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }

}

function toDateString(value, format = "yyyy-MM-dd") {
    let date;

    // 값이 Date 타입인가?
    if (value instanceof Date) {
        date = value;
    }
    // 문자거나 숫자면 날짜로 변환하기
    else if (typeof value === "string" || typeof value === "number") {
        const str = String(value).replace(/\D/g, ""); // 숫자만 추출

        if (str.length === 14) { // yyyyMMddHHmmss 형태
            const yyyy = str.substring(0, 4);
            const MM = str.substring(4, 6);
            const dd = str.substring(6, 8);
            const HH = str.substring(8, 10);
            const mm = str.substring(10, 12);
            const ss = str.substring(12, 14);
            date = new Date(`${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`);
        } else if (str.length === 12) { // yyyyMMddHHmm 형태
            const yyyy = str.substring(0, 4);
            const MM = str.substring(4, 6);
            const dd = str.substring(6, 8);
            const HH = str.substring(8, 10);
            const mm = str.substring(10, 12);
            date = new Date(`${yyyy}-${MM}-${dd}T${HH}:${mm}:00`);
        } else if (str.length === 8) { // yyyyMMdd 형태
            const yyyy = str.substring(0, 4);
            const MM = str.substring(4, 6);
            const dd = str.substring(6, 8);
            date = new Date(`${yyyy}-${MM}-${dd}`);
        } else if (str.length === 6) { // yyyyMM 형태
            const yyyy = str.substring(0, 4);
            const MM = str.substring(4, 6);
            date = new Date(`${yyyy}-${MM}-01`);
        } else {
            // 일반 문자열 또는 숫자 > Date 생성 시도
            date = new Date(value);
        }
    } else {
        throw new Error("toDateString: 지원하지 않는 타입입니다.");
    }

    if (isNaN(date.getTime())) {
        throw new Error("toDateString: 올바른 날짜 형식이 아닙니다.");
    }

    // 날짜/시간 구성 요소 추출
    const yyyy = String(date.getFullYear());
    const yy = yyyy.substring(2);
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const M = String(date.getMonth() + 1);
    const dd = String(date.getDate()).padStart(2, "0");
    const d = String(date.getDate());
    const HH = String(date.getHours()).padStart(2, "0");
    const H = String(date.getHours());
    const mm = String(date.getMinutes()).padStart(2, "0");
    const m = String(date.getMinutes());
    const ss = String(date.getSeconds()).padStart(2, "0");
    const s = String(date.getSeconds());
    const SSS = String(date.getMilliseconds()).padStart(3, "0");

    // 긴 패턴부터 처리 (yyyy를 먼저 처리해야 yy가 잘못 매칭되지 않음)
    return format
        .replace(/yyyy/g, yyyy)
        .replace(/yy/g, yy)
        .replace(/MM/g, MM)
        .replace(/M/g, M)
        .replace(/dd/g, dd)
        .replace(/d/g, d)
        .replace(/HH/g, HH)
        .replace(/H/g, H)
        .replace(/mm/g, mm)
        .replace(/m/g, m)
        .replace(/ss/g, ss)
        .replace(/s/g, s)
        .replace(/SSS/g, SSS);
}

function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

}