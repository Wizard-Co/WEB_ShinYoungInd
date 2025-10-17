package wizard.ShinYoungInd.mc.code;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.mc.code.DTO.MC;

import java.util.List;
import java.util.Map;

@Mapper
public interface MCMapper {
    List<MC> getMCList(Map<String, Object> param);
    MC saveMC(MC MC);
    MC updateMC(MC MC);
    void deleteMC(String mcID);

}
