package wizard.ShinYoungInd.product.overview.dailyView;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.dailyView
 * fileName         : DailyController
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@RequestMapping("/product/result/daily")
@Controller
@RequiredArgsConstructor
public class DailyController {

    private final DailyService service;

    @GetMapping("")
    public String dailyResult(){
         return "pages/product/overview/daily-result";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> getDailyResult(@RequestBody Map<String, Object> param) {
        return service.getDailyResult(param);
    }

    @PostMapping(value = "/search/defect")
    @ResponseBody
    public List<Overview> getDefect(@RequestBody String jobID) {
        return service.getDefect(jobID);
    }

    // 신영 천공
    @GetMapping("/drilling")
    public String drillingResult(){
        return "pages/product/overview/drilling-result";
    }

    @PostMapping(value = "/drilling/search")
    @ResponseBody
    public List<Overview> getDrillingResult(@RequestBody Map<String, Object> param) {
        return service.getDrillingResult(param);
    }

}
