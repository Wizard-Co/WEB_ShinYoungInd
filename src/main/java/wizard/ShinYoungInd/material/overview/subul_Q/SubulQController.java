package wizard.ShinYoungInd.material.overview.subul_Q;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.material.overview.DTO.SubulQView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.subul_Q
 * fileName         : SubulQController
 * author           : hd
 * date             : 2025-11-24
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-24         hd             최초 생성
 */


@Controller
@RequestMapping("/material/result/subulQ")
@RequiredArgsConstructor
public class SubulQController {
    private final SubulQService service;
    private final CMService cmService;

    @ModelAttribute
    public void ComboBoxSetting(Model model) {

        List<CMCode> cboSupplyType = cmService.getCmCodeOld("CMMASPLTYPE"); //공급유형
        List<CMCode> cboWareHouse = cmService.getCmCodeOld("LOC"); //창고
        List<CMCode> cboArticleGroup = cmService.getArticleGrp(); //품명그룹

        List<CMCode> cboInGbn = cmService.getCmCodeOld("ICD"); //입고구분
        List<CMCode> cboOutGbn = cmService.getCmCodeOld("OCD"); //출고구분

        model.addAttribute("cboArticleGroup", cboArticleGroup);
        model.addAttribute("cboSupplyType", cboSupplyType);
        model.addAttribute("cboWareHouse", cboWareHouse);
        model.addAttribute("cboInGbn", cboInGbn);
        model.addAttribute("cboOutGbn", cboOutGbn);

    }



    @GetMapping("")
    public String subulQ(){return "pages/material/overview/subulQ-result";}

    @PostMapping("/search")
    @ResponseBody
    public List<SubulQView> getSubulQ(@RequestBody Map<String, Object> params){
        return service.getSubulQ(params);
    }



}
