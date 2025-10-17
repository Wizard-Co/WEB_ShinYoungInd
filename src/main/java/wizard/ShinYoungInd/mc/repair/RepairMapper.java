package wizard.ShinYoungInd.mc.repair;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.mc.repair.DTO.Repair;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.repair.DTO
 * fileName         : RepairMapper
 * author           : sooJeong
 * date             : 2025-07-30
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-07-30         sooJeong             최초 생성
 */
@Mapper
public interface RepairMapper {
    List<Repair> getRepair(Map<String, Object> params);
}
