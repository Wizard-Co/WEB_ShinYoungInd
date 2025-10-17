package wizard.ShinYoungInd.sysMgmt.login;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.sysMgmt.login.Dto.LoginDto;

@Mapper
public interface UserLoginMapper {

    LoginDto xp_Common_Login(String userID, String password);

}
