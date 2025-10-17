package wizard.ShinYoungInd.common.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * packageName      : wizard.naDaum.common.dto
 * fileName         : Menu
 * author           : sooJeong
 * date             : 2024-10-29
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-29         sooJeong             최초 생성
 */

@NoArgsConstructor
@Getter
@Setter
public class Menu {
    public String menuID;
    public String menu;
    public String link;
    public String programID;
    public String parentID;
    public String pgGubun;
    public int level;
    public int seq;
    public String searchYN;
    public String addYN;
    public String updateYN;
    public String deleteYN;
    public String printYN;
    public List<Menu> subMenu = new ArrayList<>();
}

