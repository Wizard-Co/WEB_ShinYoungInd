package wizard.ShinYoungInd.mc.code;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.mc.code.DTO.MC;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/mc/code")
@RequiredArgsConstructor
public class MCController {
    final private MCService mcService;
    final private CMService cmService;

    @ModelAttribute
    public void setting(Model model) {
        List<CMCode> cboMcType = cmService.getCmCode("mcType");
        List<CMCode> cboUnit = cmService.getCmCode("mcUnit");

        model.addAttribute("mc", new MC());
        model.addAttribute("cboMcType", cboMcType);
        model.addAttribute("cboUnit", cboUnit);
    }

    @GetMapping("")
    public String mc() {
        return "/pages/mc/code/mc";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<MC> getMcData(@RequestBody Map<String, Object> param) {

        List<MC> data = mcService.getMCList(param);
        return data;
    }

    @PostMapping("/add")
    @ResponseBody
    public void save(@ModelAttribute MC mc) {
        try {
            mcService.saveMC(mc);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute MC mc) {
        mcService.updateMC(mc);
    }

    @GetMapping("/delete")
    @ResponseBody
    public void delete(@RequestBody String mcID) {
        mcService.deleteMC(mcID);
    }

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<String> exceptionHandler(SQLException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("SQL 오류");
    }
}
