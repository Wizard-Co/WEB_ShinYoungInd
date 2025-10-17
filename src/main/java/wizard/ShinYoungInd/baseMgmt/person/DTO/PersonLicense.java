package wizard.ShinYoungInd.baseMgmt.person.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * packageName      : wizard.naDaum.baseMgmt.person.DTO
 * fileName         : PersonLicense
 * author           : sooJeong
 * date             : 2025-01-08
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-08         sooJeong             최초 생성
 */

@Getter
@Setter
@NoArgsConstructor
public class PersonLicense {
    public String eduDate;
    public String program;
    public String license;
    public String comments;
}
