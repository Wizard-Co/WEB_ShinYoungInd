/**
 작성자:    김수정
 작성일:    2025-08-04
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

window.addEventListener('DOMContentLoaded', function () {
    init();
    updateMachineEnabled();
});



let selectedRow;
let mainTbColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "일자", field: "workDate", hozAlign: "center" },
    { title: "시간", field: "workTime", hozAlign: "center" },
    { title: "공정", field: "process", hozAlign: "center" },
    { title: "호기", field: "machineNo", hozAlign: "center" },

    { title: "생산량", field: "workQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "총 생산량", field: "totalWorkQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "불량량", field: "defectQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },

    { title: "RPM", field: "rpm", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "토탈 생산량 리셋신호", field: "tqtyReset", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "생산량 리셋신호", field: "qtyReset", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "콘트롤온도 현재값", field: "temper", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "콘트롤온도 설정값", field: "setTemper", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "상부온도 현재값", field: "upperTemper", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "상부온도 설정값", field: "upperSetTemper", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "하부온도 현재값", field: "lowerTemper", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "하부온도 설정값", field: "lowerSetTemper", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
];

let mainTb = createMainTabulator("#tbMain", mainTbColumns);


document.getElementById('btnExcel').addEventListener("click", function () {
    mainTb.download("xlsx", "설비 수집 조회.xlsx");
});

function init() {
    document.getElementById('btnSearch').addEventListener("click", Search);
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());
}

async function Search() {
    let param = {
        chkDate: getChecked('chkDate') ? 1 : 0,
        sDate: document.getElementById('sDate').value.replaceAll('-', ''),
        eDate: document.getElementById('eDate').value.replaceAll('-', ''),

        chkProcess: getChecked('chkProcess') ? 1 : 0,
        processID: getCombo('cboProcess')?.value ?? "",

        chkMachine: getChecked('chkMachine') ? 1 : 0,
        machineID: getCombo('cboMachine')?.value ?? ""
    }

    loading.visible();

    try {

        const response = await fetch("/mc/worklog/search", {
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
            mainTb.clearData();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        mainTb.setData(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

