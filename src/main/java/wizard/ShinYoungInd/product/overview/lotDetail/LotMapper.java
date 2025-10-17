package wizard.ShinYoungInd.product.overview.lotDetail;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.product.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.overview.lotDetail
 * fileName         : LotMapper
 * author           : sooJeong
 * date             : 2025-06-04
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-04         sooJeong             최초 생성
 */
@Mapper
public interface LotMapper {
    List<Overview> getLabelList(Map<String, Object> params);
    List<Map<String, Object>> getWorkList(Map<String, Object> params);
    List<Map<String, Object>> getChildList(Map<String, Object> params);
    Map<String, Object> getLabelDetail(Map<String, Object> params);
}
