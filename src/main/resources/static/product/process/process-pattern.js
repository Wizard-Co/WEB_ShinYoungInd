//#region 데이터테이블
const mainTable = new DataTable('#tbMain', {
    searching: false,
    columns:
        [
            {data: "num", className: 'center'},
            {data: "patternID", className: 'center', orderable: false},
            {data: "articleType", className: 'center', orderable: false},
            {data: "pattern", className: 'left', orderable: false}
        ]
})

const allTable = new DataTable('#allProcessTb', {
    paging: false,
    searching: false,
    order: [],
    columns:
        [
            {data: "num", className: 'center', orderable: false},
            {data: "process", className: 'center', orderable: false},
            {data: "processID", className: 'center', orderable: false}
        ],
    drawCallback: function (settings) {
        let api = this.api();
        if (api.row().count() == 0) {
            let tbody = api.table().body();
            tbody.innerHTML = '';
        }
    }
})

const selTable = new DataTable('#selectedProcessTb', {
    paging: false,
    searching: false,
    order: [],
    columns:
        [
            {data: "num", className: 'center', orderable: false},
            {data: "process", className: 'center', orderable: false},
            {data: "processID", className: 'left', orderable: false}
        ],
    drawCallback: function (settings) {
        let api = this.api();
        if (api.row().count() == 0) {
            let tbody = api.table().body();
            tbody.innerHTML = '';
        }
    }
})
//#endregion

//#region 변수
let isAllProcessTbDrawn = false;
let allProcessTb = document.getElementById("allProcessTb");
const div_AllProcessTb = document.getElementById("div_allProcess");
let selectedProcessTb = document.getElementById("selectedProcessTb");
const div_SelectedProcessTb = document.getElementById("div_selProcess");
let currentDragginRow = null;

let flag = '';
let selectedRow = 0;
toastr.options = {
    "positionClass": "toast-bottom-right", "timeOut": "3000",
}
//#endregion

window.addEventListener('DOMContentLoaded', function () {
    defaultMode();
    search_allProcess();
})

//#region 버튼동작
btnSearch.addEventListener("click", function () {
    search();
})

btnAdd.addEventListener("click", function () {
    flag = 'add';
    writeMode();
    initInput('#addForm');
})

btnUpdate.addEventListener("click", function () {
    flag = 'update';
    writeMode();
})

btnSave.addEventListener("click", async function (event) {
    event.preventDefault()

    try {
        await saveData(flag);
        defaultMode();
    } catch (error) {
        writeMode();
    }
})
btnCancel.addEventListener("click", function () {
    defaultMode();
})

//#endregion

//#region 테이블 동작
mainTable.on('select', function (e, dt, type, indexes) {
    let row = mainTable.row(indexes).data();
    setData(row, '#addForm');
    search_selProcess(row.patternID);
})

//#endregion

//#region 추가.수정모드
/*
기본모드(저장,취소버튼은 disable 추가.수정.조회버튼은 able)
 */
function defaultMode() {
    hideElementsByID('disabled', 'btnSave', 'btnCancel');
    showElementsByID('disabled', 'btnAdd', 'btnUpdate', 'btnSearch')
    formDisabled('addForm', true);
    document.getElementById('addForm').classList.remove('edit');
}

/*
추가.수정모드(저장,취소버튼 able.수정.조회버튼 disable)
 */
function writeMode() {
    hideElementsByID('disabled', 'btnAdd', 'btnUpdate', 'btnSearch');
    showElementsByID('disabled', 'btnSave', 'btnCancel');
    formDisabled('addForm', false);
    document.getElementById('addForm').classList.add('edit');
    toastr.info("자료 입력중 입니다.")

    // addDragAndDrop(allProcessTb);
    // addDragAndDrop(selectedProcessTb);

}

//#endregion

//#region 함수
async function search() {

    selTable.clear().draw();

    try {
        loading.visible();
        const response = await fetch("/product/pattern/search", {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        setNo(data);
        mainTable.clear().rows.add(data).draw();
    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function search_allProcess() {
    if (isAllProcessTbDrawn) return;

    try {
        loading.visible();
        let param = {
            processID: '',
            process: ''
        }
        const response = await fetch("/common/process", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        setNo(data);
        allTable.clear().rows.add(data).draw();
        isAllProcessTbDrawn = true;

    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function search_selProcess(patternID) {
    try {
        loading.visible();
        const response = await fetch("/product/pattern/detail", {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            }, body: patternID
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        }
        const data = await response.json();

        setNo(data);
        selTable.clear().rows.add(data).draw();

        // selectedProcessTb.outerHTML = data;
        // selectedProcessTb = document.getElementById('selectedProcessTb');
        // selectedProcessTb.querySelectorAll('tbody tr').forEach(row => addRowDragEvents(row));


    } catch (error) {
        console.error("Fetch error:", error);
    } finally {
        loading.invisible();
    }
}

async function saveData(flag) {
    const form = document.getElementById('addForm');


    try {
        if (!form.checkValidity()) return;
        const formData = new FormData(form);
        let patternSub = getSelTableData();

        patternSub.forEach((process, index) => {
            formData.append(`patternList[${index}].patternID`, form.querySelector('[name="patternID"]').value);
            formData.append(`patternList[${index}].patternSeq`, index + 1);
            formData.append(`patternList[${index}].processID`, process);
        })

        const response = await fetch(`/product/pattern/${flag}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}, ${errorText}`);
        } else {
            toastr.success('저장에 성공했습니다', '저장 성공');
            delay();
            search();
        }

    } catch (error) {
        console.error(error);
        toastr.error('저장에 실패했습니다', `'저장실패: ${error.message}`);
        delay();
    }
}

async function deleteData() {
    try {
        loading.visible();
        const response = await fetch("/product/pattern/delete", {
            method: "POST", headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {

    } finally {

    }
}

// 왼쪽 테이블 (복사 전용)
new Sortable(document.querySelector("#allProcessTb tbody"), {
    group: {
        name: 'shared',
        pull: 'clone',
        put: false
    },
    sort: false
});

// 오른쪽 테이블
new Sortable(document.querySelector("#selectedProcessTb tbody"), {
    group: 'shared',
    animation: 150,

    onAdd: function (evt) {
        const addedRow = evt.item;
        const addedProcessId = addedRow.querySelectorAll('td')[2]?.textContent?.trim();
        const allRows = evt.to.querySelectorAll('tr');

        let isDuplicate = false;
        allRows.forEach(row => {
            if (row === addedRow) return;
            const pid = row.querySelectorAll('td')[2]?.textContent?.trim();
            if (pid === addedProcessId) isDuplicate = true;
        });

        if (isDuplicate) {
            toastr.error('이미 추가된 공정입니다.', '오류');
            addedRow.remove(); // 중복이면 삭제
        }
        updateNo(selectedProcessTb);
    },

    onEnd: function (evt) {
        const draggingRow = evt.item;
        const rect = div_SelectedProcessTb.getBoundingClientRect();

        // 마우스 위치 (끝난 시점 기준)
        const {clientX: x, clientY: y} = evt.originalEvent;

        const isOutside =
            x < rect.left || x > rect.right ||
            y < rect.top || y > rect.bottom;

        if (isOutside) draggingRow.remove(); // 영역 밖이면 삭제
        updateNo(selectedProcessTb);
    }
});


// //#region 드래그 앤 드랍
// function addDragAndDrop(table) {
//     const rows = table.querySelectorAll("tr");
//     rows.forEach(row => {
//         addRowDragEvents(row);
//     });
// }
//
// document.addEventListener("dragover", (e) => {
//     e.preventDefault();
// });
//
// div_SelectedProcessTb.addEventListener("dragend", (e) => {
//     // div_SelectedProcessTb 영역 밖이면 삭제
//     const rect = div_SelectedProcessTb.getBoundingClientRect();
//     const x = e.clientX;
//     const y = e.clientY;
//
//     const isOutside = (
//         x < rect.left ||
//         x > rect.right ||
//         y < rect.top ||
//         y > rect.bottom
//     );
//     const draggingRow = document.querySelector('#selectedProcessTb tbody tr.dragging');
//     console.log(draggingRow);
//     if (isOutside && draggingRow) {
//         draggingRow.remove();
//     }
//
//     // dragend 후에 클래스 제거는 항상 해주는 게 좋음
//     if (draggingRow) {
//         draggingRow.classList.remove('dragging');
//     }
// })
// div_SelectedProcessTb.addEventListener("drop", (e) => {
//     e.preventDefault();
//     const draggingData = JSON.parse(e.dataTransfer.getData("text/plain"));
//     const draggingRow = document.createElement("tr");
//     draggingRow.innerHTML = draggingData.content;
//
//     const selectedTbody = selectedProcessTb.querySelector('tbody');
//     const draggingProcessId = draggingRow.querySelectorAll('td')[2]?.textContent?.trim(); // 3번째 td
//
//     if (draggingData.fromTable === "allProcessTb") {
//         let isDuplicate = false;
//         const rows = selectedTbody.querySelectorAll('tr');
//
//         rows.forEach(row => {
//             const existingProcessId = row.querySelectorAll('td')[2]?.textContent?.trim();
//             if (existingProcessId === draggingProcessId) {
//                 isDuplicate = true;
//             }
//         });
//
//         if (isDuplicate) {
//             toastr.error('이미 추가된 공정입니다.', '오류', {positionClass: 'toast-top-right'});
//             return;
//         }
//         selectedProcessTb.querySelector('tbody').appendChild(draggingRow);
//         addRowDragEvents(draggingRow);
//     }
//     // const originalRow = document.querySelector(`#allProcessTb tbody tr.dragging`);
//     // if (originalRow) originalRow.remove();
//
// });
//
// div_SelectedProcessTb.addEventListener("dragend", (e) => {
//     const rect = div_SelectedProcessTb.getBoundingClientRect();
//     const x = e.clientX;
//     const y = e.clientY;
//
//     const isOutside = (
//         x < rect.left ||
//         x > rect.right ||
//         y < rect.top ||
//         y > rect.bottom
//     );
//
//     if (isOutside && currentDraggingRow && div_SelectedProcessTb.contains(currentDraggingRow)) {
//         currentDraggingRow.remove();
//     }
//
//     // cleanup
//     if (currentDraggingRow) {
//         currentDraggingRow.classList.remove("dragging");
//         currentDraggingRow = null;
//     }
// });
//
// // div_AllProcessTb.addEventListener("drop", (e) => { xxx
// //     e.preventDefault();
// //
// //     const draggingData = JSON.parse(e.dataTransfer.getData("text/plain"));
// //     const draggingRow = document.createElement("tr");
// //     draggingRow.innerHTML = draggingData.content;
// //
// //     if (draggingData.fromTable === "selectedProcessTb") {
// //         const originalRow = document.querySelector(`#selectedProcessTb tbody tr.dragging`);
// //         if (originalRow) originalRow.remove();
// //         allProcessTb.querySelector('tbody').appendChild(draggingRow);
// //         addRowDragEvents(draggingRow);
// //     }
// // });
//
function addRowDragEvents(row) {
    row.setAttribute("draggable", true);
    row.addEventListener("dragstart", (e) => {
        e.target.classList.add("dragging");
        selectedRow = JSON.stringify({
            content: e.target.innerHTML,
            fromTable: row.closest('table').id
        });
        e.dataTransfer.setData("text/plain", selectedRow);
    });

    row.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        selectedRow = null;

        updateNo(allProcessTb);
        updateNo(selectedProcessTb);

    });
}

function updateNo(table) {
    let rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        let no = row.querySelector('td:first-child');
        no.textContent = index + 1;
    })
}

// //#endregion
function getSelTableData() {
    let rows = selectedProcessTb.querySelectorAll('tbody tr');
    let selList = [];

    rows.forEach(row => {
        let cells = row.querySelectorAll('td');
        selList.push(cells[2].textContent.trim());
    })
    return selList;

}

//#endregion



