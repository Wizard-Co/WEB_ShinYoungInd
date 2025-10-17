package wizard.ShinYoungInd.product.planInput;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.product.planInput.DTO.PatternArticle;
import wizard.ShinYoungInd.product.planInput.DTO.Plan;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.pre.product.planInput
 * fileName         : PlanController
 * author           : sooJeong
 * date             : 2024-12-24
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-12-24         sooJeong             최초 생성
 */
@RequestMapping("/product/plan")
@Controller
@RequiredArgsConstructor
public class PlanController {

    private final PlanService service;

    @ModelAttribute
    public void setting(Model model) {

    }

    @GetMapping("")
    public String home(Model model) {
        return "pages/product/planInput/plan-input";
    }

    /**
     * 메인테이블 조회
     *
     * @param param
     * @return
     */
    @PostMapping(value = "/search")
    @ResponseBody
    public List<Plan> getPlanList(@RequestBody Map<String, Object> param) {
        return service.getPlanList(param);
    }

    /**
     * 패턴ID 받아서 작업지시 상세내용 조회
     *
     * @param param
     * @return
     */
    @PostMapping("/pattern/detail")
    public ResponseEntity<Object> getPatternArticle(@RequestBody Map<String, Object> param) {
        List<PatternArticle> data = service.getPatternDetail(param);
        String msg = data.isEmpty() ? null : data.get(0).getOutMessage();

        if (StringUtils.hasText(msg)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("오류: " + msg);
        }
        return ResponseEntity.ok(data);
    }

    /**
     * articleTypeID 받아서 공정패턴 조회(수주건 클릭할때마다)
     *
     * @param param
     * @return
     */
    @PostMapping("/pattern")
    @ResponseBody
    public Map<String, String> getPatternByArticleTypeID(@RequestBody Map<String, String> param) {
        return service.getPatternByArticleTypeID(param.get("articleTypeID"));
    }

}
