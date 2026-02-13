package wizard.ShinYoungInd.material.overview.stock_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.material.overview.DTO.LotStockQView;
import wizard.ShinYoungInd.material.overview.DTO.LotSubulQView;
import wizard.ShinYoungInd.material.overview.DTO.StockQView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StockQService {
    private final StockQMapper mapper;
    private final Date date;

//    public List<StockQView> getStockQ(Map<String,Object> params)
    public Map<String, List<StockQView>> getStockQ(Map<String, Object> params)
    {
        List<StockQView> stockQViews = mapper.getStockQ(params);


//        List<StockQView> listStockQ = new ArrayList<>();

        List<StockQView> mainList = new ArrayList<>();
        List<StockQView> totalList = new ArrayList<>();

        int num = 1;

        for (StockQView stockQView : stockQViews){
            String cls = stockQView.getCls();


            // cls가 3이거나 초기/입고/출고/재고가 모두 0이면 제외
            boolean allZero = isEmpty(stockQView.getInitStockQty()) &&
                    isEmpty(stockQView.getStuffQty()) &&
                    isEmpty(stockQView.getOutQty()) &&
                    isEmpty(stockQView.getStockQty());
            if(allZero || "3".equals(cls)){
                continue;
            }





            if(cls.equals("4")) {

                stockQView.setInitStockQty(number(stockQView.getInitStockQty()));
                stockQView.setStuffQty(number(stockQView.getStuffQty()));
                stockQView.setOutQty(number(stockQView.getOutQty()));
                stockQView.setStockQty(number(stockQView.getStockQty()));

//                case "4":   // 오더계
//                stockQView.setBuyerArticleNo("총 계");
//                stockQView.setArticleID("");
//                stockQView.setArticle("");
//                stockQView.setLocName("");
//                stockQView.setNeedstockQty("");
//                stockQView.setOverQty("");
//                stockQView.setStockRate("");

                totalList.add(stockQView);
                continue;
//                    break;
            }

            stockQView.setNum(num);
            stockQView.setCls(cls);
            stockQView.setArticleID(stockQView.getArticleID());
            stockQView.setArticle(stockQView.getArticle());
            stockQView.setBuyerArticleNo(stockQView.getBuyerArticleNo());
            stockQView.setLocID(stockQView.getLocID());
            stockQView.setLocName(stockQView.getLocName());

            // 숫자 포맷
            stockQView.setInitStockQty(number(stockQView.getInitStockQty()));
            stockQView.setStuffQty(number(stockQView.getStuffQty()));
            stockQView.setOutQty(number(stockQView.getOutQty()));
            stockQView.setStockQty(number(stockQView.getStockQty()));
            stockQView.setNeedstockQty(number(stockQView.getNeedstockQty()));
            stockQView.setOverQty(number(stockQView.getOverQty()));
            stockQView.setStockRate(number(stockQView.getStockRate()));

            stockQView.setUnitClss(stockQView.getUnitClss());
            stockQView.setUnitClssName(stockQView.getUnitClssName());



            num++;
            mainList.add(stockQView);

        }

        Map<String, List<StockQView>> result = new HashMap<>();
        result.put("main", mainList);
        result.put("total", totalList);


        return result;

    }

    private String number(Object val) {
        if (val == null) return "0";
        try {
            return String.format("%,d", (int) Double.parseDouble(val.toString()));
        } catch (Exception e) {
            return val.toString();
        }
    }


    private boolean isEmpty(String s) {
        return s == null || s.trim().equals("") || s.equals("0");
    }

    private String trimZero(Object o) {
        if (o == null) return "";
        String s = o.toString();
        if (s.contains(".")) {
            return s.split("\\.")[0].trim();
        }
        return s.trim();
    }

    // 숫자 비교용 헬퍼
    private int compareDouble(String a, String b){
        double da = isEmpty(a) ? 0 : Double.parseDouble(a);
        double db = isEmpty(b) ? 0 : Double.parseDouble(b);
        return Double.compare(da, db);
    }

    private double toDouble(Object o) {
        if (o == null) return 0;
        try {
            String s = trimZero(o);
            return Double.parseDouble(s);
        } catch (Exception e) {
            return 0;
        }
    }

    private String format(Object o) {
        if (o == null) return "0";
        try {
            double d = Double.parseDouble(o.toString());
            return String.format("%,.0f", d);
        } catch (Exception e) {
            return o.toString();
        }
    }




}
