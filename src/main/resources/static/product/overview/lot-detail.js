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
const tbLabel = new DataTable('#tbLabel', {
    searching: false,
    buttons: [{
        extend: 'excel',
        filename: '라벨목록',
        title: '라벨목록',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num", width: "20px"},
        {data: "labelID"},
        {data: "buyerArticleNo"},
        {data: "article"},
        {data: "workDate"},
    ],
    scrollX: true
})
const tbWork = new DataTable('#tbWork', {
    searching: false,
    paging: false,
    buttons: [{
        extend: 'excel',
        filename: '작업정보',
        title: '작업정보',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num", width: "20px"},
        {data: "workDate"},
        {data: "workTime"},
        {data: "process"},
        {data: "machine"},
        {data: "workQty"},
        {data: "person"},
        {data: "remark"},
        {data: "hrLicense"},
        {data: "defectList"}
    ],
    scrollX: true
})
const tbChild = new DataTable('#tbChild', {
    searching: false,
    paging: false,
    buttons: [{
        extend: 'excel',
        filename: '하위결합',
        title: '하위결합',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num", width: "20px"},
        {data: "childLabelID", width: "5%"},
        {data: "buyerArticleNo"},
        {data: "article"},
        {data: "type"},
        {data: "inDate"},
        {data: "inTime"},
        {data: "qty"},
        {data: "custom"},
        {data: "stockQty"}
    ],
    scrollX: true
})

tbLabel.on('select', function (e, dt, type, indexes) {
    let label = tbLabel.row(indexes).data();
    if (!label) return;

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
            articleID: document.getElementById('txtArticle').value,
            chkBuyerArticleNo: getChecked('chkBuyerArticleNo') ? 1 : 0,
            buyerArticleNo: document.getElementById('txtBuyerArticleNo').value,
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

        if (!data?.length) {
            tbLabel.clear().draw();
            tbWork.clear().draw();
            tbChild.clear().draw();
            initInput('#form');

            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        tbLabel.clear().rows.add(data).draw();

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

        if (!data?.length) {
            tbWork.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        tbWork.clear().rows.add(data).draw();

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

        if (!data?.length) {
            tbChild.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }
        setNo(data);
        tbChild.clear().rows.add(data).draw();

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
    tbLabel,
    tbWork,
    tbChild
};

document.querySelectorAll('#excelModal button[data-table-id]').forEach(button => {
    button.addEventListener('click', function () {
        const tableID = this.getAttribute('data-table-id');
        tables[tableID].buttons('.buttons-excel').trigger();

        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('excelModal'));
        modalInstance.hide();
    });
});
// #endRegion



