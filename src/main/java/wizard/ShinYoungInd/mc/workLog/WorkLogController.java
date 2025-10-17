package wizard.ShinYoungInd.mc.workLog;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.mc.workLog.DTO.WorkLog;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.WorkLog
 * fileName         : WorkLogController
 * author           : sooJeong
 * date             : 2025-08-01
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-08-01         sooJeong             최초 생성
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/mc/worklog")
public class WorkLogController {
    private final WorkLogService service;

    @GetMapping("")
    public String home(){
        return "pages/mc/worklog/work-log";
    }

    @PostMapping("/search")
    @ResponseBody
    public List<WorkLog> getWorkLog(@RequestBody Map<String, Object> params) {
        return service.getWorkLog(params);
    }
}
