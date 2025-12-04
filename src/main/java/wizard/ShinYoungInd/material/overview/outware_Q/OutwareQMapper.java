package wizard.ShinYoungInd.material.overview.outware_Q;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.material.overview.DTO.OutwareView;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.YoungNam.material.overview.outware_Q;
 * fileName         : OutwareQMapper
 * author           : hd
 * date             : 2025-11-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-11-21         hd             최초 생성
 */



@Mapper
public interface OutwareQMapper {

    List<OutwareView> getOutwareQ(Map<String,Object> params);
//    System.out.println("조회된 데이터 수: " + outwareViews.size());

}
