package wizard.ShinYoungInd.material.overview.subul_Q;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.material.overview.DTO.SubulQView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.subul_Q;
 * fileName         : StockQMapper
 * author           : hd
 * date             : 2025-11-24
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-24         hd             최초 생성
 */

@Mapper
public interface SubulQMapper {
    List<SubulQView> getSubulQ(Map<String, Object> params);
}
