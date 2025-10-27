package wizard.ShinYoungInd.product.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.product.allSearch.DTO
 * fileName         : Overview
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class Overview {
    private int cls;
    private String workDate;
    private String processID;
    private String process;

    private String orderID;
    private String orderNo;
    private String orderDate;
    private String orderQty;

    private String machineID;
    private String machineNo;
    private String machine;

    private String instDate;
    private long instQty;

    private long workQty;
    private long ctrlQty;
    private String defect;
    private long defectQty;
    private double defectRate;

    private String workerID;
    private String worker;
    private String modelID;
    private String model;
    private String customID;
    private String custom;

    private String articleID;
    private String article;
    private String buyerArticleNo;

    private String labelID;
    private long jobID;
    private String jobTypeID;
    private String jobType;
    private String workStartDate;
    private String workStartTime;
    private String workEndDate;
    private String workEndTime;
    private String workTime;
    private String workHour;
    private String workMinute;
    private String scanDate;
    private String scanTime;

    private String noWorkTypeID;
    private String noWorkType;
    private String dayOrNightID;
    private String cycleTime;
    private long workCnt;

    private int qtyPerBox;
    private double unitPrice;
    private double amount;

    // 신영 추가
    private String unlavelDir;
    private String printThod;
    private double needleSize;
    private double needleDia;
    private int needleQty;
    private String colorCount;
    private String colorCode;
    private String cylinderSize;
    private String remark;
    private String spec;
    private String startSaveLabelID;


}
