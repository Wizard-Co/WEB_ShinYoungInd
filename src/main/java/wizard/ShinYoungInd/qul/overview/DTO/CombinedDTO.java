package wizard.ShinYoungInd.qul.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class CombinedDTO {
    //제품군별
    private List<Overview> defectArticleData;
    private List<Overview> modelDefectData;
    private List<Overview> typeDefectData;
    private List<Overview> workerDefectData;
    //엑스방
    private List<Overview> raMinAndMaxData;
    private List<Overview> xBarSummaryData;
    private List<Overview> inputUiData;
    private List<Overview> subTableData;

}
