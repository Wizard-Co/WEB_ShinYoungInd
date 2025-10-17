package wizard.ShinYoungInd.product.overview.totalView;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.dailyResult
 * fileName         : TotalController
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@RequestMapping("/product/result/total")
@Controller
@RequiredArgsConstructor
public class TotalController {

    private final TotalService service;

    /**
     * 생산집계조회
     */
    @GetMapping("")
    public String totalResult(){
        return "pages/product/overview/total-result";
    }

    @PostMapping(value = "/process")
    @ResponseBody
    public List<Overview> getProcessFromTotalResult(@RequestBody Map<String, Object> param) {
        return service.getProcessFromTotalResult(param);
    }

    @PostMapping(value = "/article")
    @ResponseBody
    public List<Overview> getArticleFromTotalResult(@RequestBody Map<String, Object> param) {
        return service.getArticleFromTotalResult(param);
    }

    @PostMapping(value = "/worker")
    @ResponseBody
    public List<Overview> getWorkerFromTotalResult(@RequestBody Map<String, Object> param) {
        return service.getWorkerFromTotalResult(param);
    }

    @PostMapping(value = "/daily")
    @ResponseBody
    public List<Map<String, Object>> getDailyFromTotalResult(@RequestBody Map<String, Object> param) {
        return service.getDailyFromTotalResult(param);
    }


}
