package wizard.ShinYoungInd.material.overview.stuffin_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.material.overview.DTO.Overview;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Integer.parseInt;

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
    public Map<String, Object> getStuffinQ(Map<String, Object> params) {

        List<Overview> overviews = mapper.getStuffinQ(params);

        double totalQty = 0.0;
        double totalAmount = 0.0;

        for (Overview overview : overviews) {

            // 소수점 버리고 int로 변환
            int qty = (int) Double.parseDouble(overview.getStuffQty());
            int unitPrice = (int) Double.parseDouble(overview.getUnitPrice());
            int amt = (int) Double.parseDouble(overview.getAmount());

            overview.setStuffQty(String.valueOf(qty));
            overview.setUnitPrice(String.valueOf(unitPrice));
            overview.setAmount(String.valueOf(amt));

            totalQty += qty;
            totalAmount += amt;

            overview.setStuffDate(date.stringDateFormat(overview.getStuffDate()));
            overview.setInspectDate(date.stringDateFormat(overview.getInspectDate()));
        }

        Map<String, Object> totalMap = new HashMap<>();
        totalMap.put("num", overviews.size());
        totalMap.put("sumStuffInCount", formatNumber((int) totalQty));
        totalMap.put("unitPrice", formatNumber((int) totalAmount));

//        Map<String, Object> totalMap = new HashMap<>();
//        totalMap.put("num", overviews.size());           // 전체 row 수
//        totalMap.put("sumStuffInCount", String.valueOf((int) totalQty));
//        totalMap.put("unitPrice", String.valueOf((int) totalAmount));

        Map<String, Object> result = new HashMap<>();
        result.put("main", overviews);
        result.put("total", List.of(totalMap));

        return result;
    }
//    public List<Overview> getStuffinQ(Map<String, Object> params){
//        List<Overview> overviews = mapper.getStuffinQ(params);
//        for (Overview overview : overviews){
//
//
//            overview.setStuffQty(number(overview.getStuffQty()));
//            overview.setUnitPrice(number(overview.getUnitPrice()));
//            overview.setAmount(number(overview.getAmount()));
//
//
//            overview.setStuffDate(date.stringDateFormat(overview.getStuffDate()));
//            overview.setInspectDate(date.stringDateFormat(overview.getInspectDate()));
//
//        }
//
//
//        return overviews;
//
//    }

    private String number(Object val) {
        if (val == null) return "0";
        try {
            return String.format("%,d", (int) Double.parseDouble(val.toString()));
        } catch (Exception e) {
            return val.toString();
        }
    }

    private double parseDoubleValue(Object val){
        if(val == null) return 0.0;
        try{
            return Double.parseDouble(val.toString().replaceAll(",", ""));
        }catch(Exception e){
            return 0.0;
        }
    }

    // 숫자 천단위 콤마 적용
    private String formatNumber(int val) {
        return String.format("%,d", val);
    }


}
