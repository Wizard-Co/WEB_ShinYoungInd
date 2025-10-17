package wizard.ShinYoungInd.mc.runningRate.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate.DTO
 * fileName         : NoWork
 * author           : sooJeong
 * date             : 2025-06-17
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-17         sooJeong             최초 생성
 */
@Getter
@Setter
@NoArgsConstructor
public class NoWork {
    private String mcName;
    private String machineNo;
    private String lastInspectDate;
    private int inspectCount;
    private String defectContents;
}
