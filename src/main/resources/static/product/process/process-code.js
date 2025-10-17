//#region 테이블
const mainTable = new DataTable('#tbMain', {
    searching: false,
    columns: [
        {data: "num", className: 'center'},
        {data: "processID", className: 'center'},
        {data: "process", className: 'left'},
        {data: "eProcess", className: 'left', orderable: false},
        {data: "fProcess", className: 'left', orderable: false},
        {data: "articleType", className: 'left', orderable: false},
    ]
});
const subTable = new DataTable('#tbSub', {
    searching: false,
    columns: [
        {data: "num", className: 'center'},
        {data: "processID", className: 'left'},
        {data: "process", className: 'left'},
        {data: "eProcess", className: 'left', orderable: false},
        {data: "fProcess", className: 'left', orderable: false},
        {data: "articleType", className: 'left', orderable: false},
        {data: "parentProcess", className: 'left', orderable: false},
    ]
});
//#endregion

//#region 변수
const divMain = document.getElementById('divMain');
const divSub = document.getElementById('divSub');
const btnBig = document.getElementById('btnBig');
const btnSmall = document.getElementById('btnSmall');
let flag = '';
let selectedRow = 0;
toastr.options = {
    "positionClass": "toast-bottom-right",
    "timeOut": "3000",
}

//#endregion

window.addEventListener('DOMContentLoaded', function () {
    defaultMode();
    //화면 시작시 소분류 기준
    btnSmall.checked = true;
})

//#region 버튼동작
btnBig.addEventListener("click", function () {
    divSub.classList.add('display-none');
    divMain.style.width = '75%';
    hideElementsByID('display', 'trProcessType');
    mainTable.columns.adjust().draw();
    mainTable.row(selectedRow).select();
    setRequired();
})
btnSmall.addEventListener("click", function () {
    divSub.classList.remove('display-none');
    divMain.style.width = '37.5%';
    divSub.style.width = '37.5%';
    showElementsByID('display', 'trProcessType');
    mainTable.columns.adjust().draw();
    subTable.columns.adjust().draw();
    subTable.row(selectedRow).select();
    setRequired();
})
btnSearch.addEventListener("click", function () {
    search();
})
btnAdd.addEventListener("click", function () {
    flag = 'add';
    writeMode();
    initInput('#addForm');
    document.getElementById('useYN1').checked = true;
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
    if (btnSmall.checked) {
        subTable.row(selectedRow).select();
    }
})
btnDelete.addEventListener("click", function () {
    let item;
    if (btnBig.checked) {
        item = mainTable.row(selectedRow).data();
    } else if (btnSmall.checked) {
        item = subTable.row(selectedRow).data();
    }

    if (item) {
        if (confirm("삭제하시겠습니까?")) {
            deleteData(item.processID);
        }
    } else {
        alert("삭제할 데이터를 선택해주세요.");
    }

})
//#endregion

//#region 테이블 동작
mainTable.on('select', function (e, dt, type, indexes) {
    let main = mainTable.row(indexes).data();
    selectedRow = indexes;
    if (btnBig.checked) {
        setData(main);
    }
    if (btnSmall.checked) {
        searchDetail(main);
    }
})

subTable.on('select', function (e, dt, type, indexes) {
    let sub = subTable.row(indexes).data();
    selectedRow = indexes;
    setData(sub);
})
//#endregion

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
        process: document.getElementById('inputProcessSrh').value ?? '',
        articleTypeID: getCombo('cboArticleTypeSrh').value ?? '',
        useYN: getChecked('chkIncludeUseYN') ? 'Y' : 'N'
    }

    loading.visible();
    fetch("/product/process/search", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
                setNo(data);
                mainTable.clear().rows.add(data).draw();
                loading.invisible();
            }
        );
}

function searchDetail(main) {
    let baseUrl = '/product/process/detail';
    let param = new URLSearchParams({
        processID: main.processID
    });
    let url = `${baseUrl}?${param}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
                setNo(data);
                subTable.clear().rows.add(data).draw();

                if (subTable.rows().count() > 0) {
                    subTable.row(0).select();
                }
            }
        );
}

async function deleteData(processID){
    try {
        loading.visible();
        const response = await fetch("/product/process/delete", {
            method: "POST",
            body: processID,
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
            let url = `/product/pattern/${flag}`;

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

function setRequired() {
    const parentProcessID = document.getElementById('parentProcessID');
    if (btnBig.checked) {
        parentProcessID.removeAttribute('required');
    } else if (btnSmall.checked && parentProcessID.hasAttribute('required')) {
        parentProcessID.setAttribute('required');
    }
}

//#endregion
