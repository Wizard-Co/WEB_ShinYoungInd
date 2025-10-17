package wizard.ShinYoungInd.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.product.process.Process;

import java.util.*;

@Controller
public class CMController {
    int nLarge = 0;

    @Autowired
    private CMService service;

    @GetMapping("pages/common/plusFinder")
    public String home(Model model, @RequestParam(value = "nLarge", defaultValue = "0") int nLarge,
                         @RequestParam(value = "sMiddle", defaultValue = "") String sMiddle) {

        HashMap<String, Object> params = new HashMap<>();
        params.put("nLarge", nLarge);
        params.put("sMiddle", sMiddle);

        List<LinkedHashMap<String, Object>> lstpf = service.getPlusFinder(params);

        if (lstpf.size() != 0) {
            List<String> lstColName = new ArrayList<>();
            Map<String, Object> firstItem = lstpf.get(0);

            for (String key : firstItem.keySet()) {
                lstColName.add(key.trim());
            }
            model.addAttribute("lstpf", lstpf);
            model.addAttribute("lstColName", lstColName);
        }

        return "pages/common/plusFinder";
    }

    /**
     * 김수정, 공정 가져오는 함수
     * @return
     */
    @PostMapping("/common/process")
    @ResponseBody
    public List<Process> getProcess(@RequestBody Map<String, String> param) {
        List<Process> data = service.getProcess(param.get("processID"), param.get("process"));
        return data;
    }

}
