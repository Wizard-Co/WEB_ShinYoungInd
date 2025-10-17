package wizard.ShinYoungInd.product.work;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.product.planInput.DTO
 * fileName         : Work
 * author           : sooJeong
 * date             : 2025-05-26
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-05-26         sooJeong             최초 생성
 */
@Getter
@Setter
@NoArgsConstructor
public class Work {

    private String workID;
    private String articleID;
    private String article;
    private String buyerArticleNo;
    private int workQty;
    private String workDate;
    private String startTime;
    private String endTime;
    private String remark;
    private String defectID;
    private int defectQty;
    private String workPersonID;
    private String workPerson;
    private String processID;
    private String process;
    private String machineID;
    private String machine;

}
