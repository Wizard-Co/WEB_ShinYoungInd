/**
 작성자:    김수정
 작성일:    2025-12-30
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/

const cboProcess = document.getElementById('cboProcess');
const cboMachine = document.getElementById('cboMachine');

function updateMachineEnabled() {
    cboMachine.disabled = (cboProcess.value === "");
}


cboProcess.addEventListener('change', function () {
    const select = cboProcess.value;
    getMachine(select);
})

function getMachine(processID) {
    console.log('processId', processID)
    fetch(`/machine/machine?processID=${processID}`)
        .then(response => response.json())
        .then(data => {
            if(data.length > 0) setCboMachine(data);
        })
        .catch(err => {
            console.error('process fetch error', err);
        });
}

function setCboMachine(data) {
    cboMachine.innerHTML = '';
    console.log('data', data)

    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.machineID;
        option.dataset.mappedProcessId = item.processId;          // 커스텀 속성 추가
        option.textContent = item.process + ' : ' + item.machineNo.trim();   // 생산불량일보 화면처럼 나오게 했음
        cboMachine.appendChild(option);
    });

    updateMachineEnabled();
}