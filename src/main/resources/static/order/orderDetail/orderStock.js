window.addEventListener('DOMContentLoaded', function () {
    init();
});


const mainTb = new DataTable('#tbMain', {
    searching: false,
    buttons: [{
        extend: 'excel',
        filename: '재고 현황조회',
        title: '재고 현황조회',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num"},
        {data: "article"},
        {data: "spec"},
        {data: "initStockQty"},
        {data: "stuffQty"},

        {data: "outQty"},
        {data: "unitClssName"},
        {data: "stockQty"},
        {data: "needstockQty"},
        {data: "overQty"},
        {data: "stockRate"},
    ],
    rowCallback: function (row, data, index){
        if(data.cls == 4){
            row.style.backgroundColor = '#b8d6f6';
            row.cells[1].textContent = "총계";
            row.cells[2].textContent = "";
        }

    },
    scrollX: true
})

const subTb = new DataTable('#tbSub', {
    searching: false,
    paging: false,
    info: false,
    ordering: false,
    scrollY: false,
    columns: [
        {data: "initStockQty", className: "center"},
        {data: "stuffQty", className: "center"},
        {data: "outQty", className: "center"},
        {data: "stockQty", className: "center"},
    ]
});

document.getElementById('btnSearch').addEventListener('click', search)
document.getElementById('btnExcel').addEventListener("click", function () {
    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});

async function search() {
    let param = {
        nChkDate: getChecked('chkDate') ? 1 : 0,
        sSDate: document.getElementById('sDate').value.replaceAll('-',''),
        sEDate: document.getElementById('eDate').value.replaceAll('-',''),

        nChkCustom: getChecked('chkCustom') ? 1 : 0,
        sCustomID: document.getElementById('txtCustom').value,

        nChkArticleID: getChecked('chkArticle') ? 1 : 0,
        sArticleID: document.getElementById('txtArticle').value,

        nChkOrder : 0,
        sOrder : "",
        ArticleGrpID : "05",

        sFromLocID : "",
        sToLocID : document.getElementById('cboLocID').value,

        nChkOutClss :0,
        sOutClss : "",
        nChkInClss : 0,
        sInClss : "",

        nChkReqID : 0,
        sReqID : "",
        incNotApprovalYN : getChecked('chkIn_NotApprovedIncloud') ? "Y" : "",
        incAutoInOutYN : getChecked('chkAutoInOutItemsIncloud') ? "Y" : "",

        sArticleIDS : "",
        sMissSafelyStockQty : getChecked('chkOptimumStockBelowSee') ? "Y" : "",
        sProductYN : "Y",

        nMainItem : getChecked("chkMainInterestItemsSee") ? 1 : 0,
        nCustomItem : 0,

        nSupplyType : getChecked('chkSuppleType') ? 1:0,
        sSupplyType : document.getElementById('cboSuppleType').value,

        JaturiNoYN : "",
        nBuyerArticleNo : 0,
        sBuyerArticleNo : ""


    }

    loading.visible();

    try {

        const response = await fetch("/order/result/orderStock/search", {
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
            mainTb.clear().draw(); // 기존 데이터 지워주기
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        const filteredData = data.filter(row => row.cls != 3);

        setNo(filteredData);
        mainTb.clear().rows.add(filteredData).draw();

        const normalRows = data.filter(row => row.cls == 4);

        if (normalRows.length > 0) {
            subTb.clear().rows.add(normalRows).draw();
        } else {
            subTb.clear().draw();
        }

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

function init(){
    const sDate = document.getElementById('sDate');
    const eDate = document.getElementById('eDate');

    const dm = new DateManager();
    sDate.value = dm.formatDate(dm.getToday());
    eDate.value = dm.formatDate(dm.getToday());
}