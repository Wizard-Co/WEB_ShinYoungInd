package wizard.ShinYoungInd.qul.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class Overview {

 //생산 불량 일보 조회
 private int Gbn;
 private String ScanDate;
 private String ExamDate;
 private String ProcessID;
 private String Process;
 private String BuyerModelID;
 private String ArticleID;
 private String Article;
 private String BuyerArticleNo;
 private String DefectID;
 private String KDefect;
 private String KCustom;
 private String OrderID;
 private String OrderNo;
 private String Model;
 private String InBoxID;
 private String LabelID;
 private long OrderQty;
 private long RealQty;
 private long CtrlQty;
 private long DefectQty;
 private double DefectRate;
 private String UnitClssName;
 private String Name;
 private String WorkPersonID;
 private String WorkPersonName;
 private long WorkQty;
 private String MCNAME;
 private String SortOrder;

 //제품군별품질화면
 private double M1;
 private double M2;
 private double M3;
 private double M4;
 private double M5;
 private double M6;
 private double M7;
 private double M8;
 private double M9;
 private double M10;
 private double M11;
 private double M12;
 private double M13;
 private long seq;

 private String GroupingName;

}
