package wizard.ShinYoungInd.product.planInput.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.product.planInput
 * fileName         : PlanDet
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
public class PlanDet {

    public String instID;
    public String instDetSeq;
    public String procSeq;
    public String articleID;
    public String article;
    public String processID;
    public String process;
    public String lotID;
    public String needWidth;
    public String instRemark;
    public String labelPrintQty;
    public String instQty;
    public String remark;
    public String state;
    public String startDate;
    public String endDate;
    public String machineID;
    public String machine;
    public String mtrExceptYN;
    public String firstInFirstOutYN;

    public String createDate;
    public String createUserID;
    public String lastUpdateDate;
    public String lastUpdateUserID;
}
