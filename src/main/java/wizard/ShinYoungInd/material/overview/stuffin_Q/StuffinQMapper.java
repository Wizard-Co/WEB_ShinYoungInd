package wizard.ShinYoungInd.material.overview.stuffin_Q;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.material.overview.DTO.Overview;

import java.util.List;
import java.util.Map;
/**
 * packageName      : wizard.YoungNam.material.overview.stuffin_Q
 * fileName         : StuffinQMapper
 * author           : hd
 * date             : 2025-11-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-21         hd             최초 생성
 */


@Mapper
public interface StuffinQMapper {
    List<Overview> getStuffinQ(Map<String,Object> params);
}