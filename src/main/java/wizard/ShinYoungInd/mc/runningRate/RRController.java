package wizard.ShinYoungInd.mc.runningRate;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.mc.runningRate.DTO.Machine;
import wizard.ShinYoungInd.mc.runningRate.DTO.NoWork;
import wizard.ShinYoungInd.mc.runningRate.DTO.RunningRate;
import wizard.ShinYoungInd.mc.runningRate.DTO.Work;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.runningRate
 * fileName         : RRController
 * author           : sooJeong
 * date             : 2025-06-17
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-17         sooJeong             최초 생성
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/mc/runningrate")
public class RRController {

    private final RRService service;

    @GetMapping("")
    public String home(){
        return "pages/mc/overview/runningRate/mc-running-rate";
    }

    @PostMapping("/search")
    @ResponseBody
    public List<RunningRate> getRunningRate(@RequestBody Map<String, Object> params){
        return service.getRunningRate(params);
    }

    @GetMapping("/detail")
    public String detailHome(){
        return "pages/mc/overview/runningRate/mc-running-rate-detail";
    }

    @PostMapping("/detail/search/work")
    @ResponseBody
    public List<Work> getWork(@RequestBody Map<String, Object> params){
        return service.getWork(params);
    }

    @PostMapping("/detail/search/machine")
    @ResponseBody
    public List<Machine> getMachine(@RequestBody Map<String, Object> params){
        return service.getMachine(params);
    }

    @PostMapping("/detail/search/nowork")
    @ResponseBody
    public List<NoWork> getNoWork(@RequestBody Map<String, Object> params){
        return service.getNoWork(params);
    }
}
