package wizard.ShinYoungInd.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.product.process.Process;

import java.util.*;

@Service
public class CMService {
    @Autowired
    private CMMapper mapper;

    public List<CMCode> getCmCode(String codeTypeID) {
        return mapper.getCmCode(codeTypeID);
    }

    public List<LinkedHashMap<String, Object>> getPlusFinder(HashMap<String, Object> param) {
        return mapper.getPlusFinder(param);
    }

    public List<Process> getProcess(String processID, String process) {
        HashMap<String, Object> param = new HashMap<>();
        param.put("processID", processID);
        param.put("process", process);
        return mapper.getProcess(param);
    }


}
