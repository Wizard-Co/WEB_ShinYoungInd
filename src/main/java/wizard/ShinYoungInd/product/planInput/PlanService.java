package wizard.ShinYoungInd.product.planInput;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.product.planInput.DTO.PatternArticle;
import wizard.ShinYoungInd.product.planInput.DTO.Plan;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * packageName      : wizard.SeungWoo.product.planInput
 * fileName         : PlanService
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanMapper mapper;

    public List<Plan> getPlanList(Map<String, Object> param) {
        return mapper.getPlanList(param);
    }

    public List<PatternArticle> getPatternDetail(Map<String, Object> param) {
        return mapper.getPatternDetail(param);
    }

    public Map<String, String> getPatternByArticleTypeID(String articleTypeID) {
        List<PatternArticle> before = mapper.getPatternByArticleTypeID(articleTypeID);
        return convertToPattern(before);
    }

    private Map<String, String> convertToPattern(List<PatternArticle> list) {
        Map<String, List<PatternArticle>> grouped = list.stream()
                .collect(Collectors.groupingBy(
                        PatternArticle::getPatternID,
                        Collectors.toList()));

        Map<String, String> result = grouped.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey(), //key: patternID
                        entry -> {
                            String patternID = entry.getKey();
                            String pattern = entry.getValue().get(0).getPattern(); // value: pattern
                            String process = entry.getValue().stream().map(PatternArticle::getProcess).collect(Collectors.joining("-> ")); // process 별로 추출해서 얘네를 가로배열로 이음
                            return patternID + ". " + pattern + ": " + process;
                        }
                                         ));

        return result;
    }
}
