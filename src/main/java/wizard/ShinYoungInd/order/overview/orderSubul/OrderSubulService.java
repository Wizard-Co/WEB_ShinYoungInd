package wizard.ShinYoungInd.order.overview.orderSubul;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderSubulService {
    private final OrderSubulMapper mapper;
    private final Date date;

    public List<Overview> getOrderSubulData(Map<String, Object> params) {
        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getOrderSubulData(params);
        return overviews;
    }

}
