package wizard.ShinYoungInd.qul.overview.xbar;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.qul.overview.DTO.CombinedDTO;
import wizard.ShinYoungInd.qul.overview.DTO.Overview;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class XbarService {

    private final XbarMapper mapper;

    public List<Overview> getXbarData(Map<String, Object> params) {

        List<wizard.ShinYoungInd.qul.overview.DTO.Overview> overviews = mapper.getXbarData(params);
        return overviews;
    }

    public CombinedDTO getSubData(Map<String, Object> params) {

        CombinedDTO overviews = new CombinedDTO();

        List<Overview> raMinAndMaxData = mapper.getRaMinAndRaMaxData(params);
        List<Overview> subXbarData = mapper.getSubXbarData(params);

        List<Overview> inputUiData = new ArrayList<>();
        List<Overview> subTableData = new ArrayList<>();

        for (Overview item : subXbarData) {
            if (item.getSeq() == 9999) {
                inputUiData.add(item);
            } else {
                subTableData.add(item);
            }
        }

        overviews.setRaMinAndMaxData(raMinAndMaxData);
        overviews.setInputUiData(inputUiData);
        overviews.setSubTableData(subTableData);
        //overviews.setXBarSummaryData(subXbarData);

        return overviews;
    }
}
