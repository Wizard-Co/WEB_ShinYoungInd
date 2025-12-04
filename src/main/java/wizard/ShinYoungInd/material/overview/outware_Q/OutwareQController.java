package wizard.ShinYoungInd.material.overview.outware_Q;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.material.overview.DTO.OutwareView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.stuffin_Q
 * fileName         : StuffinQController
 * author           : hd
 * date             : 2025-11-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-21         hd             최초 생성
 */
@Controller
@RequestMapping("/material/result/outwareQ")
@RequiredArgsConstructor
public class OutwareQController {
    private final OutwareQService service;
    private final CMService cmService;

    @ModelAttribute
    public void ComboBoxSetting(Model model) {

        List<CMCode> cboArticleGroup = cmService.getArticleGrp(); //품명그룹
        List<CMCode> cbFromToLoc = cmService.getCmCodeOld("LOC"); //창고
        List<CMCode> cboOutClss = cmService.getCmCodeOld("OCD"); //출고구분

        model.addAttribute("cboArticleGroup", cboArticleGroup);
        model.addAttribute("cboFromLoc", cbFromToLoc); //이전창고
        model.addAttribute("cboToLoc", cbFromToLoc); //이후창고
        model.addAttribute("cboOutClss", cboOutClss);

    }
    @GetMapping("")
    public String outwareQ(){ return "pages/material/overview/outwareQ-result";}

    @PostMapping("/search")
    @ResponseBody
    public List<OutwareView> getOutwareQ(@RequestBody Map<String, Object> params){
        return service.getOutwareQ(params);
    }

}
