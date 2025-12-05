package wizard.ShinYoungInd.qul.overview.xbar;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.qul.overview.DTO.CombinedDTO;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface XbarMapper {
    List<Overview> getXbarData(Map<String, Object> params);

    List<Overview> getRaMinAndRaMaxData(Map<String, Object> params);
    List<Overview> getSubXbarData(Map<String, Object> params);

}
