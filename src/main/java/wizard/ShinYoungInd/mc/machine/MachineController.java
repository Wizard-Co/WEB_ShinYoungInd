package wizard.ShinYoungInd.mc.machine;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * packageName      : wizard.ShinYoungInd.mc.machine
 * fileName         : MachineController
 * author           : sooJeong
 * date             : 2025-12-30
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-12-30         sooJeong             최초 생성
 */
@Controller
@RequiredArgsConstructor
@RequestMapping("/machine")
public class MachineController {
    private final MachineService machineService;



    @GetMapping("/machine")
    @ResponseBody
    public List<Machine> getMachine(@RequestParam("processID") String processID) {
        return machineService.getMachine(processID);
    }

}
