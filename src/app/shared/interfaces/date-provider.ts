import { Dayjs, UnitType } from 'dayjs';

export interface IDateProvider {
  convertToUTC(date: Date): string;
  convertToDate(date: string | number | Date | Dayjs): Date;
  convertToISOString(date: Date): string;
  compareIsBefore(start_date: Date, end_date: Date): boolean;
  compareIsSame(start_date: Date, end_date: Date): boolean;
  diff(start_date: Date, end_date: Date, unit: UnitType): number;
  dateNow(): Date;
  addDays(days: number, custom_date?: Date): Date;
  addHours(hours: number, custom_date?: Date): Date;
  addMinutes(minutes: number, custom_date?: Date): Date;
}
