import { clsx, type ClassValue as TClassValue } from 'clsx';

export const cn = (...values: TClassValue[]) => clsx(values);
