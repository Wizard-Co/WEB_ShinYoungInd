package wizard.ShinYoungInd.product.overview.dailyView;

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
