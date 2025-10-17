package wizard.ShinYoungInd.mc.workLog;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.mc.workLog.DTO.WorkLog;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.WorkLog
 * fileName         : WorkLogMapper
 * author           : sooJeong
 * date             : 2025-08-01
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-08-01         sooJeong             최초 생성
 */
@Mapper
public interface WorkLogMapper {
    List<WorkLog> getWorkLog(Map<String, Object> params);
}
