package wizard.ShinYoungInd.mc.repair;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.mc.repair.DTO.Repair;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.repair
 * fileName         : RepairController
 * author           : sooJeong
 * date             : 2025-07-30
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-07-30         sooJeong             최초 생성
 */
@Controller
@RequestMapping("/mc/repair/result")
@RequiredArgsConstructor
public class RepairController {
    private final RepairService service;

    @GetMapping("")
    public String home() {
        return "pages/mc/repair/repair-result";
    }

    @PostMapping("/search")
    @ResponseBody
    public List<Repair> getRepair(@RequestBody Map<String, Object> params) {
        return service.getRepair(params);
    }
}
