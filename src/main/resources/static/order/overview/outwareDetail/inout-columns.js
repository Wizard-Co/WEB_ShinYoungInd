export const cols = {
    period: {
        num: {title: "순번", className: "center"},
        gbn: {title: "구분", className: "center"},
        kcustom: {title: "거래처", className: "left"},
        buyerArticleNo: {title: "품번", className: "center",},
        article: {title: "품명", className: "center",  },
        roll: {title: "건수", className: "right comma",  },
        totQty: {title: "수량", className: "right comma",  },
        unitClssName: {title: "단위" , className: "center",  },
        customRate :{title:"점유율", className: "right decimal", }
    },
    daily: {
        num: {title: "순번", className: "center comma",  },
        iodate: {title: "일자", className: "center",},
        gbn: {title: "구분", className: "center",  },
        kcustom: {title: "거래처", className: "left",},
        buyerArticleNo: {title: "품번", className: "center",},
        article: {title: "품명", className: "center",  },
        roll: {title: "건수", className: "right comma",  },
        totQty: {title: "수량", className: "right comma",  },
        amount : {title:"금액",className:"right comma",  },
        vatAmount : {title:"금액",className:"right comma",  },
        unitClssName: {title: "단위" , className: "center",  },
        customRate :{title:"점유율", className: "right decimal", }
    },
    monthV: {
        num: {title: "순번", className: "center comma",  },
        iodate: {title: "일자", className: "center",  },
        gbn: {title: "구분", className: "center",  },
        kcustom: {title: "거래처", className: "left",},
        buyerArticleNo: {title: "품번", className: "center",  },
        article: {title: "품명", className: "center",  },
        roll: {title: "건수", className: "right comma",  },
        totQty: {title: "수량", className: "right comma",  },
        unitClssName: {title: "단위" , className: "center",  },
        customRate :{title:"점유율", className: "right decimal", }
    },
    monthH: {
        num: {className: "center comma",  },  // title 제거
        gbn: {className: "center",  },
        kcustom: {className: "left",},
        buyerArticleNo: {className: "center",  },
        article: {className: "center",  },
        unitClssName: {className: "center",  },
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
        label: {title: "출고건수", className: "left", },
        count: {title: "출고수량", className: "right comma",},
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
            {title: "합계", colspan: 2,  },
            {title: "기준월", colspan: 2,  },
            {title: "기준+1월", colspan: 2,  },
            {title: "기준+2월", colspan: 2,  }  // ← 추가!
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
