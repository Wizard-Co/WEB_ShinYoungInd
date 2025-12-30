package wizard.ShinYoungInd.product.overview.lotDetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.mc.machine.Machine;
import wizard.ShinYoungInd.mc.machine.MachineService;
import wizard.ShinYoungInd.product.overview.DTO.Overview;
import wizard.ShinYoungInd.product.process.Process;
import wizard.ShinYoungInd.product.process.ProcessService;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.lotDetail
 * fileName         : LotController
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@RequestMapping("/product/result/lot")
@Controller
@RequiredArgsConstructor
public class LotController {
    private final LotService service;
    private final ProcessService processService;
    private final MachineService machineService;

    @ModelAttribute
    public void setting(Model model) {

        List<Process> cboProcess = processService.getProcessSub(Map.of(
                        "processID", "",
                        "chkArticleGrpID", 0,
                        "articleGrpID", "",
                        "useClss", "")
                                                               );
        model.addAttribute("cboProcess", cboProcess);

        List<Machine> cboMachine = machineService.getMachine("");
        model.addAttribute("cboMachine", cboMachine);

    }

    @GetMapping("")
    public String home(){
        return "pages/product/overview/lot-detail";
    }

    @PostMapping("/search/label")
    @ResponseBody
    public List<Overview> getLabelList(@RequestBody Map<String, Object> params){
        return service.getLabelList(params);
    }

    @PostMapping("/search/work")
    @ResponseBody
    public List<Map<String, Object>> getWorkList(@RequestBody Map<String, Object> params){
        return service.getWorkList(params);
    }

    @PostMapping("/search/child")
    @ResponseBody
    public List<Map<String, Object>> getChildList(@RequestBody Map<String, Object> params){
        return service.getChildList(params);
    }

    @PostMapping("/search/label/detail")
    @ResponseBody
    public Map<String, Object> getLabelDetail(@RequestBody Map<String, Object> params){
        return service.getLabelDetail(params);
    }
}
