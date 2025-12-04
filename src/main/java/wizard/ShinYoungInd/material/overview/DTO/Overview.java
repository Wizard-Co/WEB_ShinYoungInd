package wizard.ShinYoungInd.material.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.YoungNam.material.overview.DTO
 * fileName         : Overview
 * author           : hd
 * date             : 2025-11-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-21         hd             최초 생성
 */

@NoArgsConstructor
@Getter
@Setter
public class Overview {

//    private bool Chk ;

    private int num;
    private String req_ID;          // 발주번호
    private String reqName;       // 발주명
    private String companyID;    // 사업장
    private String kCompany;

    private String stuffDate;        // 입고일자
    private String stuffDate_CV;        // 입고일자

    private String customID;       // 거래처
    private String customName;

    private String customChief;
    private String customAddr1;
    private String customAddr2;
    private String customAddr3;
    private String customPhone;
    private String customFaxNo;

    private String articleID;
    private String article;
    private String spec;

    private String stuffClss;          // 입고구분
    private String stuffClssName;

    private String fromLocID;       // 입고 이전 창고
    private String fromLocName;
    private String toLocID;           // 입고 이후 창고
    private String toLocName;

    private String custom;            // 입고처명
    private String stuffRoll;
    private String stuffQty;
    private String unitClss;           // 입고 단위
    private String unitClssName;

    private String priceClss;
    private String priceClssName;
    private String unitPrice;
    private String vat_Ind_YN;
    private String exchRate;

    private String stuffInID;
    private String remark;
    private String lotid;
    private String mtrCustomLotno;
    private String inspector;
    private String inspector1; // 검수자

    private String inspectDate; // 입고 검수 일자
    private String inspectDate_CV;
    private String inspectApprovalYN;
    private String amount;
    private String articleGrpID;

    private String scrapQty;    // 잔량
    private String milSheetNo; // 자주검사, 검사성적관리 테이블 속성 (Ins_InspectAuto)

    // 라벨 발행시 쓰는 박스당 수량 - mt_article의 prodQtyPerBox
    private String prodQtyPerBox;
    private String customInspector;

    // 스크랩 프로시저에서 추가
    private String outUnitPrice; // 출하단가

    private String buyerArticleNo; // 출하단가
    private String labelPrintYN; // 출하단가
    private String freeStuffinYN; // 검사필요여부
    private String chief; // 업체사장


    private double sumStuffInQty;
    private double sumStuffInCount;

}
