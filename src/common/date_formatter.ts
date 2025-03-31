const getRegExp = (pattern: string, flags?: string): RegExp => {
    return new RegExp(pattern, flags);
};
// 传递的value为时间戳
export function date_formatter(value: string | number | Date, formatStr: string): string {
    // debugger;
    // 处理时间戳
    if ((value + "").length === 10) {
        value = Number(value) * 1000;
    }

    const date = new Date(value);
    const Week = ["日", "一", "二", "三", "四", "五", "六"];

    // 定义替换规则
    const replacements = {
        yyyy: date.getFullYear(),
        YYYY: date.getFullYear(),
        yy: String(date.getFullYear()).slice(-2),
        YY: String(date.getFullYear()).slice(-2),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        M: date.getMonth() + 1,
        DD: String(date.getDate()).padStart(2, '0'),
        dd: String(date.getDate()).padStart(2, '0'),
        d: date.getDate(),
        hh: String(date.getHours()).padStart(2, '0'),
        h: date.getHours(),
        mm: String(date.getMinutes()).padStart(2, '0'),
        m: date.getMinutes(),
        ss: String(date.getSeconds()).padStart(2, '0'),
        s: date.getSeconds(),
        w: Week[date.getDay()],
        W: Week[date.getDay()]
    };

    // 执行替换
    return Object.entries(replacements).reduce((str, [key, value]) => {
        return str.replace(getRegExp(key, 'g'), String(value));
    }, formatStr);
}
function check_one_day(start, end) {
    let _start = new Date(start);
    let _end = new Date(end);
    return _start.getFullYear() === _end.getFullYear() && _start.getMonth() === _end.getMonth() && _start.getDate() === _end.getDate();
}
export function formatDate(date) {
    if (date) {
        // debugger
        let _date = Number(date);
        if ((date + "").length === 10) {
            _date = Number(date) * 1000;
        }
        let __date = new Date(_date);
        if (check_one_day(_date, new Date())) {
            if (__date.getHours() < 18) {
                return date_formatter(__date, "今天 hh:mm");
            } else {
                return date_formatter(__date, "今晚 hh:mm");
            }
        } else {
            return date_formatter(__date, "MM月dd日 hh:mm");
        }
    } else {
        return ""
    }

}


export default date_formatter;