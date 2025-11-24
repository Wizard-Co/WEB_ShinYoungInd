package wizard.ShinYoungInd.order.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@NoArgsConstructor
@Getter
@Setter
public class Overview {

    //order
    private int Depth;
    private int Gbn;
    private String OrderID;
    private String CustomID;
    private String KCustom;
    private String CompanyID;
    private String BuyerID;
    private String InCustomID;
    private String OrderNo;
    private String PoNo;
    private String BuyerModelID;
    private String OrderForm;
    private String OrderClss;
    private String BrandClss;
    private String AcptDate;
    private String DvlyDate;
    private String DvlyPlace;
    private String WorkID;
    private BigDecimal ExchRate;
    private long OrderQty;
    private long RollQty;
    private long RollTotalLength;
    private String ColorCount;
    private String ColorCode;
    private String CylinderSize;
    private String UnitClss;
    private String UnitClssName;
    private long UnitPrice;
    private String UnitPriceClss;
    private String VAT_IND_YN;
    private String ModifyClss;
    private String ModifyRemark;
    private String CancelRemark;
    private String Remark;
    private String CloseClss;
    private String CloseDate;
    private String OrderFlag;
    private String OrderEnd;
    private String OrderSpec;
    private String ArticleGrpID;
    private String ProductAutoInspectYN;
    private String Sketch1FilePath;
    private String Sketch1FileName;

    //Ordercolor
    private int OrderSeq;
    private String ArticleID;
    private String Article;
    private String BuyerArticleNo;
    private long ColorQty;
    private String NewProductYN;
    private String PatternID;
    private String ColorID;
    private String NewYN;
    private String SetDate;
    private String Color;
    private String DesignChk;
    private long ProdQty;
    private String ProdDate;
    private long ReProdQty;
    private String ReProdDate;
    private String RGB;

    //OutWare
    private String OutWareID;
    private int OutSeq;
    private String LinkedOutwareID;
    private String OutwareReqID;
    private String OutClss;
    private String OutClssName;
    private String BuyerDirectYN;
    private String InsStuffINYN;
    private String OutCustomID;
    private String OutCustom;
    private String DvlyCustomID;
    private BigDecimal LossRate;
    private long LossQty;
    private long OutRoll;
    private long Roll;
    private long OutQty;
    private long OutRealQty;
    private long TotQty;
    private long TotalRoll;
    private long TotalQty;
    private long TotalAmount;
    private long BaseMonthRoll;
    private long BaseMonthQty;
    private long BaseMonthAmount;
    private long Add1MonthRoll;
    private long Add1MonthQty;
    private long Add1MonthAmount;
    private long Add2MonthRoll;
    private long Add2MonthQty;
    private long Add2MonthAmount;
    private BigDecimal CustomRate;
    private BigDecimal OutWeight;
    private BigDecimal OutRealWeight;
    private String OutDate;
    private String IODate;
    private String Vat_Ind_YN;
    private long Amount;
    private long VatAmount;
    private long OutPrice;
    private String ResultDate;
    private String OutTime;
    private String LoadTime;
    private String TranNo;
    private int TranSeq;
    private String OutType;
    private String OutSubType;
    private String Memo;
    private String FromLocID;
    private String TOLocID;
    private String MoveYN;
    private String ProdAutoStuffinYN;
    private String WorkJobID;

    //outwareSub
    private int OutSubSeq;
    private int RollSeq;
    private String LabelID;
    private String LabelGubun;
    private int LineSeq;
    private int LineSubSeq;
    private String LotNo;
    private String Gubun;
    private String DefectID;
    private long StuffQty;
    private BigDecimal Weight;
    private long nOutQty;
    private String StuffInID;
    private int StuffInsubSeq;
    private String CustomBoxID;
    private String BoxID;
    private String SubRemark;
    private long DefectQty;
    private long SampleQty;
    private String Spec;

}
