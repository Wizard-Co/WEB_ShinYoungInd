package wizard.ShinYoungInd.mc.machine;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * packageName      : wizard.YoungNam.mc.machine
 * fileName         : MachineService
 * author           : sooJeong
 * date             : 2025-11-27
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-27         sooJeong             최초 생성
 */
@RequiredArgsConstructor
@Service
public class MachineService {
    private final MachineMapper mapper;

    public List<Machine> getMachine(String processID) {
        return mapper.getMachine(processID);
    }
}
