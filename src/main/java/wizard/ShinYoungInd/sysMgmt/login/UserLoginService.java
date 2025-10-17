package wizard.ShinYoungInd.sysMgmt.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;
import wizard.ShinYoungInd.baseMgmt.person.PersonService;
import wizard.ShinYoungInd.common.dto.Menu;
import wizard.ShinYoungInd.sysMgmt.login.Dto.LoginDto;

import java.util.List;
import java.util.stream.Collectors;

/**
 *설명          :
 *작성일         : 2024.11월.05일
 *개발자         : jhd
 *======================================================
 *DATE             AUTHOR               NOTE
 *------------------------------------------------------
 *2025.01월.07일           LJH             최초 생성
 * 2025-01-15       sooJeong        로그인 관련 추가
 **/
@Service
public class UserLoginService {

    private final LoginManager loginManager;
    private final PersonService personService;
    @Autowired
    private UserLoginMapper mapper;

    @Autowired
    public UserLoginService(LoginManager loginManager, PersonService personService) {
        this.loginManager = loginManager;
        this.personService = personService;
    }

    public LoginDto xp_Common_Login(String loginId, String password) {
        return mapper.xp_Common_Login(loginId, password);
    }

}
