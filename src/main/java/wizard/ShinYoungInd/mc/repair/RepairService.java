package wizard.ShinYoungInd.mc.repair;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.mc.repair.DTO.Repair;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.mc.repair
 * fileName         : RepairService
 * author           : sooJeong
 * date             : 2025-07-30
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-07-30         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class RepairService {
    private final RepairMapper mapper;

    public List<Repair> getRepair(Map<String, Object> params) {
        List<Repair> list = mapper.getRepair(params);
        list.forEach(x -> {
            switch (x.getCls()) {
                case 1 -> x.setRepairType("수리");
                case 2 -> x.setRepairType("교체");
                case 9 -> x.setRepairType("총계");
            }
        });
        return list;
    }
}
