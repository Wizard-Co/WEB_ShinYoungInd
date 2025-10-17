package wizard.ShinYoungInd.product.overview.totalView;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.allSearch
 * fileName         : TotalService
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class TotalService {
    private final TotalMapper mapper;
    private final Date date;

    public List<Overview> getProcessFromTotalResult(Map<String, Object> params) {
        List<Overview> overviews = mapper.getProcessFromTotalResult(params);
        for (Overview overview : overviews) {
            switch (overview.getCls()) {
                case 2:
                    overview.setModel("호기계");
                    break;
                case 3:
                    overview.setModel("공정계");
                    break;
                case 9:
                    overview.setProcess("총계");
                    break;
            }
            overview.setWorkDate(date.stringDateFormat(overview.getWorkDate()));
            overview.setWorkStartTime(date.stringTimeFormat(overview.getWorkStartTime()));
            overview.setWorkEndTime(date.stringTimeFormat(overview.getWorkEndTime()));
        }
        return overviews;
    }

    public List<Overview> getArticleFromTotalResult(Map<String, Object> params) {
        List<Overview> overviews = mapper.getArticleFromTotalResult(params);
        for (Overview overview : overviews) {
            switch (overview.getCls()) {
                case 2:
                    overview.setBuyerArticleNo("품번계");
                    break;
                case 9:
                    overview.setBuyerArticleNo("총계");
                    break;
            }
        }
        return overviews;
    }

    public List<Overview> getWorkerFromTotalResult(Map<String, Object> params) {
        List<Overview> overviews = mapper.getWorkerFromTotalResult(params);
        for (Overview overview : overviews) {
            switch (overview.getCls()) {
                case 2:
                    overview.setWorker("작업자계");
                    break;
                case 9:
                    overview.setWorker("총계");
                    break;
            }
        }
        return overviews;
    }

    public List<Map<String, Object>> getDailyFromTotalResult(Map<String, Object> params) {
        return mapper.getDailyFromTotalResult(params);
    }
}
