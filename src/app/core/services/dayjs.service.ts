import { Injectable } from '@angular/core';
import dayjs, { Dayjs, UnitType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IDateProvider } from 'src/app/shared/interfaces/date-provider';

dayjs.extend(utc);

@Injectable({
  providedIn: 'root'
})
export class DayjsService implements IDateProvider {
  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  convertToDate(date: string | number | Date | Dayjs): Date {
    return dayjs(date).toDate();
  }

  convertToISOString(date: Date): string {
    return dayjs(date).toISOString();
  }

  compareIsBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(end_date).isBefore(start_date);
  }

  compareIsSame(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isSame(end_date);
  }

  diff(start_date: Date, end_date: Date, unit: UnitType): number {
    return dayjs(start_date).diff(end_date, unit);
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  addDays(days: number, custom_date?: Date): Date {
    const date = custom_date ? dayjs(custom_date) : dayjs();
    return date.add(days, 'days').toDate();
  }

  addHours(hours: number, custom_date?: Date): Date {
    const date = custom_date ? dayjs(custom_date) : dayjs();
    return date.add(hours, 'hours').toDate();
  }

  addMinutes(minutes: number, custom_date?: Date): Date {
    const date = custom_date ? dayjs(custom_date) : dayjs();
    return date.add(minutes, 'minutes').toDate();
  }
}
