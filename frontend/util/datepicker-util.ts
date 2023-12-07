import { DatePicker, DatePickerDate } from '@vaadin/date-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { uiStore } from 'Frontend/stores/app-store';
import { lang } from './localization';

export const formatDateIso8601 = (dateParts: DatePickerDate): string => {
    const { year, month, day } = dateParts;
    const date = new Date(year, month, day);
  
    return dateFnsFormat(date, lang.getDateFormat(uiStore.lang, false));
};

export const checkAllowedFormat = (inputValue: string): boolean  => {
    var date : Date;
    if (inputValue.length > 8) {
        date = dateFnsParse(inputValue, lang.getDateFormat(uiStore.lang), new Date());
    } else {
        date = dateFnsParse(inputValue, lang.getDateFormat(uiStore.lang, true), new Date());
    }
    if (date.toDateString() === "Invalid Date") {
        return false;
    }
    return true;
};


// Allow the user to input the date using both the two digit
// and four digit year format.
export const parseDateIso8601 = (inputValue: string): DatePickerDate => {
    var date : Date;
    if (inputValue.length > 8) {
        date = dateFnsParse(inputValue, lang.getDateFormat(uiStore.lang), new Date());
    } else {
        date = dateFnsParse(inputValue, lang.getDateFormat(uiStore.lang, true), new Date());
    }
    return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
};
  
export function setFormatter(datePicker: DatePicker) {
    datePicker.i18n = {
        ...datePicker.i18n,
        formatDate: formatDateIso8601,
        parseDate: parseDateIso8601,
    };
}

export function updateI18n(datePicker : DatePicker, key : string) {
    datePicker.i18n.monthNames = lang.getMonths(key);
    datePicker.i18n.weekdays = lang.getWeekdays(key);
    datePicker.i18n.weekdaysShort = lang.getWeekdays(key, true);
    datePicker.i18n.today = lang.getText(key, "dp-today");
    datePicker.i18n.cancel = lang.getText(key, "dp-cancel");
    datePicker.i18n.firstDayOfWeek=lang.getFirstDayOfWeek(key);
}