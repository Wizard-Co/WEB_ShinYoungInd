package wizard.ShinYoungInd.mc.workLog.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.mc.WorkLog.DTO
 * fileName         : WorkLog
 * author           : sooJeong
 * date             : 2025-08-01
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-08-01         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class WorkLog {
    private String workDate;
    private String workTime;
    private String process;
    private String machineNo;

    private int workQty;
    private int totalWorkQty;
    private int defectQty;
}
