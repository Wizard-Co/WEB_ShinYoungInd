package wizard.ShinYoungInd.mc.runningRate.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate.DTO
 * fileName         : RunningRate
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
public class RunningRate {
    private String machineID;
    private String machineNo;
    private String processID;
    private String process;
    private String mcID;
    private String mcName;

    private double ct;
    private int dayCount;
    private int dayBaseHour;
    private double dayWorkHour;
    private double dayNonWorkHour;
    private double dayWorkRate;
    private int dayWorkQty;
    private int dayGoalQty;
    private int monthCount;
    private int monthBaseHour;
    private double monthWorkHour;
    private double monthNonWorkHour;
    private double monthWorkRate;
    private int monthWorkQty;
    private int monthGoalQty;
}
