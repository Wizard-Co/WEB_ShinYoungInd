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


cboProcess.addEventListener('change', function (){
 const select = cboProcess.value;
 getMachine(select);
})

function getMachine(processID) {
 fetch(`/machine/machine?processID=${processID}`)
     .then(response => response.json())
     .then(data => {
      setCboMachine(data);
     })
     .catch(err => {
      console.error('process fetch error', err);
     });
}

function setCboMachine(data){
 cboMachine.innerHTML = '';

 data.forEach(item => {
  const option = document.createElement('option');
  option.value = item.machineID;
  option.textContent = item.machineNo.trim();
  cboMachine.appendChild(option);
 });

 updateMachineEnabled();
}