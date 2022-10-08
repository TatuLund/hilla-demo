import { Validator } from '@hilla/form';

export class PastOrPresentWeekdayAndRequired implements Validator<string> {
    message = "date input is not valid";
    validate = (date: string) => this.pastOrPresentWeekdayAndRequired(date);

    pastOrPresentWeekdayAndRequired(date : string) : boolean {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const now = Date.parse(today.toDateString());
        const other = Date.parse(date);
        const otherDate = new Date(other);
        return (other <= now) && (otherDate.getDay() != 0) && (otherDate.getDay() != 6);    
    }    
}