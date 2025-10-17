package wizard.ShinYoungInd.product.pattern;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * packageName      : wizard.SeungWoo.product.pattern
 * fileName         : PatternMapper
 * author           : sooJeong
 * date             : 2025-03-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-03-07         sooJeong             최초 생성
 */
@Mapper
public interface PatternMapper {
    public List<Pattern> getProcessPattern();
    public List<Pattern> getPatternDetail(String patternID);
    public void savePattern(Pattern pattern);
    public void savePatternSub(Pattern pattern);
    public void updatePattern(Pattern pattern);
    public void deletePattern(String patternID);

}
