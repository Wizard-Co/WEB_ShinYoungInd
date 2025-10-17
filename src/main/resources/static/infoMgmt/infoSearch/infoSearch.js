/*
설명: 공지사항 조회 js 파일
작성일: 2024.10.31
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

*/
/*메뉴ID*/
/*공지사항 조회의 menuID, 권한이 있는 지 없는 지 확인하는 용도*/
let menuID = '0006';

/*선택한 행 변수*/
let selectedRow;

//조회 클릭 이벤트
document.querySelector("#btnSearch").addEventListener("click", function() {search();});  //조회

//엑셀 클릭 이벤트
document.querySelector("#btnExcel").addEventListener("click", function() {
                                                                            let dataheader = []; //테이블 헤더
                                                                            let datalst = [];    //테이블 데이터

                                                                            $('#infoSearchTable thead th').each(function() {
                                                                                dataheader.push($(this).text()); // 헤더의 텍스트 값 가져오기
                                                                            });

                                                                            infoSearchTable.rows().every(function (rowIdx) {
                                                                                     let data = this.data();
                                                                                     //엑셀 다운로드 공통으로 사용하기 위해 조회시 보이는 데이터만 가져감
                                                                                     rn = data["rn"];                   //순번 데이터
                                                                                     infoID = data["infoID"];           //공지사항 번호 데이터
                                                                                     allYNName = data["allYNName"];     //구분(전체, 개별) 데이터
                                                                                     infoTitle = data["infoTitle"]      //공지제목
                                                                                     fromDate = data["fromDate"];       //시작일 데이터
                                                                                     toDate = data["toDate"];           //종료일 데이터
                                                                                     attachFile = data["attachFile"];   //첨부파일 데이터
                                                                                     createDate = data["createDate"];   //작성일자
                                                                                     lastUpdateDate = data["lastUpdateDate"]; //수정일자
                                                                                     //필요한 데이터만 가져오기
                                                                                     datalst.push({rn, infoID, allYNName, fromDate, toDate, infoTitle, attachFile, createDate, lastUpdateDate});

                                                                            })


                                                                             if(datalst.length < 1){
                                                                                   alert("조회 된 데이터가 없습니다");
                                                                                   return;
                                                                             } else {
                                                                              fetch("/infoMgmt/infoSearch/excel", {
                                                                                                                 method: "POST",
                                                                                                                 body: JSON.stringify({headers: dataheader, data: datalst}),
                                                                                                                 headers: {
                                                                                                                     'Content-Type': 'application/json'
                                                                                                                 }
                                                                              })
                                                                               .then(response => response.blob())  // 서버에서 파일을 Blob 형식으로 받음
                                                                                      .then(blob => {
                                                                                           // Blob 데이터를 이용해 파일 다운로드
                                                                                           var link = document.createElement('a');
                                                                                           link.href = URL.createObjectURL(blob);
                                                                                           link.download = 'infoSearch.xlsx';
                                                                                           link.click();
                                                                                      })
                                                                                      .catch(error => {
                                                                                         console.error('엑셀 내보내기 실패:', error);
                                                                                      });
                                                                              }
});

//MORE 클릭 이벤트
document.querySelector("#btnMore").addEventListener("click", function() {moveInfo();});  //MORE 클릭시 공지사항 등록 조회로 이동

/*행 클릭시 행 데이터 가져오기*/
$('#infoSearchTable').on('click', 'tr', function () {
    infoSearchTable.$('tr.selected').removeClass('selected');
    $(this).addClass('selected');
    selectedRow = infoSearchTable.row(this).data();
})

/*행 더블 클릭시 상세 화면*/
$('#infoSearchTable').on('dblclick', 'tr', function () {
    let param = {
        infoID: selectedRow.infoID,
        userID: 'admin',    //controller에서 로그인한 ID로 변경함
        companyID: ''
    }

    openForm('infoAddDetail', '/infoMgmt/infoAdd/update?mode=search', param, '');
})


/*로드 이벤트*/
$(document).ready(function() {formLoad();
                              window.scrollTo(0, 0); //스크롤 초기화(새로고침인 경우)
                              //toastr 옵션 처리
                              toastr.options = {
                                    closeButton: true,
                                    progressBar: true,
                                    showMethod: 'slideDown',
                                    timeOut: 2000,
                                    positionClass: "toast-top-center",
                              };
                             });

/*웹 상단 X표시로 닫을 경우 이벤트*/
window.addEventListener('beforeunload', function (event) {
                                                            navigator.sendBeacon("/pages/infoMgmt/infoSearch/infoSearch/close")
                                                         });

/*화면 로드 함수*/
function formLoad(){
    /*loginID 찾아서 화면 확인 후 버튼 확인*/
    loginIDAuthority();

    //조회가 가능할때만 조회되게
    if( document.getElementById('authorityDisplay').style.display !== 'none'){
        infoData();
    }
}

/*조회 함수*/
function search(){
    infoData();
}

/*데이터 조회*/
function infoData(){

    let param = {
        userID:'admin' //controller에서 로그인한 ID로 변경함
    }

    //전체 공지
    let text = '';
    //개별 공지
    let ptext = '';

    //전체 공지
    loading.visible();
    fetch("/infoMgmt/infoSearch/search/all", {
        method: "POST",
        body: JSON.stringify(param),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
                        if(!response.ok){
                            return response.json().then(errorData => {
                            throw new Error(`Error: ${errorData.userMessage}`)});
                        }
                        return response.json();
    })
    .then((data) => {
       infoSearchTable.clear().rows.add(data).draw();
    })
    .catch(error => {
            loading.invisible();
            console.error('Error occurred:', error.message);
            toastr.error(`${error.message}`);
    });
}

/*공지사항 첨부문서 테이블*/
const infoSearchTable = $('#infoSearchTable').DataTable({
    select: true,
    dom: '<"d-none"B><"mb-2 right"f>t<"mt-2 center"p>',
    language: {
        search: "통합 검색:",
        zeroRecords: "검색된 항목이 없습니다.",
        infoEmpty: "검색된 항목이 없습니다.",
        infoFiltered: "(전체 _MAX_개의 항목에서 검색)",
        select: {
             rows: "", // 선택된 행 메시지를 비웁니다
             style: "single" // 단일 선택 모드 설정
        },
    },
    paging: false, //페이지 사용 안 함
    searching: false, //검색 기능 사용 안 함
    ordering: false, //자동정렬 사용 안 함
    scrollY: true,
    columns: [
        {data: "rn", className:'center'} ,                /*순번*/
        {data: "infoID", className: 'center'},            /*공지번호*/
        {data: "allYNName", className: 'left'},           /*구분이름*/
        {data: "fromDate", className: 'center'},          /*시작일*/
        {data: "toDate", className: 'center'},            /*종료일*/
        {data: "infoTitle", className: 'left'},           /*공지사항제목*/
        {data: "attachFile", className:'center'},         /*첨부문서*/
        {data: "attachPath", className:'left'},           /*첨부문서경로*/
        {data: "createDate", className:'center'},         /*작성일자*/
        {data: "lastUpdateDate", className:'center'},       /*수정일자*/
    ],

    columnDefs:[{
            target : [7],
            visible : false,
            serchable : false
        }
    ]

});

/*more 버튼 클릭 시 이동*/
function moveInfo(){
    window.location.href = '/pages/infoMgmt/infoAdd/infoAdd';
}

/*loginID의 권한 조회*/
function loginIDAuthority(){
    let getMenuID = '';

    fetch("/infoMgmt/infoAdd/add/userCheck", {
        method: "POST",
        body: JSON.stringify(),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
                        if(!response.ok){
                            return response.json().then(errorData => {
                            throw new Error(`Error: ${errorData.userMessage}`)});
                        }
                        return response.json();
    })
    .then((data) => {
       if(data["menuList"].length > 0){
            for (let i = 0; i < data["menuList"].length; i++) {
                if(data["menuList"][i].menuID == menuID){
                    if(data["menuList"][i].searchYN == 'N'){
                            document.getElementById('btnSearch').style.display = 'none';
                            document.getElementById('btnMore').style.display = 'none';
                            document.getElementById('infoContent').style.display = 'none';
                    }

                    //엑셀
                    if(data["menuList"][i].printYN == 'N'){
                            document.getElementById('btnExcel').style.display = 'none';
                    }

                    getMenuID = menuID;
                }
            }

            if(getMenuID == ''){
                document.getElementById('authorityDisplay').style.display = 'none';
                alert("권한이 없습니다. \r\n 권한을 확인 해주세요.");
            }
       }
       else{
            document.getElementById('authorityDisplay').style.display = 'none';
            alert("권한이 없습니다. \r\n 권한을 확인 해주세요.");
       }

    })
    .catch(error => {
            loading.invisible();
            console.error('Error occurred:', error.message);
            toastr.error(`${error.message}`);
    });
}



