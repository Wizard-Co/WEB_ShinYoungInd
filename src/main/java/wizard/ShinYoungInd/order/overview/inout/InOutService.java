package wizard.ShinYoungInd.order.overview.inout;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InOutService {
    private final InOutMapper mapper;
    private final Date date;

    public List<Overview> getPeriodData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getPeriodData(params);
        for (wizard.ShinYoungInd.order.overview.DTO.Overview overview : overviews){
            overview.setOutDate(date.stringDateFormat(overview.getOutDate()));
        }

        return overviews;
    }

    public List<Overview> getDailyData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getDailyData(params);
        for (wizard.ShinYoungInd.order.overview.DTO.Overview overview : overviews){
            overview.setIODate(date.stringDateFormat(overview.getIODate()));
        }

        return overviews;
    }

    public List<Overview> getMonthVData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getMonthVData(params);
        for (wizard.ShinYoungInd.order.overview.DTO.Overview overview : overviews){
            overview.setIODate(date.stringDateFormat(overview.getIODate()));
        }

        return overviews;
    }

    public List<Overview> getMonthHData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getMonthHData(params);


        return overviews;
    }

}
