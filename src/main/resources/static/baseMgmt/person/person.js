/**
 작성자:    김수정
 작성일:    2024-10-21
 내용:     person.js
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

window.addEventListener('DOMContentLoaded', function () {
    init();
});

let selectedRow;
const option = 'width=1100, height=750';

const table = new DataTable('#table', {
    buttons: [{
        extend: 'excel',
        filename: '사원코드',
        title: '사원코드',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "num", className: 'center'},
        {data: "personID", className: 'left'},
        {data: "name", className: 'left'},
        {data: "depart", className: 'left'},
        {data: "position", className: 'left'},

        {data: "duty", className: 'left'},
        {data: "registNo", className: 'left'},
        {data: "birth", className: 'center'},
        {data: "email", className: 'left'},
        {data: "loginID", className: 'left'},

        {data: "startDate", className: 'center'},
        {data: "endDate", className: 'center'},
        {data: "handPhone", className: 'center'},
        {data: "phone", className: 'right'},

        {data: "zipCode", className: 'center'},
        {data: "address", className: 'left'},
        {data: "addressDetail", className: 'left'},
        {data: "addressJibun", className: 'left'},
        {data: "addressDetail", className: 'left'},

        {data: "bankAccount", className: 'left'},
        {data: "fileName", className: 'left'},
        {data: "remark", className: 'left'},

    ],
    scrollX: true
})

let tbody = document.querySelector('#table tbody');
tbody.onclick = function () {
    let rowElement = event.target.closest('tr');
    selectedRow = table.row(rowElement).data();
};
tbody.ondblclick = goDetail;
document.getElementById('btnDetail').onclick = goDetail;

function goDetail(){
    if(selectedRow) {
        let param = {
            personID: selectedRow.personID
        }
        openForm('personDetail', '/baseMgmt/person/detail?mode=update', param, option);
    } else {
        alert("선택한 행의 사원코드를 인식할 수 없습니다");
    }
}

function init() {
    document.getElementById('btnSearch').addEventListener("click", Search);
}

document.getElementById('btnAdd').addEventListener('click', function () {
    openForm('personDetail', '/baseMgmt/person/add?mode=add', '', option);
})

document.getElementById('btnDelete').addEventListener('click', function () {
    if (!!selectedRow) {
        let baseUrl = '/baseMgmt/person/delete';
        let param = new URLSearchParams({
            personID: selectedRow.personID
        });
        let urlWithParam = `${baseUrl}?${param}`

        fetch(urlWithParam)
            .then(response => {
                if (!response.ok) console.log('http error: ', response);
            })
            .then(() => {
                Search();
            })
            .catch(error => console.log('Unexpected error: ', error));
    }
})


async function Search() {
    let param = {
        chkDepart: getChecked('chkDepartSrh') ? 1 : 0,
        depart: document.getElementById('inputDepartSrh').value,

        chkName: getChecked('chkNameSrh') ? 1 : 0,
        name: document.getElementById('inputNameSrh').value,

        chkArea: getChecked('chkAreaSrh') ? 1 : 0,
        areaID: document.getElementById('cboAreaSrh').value,

        chkQualified: getChecked('chkQualifiedSrh') ? 1 : 0,
        licenseID: document.getElementById('cboQualifiedSrh').value,

        chkIncludeAdmin: getChecked('chkIncludeAdmin') ? 1 : 0,
        chkIncludeEnd: getChecked('chkIncludeEnd') ? 1 : 0
    }

    try{
        loading.visible();
        const response = await fetch("/baseMgmt/person/search", {
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
            table.clear().draw();
            toastr.warning('조회된 데이터가 없습니다', '', {positionClass: 'toast-bottom-center'});
            return;
        }

        setNo(data);
        table.clear().rows.add(data).draw();
    }catch(e){
        console.error("Fetch error:", error);
    }finally{
        loading.invisible();
    }
}


document.getElementById('btnExcel').addEventListener("click", function () {

    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});



