package wizard.ShinYoungInd.KPI;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.KPI.DTO.Defect;
import wizard.ShinYoungInd.KPI.DTO.Production;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.Production
 * fileName         : KPIController
 * author           : sooJeong
 * date             : 2025-06-09
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-09         sooJeong             최초 생성
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/kpi")
public class KPIController {

    private final KPIService service;

    @GetMapping("")
    public String home(){
        return "pages/kpi";
    }

    @PostMapping(value = "/prod")
    @ResponseBody
    public List<Production> getProd(@RequestBody Map<String, Object> param) {
        return service.getProduction(param);
    }

    @PostMapping(value = "/defect")
    @ResponseBody
    public List<Defect> getDefect(@RequestBody Map<String, Object> param) {
        return service.getDefect(param);
    }
}
