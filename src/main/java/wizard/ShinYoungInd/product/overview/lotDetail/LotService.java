package wizard.ShinYoungInd.product.overview.lotDetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.lotDetail
 * fileName         : LotService
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class LotService {
    private final LotMapper mapper;
    private final Date date;

    public List<Overview> getLabelList(Map<String, Object> params){
        List<Overview> list = mapper.getLabelList(params);
        list.forEach(x -> x.setWorkDate(date.stringDateFormat(x.getWorkDate())));

        return list;
    }

    public List<Map<String, Object>> getWorkList(Map<String, Object> params){
        List<Map<String, Object>> list = mapper.getWorkList(params);
        list.forEach(x -> {
            Object workDate = x.get("workDate");

            if (workDate != null) {
                String formatted = date.stringDateFormat(workDate.toString());
                x.put("workDate", formatted);
            }

            Object workTime = x.get("workTime");
            if(workTime != null){
                String formatted = date.stringTimeFormat(workTime.toString());
                x.put("workTime", formatted);
            }
        });
        return list;
    }
    public List<Map<String, Object>> getChildList(Map<String, Object> params)
    {
        List<Map<String, Object>> list = mapper.getChildList(params);
        list.forEach(x -> {
            Object inDate = x.get("inDate");

            if (inDate != null) {
                String formatted = date.stringDateFormat(inDate.toString());
                x.put("inDate", formatted);
            }

            Object inTime = x.get("inTime");
            if(inTime != null){
                String formatted = date.stringTimeFormat(inTime.toString());
                x.put("inTime", formatted);
            }
        });
        return list;
    }
    public Map<String, Object> getLabelDetail(Map<String, Object> params){
        return mapper.getLabelDetail(params);
    }
}
