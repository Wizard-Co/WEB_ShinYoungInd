package wizard.ShinYoungInd.qul.overview.insDefect;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface InsDefectMapper {
    List<Overview> getInsDefectData(Map<String, Object> params);
}
