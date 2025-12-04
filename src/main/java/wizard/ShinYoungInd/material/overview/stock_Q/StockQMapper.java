package wizard.ShinYoungInd.material.overview.stock_Q;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.material.overview.DTO.StockQView;

import java.util.List;
import java.util.Map;
/**
 * packageName      : wizard.YoungNam.material.overview.stock_Q;
 * fileName         : StockQMapper
 * author           : hd
 * date             : 2025-11-24
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-24         hd             최초 생성
 */

@Mapper
public interface StockQMapper {
    List<StockQView> getStockQ(Map<String, Object> params);

}
