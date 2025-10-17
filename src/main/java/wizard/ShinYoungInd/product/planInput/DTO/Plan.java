package wizard.ShinYoungInd.product.planInput.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.SeungWoo.product.planInput
 * fileName         : Plan
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
public class Plan {
    public String instID;
    public String instDate;
    public String instSeq;
    public String orderID;
    public String orderDate;
    public String orderSeq;
    public String orderNo;
    public String orderQty;
    public String mtrExceptYN;
    public String outwareExceptYN;
    public String remark;
    public String instRemark;
    public String customID;
    public String custom;
    public String articleID;
    public String article;

    public String processID;
    public String process;
    public String patternID;
    public String pattern;
    public String articleTypeID;
    public String articleType;
    public String model;
    public String buyerArticleNo;
    public String closeYN; //수주마감(수주의 closeYN)
    public String completeYN; //지시완료여부 (수주량-지시량이 0보다 작거나 같으면 완료)

    public String instQty; //지시수량
    public String notOrderQty; //미계획량 (수주량-지시량)
    public String p1WorkQty; //투입수량
    public String inspectQty; //검사량
    public String outQty; //출고량
}
