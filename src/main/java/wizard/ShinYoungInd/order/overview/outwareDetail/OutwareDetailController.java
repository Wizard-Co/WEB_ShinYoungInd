package wizard.ShinYoungInd.order.overview.outwareDetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@RequestMapping("/order/result/outwareDetail")
@Controller
@RequiredArgsConstructor
public class OutwareDetailController {

    private final OutwareDetailService service;

    @GetMapping("")
    public String goPage(){
        return "pages/order/overview/outwareDetail";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> search(@RequestBody Map<String, Object> param) {
        return service.getOutwareResult(param);
    }
}
