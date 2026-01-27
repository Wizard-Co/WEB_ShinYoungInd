package wizard.ShinYoungInd.product.overview.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DailyResultRes {
    private List<Overview> list;   // 메인 테이블
    private Overview summary;      // 총계
}
