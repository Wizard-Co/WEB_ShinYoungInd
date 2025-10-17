package wizard.ShinYoungInd.mc.code;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.mc.code.DTO.MC;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MCService {

    final private MCMapper mapper;
    final private Date date;
    final private LoginManager loginManager;

    /**
     * 메인 목록 조회
     *
     * @param param
     * @return
     */
    public List<MC> getMCList(Map<String, Object> param) {
      List<MC> list = mapper.getMCList(param);
      list.forEach(x -> x.setInstallDate(date.stringDateFormat(x.getInstallDate())));
        return list;
    }

    /**
     * 추가 저장
     *
     * @param MC
     * @return
     */
    public MC saveMC(MC MC) {
        MC.setCreateUserID(loginManager.getPersonID());
        MC.setInstallDate(date.compactDate(MC.getInstallDate()));
        return mapper.saveMC(MC);
    }

    /**
     * 수정 저장
     *
     * @param MC
     * @return
     */
    public MC updateMC(MC MC) {
        MC.setLastUpdateUserID(loginManager.getPersonID());
        MC.setInstallDate(date.compactDate(MC.getInstallDate()));
        return mapper.updateMC(MC);
    }

    /**
     * 삭제
     *
     * @param mcID
     */
    public void deleteMC(String mcID) {
        mapper.deleteMC(mcID);
    }

    /**
     * 엑셀 다운로드
     *
     * @param response
     * @param data
     * @return
     * @throws IOException
     * @deprecated 수동 엑셀 저장
     */
    public byte[] excelDownload(HttpServletResponse response, @RequestParam List<MC> data) throws IOException {
        String fileName = "빅갯주";
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        SXSSFWorkbook workbook = new SXSSFWorkbook();
        Sheet sheet = workbook.createSheet("빅갯주");

        //column header
        String[] header = {"관리번호", "설비명", "제작사", "구매처", "담당자명", "사용연한", "마지막 점검일자"};
        SXSSFRow row = (SXSSFRow) sheet.createRow(0);

        CellStyle table_style = workbook.createCellStyle();
        table_style.setBorderTop(BorderStyle.THIN);
        table_style.setBorderBottom(BorderStyle.THIN);
        table_style.setBorderLeft(BorderStyle.THIN);
        table_style.setBorderRight(BorderStyle.THIN);

        for (int i = 0; i < header.length; i++) {
            SXSSFCell cell = row.createCell(i);
            cell.setCellValue(header[i]);
            cell.setCellStyle(table_style);
        }

        //body
        for (int i = 0; i < data.size(); i++) {
            SXSSFCell cell = null;
            row = (SXSSFRow) sheet.createRow(i + 1);

            cell = row.createCell(0);
            cell.setCellValue(data.get(i).getMcID());

            cell = row.createCell(1);
            cell.setCellValue(data.get(i).getMcName());

        }

        workbook.write(out);
        out.close();
        workbook.dispose();
        return out.toByteArray();
    }
}
