// #region 테이블 변수
const mcTable = new DataTable('#MCtable', {
    buttons: [{
        extend: 'excel',
        filename: '설비관리',
        title: '설비관리',
        customize: function (xlsx) {
            let sheet = xlsx.xl.worksheets['sheet1.xml'];
            $('row:first c', sheet).attr('s', '42');
        }
    }],
    columns: [
        {data: "mcType", className: 'center'},
        {data: "mcName", className: 'left'},
        {data: "mcNo", className: 'left'},
        {data: "installDate", className: 'center'},
        {data: "elecCapacity", className: 'right'},
        {data: "steamCapacity", className: 'right'},
    ]
});

// #endregion

// #region 변수
let selectedRow;
let flag = '';
toastr.options = {
    "positionClass": "toast-bottom-right",
    "timeOut": "3000",
}
// #endregion

// #region 버튼동작
window.addEventListener('load', function () {
    mainBtnSetting();
});

btnSearch.addEventListener("click", function () {
    search();
})
btnAdd.addEventListener("click", function () {
    flag = 'add';
    writeMode();
    initInput('#addForm input');
})
btnUpdate.addEventListener("click", function () {
    flag = 'update';
    writeMode();
})
btnSave.addEventListener("click", function () {
    save(flag);
    defaultMode();
})
btnCancel.addEventListener("click", function () {
    defaultMode();

    if (btnBig.checked) {
        mainTable.row(selectedRow).select();
    }
})
btnDelete.addEventListener("click", function () {
    let item = mainTable.row(selectedRow).data();
    if (item) {
        if (confirm("삭제하시겠습니까?")) {
            deleteData(item.mcID);
        }
    } else {
        alert("삭제할 데이터를 선택해주세요.");
    }
})
// #endregion

// #region 테이블 동작
mcTable.on('select', function (e, dt, type, indexes) {
    let main = mcTable.row(indexes).data();
    selectedRow = indexes;

    setData(main);
})
// #endregion

//#region 모드
function defaultMode() {
    hideElementsByID('disabled', 'btnSave', 'btnCancel');
    showElementsByID('disabled', 'btnAdd', 'btnUpdate', 'btnSearch', 'btnExcel')
    formDisabled('addForm', true);
    document.getElementById('addForm').classList.remove('edit');
}
function writeMode() {
    hideElementsByID('disabled', 'btnAdd', 'btnUpdate', 'btnSearch', 'btnExcel');
    showElementsByID('disabled', 'btnSave', 'btnCancel');
    formDisabled('addForm', false);
    document.getElementById('addForm').classList.add('edit');
    toastr.info("자료 입력중 입니다.")
}

//#endregion

//#region 함수

function search() {
    let param = {
        mcType: document.getElementById('cboMcTypeSrh').value,
        mcName: document.getElementById('inputMcNameSrh').value,
        mcNo: document.getElementById('inputMcNOSrh').value,
    }

    loading.visible();
    fetch("/mc/code/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
                mcTable.clear().rows.add(data).draw();
                loading.invisible();
            }
        );
}

async function deleteData(mcID){
    try {
        loading.visible();
        const response = await fetch("/mc/code/delete", {
            method: "POST",
            body: mcID,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        // search();
    } catch(error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function save(flag) {
    const form = document.getElementById('addForm');

    try {
        if (form.checkValidity) {
            const formData = new FormData(form);
            let url = `/mc/code/${flag}`;

            const response = await fetch(url, {
                method: 'post',
                body: formData,
                headers: {},
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}, ${errorText}`);
            } else {
                toastr.success('저장에 성공했습니다', '저장 성공');
                delay();
            }
        }
    } catch (e) {
        console.error(error);
        toastr.error('저장에 실패했습니다', `'저장실패: ${error.message}`);
        delay();
    }
}
//#endregion

// table filter
document.getElementById('inputMcNameSrh').addEventListener('keyup', function () {
    let input = this.value;
    mcTable.column(1).search(input).draw();
})


document.getElementById('btnExcel').addEventListener("click", function () {

    const dtExcel = document.querySelector('.dt-button.buttons-excel')
    dtExcel.click();
});



