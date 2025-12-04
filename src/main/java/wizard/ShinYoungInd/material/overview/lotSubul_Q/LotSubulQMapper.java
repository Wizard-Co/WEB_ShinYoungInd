package wizard.ShinYoungInd.material.overview.lotSubul_Q;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.material.overview.DTO.LotSubulQView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.lotSubul_Q;
 * fileName         : LotStockQMapper
 * author           : hd
 * date             : 2025-11-25
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-25         hd             최초 생성
 */

@Mapper
public interface LotSubulQMapper {
    List<LotSubulQView> getLotSubulQ(Map<String, Object> params);
}

