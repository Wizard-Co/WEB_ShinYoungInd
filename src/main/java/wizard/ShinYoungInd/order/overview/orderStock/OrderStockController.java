package wizard.ShinYoungInd.order.overview.orderStock;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import org.springframework.ui.Model;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/order/result/orderStock")
public class OrderStockController {

    private final OrderStockService service;
    private final CMService cmService;

    @ModelAttribute
    public void getCboOrderStock(Model model){
        List<CMCode> cboSuppleType = cmService.getCmCode("CMMASPLTYPE"); //공급유형
        List<CMCode> cboLocID = cmService.getCmCode("LOC"); //공급유형

        model.addAttribute("cboSuppleType", cboSuppleType);
        model.addAttribute("cboLocID", cboLocID);
    }


    @GetMapping("")
    public String dailyResult(){
        return "pages/order/overview/orderStock";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> getOrderStockData(@RequestBody Map<String, Object> param) {
//        return service.getOrderStockData(param);
        List<Overview> result = service.getOrderStockData(param);  // ← 여기 중단점
        return result;
    }
}
