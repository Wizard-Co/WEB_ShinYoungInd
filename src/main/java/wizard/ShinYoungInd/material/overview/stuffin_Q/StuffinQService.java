package wizard.ShinYoungInd.material.overview.stuffin_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.material.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.stuffin_Q
 * fileName         : StuffinQService
 * author           : hd
 * date             : 2025-11-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-21         hd             최초 생성
 */


@Service
@RequiredArgsConstructor
public class StuffinQService {
    private final StuffinQMapper mapper;
    private final Date date;
    public List<Overview> getStuffinQ(Map<String, Object> params){
        List<Overview> overviews = mapper.getStuffinQ(params);
        for (Overview overview : overviews){


            overview.setStuffQty(number(overview.getStuffQty()));
            overview.setUnitPrice(number(overview.getUnitPrice()));
            overview.setAmount(number(overview.getAmount()));


            overview.setStuffDate(date.stringDateFormat(overview.getStuffDate()));
            overview.setInspectDate(date.stringDateFormat(overview.getInspectDate()));

        }


        return overviews;

    }

    private String number(Object val) {
        if (val == null) return "0";
        try {
            return String.format("%,d", (int) Double.parseDouble(val.toString()));
        } catch (Exception e) {
            return val.toString();
        }
    }

}
