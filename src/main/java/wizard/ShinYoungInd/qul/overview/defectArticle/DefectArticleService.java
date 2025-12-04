package wizard.ShinYoungInd.qul.overview.defectArticle;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.qul.overview.DTO.CombinedDTO;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DefectArticleService {

    private final DefectArticleMapper mapper;

    public List<Overview> getDefectArticleData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.qul.overview.DTO.Overview> overviews = mapper.getDefectArticleData(params);
//        for (wizard.ShinYoungInd.qul.overview.DTO.Overview overview : overviews){
//            overview.setScanDate(date.stringDateFormat(overview.getScanDate()));
//        }
        return overviews;
    }

    public CombinedDTO getAllData(Map<String, Object> params) {

        CombinedDTO overviews = new CombinedDTO();

        List<Overview> defectArticleData = mapper.getDefectArticleData(params);
        List<Overview> modelDefectData = mapper.getModelDefectData(params);
        List<Overview> typeDefectData = mapper.getTypeDefectData(params);
        List<Overview> workerDefectData = mapper.getWorkerDefectData(params);

        overviews.setDefectArticleData(defectArticleData);
        overviews.setModelDefectData(modelDefectData);
        overviews.setTypeDefectData(typeDefectData);
        overviews.setWorkerDefectData(workerDefectData);

        return overviews;
    }


}
