package wizard.ShinYoungInd.mc.repair.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.mc.repair.DTO
 * fileName         : Repair
 * author           : sooJeong
 * date             : 2025-07-30
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-07-30         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class Repair {
    private int cls;
    private String repairID;
    private String repairDate;
    private String repairType;
    private String repairPrice;
    private String customID;
    private String custom;
    private String mcID;
    private String mcName;
    private String remark;

    private String mcPartID;
    private String mcPart;
    private String repairRemark;
    private String partRemark;

    private int partQty;
    private int partPrice;
    private String reason;
}
