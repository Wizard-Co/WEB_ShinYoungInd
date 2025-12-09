package wizard.ShinYoungInd.sysMgmt.login;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class Aes256Util {

    // C#과 동일한 key / iv 사용해야 함
    private static final String key = "12345678901234567890123456789012"; // 32byte
    private static final String iv  = "1234567890123456";                // 16byte

    public static String decrypt(String encrypted) {
        try {
            byte[] keyBytes = key.getBytes("UTF-8");
            byte[] ivBytes  = iv.getBytes("UTF-8");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

            SecretKeySpec keySpec = new SecretKeySpec(keyBytes, "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);

            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

            byte[] decodedBytes = Base64.getDecoder().decode(encrypted);
            byte[] decrypted = cipher.doFinal(decodedBytes);

            return new String(decrypted, "UTF-8");

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
