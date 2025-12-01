package wizard.ShinYoungInd.qul.overview.dateProd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.common.util.Date;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DateProdService {
    private final DateProdMapper mapper;
    private final Date date;

    public List<CMCode> getWorkProcess(int nProc, String ProcessID) { return mapper.getWorkProcess(nProc, ProcessID); }
    public List<CMCode> getMachineList(String ProcessID) {
        return mapper.getMachineList(ProcessID);
    }
    public List<wizard.ShinYoungInd.qul.overview.DTO.Overview> getDateProdData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.qul.overview.DTO.Overview> overviews = mapper.getDateProdData(params);
        for (wizard.ShinYoungInd.qul.overview.DTO.Overview overview : overviews){
            overview.setScanDate(date.stringDateFormat(overview.getScanDate()));
        }
        return overviews;
    }
}
