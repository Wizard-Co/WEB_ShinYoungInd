package wizard.ShinYoungInd.product.planInput;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.product.planInput.DTO.PatternArticle;
import wizard.ShinYoungInd.product.planInput.DTO.Plan;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.product.planInput
 * fileName         : PlanMapper
 * author           : sooJeong
 * date             : 2025-02-11
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-02-11         sooJeong             최초 생성
 */
@Mapper
public interface PlanMapper {
    List<Plan> getPlanList(Map<String, Object> params);
    List<PatternArticle> getPatternDetail(Map<String, Object> params);
    List<PatternArticle> getPatternByArticleTypeID(String articleTypeID);
}
