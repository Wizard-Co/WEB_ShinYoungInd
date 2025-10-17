package wizard.ShinYoungInd.wizLog.log.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.naDaum.wizLog.log.dto
 * fileName         : Log
 * author           : sooJeong
 * date             : 2025-05-19
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-05-19         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class Log {
    private int logID;
    private String companyID;
    private String menuID;
    private String workFlag;
    private String workDate;
    private String workTime;
    private String userID;
    private String desktop;
    private String desktopIP;
    private String workLog;
    private String startDate;
    private String startTime;
    private String endDate;
    private String endTime;
    private String createUserID;
    private String lastUpdateUserID;

    private int lastLogID;
}
