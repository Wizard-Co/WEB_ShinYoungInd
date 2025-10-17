package wizard.ShinYoungInd.baseMgmt.person;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;
import wizard.ShinYoungInd.baseMgmt.person.DTO.PersonLicense;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.common.dto.Menu;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.common.util.FTP;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.SeungWoo.baseMgmt.person
 * fileName         : PersonService
 * author           : sooJeong
 * date             : 2024-10-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-21         sooJeong             최초 생성
 */
@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonMapper mapper;
    private final HttpSession hs;
    private final FTP ftp;
    private final Date date;

    public List<Person> getPersonList(Map<String, Object> params) {
        return mapper.getPersonList(params);
    }

    public Person getPersonDetail(String personID) {
        Person person = mapper.getPersonDetail(personID);
        person.setEndDate(date.stringDateFormat(person.getEndDate()));
        person.setStartDate(date.stringDateFormat(person.getStartDate()));

        return person;
    }

    public List<CMCode> getDeart() {
        return mapper.getDepart();
    }

    public List<CMCode> getResably() {
        return mapper.getResably();
    }

    public void savePerson(Person person) throws IOException {
        Person loginUser = (Person)hs.getAttribute("loginUser");

        person.setCreateUserID(loginUser.getPersonID());
        person.setUseYN("Y");
        person.setBirth(date.stringDateFormat(person.getBirth()));
        person.setStartDate(date.stringDateFormat(person.getStartDate()));
        person.setEndDate(date.stringDateFormat(person.getEndDate()));

        mapper.savePerson(person);
        String personID = person.getPersonID();

        if (personID.isBlank()) return;

        savePersonMenu(person);
        uploadFile(person, person.fileList);

    }

    public void updatePerson(Person person) throws IOException {
        if (person.personID == null || person.personID.isBlank()) return;

        String personID = person.getPersonID();
        Person loginUser = (Person)hs.getAttribute("loginUser");

        person.setLastUpdateUserID(loginUser.getPersonID());  // 로그인한 userID 로 바꾸기
        person.setUseYN("Y");
        person.setStartDate(person.startDate.replace("-", ""));
        person.setEndDate(person.endDate.replace("-", ""));

        Person oldPerson = mapper.getPersonDetail(personID);
        List<MultipartFile> newOne = person.getFileList();
        List<String> oldfileNames = oldPerson.getFileNameList();

        for (int i = 0; i < newOne.size(); i++) {
            MultipartFile file = newOne.get(i);
            String delFilename = person.getDeleteFileList().get(i);

            String filePath = ftp.getPath("PERSON", "") + personID + "/";

            if (!file.isEmpty()) {
                if (!file.getOriginalFilename().equals(oldfileNames.get(i))) {
                    ftp.uploadFile(file, filePath);
                    setPersonFile(i, person, file.getOriginalFilename(), filePath);
                } else {
                    setPersonOldFile(i, person, oldPerson);
                }
            } else {
                if (delFilename.equals(oldfileNames.get(i)) && !delFilename.isBlank()) {
                    ftp.deleteFile(delFilename, filePath);
                    setPersonFile(i, person, "", "");
                } else {
                    setPersonOldFile(i, person, oldPerson);
                }
            }
        }
        mapper.updatePerson(person);
        savePersonMenu(person);

    }

    private void uploadFile(Person person, List<MultipartFile> fileList) {
        if (fileList == null || fileList.isEmpty()) return;

        String personID = person.getPersonID();

        for (int i = 0; i < fileList.size(); i++) {
            MultipartFile file = fileList.get(i);
            if (!file.isEmpty()) {
                String filePath = ftp.getPath("ARTICLE", "") + personID + "/";
                ftp.uploadFile(file, filePath);
                setPersonFile(i, person, file.getOriginalFilename(), filePath);
            }
        }
        mapper.updatePersonFTP(person);

    }

    private void setPersonFile(int index, Person person, String fileName, String filePath) {
        switch (index) {
            case 0:
                person.setFileName(fileName);
                person.setFilePath(filePath);
                break;
            case 1:
                person.setFileName2(fileName);
                person.setFilePath2(filePath);
                break;
            case 2:
                person.setFileName3(fileName);
                person.setFilePath3(filePath);
                break;
            case 3:
                person.setFileName4(fileName);
                person.setFilePath4(filePath);
                break;
        }
    }

    private void setPersonOldFile(int index, Person person, Person oldPerson) {
        switch (index) {
            case 0:
                person.setFileName(oldPerson.getFileName());
                person.setFilePath(oldPerson.getFilePath());
                break;
            case 1:
                person.setFileName2(oldPerson.getFileName2());
                person.setFilePath2(oldPerson.getFilePath2());
                break;
            case 2:
                person.setFileName3(oldPerson.getFileName3());
                person.setFilePath3(oldPerson.getFilePath3());
                break;
            case 3:
                person.setFileName4(oldPerson.getFileName4());
                person.setFilePath4(oldPerson.getFilePath4());
                break;
        }
    }

    public void deletePerson(String personID) throws IOException {
        String today = date.getToday();
        mapper.deletePerson(personID, today);
    }

    /**
     * 김수정, 전체메뉴트리 가져오기
     *
     * @return
     */
    public List<Menu> getMenuTree() {
        String pgGubun = "7";
        List<Menu> menuList = mapper.getMenuList(pgGubun);
        return setMenuTree("0", menuList);
    }

    /**
     * 김수정, 메뉴트리를 [메뉴ID, 메뉴명]의 Map으로 반환
     *
     * @param
     * @return
     */
    public Map<String, Menu> buildMenuMap(List<Menu> menuList) {
        Map<String, Menu> menuMap = new HashMap<>();

        for (Menu menu : menuList) {
            menuMap.put(menu.getMenuID(), menu);

            if (menu.getSubMenu() != null && !menu.getSubMenu().isEmpty()) {
                menuMap.putAll(buildMenuMap(menu.getSubMenu()));
            }
        }
        return menuMap;
    }

    /**
     * 김수정, 사원에 해당하는 메뉴를 맵형태 로 반환
     *
     * @param personID
     * @return
     */
    public Map<String, Menu> getPersonMenuMap(String personID) {
        String pgGubun = "7";
        List<Menu> list = mapper.getPersonMenu(personID, pgGubun);
        return buildMenuMap(list);
    }

    /**
     * 김수정, 사원에 해당하는 메뉴를 트리형태 로 반환
     *
     * @param personID
     * @return
     */
    public List<Menu> getPersonMenu(String personID) {
        String pgGubun = "7";
        List<Menu> list = mapper.getPersonMenu(personID, pgGubun);
        return setMenuTree("0", list);
    }


    /**
     * 김수정, List<MENU> 타입을 트리형태로 반환
     *
     * @param menuList
     * @return
     */

    private List<Menu> setMenuTree(String parentID, List<Menu> menuList){
        List<Menu> children = new ArrayList<>();
        for (Menu menu : menuList) {
            if (parentID.equals(menu.getParentID().trim())) {
                menu.setSubMenu(setMenuTree(menu.getMenuID().trim(), menuList));
                children.add(menu);
            }
        }
        return children;
    }

    public void savePersonMenu(Person person) {
        if (CollectionUtils.isEmpty(person.getMenuList())) return;

        String pgGubun = "7"; // 사무실은 7번
        mapper.deletePersonMenu(person.getPersonID(), "7");

        for (int i = 0; i < person.getMenuList().size(); i++) {
            Menu menu = person.getMenuList().get(i);
            menu.setLevel(menu.getParentID().length() == 1 ? 0 : 3);

            Map<String, Object> params = new HashMap<>();
            params.put("personID", person.getPersonID());
            params.put("pgGubun", pgGubun);
            params.put("menuID", menu.getMenuID());
            params.put("seq", i + 1);
            params.put("level", menu.getLevel());
            params.put("parentID", menu.getParentID());
            params.put("searchYN", menu.getSearchYN());
            params.put("addYN", menu.getAddYN());
            params.put("updateYN", menu.getUpdateYN());
            params.put("deleteYN", menu.getDeleteYN());
            params.put("printYN", menu.getPrintYN());
            params.put("createUserID", person.getLoginID());

            mapper.savePersonMenu(params);
        }
    }

    public boolean checkID(String loginID) {
        int result = mapper.checkID(loginID);
        if (result > 0) {
            return false;
        } else return true;
    }

}
