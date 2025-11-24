/**
 작성자:    최대현
 작성일:    2025-11-24
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

window.addEventListener('DOMContentLoaded', function () {
    init();
});

const mainTb = new DataTable('#tbMain', {
    searching: false,
    buttons: [{
        extend: 'excel',
        filename: '출하 실적조회',
        title: '출하 실적조회',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num"},
        {data: "outDate"},
        {data: "kcustom"},
        {data: "orderNo"},
        {data: "orderID"},
        {data: "outClssName"},

        {data: "buyerArticleNo"},
        {data: "article"},
        {data: "labelID"},
        {data: "outQty"},
        {data: "unitClssName"},
        {data: "outPrice"},

        {data: "outWareID"},
        {data: "remark"},
    ],
    rowCallback: function (row, data, index){
        if(data.depth == 1){
            row.style.backgroundColor = '#b8d6f6';
            row.cells[2].textContent = "일계";  
        } else if(data.depth == 2) {
            row.style.backgroundColor = '#419bf6';
            row.cells[1].textContent = "합계";
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
        {data: "totalCount", className: "center"},
        {data: "totalQty", className: "center"},
        {data: "totalAmount", className: "center"}
    ]
});



document.getElementById('btnSearch').addEventListener('click', search)
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

        const response = await fetch("/order/result/outwareDetail/search", {
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
        setNo(data);
        mainTb.clear().rows.add(data).draw();

        // cls가 2, 9가 아닌 일반 행만 필터링
        const normalRows = data.filter(row => row.depth !== 1 && row.depth !== 2);

        // 합계 계산
        let totalCount = normalRows.length;
        let totalQty = normalRows.reduce((sum, row) => sum + (row.outQty || 0), 0);
        let totalAmount = normalRows.reduce((sum, row) => sum + (row.amount || 0), 0);

        // 서브 테이블 업데이트
        subTb.clear().row.add({
            totalCount: totalCount.toLocaleString(),
            totalQty: totalQty.toLocaleString(),
            totalAmount: totalAmount.toLocaleString()
        }).draw();

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