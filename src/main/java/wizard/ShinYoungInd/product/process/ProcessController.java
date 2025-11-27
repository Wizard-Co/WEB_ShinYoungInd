package wizard.ShinYoungInd.product.process;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.pre.baseMgmt.product
 * fileName         : ProcessController
 * author           : sooJeong
 * date             : 2024-12-06
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-12-06         sooJeong             최초 생성
 */
@RequestMapping("/product/process")
@AllArgsConstructor
@Controller
public class ProcessController {

    private ProcessService service;
    private CMService cmService;

    @ModelAttribute
    public void setting(Model model) {
        List<CMCode> cboArticleType = cmService.getCmCode("ArticleType");
        Map<String, Object> param = Map.of(
                "process", "",
                "articleTypeID", "",
                "useYN", "");
        List<Process> cboProcess = service.getProcess(param);

        model.addAttribute("process", new Process());
        model.addAttribute("cboArticleType", cboArticleType);
        model.addAttribute("cboProcess", cboProcess);
    }

    @GetMapping("")
    public String home() {
        return "pages/product/process-code";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Process> search(@RequestBody Map<String, Object> param) {
        List<Process> data = service.getProcess(param);
        return data;
    }

    @GetMapping("/detail")
    @ResponseBody
    public List<Process> searchSub(@RequestParam Map<String, Object> param) {
        List<Process> data = service.getProcessSub(param);
        return data;
    }

    @PostMapping("/add")
    @ResponseBody
    public void save(@ModelAttribute Process process) {
        try {
            service.saveProcess(process);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute Process process) {
        try {
            service.updateProcess(process);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/delete")
    @ResponseBody
    public void delete(@RequestBody String processID) {
        try {
            service.deleteProcess(processID);
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }
}
