package wizard.ShinYoungInd.qul.overview.xbar;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.qul.overview.DTO.CombinedDTO;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qul/result/xbar")
public class XbarController {

    private final XbarService service;
    private final CMService cmService;

    @ModelAttribute
    public void getCboOrderStock(Model model){
        List<CMCode> cboOccurStep = cmService.getCmCode("QULSTEP").stream()
                .filter(code -> !"2".equals(code.getCode_ID()) && !"0".equals(code.getCode_ID()))
                .collect(Collectors.toList());
        model.addAttribute("cboOccurStep", cboOccurStep);

    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> search(@RequestBody Map<String, Object> param) {

        List<Overview> data = service.getXbarData(param);
        return data;
        //return service.getOutwareResult(param);
    }

    @PostMapping(value = "/search/detail")
    @ResponseBody
    public CombinedDTO searchDetail(@RequestBody Map<String, Object> param) {

        CombinedDTO data = service.getSubData(param);
        return data;
        //return service.getOutwareResult(param);
    }

    @GetMapping("")
    public String goPage(){
        return "pages/qul/overview/xbar";
    }
}
