package wizard.ShinYoungInd.product.overview.lotDetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.lotDetail
 * fileName         : LotController
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@RequestMapping("/product/result/lot")
@Controller
@RequiredArgsConstructor
public class LotController {
    private final LotService service;

    @GetMapping("")
    public String home(){
        return "pages/product/overview/lot-detail";
    }

    @PostMapping("/search/label")
    @ResponseBody
    public List<Overview> getLabelList(@RequestBody Map<String, Object> params){
        return service.getLabelList(params);
    }

    @PostMapping("/search/work")
    @ResponseBody
    public List<Map<String, Object>> getWorkList(@RequestBody Map<String, Object> params){
        return service.getWorkList(params);
    }

    @PostMapping("/search/child")
    @ResponseBody
    public List<Map<String, Object>> getChildList(@RequestBody Map<String, Object> params){
        return service.getChildList(params);
    }

    @PostMapping("/search/label/detail")
    @ResponseBody
    public Map<String, Object> getLabelDetail(@RequestBody Map<String, Object> params){
        return service.getLabelDetail(params);
    }
}
