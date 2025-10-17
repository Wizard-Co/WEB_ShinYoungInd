package wizard.ShinYoungInd.KPI.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.KPI.DTO
 * fileName         : Defect
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
public class Defect {
    private String yyyyMM;
    private String workDate;
    private int defectQty;
    private long defectWorkQty;
    private double defectRate;
    private double defectUpRate;
    private double defectGoalRate;

    private int sort;
}
