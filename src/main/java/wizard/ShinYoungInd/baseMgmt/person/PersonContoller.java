package wizard.ShinYoungInd.baseMgmt.person;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.ShinYoungInd.baseMgmt.person.DTO.Person;
import wizard.ShinYoungInd.common.CMService;
import wizard.ShinYoungInd.common.dto.CMCode;
import wizard.ShinYoungInd.common.dto.Menu;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.naDaum.baseMgmt.person
 * fileName         : PersonContoller
 * author           : sooJeong
 * date             : 2024-10-18
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-18         sooJeong             최초 생성
 */

@Controller
@RequiredArgsConstructor
@RequestMapping("/baseMgmt/person")
public class PersonContoller {

    final private PersonService service;
    final private CMService cmService;
    final private LoginManager loginManager;
    @ModelAttribute
    public void setting(Model model) {
        List<CMCode> cboDepart = service.getDeart(); //부서
        List<CMCode> cboPosition = service.getResably(); //강사 직위

        List<CMCode> cboSolar = cmService.getCmCode("SLR"); // 양음력

        model.addAttribute("person", new Person());
        model.addAttribute("cboDepart", cboDepart);
        model.addAttribute("cboPosition", cboPosition);
        model.addAttribute("cboSolar", cboSolar);
    }

    @GetMapping("")
    public String home() {
        return "pages/baseMgmt/person/person";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Person> getPersonList(@RequestBody Map<String, Object> param) {
        List<Person> data = service.getPersonList(param);
        return data;
    }

    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "personID", required = true) String personID,
                               Model model) {

        Person person = service.getPersonDetail(personID);

        model.addAttribute("person", person);
        model.addAttribute("currentMenu", loginManager.getCurrentMenu());
        return "pages/baseMgmt/person/personDetail";
    }

    @PostMapping("/add")
    public String add(Model model) {
        model.addAttribute("currentMenu", loginManager.getCurrentMenu());
        return "pages/baseMgmt/person/personDetail";
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute Person person) {
        try {
            service.updatePerson(person);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/save")
    @ResponseBody
    public ResponseEntity<Object> save(@ModelAttribute Person person) {
        try {
            service.savePerson(person);
            return ResponseEntity.ok().build();
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @GetMapping("/delete")
    @ResponseBody
    public ResponseEntity<Object> delete(@RequestParam String personID) {
        try {
            service.deletePerson(personID);
            return ResponseEntity.ok().build();
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

    @PostMapping("/user-menu")
    public String getMenu(Model model, String personID,String mode) {
        List<Menu> menuTree = service.getMenuTree();
        model.addAttribute("mode", mode);
        model.addAttribute("menuTree", menuTree);

        if(mode.equals("update")) {
            Map<String, Menu> menuMap = service.getPersonMenuMap(personID);
            model.addAttribute("menuMap", menuMap);
        }

        return "pages/baseMgmt/person/user-menu";
    }

    @ResponseBody
    @GetMapping("/checkID")
    public ResponseEntity<Boolean> checkID(String loginID) {
         if(service.checkID(loginID)){
             return ResponseEntity.ok(true);
         } else {
             return ResponseEntity.status(HttpStatus.CONFLICT).body(false);
         }
    }
}
