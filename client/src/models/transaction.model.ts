import { Category } from "./category.model";

export interface Transacation {
  id?: string;
  type: string;
  description: string;
  category: Category;
  amount: number;
  time: string;
}
