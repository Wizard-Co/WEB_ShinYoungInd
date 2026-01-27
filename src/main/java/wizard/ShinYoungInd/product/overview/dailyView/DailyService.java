package wizard.ShinYoungInd.product.overview.dailyView;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.product.overview.DTO.DailyResultRes;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.math.BigDecimal;
import java.util.ArrayList;
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
    public DailyResultRes getDailyResult(Map<String, Object> params) {
        // 메인 테이블용
        List<Overview> overviews = mapper.getDailyResult(params);

        // 총계 테이블용
        Overview total = null;
        List<Overview> rows = new ArrayList<>();

        for (Overview overview : overviews) {

            // 총계테이블 데이터
            if (overview.getCls() == 9) {
                total = overview;
                continue;
            }

            // 메인테이블 데이터
            switch (overview.getCls()) {
                case 2:
                    overview.setOrderID("공정계");
                    break;
                case 3:
                    overview.setProcess("날짜계");
                    break;
            }
            overview.setWorkDate(date.stringDateFormat(overview.getWorkDate()));
            overview.setWorkStartTime(date.stringTimeFormat(overview.getWorkStartTime()));
            overview.setWorkEndTime(date.stringTimeFormat(overview.getWorkEndTime()));

            rows.add(overview);
        }
        return new DailyResultRes(rows, total);
    }

    public DailyResultRes getDrillingResult(Map<String, Object> params) {
        List<Overview> overviews = mapper.getDrillingResult(params);

        // 총계 테이블용
        Overview total = null;
        List<Overview> rows = new ArrayList<>();

        for (Overview overview : overviews) {
            // 총계테이블 데이터
            if (overview.getCls() == 9) {
                total = overview;
                continue;
            }

            switch (overview.getCls()) {
                case 2:
                    overview.setOrderNo("호기계");
                    break;
                case 3:
                    overview.setMachineNo("날짜계");
                    break;
            }
            overview.setWorkDate(date.stringDateFormat(overview.getWorkDate()));
            overview.setWorkStartTime(date.stringTimeFormat(overview.getWorkStartTime()));
            overview.setWorkEndTime(date.stringTimeFormat(overview.getWorkEndTime()));

            rows.add(overview);
        }
        return new DailyResultRes(rows, total);
    }

    public List<Overview> getDefect(String jobID) {
        return mapper.getDefect(new BigDecimal(jobID));
    }
}
