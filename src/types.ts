export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
  }
  
  export interface Recipe {
    id: string;
    user_id: string;
    name: string;
    prep_time: number | null;
    cook_time: number | null;
    servings: number | null;
    ingredients: Ingredient[];
    instructions: string;
    created_at?: string | null;
    updated_at?: string | null;
  }