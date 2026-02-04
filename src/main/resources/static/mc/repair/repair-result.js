/**
 작성자:    김수정
 작성일:    2025-07-30
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/


window.addEventListener('DOMContentLoaded', function () {
    init();
});

let selectedRow;
let mainTbColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "구분", field: "repairType", hozAlign: "center" },
    { title: "설비명", field: "mcName", hozAlign: "left" },
    { title: "수리 일자", field: "repairDate", hozAlign: "center" },
    { title: "수리 비고", field: "repairRemark", hozAlign: "left" },
    { title: "수리 비용", field: "repairPrice", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },

    { title: "예비품", field: "mcPart", hozAlign: "left" },
    { title: "예비품 구입처", field: "custom", hozAlign: "left" },
    { title: "수량", field: "partQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "예비품 비용", field: "partPrice", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },

    { title: "사유", field: "reason", hozAlign: "left" },
    { title: "예비품 비고", field: "partRemark", hozAlign: "left" },
];

let mainTb = createMainTabulator("#tbMain", mainTbColumns);

mainTb.on("rowClick", function (e, row) {
    let main = row.getData();
});

document.getElementById('btnExcel').addEventListener("click", function () {
    mainTb.download("xlsx", "설비 수리 조회.xlsx");
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

        chkMCName: getChecked('chkMCName') ? 1 : 0,
        mcName: document.getElementById('txtMCName').value,

        chkMCPart: getChecked('chkMCPart') ? 1 : 0,
        mcPartID: document.getElementById('txtMCPart').dataset.id,
    }

    loading.visible();

    try {

        const response = await fetch("/mc/repair/result/search", {
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
            mainTb.clearData()
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
