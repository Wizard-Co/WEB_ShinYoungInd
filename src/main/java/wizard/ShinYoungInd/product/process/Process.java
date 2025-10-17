package wizard.ShinYoungInd.product.process;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.pre.baseMgmt.product
 * fileName         : Process
 * author           : sooJeong
 * date             : 2024-12-09
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-12-09         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class Process {
    public String processID;
    public String process;
    public String parentProcessID;
    public String parentProcess;
    public String articleTypeID;

    public String articleType;
    public String useYN;
    public int sortSeq;

    @JsonProperty("eProcess")
    public String eProcess;
    @JsonProperty("fProcess")
    public String fProcess;
    
    public String childCheckYN;
    public String detailWorkYN;
    public String setDate;
    public String autoGatheringYN;
    public String createUserID;

    public String lastUpdateUserID;
}
