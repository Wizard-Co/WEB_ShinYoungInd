export const cols = {
    period: {
        num: {title: "순번", className: "center", width: "3%"},
        gbn: {title: "구분", className: "center", width: "3%"},
        kcustom: {title: "거래처", className: "left", width: "5%"},
        buyerArticleNo: {title: "품번", className: "center", width: "5%%"},
        article: {title: "품명", className: "center", width: "10%"},
        roll: {title: "건수", className: "right comma", width: "10%"},
        totQty: {title: "수량", className: "right comma", width: "10%"},
        unitClssName: {title: "단위" , className: "center", width: "10%"},
        customRate :{title:"점유율", className: "right decimal", width:"10%"}
    },
    daily: {
        num: {title: "순번", className: "center comma", width: "3%"},
        iodate: {title: "일자", className: "center", width: "5%"},
        gbn: {title: "구분", className: "center", width: "3%"},
        kcustom: {title: "거래처", className: "left", width: "5%"},
        buyerArticleNo: {title: "품번", className: "center", width: "5%"},
        article: {title: "품명", className: "center", width: "10%"},
        roll: {title: "건수", className: "right comma", width: "10%"},
        totQty: {title: "수량", className: "right comma", width: "10%"},
        amount : {title:"금액",className:"right comma", width: "10%"},
        vatAmount : {title:"금액",className:"right comma", width: "10%"},
        unitClssName: {title: "단위" , className: "center", width: "10%"},
        customRate :{title:"점유율", className: "right decimal", width:"10%"}
    },
    monthV: {
        num: {title: "순번", className: "center comma", width: "3%"},
        iodate: {title: "일자", className: "center", width: "3%"},
        gbn: {title: "구분", className: "center", width: "3%"},
        kcustom: {title: "거래처", className: "left", width: "5%"},
        buyerArticleNo: {title: "품번", className: "center", width: "10%"},
        article: {title: "품명", className: "center", width: "10%"},
        roll: {title: "건수", className: "right comma", width: "10%"},
        totQty: {title: "수량", className: "right comma", width: "10%"},
        unitClssName: {title: "단위" , className: "center", width: "10%"},
        customRate :{title:"점유율", className: "right decimal", width:"10%"}
    },
    monthH: {
        num: {className: "center comma", width: "3%"},  // title 제거
        gbn: {className: "center", width: "3%"},
        kcustom: {className: "left", width: "5%"},
        buyerArticleNo: {className: "center", width: "10%"},
        article: {className: "center", width: "10%"},
        unitClssName: {className: "center", width: "3%"},
        totalRoll: {className: "right comma", },
        totalQty: {className: "right comma", },
        baseMonthRoll: {className: "right comma", },
        baseMonthQty: {className: "right comma", },
        add1MonthRoll: {className: "right comma",},
        add1MonthQty: {className: "right comma", },
        add2MonthRoll: {className: "right comma",},
        add2MonthQty: {className: "right comma", }
    },
    total: {
        label: {title: "출고건수", className: "left", width: "40%"},
        count: {title: "출고수량", className: "right comma", width: "30%"},
    },
    totalMonthH: {
        totalRoll: {className: "left"},
        totalQty: {className: "right comma"},
        baseMonthRoll: {className: "left"},
        baseMonthQty: {className: "right comma"},
        add1MonthRoll: {className: "left"},
        add1MonthQty: {className: "right comma"},
        add2MonthRoll: {className: "left"},
        add2MonthQty: {className: "right comma"},
    }
};

export const multiHeaders = {
    monthH: {
        row1: [
            {title: "순번", rowspan: 2},
            {title: "구분", rowspan: 2},
            {title: "거래처", rowspan: 2},
            {title: "품번", rowspan: 2},
            {title: "품명", rowspan: 2},
            {title: "단위", rowspan: 2},
            {title: "합계", colspan: 2, width: "16%"},
            {title: "기준월", colspan: 2, width: "16%"},
            {title: "기준+1월", colspan: 2, width: "16%"},
            {title: "기준+2월", colspan: 2, width: "16%"}  // ← 추가!
        ],
        row2: [
            {title: "건수"},
            {title: "수량"},
            {title: "건수"},
            {title: "수량"},
            {title: "건수"},
            {title: "수량"},
            {title: "건수"},  // ← 기준+2월
            {title: "수량"}   // ← 기준+2월
        ]
    }
    ,totalMonthH:{
        row:[
            {title: "합계" , colSpan:2},
            {title: "기준월" , colSpan:2},
            {title: "기준+1월" , colSpan:2},
            {title: "기준+2월" , colSpan:2},
        ],
        row2:[
            {title: "건수"},
            {title: "수량"},
            {title: "건수"},
            {title: "수량"},
            {title: "건수"},
            {title: "수량"},
            {title: "건수"},
            {title: "수량"},
        ]
    }
};
