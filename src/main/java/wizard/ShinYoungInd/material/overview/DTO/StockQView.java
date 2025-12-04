package wizard.ShinYoungInd.material.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class StockQView {

    private int num;

    private String cls;
    private String articleID;
    private String article;

    private String locID;
    private String locName;

    private String initStockRoll;
    private String initStockQty;
    private String stuffRoll;
    private String stuffQty;
    private String outRoll;

    private String outQty;
    private String stockQty;
    private String unitClss;
    private String unitClssName;
    private String needstockQty;

    private String overQty;
    private String stockRate;

    private String fontRed;
    private String colorGreen;
    private String buyerArticleNo;



}
