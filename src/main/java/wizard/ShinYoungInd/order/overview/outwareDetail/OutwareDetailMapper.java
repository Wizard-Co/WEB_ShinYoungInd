package wizard.ShinYoungInd.order.overview.outwareDetail;
import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface OutwareDetailMapper {
    List<Overview> getOutwareResult(Map<String, Object> params);
}
