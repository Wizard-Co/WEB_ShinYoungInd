package wizard.ShinYoungInd.KPI;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.KPI.DTO.Defect;
import wizard.ShinYoungInd.KPI.DTO.Production;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.Production
 * fileName         : KPIMapper
 * author           : sooJeong
 * date             : 2025-06-09
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-09         sooJeong             최초 생성
 */
@Mapper
public interface KPIMapper {
    List<Production> getProduction(Map<String, Object> params);
    List<Defect> getDefect(Map<String, Object> params);
}
