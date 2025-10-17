package wizard.ShinYoungInd.product.pattern;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * packageName      : wizard.SeungWoo.product.pattern
 * fileName         : Pattern
 * author           : sooJeong
 * date             : 2025-03-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-03-07         sooJeong             최초 생성
 */
@NoArgsConstructor
@Getter
@Setter
public class Pattern {
    public String patternID;
    public String pattern;
    public int patternSeq;
    public String processID;
    public String process;
    public String articleTypeID;
    public String articleType;
    public String workID;
    public String createUserID;
    public String lastUpdateUserID;

    public List<Pattern> patternList;
}
