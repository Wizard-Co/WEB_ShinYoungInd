package wizard.ShinYoungInd.order.overview.orderStock;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderStockMapper {
    List<Overview> getOrderStockData(Map<String, Object> params);
}
