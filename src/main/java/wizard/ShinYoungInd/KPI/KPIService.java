package wizard.ShinYoungInd.KPI;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.KPI.DTO.Defect;
import wizard.ShinYoungInd.KPI.DTO.Production;
import wizard.ShinYoungInd.common.util.Date;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.Production
 * fileName         : KPIService
 * author           : sooJeong
 * date             : 2025-06-09
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-06-09         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class KPIService {

    final private KPIMapper mapper;
    final private Date date;

    public List<Production> getProduction(Map<String, Object> params) {
        List<Production> list = mapper.getProduction(params);
        list.forEach(x -> x.setYyyyMM(date.stringDateFormat(x.getYyyyMM())));
        return list;
    }

    public List<Defect> getDefect(Map<String, Object> params) {
        List<Defect> list = mapper.getDefect(params);
        list.forEach(x -> x.setYyyyMM(date.stringDateFormat(x.getYyyyMM())));
        return list;
    }
}

