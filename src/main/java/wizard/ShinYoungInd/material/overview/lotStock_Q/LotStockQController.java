package wizard.ShinYoungInd.material.overview.lotStock_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.material.overview.DTO.LotStockQView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.lotStock_Q
 * fileName         : LotStockQController
 * author           : hd
 * date             : 2025-11-25
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-24         hd             최초 생성
 */


@Controller
@RequestMapping("/material/result/lotStockQ")
@RequiredArgsConstructor
public class LotStockQController {
    private final LotStockQService service;

    private final CMService cmService;

    @ModelAttribute
    public void ComboBoxSetting(Model model) {



        List<CMCode> cboWareHouse = cmService.getCmCodeOld("LOC"); //창고

        model.addAttribute("cboWareHouse", cboWareHouse);


    }

    @GetMapping
    public String lotStockQ(){
         return "pages/material/overview/lotstockQ-result";
    }

    @PostMapping("/search")
    @ResponseBody
    public Map<String, List<LotStockQView>> getlotStockQ(@RequestBody Map<String, Object> params) {
        return service.getLotStockQ(params);
    }
}
