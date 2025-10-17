package wizard.ShinYoungInd.mc.runningRate;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.mc.runningRate.DTO.Machine;
import wizard.ShinYoungInd.mc.runningRate.DTO.NoWork;
import wizard.ShinYoungInd.mc.runningRate.DTO.RunningRate;
import wizard.ShinYoungInd.mc.runningRate.DTO.Work;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate
 * fileName         : RRService
 * author           : sooJeong
 * date             : 2025-06-17
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-17         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class RRService {
    private final RRMapper mapper;
    List<RunningRate> getRunningRate(Map<String, Object> params){
        return mapper.getRunningRate(params);
    }
    List<Work> getWork(Map<String, Object> params){
        return mapper.getWork(params);
    }
    List<Machine> getMachine(Map<String, Object> params){
        return mapper.getMachine(params);
    }
    List<NoWork> getNoWork(Map<String, Object> params){
        return mapper.getNoWork(params);
    }
}
