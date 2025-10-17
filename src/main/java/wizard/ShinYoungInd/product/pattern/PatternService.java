package wizard.ShinYoungInd.product.pattern;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;

import java.util.List;

/**
 * packageName      : wizard.SeungWoo.product.pattern
 * fileName         : PatternService
 * author           : sooJeong
 * date             : 2025-03-07
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-03-07         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class PatternService {

    private final PatternMapper mapper;
    private final LoginManager loginManager;

    List<Pattern> getProcessPattern(){
        return mapper.getProcessPattern();
    }
    List<Pattern> getPatternDetail(String patternID){
        return mapper.getPatternDetail(patternID);
    }
    public void savePattern(Pattern pattern){
        pattern.setCreateUserID(loginManager.getPersonID() == null ? "test" : loginManager.getPersonID());
        mapper.savePattern(pattern);
        String patternID = pattern.getPatternID();
        if(patternID != null) savePatternSub(patternID, pattern.getPatternList());

    }

    public void updatePattern(Pattern pattern){
        String workID = "0001";
        pattern.setWorkID(workID);
        pattern.setLastUpdateUserID(loginManager.getPersonID() == null ? "test" : loginManager.getPersonID());
        mapper.updatePattern(pattern);
        savePatternSub(pattern.getPatternID(), pattern.getPatternList());
    }

    private void savePatternSub(String patternID, List<Pattern> patternList) {
        if (patternList == null || patternList.isEmpty()) return;

        for(int i=0; i < patternList.size(); i++){
            Pattern sub = patternList.get(i);
            sub.setCreateUserID(loginManager.getPersonID() == null ? "test" : loginManager.getPersonID()); //로그인 되면 바꾸기
            mapper.savePatternSub(sub);
        }

    }
}
