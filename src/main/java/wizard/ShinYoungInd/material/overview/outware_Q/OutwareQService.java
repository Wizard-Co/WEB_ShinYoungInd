package wizard.ShinYoungInd.material.overview.outware_Q;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.material.overview.DTO.OutwareView;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OutwareQService {
    private final OutwareQMapper mapper;
    private final Date date;

    public List<OutwareView> getOutwareQ(Map<String, Object> params){
        List<OutwareView> outwareViews = mapper.getOutwareQ(params);
        for (OutwareView outwareView : outwareViews){

            String depth = outwareView.getDepth();

            switch (depth) {
                case "0":   // 기본 라인
                    break;

                case "2":   // 오더계
                    outwareView.setOrderNo("오더 계");
                    outwareView.setFromLocName("");
                    outwareView.setToLocname("");
                    outwareView.setOutClssname("");
                    outwareView.setOutwareiD("");
                    break;

                case "3":   // 거래처 계
                    outwareView.setKCustom("거래처 계");
                    outwareView.setArticle("");
                    outwareView.setBuyerArticleNo("");
                    outwareView.setFromLocName("");
                    outwareView.setToLocname("");
                    outwareView.setOutClssname("");
                    outwareView.setOutwareiD("");
                    break;

                case "4":   // 일자 계
                    outwareView.setOutDate("일 계");
                    outwareView.setKCustom("");
                    outwareView.setArticle("");
                    outwareView.setBuyerArticleNo("");
                    outwareView.setFromLocName("");
                    outwareView.setToLocname("");
                    outwareView.setOutClssname("");
                    outwareView.setOutwareiD("");
                    break;

                case "5":   // 월 계
                    String outDate = outwareView.getOutDate();
                    if (outDate != null && outDate.length() >= 6) {
                        // 안전하게 5~6번째 글자를 가져옴
                        outwareView.setOutDate(outDate.substring(4, 6) + "월 계");
                    } else {
                        outwareView.setOutDate("월 계");
                    }
                    outwareView.setKCustom("");
                    outwareView.setArticle("");
                    outwareView.setBuyerArticleNo("");
                    outwareView.setFromLocName("");
                    outwareView.setToLocname("");
                    outwareView.setOutClssname("");
                    outwareView.setOutwareiD("");
                    break;

                case "6":   // 총 합계
                    outwareView.setOutDate("총 합계");
                    outwareView.setKCustom("");
                    outwareView.setArticle("");
                    outwareView.setBuyerArticleNo("");
                    outwareView.setFromLocName("");
                    outwareView.setToLocname("");
                    outwareView.setOutClssname("");
                    outwareView.setOutwareiD("");
                    break;
            }

            // 숫자 포맷
            outwareView.setOutQty(number(outwareView.getOutQty()));
            outwareView.setAmount(number(outwareView.getAmount()));
            outwareView.setUnitPrice(number(outwareView.getUnitPrice()));

            // 날짜 포맷
            outwareView.setOutDate(date.stringDateFormat(outwareView.getOutDate()));
        }

        return outwareViews;
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
