package wizard.ShinYoungInd.product.pattern;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;

import java.util.List;

/**
 * packageName      : wizard.SeungWoo.product.pattern
 * fileName         : PatternController
 * author           : sooJeong
 * date             : 2025-03-06
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-03-06         sooJeong             최초 생성
 */
@RequestMapping("/product/pattern")
@Controller
@AllArgsConstructor
public class PatternController {

    private PatternService service;
    private CMService cmService;

    @ModelAttribute
    public void setting(Model model) {
        List<CMCode> cboArticleType = cmService.getCmCode("ArticleType");

        model.addAttribute("pattern", new Pattern());
        model.addAttribute("cboArticleType", cboArticleType);
    }

    @GetMapping("")
    public String home(){
        return "pages/product/process-pattern";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Pattern> search() {
        List<Pattern> data = service.getProcessPattern();
        return data;
    }

    @PostMapping("/detail")
    @ResponseBody
    public List<Pattern> searchDetail(@RequestBody String patternID) {
        List<Pattern> data = service.getPatternDetail(patternID);
        return data;
    }

    @PostMapping("/add")
    @ResponseBody
    public void saveData(@ModelAttribute Pattern pattern) {
        service.savePattern(pattern);
    }

    @PostMapping("/update")
    @ResponseBody
    public void updateData(@ModelAttribute Pattern pattern) {
        service.updatePattern(pattern);
    }
}
