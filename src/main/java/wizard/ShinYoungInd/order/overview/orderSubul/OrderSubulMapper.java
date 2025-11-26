package wizard.ShinYoungInd.order.overview.orderSubul;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface OrderSubulMapper {
    List<Overview> getOrderSubulData(Map<String, Object> params);

}
