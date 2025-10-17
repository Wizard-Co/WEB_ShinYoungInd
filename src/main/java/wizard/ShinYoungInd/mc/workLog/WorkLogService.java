package wizard.ShinYoungInd.mc.workLog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.mc.workLog.DTO.WorkLog;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.WorkLog
 * fileName         : WorkLogService
 * author           : sooJeong
 * date             : 2025-08-01
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-08-01         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class WorkLogService {
    private final WorkLogMapper mapper;

    List<WorkLog> getWorkLog(Map<String, Object> params) {
        return mapper.getWorkLog(params);
    }
}
