package wizard.ShinYoungInd.common;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * packageName      : wizard.naDaum.common
 * fileName         : WebConfig
 * author           : sooJeong
 * date             : 2025-01-15
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-15         sooJeong             최초 생성
 */
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    private final LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .excludePathPatterns(
                        "/",
                        "/login",
                        "/sysMgmt/userLogin/", //login api
                        "/sysMgmt/login/**"
                                    );
    }

}

