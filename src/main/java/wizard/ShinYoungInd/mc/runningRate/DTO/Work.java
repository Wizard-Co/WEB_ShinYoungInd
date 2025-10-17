package wizard.ShinYoungInd.mc.runningRate.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate.DTO
 * fileName         : Work
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
public class Work {
    private String workDate;
    private String articleID;
    private String article;
    private String workPersonID;
    private String workPerson;
    private int eduCount;
    private String license;
    private int licenseCount;
    private String startDate;
}
