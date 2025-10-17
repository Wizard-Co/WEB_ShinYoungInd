package wizard.ShinYoungInd.product.overview.dailyView;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.dailyView
 * fileName         : DailyService
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class DailyService {
    private final DailyMapper mapper;
    private final Date date;
    public List<Overview> getDailyResult(Map<String, Object> params) {
        List<Overview> overviews = mapper.getDailyResult(params);
        for (Overview overview : overviews) {
            switch (overview.getCls()) {
                case 2:
                    overview.setWorkDate("");
                    overview.setProcess("공정계");
                    break;
                case 4:
                    overview.setWorkDate("작업구분계");
                    overview.setProcess("");
                    break;
                case 9:
                    overview.setWorkDate("총계");
                    overview.setProcess("");
                    break;
            }
            overview.setWorkDate(date.stringDateFormat(overview.getWorkDate()));
            overview.setWorkStartTime(date.stringTimeFormat(overview.getWorkStartTime()));
            overview.setWorkEndTime(date.stringTimeFormat(overview.getWorkEndTime()));
        }
        return overviews;
    }

    public List<Overview> getDrillingResult(Map<String, Object> params) {
        List<Overview> overviews = mapper.getDrillingResult(params);
        for (Overview overview : overviews) {
            switch (overview.getCls()) {
                case 4:
                    overview.setWorkDate("작업구분계");
                    overview.setProcess("");
                    break;
                case 9:
                    overview.setWorkDate("총계");
                    overview.setProcess("");
                    break;
            }
            overview.setWorkDate(date.stringDateFormat(overview.getWorkDate()));
            overview.setWorkStartTime(date.stringTimeFormat(overview.getWorkStartTime()));
            overview.setWorkEndTime(date.stringTimeFormat(overview.getWorkEndTime()));
        }
        return overviews;
    }

    public List<Overview> getDefect(String jobID) {
        return mapper.getDefect(new BigDecimal(jobID));
    }
}
