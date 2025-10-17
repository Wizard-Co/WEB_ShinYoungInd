package wizard.ShinYoungInd.product.planInput.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.product.planInput
 * fileName         : PatternArticle
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class PatternArticle {
    public String patternID;
    public String pattern;
    public String patternSeq;
    public String processID;
    public String process;
    public String articleID;
    public String article;
    public String buyerArticleNo;
    public String qty;
    public String level;
    public String startDate;
    public String endDate;
    public String childArticle;
    public String childBuyerArticleNo;
    public String instRemark;
    public String machineID;
    public String machine;
    public String mtrExceptYN;
    public String fifoYN;
    public String outMessage;
}
