package wizard.ShinYoungInd.qul.overview.dateProd;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.List;
import java.util.Map;

@Mapper
public interface DateProdMapper {

    List<CMCode> getWorkProcess(@Param("nchkProc") int nChkProc, @Param("ProcessID") String ProcessID);
    List<CMCode> getMachineList(@Param("sProcessID") String ProcessID);
    List<Overview> getDateProdData(Map<String, Object> params);
}
