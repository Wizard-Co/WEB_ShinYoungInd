package wizard.ShinYoungInd.mc.runningRate.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate.DTO
 * fileName         : Machine
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
public class Machine {
    private String mcID;
    private String mcName;
    private String machineID;
    private String machineNo;
    private String lastInspectDate;
    private String inspectCount;
    private String defectContents;
    private String noWorkDate;
}
