package wizard.ShinYoungInd.common;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;

/**
 * packageName      : wizard.naDaum.common
 * fileName         : LoginInterceptor
 * author           : sooJeong
 * date             : 2025-01-15
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-15         sooJeong             최초 생성
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Autowired
    private HttpSession session;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Person loginUser = (Person)session.getAttribute("loginUser");
        if(loginUser == null){
            response.sendRedirect("/");
            return false;
        }
        return true;
    }
}
