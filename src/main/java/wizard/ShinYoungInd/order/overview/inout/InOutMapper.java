package wizard.ShinYoungInd.order.overview.inout;
import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.order.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface InOutMapper {
    List<Overview> getPeriodData(Map<String, Object> params);
    List<Overview> getDailyData(Map<String, Object> params);
    List<Overview> getMonthVData(Map<String, Object> params);
    List<Overview> getMonthHData(Map<String, Object> params);
}
