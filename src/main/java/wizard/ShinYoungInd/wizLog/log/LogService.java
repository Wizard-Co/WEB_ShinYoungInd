/*
설명: log 서비스
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

*/

package wizard.ShinYoungInd.wizLog.log;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.ShinYoungInd.common.util.Date;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;
import wizard.ShinYoungInd.wizLog.log.dto.Log;
import wizard.ShinYoungInd.wizLog.log.dto.LogDto;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class LogService {
    private final LogMapper logMapper;
    private final LoginManager loginManager;
    private final Date date;

    @Transactional
    public void logSave(String procedure, String gbn, String programID, Object param) throws UnknownHostException {
        //dto 데이터 입력
        LogDto logDto = new LogDto();

        //일자
        DateTimeFormatter formatterDate = DateTimeFormatter.ofPattern("yyyyMMdd");
        String formattedDate = LocalDate.now().format(formatterDate); //yyyyMMdd로 변경

        //시간
        DateTimeFormatter formatterTime = DateTimeFormatter.ofPattern("HHmm");
        String formattedTime = LocalTime.now().format(formatterTime); //HHmm으로 변경

        //IP
        InetAddress inetAddress = InetAddress.getLocalHost(); //현재 컴퓨터 IP

        logDto.setComputerID(inetAddress.getHostName()); //컴퓨터 이름
        logDto.setUserID(loginManager.getPersonID()); //로그인ID

        String stringParam = param.toString(); //오브젝트를 String으로 변경

        logDto.setLogData(procedure + " " + stringParam); //프로시저 이름, 파라미터

        logDto.setSMenuID("");              //menuID
        logDto.setSWorkFlag(gbn);           //C 추가 R 조회 U 수정 D 삭제
        logDto.setSWorkDate(formattedDate); //일자
        logDto.setSWorkTime(formattedTime); //시간
        logDto.setSUserID(loginManager.getPersonID());    //로그인ID
        logDto.setSWorkComputer(inetAddress.getHostName()); //컴퓨터 이름
        logDto.setSWorkComputerIP(inetAddress.getHostAddress()); //현재 컴퓨터 IP
        logDto.setSWorkLog("");          //화면이름
        logDto.setSProgramID(programID); //화면이름 mt_menu programID

        //화면 로그 RepairMapper
        logMapper.xp_iWorkLogWeb(logDto);
        //로그 RepairMapper
        logMapper.xp_iLog(logDto);
    }
    public int save(Log log) throws UnknownHostException{
        // last Log update
        Log lastLog = log;
        lastLog.setLogID(log.getLastLogID());
        update(lastLog);
        // 지금꺼는 insert 하고
        insert(log);
        int logID = log.getLogID();
        return logID;
    }
    public void insert(Log log) throws UnknownHostException{
        InetAddress local = InetAddress.getLocalHost();

        log.setWorkDate(date.getToday());
        log.setWorkTime(date.getTodayTime());
        log.setStartDate(date.getToday());
        log.setStartTime(date.getTodayTime());
        log.setUserID(loginManager.getPersonID());
        log.setDesktop(local.getHostName());
        log.setDesktopIP(local.getHostAddress());
        logMapper.insert(log);
    }
    public void update(Log log){
        log.setEndDate(date.getToday());
        log.setEndTime(date.getTodayTime());
        logMapper.update(log);
    }


}
