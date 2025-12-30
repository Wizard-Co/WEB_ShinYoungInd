package wizard.ShinYoungInd.sysMgmt.login;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import wizard.ShinYoungInd.sysMgmt.login.Dto.LoginDto;
import wizard.ShinYoungInd.sysMgmt.login.Dto.Utils;
import wizard.ShinYoungInd.sysMgmt.login.Aes256Util;   // ⭐ 반드시 추가해야 함


import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
/**
 * packageName      : wizard.naDaum.sysMgmt.login
 * fileName         : loginController
 * author           : 이준협
 * date             : 2025-01-14
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-14         이준협             최초 생성
 * 2025-01-15        sooJeong          로직 수정
 */
@Controller
@AllArgsConstructor
@RequestMapping("/sysMgmt/userLogin")
@Slf4j
public class UserLoginController {

    private UserLoginService service;
    private LoginManager loginManager;

    @PostMapping("/")
    public String loginProc(
            HttpSession session,
            Model model,
            String userID,
            String password,
            HttpServletResponse response,
            HttpServletRequest request
    ) throws IOException {

        // ===============================
        // 아이디별 실패 횟수 Map
        // ===============================
        Map<String, Integer> failedMap =
                (Map<String, Integer>) session.getAttribute("failedAttemptsMap");

        if (failedMap == null) {
            failedMap = new HashMap<>();
            session.setAttribute("failedAttemptsMap", failedMap);
        }

        int failedAttempts = failedMap.getOrDefault(userID, 0);

        // ===============================
        // ❗ 이미 5회 초과 → 바로 잠김 메시지
        // ===============================
        if (failedAttempts >= 5) {
            service.personLock(userID);

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            // 🔥 JS가 읽는 key = error
            response.getWriter().write(
                    "{\"error\":\"로그인 시도가 너무 많습니다. 계정이 잠겼습니다.\"}"
            );
            return null;
        }

        // ===============================
        // URL 디코딩
        // ===============================
        password = java.net.URLDecoder.decode(
                password,
                java.nio.charset.StandardCharsets.UTF_8
        );

        // ===============================
        // AES 암호문 여부 판별
        // ===============================
        boolean isAesEncrypted = false;
        byte[] decodedBytes;

        try {
            decodedBytes = java.util.Base64.getDecoder().decode(password);
            if (decodedBytes.length % 16 == 0) {
                isAesEncrypted = true;
            }
        } catch (IllegalArgumentException e) {
            isAesEncrypted = false;
        }

        String decryptedPassword =
                isAesEncrypted ? Aes256Util.decrypt(password) : password;

        // ===============================
        // 로그인 검증
        // ===============================
        LoginDto dto = service.xp_Common_Login(userID, decryptedPassword);
        String error = dto.getResult();

        if (error == null || error.isEmpty()) {
            // ===============================
            // 로그인 성공
            // ===============================
            loginManager.setLoginUser(userID);

            // ✅ 성공 시 해당 아이디 실패 횟수 초기화
            failedMap.remove(userID);

            session.setAttribute("userID", userID);
            session.setMaxInactiveInterval(-1);

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write("{\"redirectUrl\":\"/\"}");

            return null;

        } else {
            // ===============================
            // 로그인 실패
            // ===============================
            failedAttempts++;
            failedMap.put(userID, failedAttempts);

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");

            // ❗ 이번 실패로 5회 도달 → 잠금 처리
            if (failedAttempts >= 5) {
                service.personLock(userID);

                response.getWriter().write(
                        "{\"error\":\"로그인 시도가 너무 많습니다. 계정이 잠겼습니다.\"}"
                );
                return null;
            }

            String errorMessage =
                    error + " (실패 횟수: " + failedAttempts + "/5)";

            response.getWriter().write(
                    "{\"error\":\"" + errorMessage + "\"}"
            );
            return null;
        }
    }


    @PostMapping("/logout")
    public String logout(HttpSession session) {
        log.info("로그아웃 요청이 들어왔습니다.");

        // 세션 무효화
        session.invalidate();
        log.info("세션이 무효화되었습니다.");

        // 로그아웃 후 리다이렉트
        log.info("로그아웃 후 리다이렉트: /login");
        return "redirect:/";

    }
    @GetMapping("/getSessionInfo")
    public ResponseEntity<Map<String, String>> getSessionInfo(HttpSession session) {
        // 세션에서 userID와 password 가져오기
        String userID = (String) session.getAttribute("userID");
        String password = (String) session.getAttribute("Password");

        // 세션에 값이 없으면 빈 객체로 반환
        if (userID == null || password == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new HashMap<>());
        }

        // 세션에서 가져온 값을 Map에 담아서 반환
        Map<String, String> sessionInfo = new HashMap<>();
        sessionInfo.put("userID", userID);
        sessionInfo.put("Password", password);
        return ResponseEntity.ok(sessionInfo);
    }
}
