package wizard.ShinYoungInd.common.util;

import jakarta.annotation.PostConstruct;
import org.apache.commons.configuration2.INIConfiguration;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.springframework.stereotype.Component;

import java.io.File;

/**
 * packageName      : wizard.naDaum.common.util
 * fileName         : INIReader
 * author           : sooJeong
 * date             : 2025-01-17
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-17         sooJeong             최초 생성
 */

@Component
public class INIReader {
    private INIConfiguration iniConf;

    @PostConstruct
    public void Init() {
        try {
            Configurations configs = new Configurations();
            iniConf = configs.ini(new File("C:\\Windows\\Wizard.ini"));
        } catch (Exception e) {
            throw new RuntimeException("INI 파일을 로드하는 중 오류 발생", e);
        }
    }

    public String getProperty(String key, String defaultValue) {
        if (iniConf == null) {
            throw new IllegalStateException("INI 파일이 로드되지 않았습니다.");
        }
        return iniConf.getString(key, defaultValue);
    }

    public int getPort(String key, int defaultValue) {
        if (iniConf == null) {
            throw new IllegalStateException("INI 파일이 로드되지 않았습니다.");
        }
        return iniConf.getInt(key, defaultValue);
    }
}
