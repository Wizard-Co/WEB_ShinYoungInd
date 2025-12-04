package wizard.ShinYoungInd.material.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class OutwareView {

    private String outwareiD;
    private String orderID;
    private String orderNo;
    private String customID;
    private String kCustom;

    private String outDate;
    private String article;
    private String buyerArticleNo;
    private String articleID;
    private String sabun;


    private String outCustom;
    private String orderQty;
    private String unitClss;

    private String unitClssName;
    private String fromLocName;
    private String toLocname;
    private String outClssname;
    private String labelID;

    private String labelGubun;
    private String outRoll;
    private String outQty;
    private String unitPrice;
    private String workName;

    // N : 정상, S : 샘플, D : 불량
    private String nQty;
    private String sQty;
    private String dQty;

    private String vatAmount;
    private String amount;
    private String totAmount;
    private String remark;
    private String depth;


    //순번 체크용/
    private int num;

    //컬러 칠하기
    private String colorGreen;
    private String colorRed;
    private String colorOrder;


}
