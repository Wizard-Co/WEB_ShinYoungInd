package wizard.ShinYoungInd.material.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class LotStockQView {
    private int num;

    private String gubun;

    private String cls;
    private String articleID;
    private String article;
    private String lotID;
    private String ioDate;
    private String ioDate_CV;

    private String stuffRoll;
    private String stuffQty;
    private String unitClss;
    private String unitClssName;
    private String outRoll;

    private String outQty;
    private String stockQty;
    private String buyerArticleNo;
    private String remark;

    private boolean lotColor;
    private boolean articleColor;
    private boolean totalColor;



}
