export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  name: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string;
  created_at?: string;
  updated_at?: string;
}