package wizard.ShinYoungInd.qul.overview.insDefect;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InsDefectService {

    private final InsDefectMapper mapper;
    private final Date date;

    public List<Overview> getInsDefectData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.qul.overview.DTO.Overview> overviews = mapper.getInsDefectData(params);
        for (wizard.ShinYoungInd.qul.overview.DTO.Overview overview : overviews){
            overview.setScanDate(date.stringDateFormat(overview.getScanDate()));
        }
        return overviews;
    }
}
