package wizard.ShinYoungInd;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;
import wizard.ShinYoungInd.sysMgmt.login.UserLoginService;
import wizard.ShinYoungInd.wizLog.log.LogService;
import wizard.ShinYoungInd.wizLog.log.dto.Log;

import java.net.UnknownHostException;

@Controller
@RequiredArgsConstructor
public class mainController {

    private final LoginManager loginManager;
    private final LogService logService;
    private final UserLoginService service;

    @GetMapping("/")
    public String login(Model model) {
        //Person loginUser = loginManager.getLoginUser();
        loginManager.setLoginUser("admin");

        //return "pages/order/overview/orderStock";
        return "redirect:/order/result/orderStock";
//
//        if (loginUser != null) {
//            return "pages/infoMgmt/infoSearch/infoSearch";
//        }else {
//            return "pages/sysMgmt/login/login";
//        }
    }
    /**
     * 2025.05.20, 김수정, 로그 저장
     * @param log
     * @return
     */
    @PostMapping("/log/insert")
    @ResponseBody
    public ResponseEntity<Object> saveLog(@RequestBody Log log) {
        try{
            int logId = logService.save(log);
            return ResponseEntity.ok(logId);
        } catch (UnknownHostException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    /**
     * 2025.05.20, 김수정, 비정상 종료할때 update
     * @param log
     * @return
     */
    @PostMapping("/log/update")
    @ResponseBody
    public ResponseEntity<Object> update(@RequestBody Log log) {
        try{
            logService.update(log); // insert하고 생성된 logID 반환
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }
}
