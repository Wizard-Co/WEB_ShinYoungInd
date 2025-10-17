package wizard.ShinYoungInd.baseMgmt.person;

import org.apache.ibatis.annotations.Mapper;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;
import wizard.ShinYoungInd.baseMgmt.person.DTO.PersonLicense;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.common.dto.Menu;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.naDaum.baseMgmt.person
 * fileName         : PersonMapper
 * author           : sooJeong
 * date             : 2024-10-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-21         sooJeong             최초 생성
 */
@Mapper
public interface PersonMapper {

    List<Person> getPersonList(Map<String, Object> params);
    Person getPersonDetail(String personID);
    Person savePerson(Person person);
    Person updatePerson(Person person);
    void updatePersonFTP(Person person);
    void deletePerson(String personID, String endDate);
    void savePersonMenu(Map<String, Object> menu);
    void deletePersonMenu(String personID, String pgGubun);
    List<CMCode> getDepart();
    List<CMCode> getResably();
    List<Menu> getMenuList(String sPgGubun);
    List<Menu> getPersonMenu(String personID, String pgGubun);
    int checkID(String loginID);

}
