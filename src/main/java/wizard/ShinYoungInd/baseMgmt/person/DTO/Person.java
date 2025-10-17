package wizard.ShinYoungInd.baseMgmt.person.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import wizard.ShinYoungInd.common.dto.Menu;

import java.util.Arrays;
import java.util.List;

/**
 * packageName      : wizard.naDaum.baseMgmt.person.DTO
 * fileName         : Person
 * author           : sooJeong
 * date             : 2024-10-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-21         sooJeong             최초 생성
 */

@NoArgsConstructor
@Getter
@Setter
public class Person {
    public String personID;
    public String name;
    public String loginID;
    public String password;
    public String departID;
    public String depart;
    public String registNo;
    public String birth;
    public String solarTypeID;
    public String solar;
    public String resablyID;
    public String resably;
    public String zipCode;
    public String address;
    public String addressDetail;
    public String addressJibun;
    public String fileName;
    public String filePath;
    public String fileName2;
    public String filePath2;
    public String fileName3;
    public String filePath3;
    public String fileName4;
    public String filePath4;
    public String remark;
    public String bankName;
    public String bankAccount;
    public String email;
    public String startDate;
    public String endDate;
    public String handPhone;
    public String phone;
    public String endReason;
    public String useYN;
    public String passwordChangeDate;
    public String sexTypeID;
    public String createDate;
    public String createUserID;
    public String lastUpdateDate;
    public String lastUpdateUserID;

    public List<Menu> menuList;
    public List<MultipartFile> fileList;
    public List<String> deleteFileList;
    public List<PersonLicense> licenseList;

    public List<String> getFileNameList() {
        List<String> fileNames = Arrays.asList(fileName, fileName2, fileName3, fileName4);
        return fileNames;
    }
}
