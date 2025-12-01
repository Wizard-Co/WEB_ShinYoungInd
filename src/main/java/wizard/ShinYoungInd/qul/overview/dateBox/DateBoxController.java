package wizard.ShinYoungInd.qul.overview.dateBox;

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
@RequestMapping("/qul/result/dateBox")
public class DateBoxController {

    private final DateBoxService service;
    private final CMService cmService;

    @ModelAttribute
    public void getCboOrderStock(Model model){
        List<CMCode> cboDefectGrpID = cmService.getCmCode("DFGRP"); //불량유형
        model.addAttribute("cboDefectGrpID", cboDefectGrpID);

    }

    @GetMapping("")
    public String goPage(){
        return "pages/qul/overview/dateBox";
    }


    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> search(@RequestBody Map<String, Object> param) {

        List<Overview> data = service.getDateBoxData(param);
        return data;
        //return service.getOutwareResult(param);
    }
}
