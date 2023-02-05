import { Category } from "./category.model";

export interface Transacation {
  id?: string;
  description: string;
  categoryName: string;
  categoryId?: string;
  value: number;
  date: string;
}
