package wizard.ShinYoungInd.material.overview.stuffin_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.material.overview.DTO.Overview;

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
@RequestMapping("/material/result/stuffinQ")
@RequiredArgsConstructor
public class StuffinQController {
    private final StuffinQService service;
    private final CMService cmService;

    @ModelAttribute
    public void ComboBoxSetting(Model model) {

        List<CMCode> cboArticleGrpSrh = cmService.getArticleGrp(); //품명그룹
        List<CMCode> cboStuffClssSrh = cmService.getCmCodeOldRel("ICD","MTR"); //입고구분
        List<CMCode> cboToLocSrh = cmService.getCmCodeOld("LOC"); //입고창고


        model.addAttribute("cboArticleGrpSrh", cboArticleGrpSrh); //품명그룹
        model.addAttribute("cboStuffClssSrh", cboStuffClssSrh);
        model.addAttribute("cboToLocSrh", cboToLocSrh); //입고창고

    }


    @GetMapping("")
    public String stuffinQ(){ return "pages/material/overview/stuffinQ-result";}

    @PostMapping("/search")
    @ResponseBody
    public List<Overview> getStuffinQ(@RequestBody Map<String, Object> params){
        return service.getStuffinQ(params);
    }

}
