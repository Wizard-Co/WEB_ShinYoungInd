package wizard.ShinYoungInd.qul.overview.dateProd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qul/result/dateProd")
public class DateProdController {

    private final DateProdService service;
    private final CMService cmService;

    @ModelAttribute
    public void getCboOrderStock(Model model){
        List<CMCode> cboProcessID = service.getWorkProcess(0,""); //공정
        CMCode defalutOption = new CMCode();
        defalutOption.setCode_ID("");
        defalutOption.setCode_Name("전체");
        cboProcessID.add(0, defalutOption);

        List<CMCode> cboMachineID = service.getMachineList(""); //호기

        model.addAttribute("cboProcessID", cboProcessID);
        model.addAttribute("cboMachineID", cboMachineID);
    }



    @GetMapping("/getMachineList")
    @ResponseBody  // JSON 응답
    public List<CMCode> getMachineList(@RequestParam(defaultValue = "") String processID) {
        return service.getMachineList(processID);
    }

    @GetMapping("")
    public String goPage(){
        return "pages/qul/overview/dateProd";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> search(@RequestBody Map<String, Object> param) {

        List<Overview> data = service.getDateProdData(param);
        return data;
        //return service.getOutwareResult(param);
    }
}
