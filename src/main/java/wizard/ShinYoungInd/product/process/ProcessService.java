package wizard.ShinYoungInd.product.process;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.pre.product
 * fileName         : ProcessService
 * author           : sooJeong
 * date             : 2024-12-10
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-12-10         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class ProcessService {
    private final ProcessMapper mapper;
    private final LoginManager loginManager;

    List<Process> getProcess(Map<String, Object> param) {
        return mapper.getProcess(param);
    }

    //공정 소분류 가져오기
    public List<Process> getProcessSub(Map<String, Object> param) {
        return mapper.getProcessSub(param);
    }


    public void saveProcess(Process process) throws Exception {
        if (process.processID == null || process.processID.isBlank()) return;
        process.setCreateUserID("admin");
        mapper.saveProcess(process);
    }

    public void updateProcess(Process process) throws Exception {
        if (process.processID == null || process.processID.isBlank()) return;
        process.setLastUpdateUserID("admin");
        mapper.updateProcess(process);
    }

    public void deleteProcess(String processID) throws IOException {
        //String lastUpdateUserID = loginManager.getPersonID();
        mapper.deleteProcess(processID, "test");
    }
}
