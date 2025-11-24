package wizard.ShinYoungInd.order.overview.outwareDetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OutwareDetailService {
    private final OutwareDetailMapper mapper;
    private final Date date;

    public List<wizard.ShinYoungInd.order.overview.DTO.Overview> getOutwareResult(Map<String, Object> params) {

        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getOutwareResult(params);
        for (wizard.ShinYoungInd.order.overview.DTO.Overview overview : overviews){
            overview.setOutDate(date.stringDateFormat(overview.getOutDate()));
        }

        return overviews;
    }
}
