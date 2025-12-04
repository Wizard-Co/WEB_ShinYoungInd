package wizard.ShinYoungInd.common;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.product.process.Process;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * packageName      : common
 * fileName         : ArticleService
 * author           : sooJeong
 * date             : 2024-10-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-07         sooJeong             최초 생성
 */
@Mapper
public interface CMMapper {
    List<CMCode> getCmCode(String codeTypeID);

    List<CMCode> getCmCodeOld(String codeTypeID);
    List<CMCode> getArticleGrp();

    List<LinkedHashMap<String, Object>> getPlusFinder(HashMap<String, Object> param);
    List<Process> getProcess(HashMap<String, Object> param);

    List<CMCode> getCmCodeOldRel(String codeTypeID, String psRelation);


}
