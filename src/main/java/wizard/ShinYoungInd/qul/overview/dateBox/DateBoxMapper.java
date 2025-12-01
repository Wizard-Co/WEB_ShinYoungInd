package wizard.ShinYoungInd.qul.overview.dateBox;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface DateBoxMapper {
    List<Overview> getDateBoxData(Map<String, Object> params);
}
