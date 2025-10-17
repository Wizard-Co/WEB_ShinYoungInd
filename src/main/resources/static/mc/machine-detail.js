let form = document.getElementById('addForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
});
document.getElementById('btnSave').addEventListener('click', function () {

    if (form.checkValidity()) {
        const payload = new FormData(form);

        fetch('/machine/machine/save', {
            method: 'post',
            body: payload,
            headers: {},
        })
            .then(res => {
                if (!res.ok) console.log('http error: ', res)
            })
            .then(() => {
                window.open('', '_self').close();
                opener.Search();
            })
            .catch(error => console.log('Unexpected error: ', error));
    }
})

document.getElementById('btnDelete').addEventListener('click', function () {
    let mcID = document.getElementById('mcID').value;

    if (!!mcID) {

        let baseUrl = '/machine/machine/delete';
        let param = new URLSearchParams({
            mcID: mcID
        });
        let urlWithParam = `${baseUrl}?${param}`

        fetch(urlWithParam)
            .then(res => {
                if (!res.ok) {
                    return res.text().then(err => {throw new Error(err)});
                }
            })
            .then(() => {
                window.open('', '_self').close();
                opener.Search();
            })
            .catch(error => console.log('Unexpected error: ', error))
    }
})

document.getElementById('btnUpdate').addEventListener('click', function () {

    if (form.checkValidity()) {
        const payload = new FormData(form);
        const result = document.querySelector('.form-result');

        fetch('/machine/machine/update', {
            method: 'post',
            body: payload,
            headers: {},
        })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(err => {throw new Error(err)});
                }
            })
            .then(() => {
                // window.open('', '_self').close();
                result.innerHTML = '저장이 완료되었습니다';
                refreshForm();
                opener.Search();
            })
            .catch(error => {
                console.dir(error);
                result.innerHTML = `저장에 실패하였습니다. 오류 발생: ${error.message}`
            });
    }
})

document.getElementById('btnClose').addEventListener('click', function () {
    window.open('', '_self').close();
})

document.getElementById('inputInstallCustom').addEventListener('dblclick', function () {
    PlusFinder('inputInstallCustomID', 'inputInstallCustom', 1, '');
})