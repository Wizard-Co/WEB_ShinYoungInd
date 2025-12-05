window.addEventListener('DOMContentLoaded', function () {
    init();
});

let graphDefectIndex;
let graphModelIndex;
let graphTypeIndex;

document.getElementById('btnSearch').addEventListener('click', search)
document.getElementById('btnExcel').addEventListener("click", function () {
    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // 첫 번째 테이블 (불량지수)
    const table1 = document.querySelector('#defect-table-container .modern-table');
    const ws1 = XLSX.utils.table_to_sheet(table1);
    XLSX.utils.book_append_sheet(wb, ws1, "불량지수");

    // 두 번째 테이블 (점유제품/불량유형/작업자)
    const table2 = document.querySelector('#defect-table-Sub-container .modern-table');
    const ws2 = XLSX.utils.table_to_sheet(table2);
    XLSX.utils.book_append_sheet(wb, ws2, "상세현황");

    // 엑셀 파일로 다운로드
    const fileName = `제품군별 품질분석 .xlsx`;
    XLSX.writeFile(wb, fileName);
});

function init(){
    document.getElementById('chkDate').disabled =true;
    document.getElementById('chkOccurStep').disabled = true;
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());

    search();
}

function createDefectTable(data, baseDate) {
    const container = document.getElementById('defect-table-container');
    const subContainer = document.getElementById('defect-table-Sub-container');

    const months = getPreviousMonths(12, baseDate);
    const subMonth = getPreviousMonths(13, baseDate);

    // 포맷 함수
    const formatNumber = (value) => {
        if (!value || value === 0) return '-';
        return Number(value).toLocaleString('ko-KR');
    };

    const formatDecimal = (value) => {
        if (!value || value === 0) return '-';
        return Number(value).toFixed(2);
    };

    // 데이터가 없을 때 빈 객체 사용
    const defectData = data?.defectArticleData || [];
    const modelData = data?.modelDefectData || [];
    const typeData = data?.typeDefectData || [];
    const workerData = data?.workerDefectData || [];

    const targetPPM = defectData.find(item => item.seq == 1) || {};
    const totalQty = defectData.find(item => item.seq == 2) || {};
    const defectQty = defectData.find(item => item.seq == 3) || {};
    const defectPPM = defectData.find(item => item.seq == 4) || {};

    const html = `
    <div style="overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <table class="modern-table">
            <thead>
                <tr>
                    <th colspan="2" class="header-main">구분</th>
                    ${months.map(month => `<th class="header-month">${month}</th>`).join('')}
                    <th class="header-total">합계</th>
                </tr>
            </thead>
            <tbody>       
                <tr>
                    <td rowspan="4" class="group-header">불량지수<br>(건수)</td>
                    <td class="sub-header">목표PPM</td>
                    ${months.map((_, idx) => `<td class="data-cell-right">${formatDecimal(targetPPM[`m${idx + 1}`])}</td>`).join('')}
                    <td class="total-cell">${formatDecimal(targetPPM.m13)}</td>
                </tr>
                <tr>
                    <td class="sub-header">전체수량</td>
                    ${months.map((_, idx) => `<td class="data-cell-right">${formatNumber(totalQty[`m${idx + 1}`])}</td>`).join('')}
                    <td class="total-cell">${formatNumber(totalQty.m13)}</td>
                </tr>
                <tr>
                    <td class="sub-header">불량수량</td>
                    ${months.map((_, idx) => `<td class="data-cell-right">${formatNumber(defectQty[`m${idx + 1}`])}</td>`).join('')}
                    <td class="total-cell">${formatNumber(defectQty.m13)}</td>
                </tr>
                <tr>
                    <td class="sub-header">불량PPM</td>
                    ${months.map((_, idx) => `<td class="data-cell-right">${formatDecimal(defectPPM[`m${idx + 1}`])}</td>`).join('')}
                    <td class="total-cell">${formatDecimal(defectPPM.m13)}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `;

    const subHtml = `
        <div style="overflow-x: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <table class="modern-table">
            <thead>
                <tr>
                    <th colspan="2" class="header-main">구분</th>
                    ${subMonth.map((_, idx) => `<th class="header-month">${idx === 12 ? '기타' : idx + 1}</th>`).join('')}
                </tr>
                <tbody>
                   <tr>
                        <td rowspan="2" class="group-header">점유제품</td>
                        <td class="sub-header">제품명</td>                        
                        ${subMonth.map((_, idx) => `<td class="data-cell-left">${modelData[idx]?.groupingName || '-'}</td>`).join('')}
                   </tr>
                   <tr>
                        <td class="sub-header">불량유형</td>
                        ${subMonth.map((_, idx) => `<td class="data-cell-right">${formatNumber(modelData[idx]?.defectQty) || '-'}</td>`).join('')}
                   </tr>
                   <tr>
                        <td rowspan="2" class="group-header">불량유형</td>
                        <td class="sub-header">유형</td>                       
                        ${subMonth.map((_, idx) => `<td class="data-cell-left">${typeData[idx]?.groupingName || '-'}</td>`).join('')}
                   </tr>
                   <tr>
                        <td class="sub-header">불량수량</td>
                        ${subMonth.map((_, idx) => `<td class="data-cell-right">${formatNumber(typeData[idx]?.defectQty) || '-'}</td>`).join('')}
                   </tr>             
                   <tr>
                        <td rowspan="2" class="group-header">작업자</td>
                        <td class="sub-header">유형</td>                        
                        ${subMonth.map((_, idx) => `<td class="data-cell-left">${workerData[idx]?.groupingName || '-'}</td>`).join('')}                        
                   </tr>
                   <tr>
                        <td class="sub-header">불량수량</td>
                        ${subMonth.map((_, idx) => `<td class="data-cell-right">${formatNumber(workerData[idx]?.defectQty) || '-'}</td>`).join('')}                        
                   </tr>
                </tbody>                  
            </thead>
        </table>
        </div>
    `;

    container.innerHTML = html;
    subContainer.innerHTML = subHtml;
}

function clearAllData() {

    createDefectTable(null, document.getElementById('sDate').value);

    if(graphDefectIndex) {
        graphDefectIndex.destroy();
        graphDefectIndex = null;
    }

    if(graphModelIndex) {
        graphModelIndex.destroy();
        graphModelIndex = null;
    }

    if(graphTypeIndex) {
        graphTypeIndex.destroy();
        graphTypeIndex = null;
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

async function search() {

        let param = {
            YYYYMM : toDateString(document.getElementById('sDate').value,'yyyyMM'),
            YYYY : toDateString(document.getElementById('sDate').value, 'yyyy'),
            MM : toDateString(document.getElementById('sDate').value,'MM'),

            chkProdGroupID : getChecked('chkProductGrpID') ? 1:0,
            ProdGroupID : document.getElementById('cboProductGrpID').value,

            chkInspectPointID : getChecked('chkOccurStep') ? 1:0,
            InspectPointID : document.getElementById('cboOccurStep').value,

            chkArticleID : getChecked('chkArticle') ? 1:0,
            ArticleID : document.getElementById('txtArticle').value,

            chkBuyerArticleNo : getChecked('chkBuyerArticleNo')? 1:0,
            BuyerArticleNo :  document.getElementById('txtBuyerArticleNo').value,
        }

        loading.visible();

        try {

            const response = await fetch("/qul/result/defectArticle/search", {
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
            if(data.defectArticleData.length > 0 && data.modelDefectData.length > 0){
                 createDefectTable(data, document.getElementById('sDate').value);
                 drawDefectIndex(data.defectArticleData);

                setTimeout(() => {
                    drawModelIndex(data.modelDefectData);
                }, 100);

                setTimeout(() => {
                    drawTypeIndex(data.typeDefectData);
                }, 200);
            }
            else{
                clearAllData();
                toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            }

        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            loading.invisible();
        }
}

function drawDefectIndex(data) {
    const div = document.getElementById('graphDefectIndex');

    const labels = getPreviousMonths(12, document.getElementById('sDate').value);

    // seq=1: 목표PPM, seq=4: 불량PPM
    const goalPPM = data.find(d => d.seq === 1);
    const defectPPM = data.find(d => d.seq === 4);

    const datasets = [
        {
            label: '목표PPM',
            data: Array.from({ length: 12 }, (_, i) => goalPPM?.[`m${i + 1}`] || 0),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2,
            tension: 0.1  // 선 부드럽게
        },
        {
            label: '불량PPM',
            data: Array.from({ length: 12 }, (_, i) => defectPPM?.[`m${i + 1}`] || 0),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            tension: 0.1
        }
    ];

    if(graphDefectIndex){
        graphDefectIndex.destroy();
    }

    graphDefectIndex = new Chart(div, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '불량지수(PPM) 추이'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'PPM'
                    }
                }
            }
        }
    })
}

function drawModelIndex(data) {
    const div = document.getElementById('graphModelIndex');

    const labels = data.map(item => item.groupingName);
    const defectQtyData = data.map(item => item.defectQty || 0);

    const palette = [
        'rgba(141, 160, 203, 0.8)',  // 블루그레이
        'rgba(252, 205, 229, 0.8)',  // 핑크
        'rgba(255, 217, 102, 0.8)',  // 골드
        'rgba(179, 226, 205, 0.8)',  // 민트
        'rgba(253, 180, 98, 0.8)',   // 피치
        'rgba(190, 186, 218, 0.8)',  // 라벤더
        'rgba(251, 128, 114, 0.8)',  // 코랄
        'rgba(128, 177, 211, 0.8)',  // 스틸블루
        'rgba(188, 128, 189, 0.8)',  // 모브
        'rgba(204, 235, 197, 0.8)'   // 세이지
    ];

    const colors = data.map((_, idx) => palette[idx % palette.length]);

    if(graphModelIndex){
        graphModelIndex.destroy();
    }

    graphModelIndex = new Chart(div, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: defectQtyData,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: 'black',
                    font: {
                        weight: 'bold',
                        size: 13
                    },
                    anchor: 'center',      // 라벨을 조각 중앙에
                    align: 'center',       // 중앙 정렬
                    offset: 0,             // 오프셋 없음
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100);

                        // 5% 이상만 라벨 표시
                        if (percentage < 5) {
                            return '';
                        }

                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}\n${percentage.toFixed(1)}%`;
                    },
                    textAlign: 'center',
                    padding: 4
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function drawTypeIndex(data) {
    const div = document.getElementById('graphTypeIndex');

    const labels = data.map(item => item.groupingName);
    const defectQtyData = data.map(item => item.defectQty || 0);

    const palette = [
        'rgba(102, 194, 165, 0.8)',  // 터키쿼이즈
        'rgba(252, 141, 98, 0.8)',   // 살몬
        'rgba(141, 160, 203, 0.8)',  // 페리윙클
        'rgba(231, 138, 195, 0.8)',  // 로즈
        'rgba(166, 216, 84, 0.8)',   // 라임
        'rgba(255, 217, 47, 0.8)',   // 앰버
        'rgba(229, 196, 148, 0.8)',  // 탠
        'rgba(179, 179, 179, 0.8)',  // 실버
        'rgba(206, 162, 98, 0.8)',   // 카멜
        'rgba(153, 210, 198, 0.8)'   // 시폼
    ];

    const colors = data.map((_, idx) => palette[idx % palette.length]);

    if(graphTypeIndex){
        graphTypeIndex.destroy();
    }

    graphTypeIndex = new Chart(div, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: defectQtyData,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            transitions: {
                resize: {
                    animation: {
                        duration: 500
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: 'black',
                    font: {
                        weight: 'bold',
                        size: 13
                    },
                    anchor: 'center',      // 라벨을 조각 중앙에
                    align: 'center',       // 중앙 정렬
                    offset: 0,             // 오프셋 없음
                    formatter: (value, context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100);

                        // 5% 이상만 라벨 표시
                        if (percentage < 5) {
                            return '';
                        }

                        const label = context.chart.data.labels[context.dataIndex];
                        return `${label}\n${percentage.toFixed(1)}%`;
                    },
                    textAlign: 'center',
                    padding: 4
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function getPreviousMonths(count, baseDateStr) {
    const months = [];

    // baseDateStr이 "YYYY-MM-DD" 형식이라고 가정
    const baseDate = new Date(baseDateStr);

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
        const month = date.getMonth() + 1; // 1~12
        months.push(`${month}월`);
    }

    return months;
}


