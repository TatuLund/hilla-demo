import { Validator } from '@hilla/form';

function pastOrPresent(date : string) : boolean {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const now = Date.parse(today.toDateString());
    const other = Date.parse(date);
    return other <= now;    
  }

const dateError = "date is required, date can't be in future";

export const pastOrPresentValidator : Validator<string> = {
    message: dateError,
    validate: (date: string) => pastOrPresent(date),
}
