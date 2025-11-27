package wizard.ShinYoungInd.mc.machine;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * packageName      : wizard.YoungNam.mc.machine
 * fileName         : MachineMapper
 * author           : sooJeong
 * date             : 2025-11-27
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-27         sooJeong             최초 생성
 */
@Mapper
public interface MachineMapper {
    List<Machine> getMachine(String processID);
}
