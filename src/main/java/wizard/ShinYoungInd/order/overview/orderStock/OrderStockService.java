package wizard.ShinYoungInd.order.overview.orderStock;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderStockService {
    private final OrderStockMapper mapper;

    public List<Overview> getOrderStockData(Map<String, Object> params) {
        List<wizard.ShinYoungInd.order.overview.DTO.Overview> overviews = mapper.getOrderStockData(params);

        return overviews;
    }
}
