package wizard.ShinYoungInd.qul.overview.insDefect;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/qul/result/insDefect")
public class InsDefectController {

    private final InsDefectService service;

    @GetMapping("")
    public String goPage(){
        return "pages/qul/overview/insDefect";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Overview> search(@RequestBody Map<String, Object> param) {

        List<Overview> data = service.getInsDefectData(param);
        return data;
        //return service.getOutwareResult(param);
    }
}
