package wizard.ShinYoungInd.product.overview.totalView;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.allSearch
 * fileName         : TotalMapper
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@Mapper
public interface TotalMapper {

    List<Overview> getProcessFromTotalResult(Map<String, Object> params);
    List<Overview> getArticleFromTotalResult(Map<String, Object> params);
    List<Overview> getWorkerFromTotalResult(Map<String, Object> params);
    List<Map<String, Object>> getDailyFromTotalResult(Map<String, Object> params);
}
