package wizard.ShinYoungInd.common;

import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;
import wizard.ShinYoungInd.baseMgmt.person.PersonService;
import wizard.ShinYoungInd.common.dto.Menu;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;

import java.util.Map;

/**
 * packageName      : wizard.naDaum.common
 * fileName         : Setting
 * author           : sooJeong
 * date             : 2025-01-15
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-15         sooJeong             최초 생성
 */

@ControllerAdvice
@RequiredArgsConstructor
public class Setting {
    private final LoginManager loginManager;
    private final PersonService personService;

    @ModelAttribute
    public void setting(Model model) {

        Person loginUser = loginManager.getLoginUser();
        if (loginUser != null) {
            model.addAttribute("loginUser", loginUser);
            model.addAttribute("userMenu", loginManager.getUserMenu());
        }
    }

    @ModelAttribute("currentMenu")
    public Menu setCurrentMenu(@RequestParam(required = false) String menuID) {
        if (menuID == null) return null;
        Menu currentMenu =  loginManager.getMenuMap().get(menuID);
        loginManager.setCurrentMenu(currentMenu);
        return currentMenu;
    }


}
