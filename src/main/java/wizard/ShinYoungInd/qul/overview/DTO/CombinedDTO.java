package wizard.ShinYoungInd.qul.overview.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
public class CombinedDTO {
    private List<Overview> defectArticleData;
    private List<Overview> modelDefectData;
    private List<Overview> typeDefectData;
    private List<Overview> workerDefectData;

}
