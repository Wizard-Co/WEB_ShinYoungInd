package wizard.ShinYoungInd.KPI.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.Production
 * fileName         : Production
 * author           : sooJeong
 * date             : 2025-06-09
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-09         sooJeong             최초 생성
 */
@Getter
@Setter
@NoArgsConstructor
public class Production {
    private String yyyyMM;
    private String buyerArticleNo;
    private String article;
    private String workDate;
    private int workQty;
    private double workTime;
    private double workQtyPerHour;
    private double workUpRate;
    private double workGoalRate;

    private int sort;

}
