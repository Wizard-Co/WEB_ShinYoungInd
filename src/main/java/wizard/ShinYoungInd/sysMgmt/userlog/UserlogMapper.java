package wizard.ShinYoungInd.sysMgmt.userlog;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.sysMgmt.userlog.DTO.Userlog;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserlogMapper {

    List<Userlog> getUserlogList(Map<String, Object> params) ;


}
