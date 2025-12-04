package wizard.ShinYoungInd.material.overview.stock_Q;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.material.overview.DTO.StockQView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.stock_Q
 * fileName         : StockQController
 * author           : hd
 * date             : 2025-11-24
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-24         hd             최초 생성
 */

@Controller
@RequestMapping("/material/result/stockQ")
@RequiredArgsConstructor
public class StockQController {

    private final StockQService service;
    private final CMService cmService;

    @ModelAttribute
    public void ComboBoxSetting(Model model) {

        List<CMCode> cboArticleGroup = cmService.getArticleGrp(); //품명그룹
        List<CMCode> cboWareHouse = cmService.getCmCodeOld("LOC"); //창고
        List<CMCode> cboInGbn = cmService.getCmCodeOld("ICD"); //입고구분
        List<CMCode> cboOutGbn = cmService.getCmCodeOld("OCD"); //출고구분
        List<CMCode> cboSupplyType = cmService.getCmCodeOld("CMMASPLTYPE"); //공급유형

        model.addAttribute("cboArticleGroup", cboArticleGroup);
        model.addAttribute("cboWareHouse", cboWareHouse);
        model.addAttribute("cboInGbn", cboInGbn);
        model.addAttribute("cboOutGbn", cboOutGbn);
        model.addAttribute("cboSupplyType", cboSupplyType);

    }

    @GetMapping("")
    public String stockQ(){return "pages/material/overview/stockQ-result";}

    @PostMapping("/search")
    @ResponseBody
    public List<StockQView> getStockQ(@RequestBody Map<String, Object> params){
        return service.getStockQ(params);
    }




}
