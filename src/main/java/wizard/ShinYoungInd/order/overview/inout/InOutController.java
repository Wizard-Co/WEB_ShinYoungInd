package wizard.ShinYoungInd.order.overview.inout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@RequestMapping("/order/result/inout")
@Controller
@RequiredArgsConstructor
public class InOutController {

    private final InOutService service;

    @GetMapping("")
    public String dailyResult(){
        return "pages/order/overview/inout";
    }

    @PostMapping(value = "/period")
    @ResponseBody
    public List<Overview> getPeriodData(@RequestBody Map<String, Object> param) {
        return service.getPeriodData(param);
    }

    @PostMapping(value = "/daily")
    @ResponseBody
    public List<Overview> getDailyData(@RequestBody Map<String, Object> param) {
        return service.getDailyData(param);
    }

    @PostMapping(value = "/monthV")
    @ResponseBody
    public List<Overview> getMonthVData(@RequestBody Map<String, Object> param) {
        return service.getMonthVData(param);
    }

    @PostMapping(value = "/monthH")
    @ResponseBody
    public List<Overview> getMonthHData(@RequestBody Map<String, Object> param) {
        return service.getMonthHData(param);
    }
}
