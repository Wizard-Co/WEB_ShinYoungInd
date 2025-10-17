/**
 작성자:    김수정
 작성일:    2025-02-17
 내용: 동적 dataTable 만드는데 필요한 데이터
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/
export const cols = {
    process: {
        num: {title: "순번", className: "center comma", width: "5%", orderable: true},
        process: {title: "공정", className: "center", width: "10%", orderable: true},
        machineNo: {title: "호기", className: "center", width: "10%"},
        model: {title: "모델", className: "center", width: "10%"},
        buyerArticleNo: {title: "품번", className: "left", width: "20%"},
        article: {title: "품명", className: "left", width: "20%"},
        custom: {title: "거래처", className: "left", width: "15%"},
        workQty: {title: "생산량", className: "right comma", width: "10%"},
        workTime: {title: "작업시간", className: "right comma", width: "10%"},
        qtyPerBox: {title: "박스당 장입량", className: "right comma", width: "10%"}
    },
    article: {
        num: {title: "순번", className: "center comma", width: "5%", orderable: true},
        buyerArticleNo: {title: "품번", className: "left", width: "20%", orderable: true},
        article: {title: "품명", className: "left", width: "20%", orderable: true},
        custom: {title: "거래처", className: "left", width: "20%"},
        model: {title: "모델", className: "center", width: "20%"},
        workQty: {title: "생산량", className: "right comma", width: "10%"},
        qtyPerBox: {title: "박스당 장입량", className: "right comma", width: "10%"}
    },
    worker: {
        num: {title: "순번", className: "center comma", width: "5%", orderable: true},
        worker: {title: "작업자", className: "center", width: "10%", orderable: true},
        process: {title: "공정", className: "center", width: "10%"},
        machineNo: {title: "호기", className: "center", width: "10%"},
        model: {title: "모델", className: "center", width: "10%"},
        buyerArticleNo: {title: "품번", className: "left", width: "20%"},
        article: {title: "품명", className: "left", width: "20%"},
        custom: {title: "거래처", className: "left", width: "10%"},
        workQty: {title: "생산량", className: "right comma", width: "10%"},
        qtyPerBox: {title: "박스당 장입량", className: "right comma", width: "10%"}
    },
    daily: {
        num: {title: "순번", className: "center comma", width: "3%", orderable: true},
        buyerArticleNo: {title: "품번", className: "left", width: "10%", orderable: true},
        article: {title: "품명", className: "left", width: "10%", orderable: true},
        totalQty: {title: "생산량", className: "right comma", width: "8%"},
        day01: {title: "1일", className: "right comma", width: "5%"},
        day02: {title: "2일", className: "right comma", width: "5%"},
        day03: {title: "3일", className: "right comma", width: "5%"},
        day04: {title: "4일", className: "right comma", width: "5%"},
        day05: {title: "5일", className: "right comma", width: "5%"},
        day06: {title: "6일", className: "right comma", width: "5%"},
        day07: {title: "7일", className: "right comma", width: "5%"},
        day08: {title: "8일", className: "right comma", width: "5%"},
        day09: {title: "9일", className: "right comma", width: "5%"},
        day10: {title: "10일", className: "right comma", width: "5%"},
        day11: {title: "11일", className: "right comma", width: "5%"},
        day12: {title: "12일", className: "right comma", width: "5%"},
        day13: {title: "13일", className: "right comma", width: "5%"},
        day14: {title: "14일", className: "right comma", width: "5%"},
        day15: {title: "15일", className: "right comma", width: "5%"},
        day16: {title: "16일", className: "right comma", width: "5%"},
        day17: {title: "17일", className: "right comma", width: "5%"},
        day18: {title: "18일", className: "right comma", width: "5%"},
        day19: {title: "19일", className: "right comma", width: "5%"},
        day20: {title: "20일", className: "right comma", width: "5%"},
        day21: {title: "21일", className: "right comma", width: "5%"},
        day22: {title: "22일", className: "right comma", width: "5%"},
        day23: {title: "23일", className: "right comma", width: "5%"},
        day24: {title: "24일", className: "right comma", width: "5%"},
        day25: {title: "25일", className: "right comma", width: "5%"},
        day26: {title: "26일", className: "right comma", width: "5%"},
        day27: {title: "27일", className: "right comma", width: "5%"},
        day28: {title: "28일", className: "right comma", width: "5%"},
        day29: {title: "29일", className: "right comma", width: "5%"},
        day30: {title: "30일", className: "right comma", width: "5%"},
        day31: {title: "31일", className: "right comma", width: "5%"}
    }
};
