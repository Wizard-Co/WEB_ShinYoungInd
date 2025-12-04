package wizard.ShinYoungInd.material.overview.lotSubul_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.material.overview.DTO.LotSubulQView;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/material/result/lotSubulQ")
@RequiredArgsConstructor
public class LotSubulQController {
    private final LotSubulQService service;
    private final CMService cmService;

    @ModelAttribute
    public void ComboBoxSetting(Model model) {


        List<CMCode> cboArticleGroup = cmService.getArticleGrp(); //품명그룹
        List<CMCode> cboWareHouse = cmService.getCmCodeOld("LOC"); //창고

        model.addAttribute("cboArticleGroup", cboArticleGroup);
        model.addAttribute("cboWareHouse", cboWareHouse);


    }

    @GetMapping
    public String lotSubulQ(){
        return "pages/material/overview/lotsubulQ-result";
    }

    @PostMapping("/search")
    @ResponseBody
    public Map<String, List<LotSubulQView>> getLotSubulQ(@RequestBody Map<String, Object> params) {

        return service.getLotSubulQ(params);
    }



}
