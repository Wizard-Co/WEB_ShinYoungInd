package wizard.ShinYoungInd.product.process;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.pre.baseMgmt.product
 * fileName         : ProcessMapper
 * author           : sooJeong
 * date             : 2024-12-10
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-12-10         sooJeong             최초 생성
 */
@Mapper
public interface ProcessMapper {
    List<Process> getProcess(Map<String, Object> param);
    List<Process> getProcessSub(String parentID);
    void saveProcess(Process process);
    void updateProcess(Process process);
    void deleteProcess(String processID, String lastUpdateUserID);

}
