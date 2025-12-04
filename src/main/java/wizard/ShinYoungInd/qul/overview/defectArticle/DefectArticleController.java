package wizard.ShinYoungInd.qul.overview.defectArticle;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMMapper;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.qul.overview.DTO.CombinedDTO;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qul/result/defectArticle")
public class DefectArticleController {

    private final DefectArticleService service;
    private final CMService cmService;

    @ModelAttribute
    public void getCboOrderStock(Model model){
        List<CMCode> cboProductGrpID = cmService.getCmCode("CMPRDGRPID"); //제품그룹
        List<CMCode> cboOccurStep = cmService.getCmCode("QULSTEP"); //발생단계

        model.addAttribute("cboProductGrpID", cboProductGrpID);
        model.addAttribute("cboOccurStep", cboOccurStep);

    }

    @PostMapping(value = "/search")
    @ResponseBody
    public CombinedDTO search(@RequestBody Map<String, Object> param) {
        CombinedDTO result = service.getAllData(param);
        return result;
    }

    @GetMapping("")
    public String goPage(){
        return "pages/qul/overview/defectArticle";
    }
}
