package wizard.ShinYoungInd.sysMgmt.login;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;
import wizard.ShinYoungInd.baseMgmt.person.PersonService;
import wizard.ShinYoungInd.common.dto.Menu;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.naDaum.sysMgmt.login.Dto
 * fileName         : LoginManager
 * author           : sooJeong
 * date             : 2025-01-14
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-14         sooJeong             최초 생성
 */
@Component
@RequiredArgsConstructor
public class LoginManager {
    final private HttpSession hs;

    final private PersonService personService;
    private Person loginUser;
    private Map<String, Menu> menuMap;

    public void setLoginUser(String userID) {
        this.loginUser = personService.getPersonDetail(userID);
        // User별 메뉴 권한 넣어주기
        List<Menu> menuList = personService.getPersonMenu(userID);


        /** 2025.09.23, 김수정
         * 영남 기초관리, 조회만 웹 메뉴로
         */
//        List<Menu> basicMenu = menuList.stream()
//                .filter(x -> {
//                    String first = x.getMenuID().substring(0, 1);
//                    return first.equals("0") || first.equals("1");
//                })
//                .collect(Collectors.toList());


        setUserMenu(menuList);
        // CurrentMenu 조회에 필요한 MenuMap 넣어주기
        this.menuMap = personService.buildMenuMap(menuList);

        hs.setAttribute("loginUser", loginUser);
    }

    public Person getLoginUser() {
        return (Person) hs.getAttribute("loginUser");
    }

    public String getPersonID() {
        return loginUser.getPersonID().trim();
    }
    public void setCurrentMenu(Menu currentMenu){
        hs.setAttribute("currentMenu", currentMenu);
    }
    public Menu getCurrentMenu(){
        return (Menu) hs.getAttribute("currentMenu");
    }
    public void setUserMenu(List<Menu> UserMenu) {
        hs.setAttribute("userMenu", UserMenu);
    }
    public List<Menu> getUserMenu() {
        return (List<Menu>) hs.getAttribute("userMenu");
    }

    public Map<String, Menu> getMenuMap(){
        return this.menuMap;
    }

}