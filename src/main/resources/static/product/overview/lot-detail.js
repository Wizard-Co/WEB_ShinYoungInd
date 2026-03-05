/**
 작성자:    김수정
 작성일:    2025-06-04
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/
window.addEventListener('DOMContentLoaded', function () {
    init();
});

let selectedRow;
let tbLabelColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "라벨", field: "labelID", hozAlign: "left" },
    { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
    { title: "품명", field: "article", hozAlign: "left" },
    { title: "생산일자", field: "workDate", hozAlign: "center" },
];

let tbWorkColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "일자", field: "workDate", hozAlign: "center" },
    { title: "시간", field: "workTime", hozAlign: "center" },
    { title: "공정", field: "process", hozAlign: "center" },
    { title: "호기", field: "machine", hozAlign: "center" },
    { title: "수량", field: "workQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "작업자", field: "person", hozAlign: "center" },
    { title: "비고", field: "remark", hozAlign: "left" },
    { title: "필요 자격", field: "hrLicense", hozAlign: "center" },
    { title: "불량 정보", field: "defectList", hozAlign: "left" },
];

let tbChildColumns = [
    { title: "순번", field: "num", hozAlign: "center", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "라벨ID", field: "childLabelID", hozAlign: "center" },
    { title: "품번", field: "buyerArticleNo", hozAlign: "left" },
    { title: "품명", field: "article", hozAlign: "left" },
    { title: "구분", field: "type", hozAlign: "center" },
    { title: "일자", field: "inDate", hozAlign: "center" },
    { title: "시간", field: "inTime", hozAlign: "center" },
    { title: "수량", field: "qty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
    { title: "거래처", field: "custom", hozAlign: "left" },
    { title: "현 재고", field: "stockQty", hozAlign: "right", formatter: "money", formatterParams: { thousand: ",", precision: false } },
];

let labelTb = createMainTabulator("#tbLabel", tbLabelColumns);
let workTb = createSummaryTabulator("#tbWork", tbWorkColumns);
let childTb = createSummaryTabulator("#tbChild", tbChildColumns);


labelTb.on("rowClick", function (e, row) {
    let label = row.getData();

    getWorkList(label.labelID);
    getChildList(label.labelID);
    getLabelDetail(label.labelID);
})

function init() {
    document.getElementById('btnSearch').addEventListener("click", getlabelList);
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());
}

async function getlabelList() {
    loading.visible();

    try {
        const checkedRadio = document.querySelector('#rds input[name="radioDefault"]:checked');

        let params = {
            labelTypeID: checkedRadio ? checkedRadio.value : '',
            chkDate: getChecked('chkDate') ? 1 : 0,
            sDate: document.getElementById('sDate').value.replaceAll('-', ''),
            eDate: document.getElementById('eDate').value.replaceAll('-', ''),

            chkLabelID: getChecked('chkLabelID') ? 1 : 0,
            fromLabel: document.getElementById('txtFromLabel').value,
            toLabel: document.getElementById('txtToLabel').value,

            chkArticle: getChecked('chkArticle') ? 1 : 0,
            articleID: document.getElementById('txtArticle').dataset.id,
            chkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1 : 0,
            buyerArticleNo: document.getElementById('txtBuyerArticleNo').dataset.id,
        }

        const response = await fetch("/product/result/lot/search/label", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        labelTb.clearData()
        workTb.clearData();
        childTb.clearData();
        if (!data?.length) {
            initInput('#form');

            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        // tbLabel.clear().rows.add(data).draw();
        labelTb.setData(data);

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function getWorkList(labelID) {
    loading.visible();

    try {
        let params = {
            labelID: labelID
        };

        const response = await fetch("/product/result/lot/search/work", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        workTb.clearData();
        if (!data?.length) {
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        console.log('data', data)
        setNo(data);
        // tbWork.clear().rows.add(data).draw();
        workTb.setData(data);


    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function getChildList(labelID) {
    loading.visible();

    try {
        let params = {
            labelID: labelID
        };

        const response = await fetch("/product/result/lot/search/child", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        childTb.clearData();
        if (!data?.length) {
            // tbChild.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        // tbChild.clear().rows.add(data).draw();
        childTb.setData(data);


    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function getLabelDetail(labelID) {
    loading.visible();

    let params = {
        labelID: labelID
    };

    try {
        const response = await fetch('/product/result/lot/search/label/detail', {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        if (!data) {
            initInput('#form');
            return;
        }
        setData(data, '#form');

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}


// #region 엑셀
document.getElementById('btnExcel').addEventListener("click", function () {
    const excelModal = new bootstrap.Modal(document.getElementById('excelModal'));
    excelModal.show();
});

const tables = {
    tbLabel: labelTb,
    tbWork: workTb,
    tbChild: childTb
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
// #endRegion



