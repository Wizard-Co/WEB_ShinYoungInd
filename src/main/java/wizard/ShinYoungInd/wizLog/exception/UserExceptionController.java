/*
설명: 사용자 예외 처리 Controller
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.ShinYoungInd.wizLog.exception;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import wizard.ShinYoungInd.sysMgmt.login.LoginManager;
import wizard.ShinYoungInd.wizLog.exception.dto.UserExceptionDto;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Controller
@AllArgsConstructor
public class UserExceptionController {

    @Autowired
    private LoginManager loginManager;

    private UserExceptionService userExceptionService;

    @ExceptionHandler(UserException.class)
    public ResponseEntity<UserException> handleUserNotFoundException(UserException e){
        try {
            //IP
            InetAddress inetAddress = InetAddress.getLocalHost(); //현재 컴퓨터 IP

            UserException errorResponse = new UserException(e.getUserMessage(),e.getMessage(), e.getMapping(), inetAddress.getHostName(), e.getUserID(), e.getParam()); //TODO 로그인한 ID

            UserExceptionDto userExceptionDto = new UserExceptionDto();

            userExceptionDto.setNErrID(0);
            userExceptionDto.setSComputer(inetAddress.getHostName()); //컴퓨터 이름으로 변경
            userExceptionDto.setSUserID(loginManager.getPersonID()); //로그인한 ID
            userExceptionDto.setNErrNO(0);              //HttpStatus.INTERNAL_SERVER_ERROR.value()
            userExceptionDto.setSErrMsg(e.getMessage());
            userExceptionDto.setNErrIndex(0);

            //컴퓨터ID, userID, Errno Errindex ErrMsg
            Integer errid = userExceptionService.insertErrLog(userExceptionDto);
            userExceptionDto.setNErrID(errid);

            userExceptionDto.setNErrSeq(0);
            userExceptionDto.setSErrData(e.getMapping() +" "+ e.getParam());

            userExceptionService.insertErrLogSub(userExceptionDto);

            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (Exception ex){
            UserException exErrorResponse = new UserException("오류 발생",ex.getMessage());
            return new ResponseEntity<>(exErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<UserException> handleGeneralException(Exception e) throws UnknownHostException {
        //IP
        InetAddress inetAddress = InetAddress.getLocalHost(); //현재 컴퓨터 IP

        UserException errorResponse = new UserException("오류",e.getMessage(), "", inetAddress.getHostName(), "admin", ""); //TODO 로그인한 ID

        UserExceptionDto userExceptionDto = new UserExceptionDto();

        userExceptionDto.setNErrID(0);
        userExceptionDto.setSComputer(inetAddress.getHostName()); //컴퓨터 이름으로 변경
        userExceptionDto.setSUserID(loginManager.getPersonID());           //로그인한 ID
        userExceptionDto.setNErrNO(0);              //HttpStatus.INTERNAL_SERVER_ERROR.value()
        userExceptionDto.setSErrMsg(e.getMessage());
        userExceptionDto.setNErrIndex(0);

        //컴퓨터ID, userID, Errno Errindex ErrMsg
        Integer errid = userExceptionService.insertErrLog(userExceptionDto);
        userExceptionDto.setNErrID(errid);

        userExceptionDto.setNErrSeq(0);
        userExceptionDto.setSErrData(e.getMessage());

        userExceptionService.insertErrLogSub(userExceptionDto);

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
