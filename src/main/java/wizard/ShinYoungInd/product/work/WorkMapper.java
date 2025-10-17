package wizard.ShinYoungInd.product.work;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.work
 * fileName         : WorkMapper
 * author           : sooJeong
 * date             : 2025-05-26
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-05-26         sooJeong             최초 생성
 */
@Mapper
public interface WorkMapper {
    List<Work> getWorkList(Map<String, Object> params);
    List<Defect> getDefect();
    Work save(Work work);
    void update(Work work);
    void delete(String workID);
}
