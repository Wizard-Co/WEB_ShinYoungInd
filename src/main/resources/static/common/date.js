/**
 작성자:    김수정
 작성일:    2025-04-29
 내용:
 **********************************************
 변경일자        변경자         요청자
 **********************************************
 **/
class DateManager {

    constructor() {
        this.currentDate = new Date();
        this.sDateValue = new Date(this.currentDate);
        this.eDateValue = new Date(this.currentDate);
    }

    getToday() {
        return new Date();
    }

    /*
    이번달 1일
     */
    getFirstDayOfThisMonth() {
        const firstDay = new Date(this.sDateValue.getFullYear(), this.sDateValue.getMonth(), 1);
        this.sDateValue = new Date(firstDay);
        return firstDay;
    }

    /*
    이번달 말일
     */
    getLastDayOfThisMonth() {
        const lastDay = new Date(this.eDateValue.getFullYear(), this.eDateValue.getMonth() + 1, 0);
        this.eDateValue = new Date(lastDay);
        return lastDay;
    }

    /*
    지난달 1일
     */
    getFirstDayOfLastMonth() {
        const firstDay = new Date(this.sDateValue.getFullYear(), this.sDateValue.getMonth() - 1, 1);
        this.sDateValue = new Date(firstDay);
        return firstDay;
    }

    /*
    지난달 말일
     */
    getLastDayOfLastMonth() {
        const lastDay = new Date(this.eDateValue.getFullYear(), this.eDateValue.getMonth(), 0); // 현재 달의 0일 => 지난달 마지막 날
        this.eDateValue = new Date(lastDay);
        return lastDay;
    }

    getYesterDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        return this.currentDate;
    }

    setDate(date) {
        this.currentDate = new Date(date);
    }

    getCurrentDate() {
        return new Date(this.currentDate);
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줌
        const day = date.getDate().toString().padStart(2, '0'); // 날짜가 1자리일 경우 앞에 0을 채워줌
        return `${year}-${month}-${day}`;
    }
}

const btnToday = document.getElementById('btnToday') ?? '';
const btnThisMonth = document.getElementById('btnThisMonth') ?? '';
const btnYesterDay = document.getElementById('btnYesterDay') ?? '';
const btnLastMonth = document.getElementById('btnLastMonth') ?? '';

const sDate = document.getElementById('sDate') ?? ''; //시작일 input
const eDate = document.getElementById('eDate') ?? ''; //종료일 input

const dateManager = new DateManager();

btnToday.addEventListener("click", () => {
    if (btnToday.checked) {
        const today = dateManager.getToday();
        sDate.value = dateManager.formatDate(today);
        eDate.value = dateManager.formatDate(today);
    }
});

btnThisMonth.addEventListener("click", () => {
    if (btnThisMonth.checked) {
        const firstDay = dateManager.getFirstDayOfThisMonth();
        const lastDay = dateManager.getLastDayOfThisMonth();
        sDate.value = dateManager.formatDate(firstDay);
        eDate.value = dateManager.formatDate(lastDay);
    }
});

btnYesterDay.addEventListener("click", () => {
    if (btnYesterDay.checked) {
        const yesterday = dateManager.getYesterDay();
        sDate.value = dateManager.formatDate(yesterday);
        eDate.value = dateManager.formatDate(yesterday);
    }
});

btnLastMonth.addEventListener("click", () => {
    if (btnLastMonth.checked) {
        const firstDayLastMonth = dateManager.getFirstDayOfLastMonth();
        const lastDayLastMonth = dateManager.getLastDayOfLastMonth();
        sDate.value = dateManager.formatDate(firstDayLastMonth);
        eDate.value = dateManager.formatDate(lastDayLastMonth);
    }
});