package wizard.ShinYoungInd.material.overview.subul_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.material.overview.DTO.SubulQView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SubulQService {
    private final SubulQMapper mapper;
    private final Date date;

//    public List<SubulQView> getSubulQ(Map<String,Object> params){
    public Map<String, List<SubulQView>> getSubulQ(Map<String,Object> params){
        List<SubulQView> subulQViews = mapper.getSubulQ(params);

        List<SubulQView> mainList = new ArrayList<>();
        List<SubulQView> totalList = new ArrayList<>();

        double nmstockQty = 0;
        double sumStockQty = 0;
        double sumStuffinQty = 0;
        double sumOutQty = 0;

        int num = 0;

        for (SubulQView subul : subulQViews) {
            String cls = subul.getCls(); // cls 값 가져오기

            if ("7".equals(cls)) {

                subul.setArticle("총계");
//                subul.setGubun("");
//                subul.setTotalColor(true);


                subul.setStuffQty(number(subul.getStuffQty()));
                subul.setOutQty(number(subul.getOutQty()));
                subul.setStockQty(number(subul.getStockQty()));

                totalList.add(subul);
                continue;
            }
//            if ("0".equals(cls))
//            {
//                double qty = Double.parseDouble(subul.getStuffQty());
//                sumStockQty += qty;
//                continue; // 리스트에 안 넣음
//            }

            switch (cls) {
                case "0": // 이월
                    subul.setIoDate("이월");
                    subul.setStockQty(subul.getStuffQty()); // 재고량 바로 보여주기
//                    sumStockQty += subul.getStuffQty();
                    break;

                case "1": // 입고
//                    sumStuffinQty = sumStockQty + subul.getStuffQty();
//                    subul.setStockQty(sumStuffinQty);
                    sumStockQty = sumStuffinQty;
                    break;

                case "2": // 출고
//                    sumOutQty = sumStockQty - subul.getOutQty();
//                    subul.setStockQty(sumOutQty);
                    sumStockQty = sumOutQty;
                    break;

                case "6": // 품명계
                    subul.setArticle("");
                    subul.setBuyerArticleNo("품명계");
                    subul.setIoDate("");
                    subul.setLocName("");
                    subul.setArticleTotal_Color(true);
                    sumStockQty = 0;
                    break;

//                case "7": // 총계
//                    subul.setArticle("");
//                    subul.setBuyerArticleNo("총계");
//                    subul.setIoDate("");
//                    subul.setLocName("");
//                    subul.setTotal_Color(true);
//                    break;

                default:
                    // 필요 시 다른 cls 값 처리
                    break;
            }

            // 숫자 포맷
            subul.setStockQty(number(subul.getStockQty()));
            subul.setStuffQty(number(subul.getStuffQty()));
            subul.setOutQty(number(subul.getOutQty()));
            subul.setIoDate(date.stringDateFormat(subul.getIoDate()));

            num++;
            subul.setNum(num);

            mainList.add(subul);

        }

//        SubulQView totalRow = new SubulQView();
//        totalRow.setArticle("이월합계");
//        totalRow.setNmstockQty(String.format("%,.0f", sumStockQty));
//
//        totalList.add(totalRow);

        Map<String, List<SubulQView>> result = new HashMap<>();
        result.put("main", mainList);
        result.put("total", totalList);

        return result;
//        return subulQViews;
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
