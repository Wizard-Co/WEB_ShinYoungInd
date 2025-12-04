package wizard.ShinYoungInd.material.overview.lotStock_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.material.overview.DTO.LotStockQView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LotStockQService {

    private final LotStockQMapper mapper;
    private final Date date;

    public Map<String, List<LotStockQView>> getLotStockQ(Map<String, Object> params)
    {


        List<LotStockQView> list = mapper.getLotStockQ(params);
//        System.out.println("=== 시작 ===");
//        for (LotStockQView item : list) {
//            System.out.println(item.getArticle() + " 입고수량 " + item.getStuffQty() + " 출고수량" + item.getOutQty() );
//        }
//
//


        List<LotStockQView> mainList = new ArrayList<>();
        List<LotStockQView> totalList = new ArrayList<>();

        double sumStockQty = 0;

        int num = 0;
        for (LotStockQView lot : list) {

            String cls = lot.getCls();

//            System.out.println("=== BEFORE CASE ===");
//            System.out.println("cls = " + cls);
//            System.out.println(lot.getArticle() +  " " + lot.getStuffQty());   // toString() 필요


            if ("7".equals(cls)) {

                lot.setArticle("총계");
                lot.setGubun("");
                lot.setTotalColor(true);


                lot.setStuffQty(number(lot.getStuffQty()));
                lot.setOutQty(number(lot.getOutQty()));
                lot.setStockQty(number(lot.getStockQty()));

                totalList.add(lot);
                continue;
            }

            switch (cls) {

                case "0":   // 이월
//                    System.out.println("[CASE 0 이월] lot=" + lot.getStuffQty());
                    lot.setGubun("이월");
                    sumStockQty = toDouble(lot.getStuffQty());

                    lot.setStockQty(number(sumStockQty));
                    break;

                case "1":   // 입고
//                    System.out.println("[CASE 1 입고] lot=" + lot.getStuffQty());
                    lot.setGubun("입고");
                    sumStockQty += toDouble(lot.getStuffQty());
                    lot.setStockQty(number(sumStockQty));
                    break;

                case "2":   // 출고
//                    System.out.println("[CASE 1 입고] lot=" + lot.getStuffQty());
                    lot.setGubun("출고");
                    sumStockQty -= toDouble(lot.getOutQty());
                    lot.setStockQty(number(sumStockQty));
                    break;

                case "3":   // Lot 집계
//                    System.out.println("[CASE 3 Lot집계] lot=" + lot);
                    lot.setGubun("Lot집계");
                    lot.setIoDate_CV("");
                    lot.setLotColor(true);
                    break;

                case "4":   // 품명계
//                    System.out.println("[CASE 4 품명계] lot=" + lot);
                    lot.setLotID("품명계");
                    lot.setArticleColor(true);
                    sumStockQty = 0;  // 새 품목 누적 시작점
                    break;
            }

            lot.setStuffQty(number(lot.getStuffQty()));
            lot.setOutQty(number(lot.getOutQty()));
            lot.setStockQty(number(lot.getStockQty()));

            if (!"3".equals(cls) && !"4".equals(cls)) {
                lot.setIoDate(date.stringDateFormat(lot.getIoDate()));
            }

            num++;
            lot.setNum(num);

            mainList.add(lot);
        }

        Map<String, List<LotStockQView>> result = new HashMap<>();
        result.put("main", mainList);
        result.put("total", totalList);

        return result;
    }

    private double toDouble(String val) {
        if (val == null || val.isEmpty()) return 0;
        try {
            return Double.parseDouble(val.replaceAll(",", ""));
        } catch (NumberFormatException e) {
            return 0;
        }
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