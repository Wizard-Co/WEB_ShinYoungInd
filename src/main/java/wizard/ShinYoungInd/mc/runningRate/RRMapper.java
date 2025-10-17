package wizard.ShinYoungInd.mc.runningRate;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.mc.runningRate.DTO.Machine;
import wizard.ShinYoungInd.mc.runningRate.DTO.NoWork;
import wizard.ShinYoungInd.mc.runningRate.DTO.RunningRate;
import wizard.ShinYoungInd.mc.runningRate.DTO.Work;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate
 * fileName         : RRMapper
 * author           : sooJeong
 * date             : 2025-06-17
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-17         sooJeong             최초 생성
 */
@Mapper
public interface RRMapper {
    List<RunningRate> getRunningRate(Map<String, Object> params);
    List<Work> getWork(Map<String, Object> params);
    List<Machine> getMachine(Map<String, Object> params);
    List<NoWork> getNoWork(Map<String, Object> params);
}
