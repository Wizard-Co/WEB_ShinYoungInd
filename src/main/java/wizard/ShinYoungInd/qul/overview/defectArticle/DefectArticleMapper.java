package wizard.ShinYoungInd.qul.overview.defectArticle;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface DefectArticleMapper {
    List<Overview> getDefectArticleData(Map<String, Object> params);
    List<Overview> getModelDefectData(Map<String, Object> params);
    List<Overview> getTypeDefectData(Map<String, Object> params);
    List<Overview> getWorkerDefectData(Map<String, Object> params);

}
