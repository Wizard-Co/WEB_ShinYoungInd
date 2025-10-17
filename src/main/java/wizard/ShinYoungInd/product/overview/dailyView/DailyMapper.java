package wizard.ShinYoungInd.product.overview.dailyView;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.dailyView
 * fileName         : DailyMapper
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@Mapper
public interface DailyMapper {
    List<Overview> getDailyResult(Map<String, Object> params);
    List<Overview> getDefect(BigDecimal jobID);
    List<Overview> getDrillingResult(Map<String, Object> params);
}
