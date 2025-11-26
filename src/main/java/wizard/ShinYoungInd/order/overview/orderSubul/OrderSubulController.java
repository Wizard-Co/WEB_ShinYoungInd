package wizard.ShinYoungInd.order.overview.orderSubul;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/order/result/orderSubul")
public class OrderSubulController {

    private final OrderSubulService service;
    private final CMService cmService;

    @ModelAttribute
    public void getCboOrderStock(Model model){
        List<CMCode> cboSuppleType = cmService.getCmCode("CMMASPLTYPE"); //공급유형
        List<CMCode> cboLocID = cmService.getCmCode("LOC"); //공급유형

        model.addAttribute("cboSuppleType", cboSuppleType);
        model.addAttribute("cboLocID", cboLocID);
    }

    @GetMapping("")
    public String goPage(){
        return "pages/order/overview/orderSubul";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> search(@RequestBody Map<String, Object> param) {
        return service.getOrderSubulData(param);
    }

}
