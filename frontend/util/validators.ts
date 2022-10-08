import { Validator } from '@hilla/form';

function pastOrPresentWeekdayAndRequired(date : string) : boolean {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const now = Date.parse(today.toDateString());
    const other = Date.parse(date);
    const otherDate = new Date(other);
    return (other <= now) && (otherDate.getDay() != 0) && (otherDate.getDay() != 6);    
  }

const dateError = "date is required, date can't be in future, date must be weekday";

export const pastOrPresentWeekdayAndRequiredValidator : Validator<string> = {
    message: dateError,
    validate: (date: string) => pastOrPresentWeekdayAndRequired(date),
}
