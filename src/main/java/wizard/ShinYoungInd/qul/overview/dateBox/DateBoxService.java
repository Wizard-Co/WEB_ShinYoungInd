package wizard.ShinYoungInd.qul.overview.dateBox;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DateBoxService {

    private final DateBoxMapper mapper;
    private final Date date;

    public List<Overview> getDateBoxData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.qul.overview.DTO.Overview> overviews = mapper.getDateBoxData(params);
        for (wizard.ShinYoungInd.qul.overview.DTO.Overview overview : overviews){
            overview.setExamDate(date.stringDateFormat(overview.getExamDate()));
        }
        return overviews;
    }
}
