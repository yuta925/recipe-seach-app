import { Ingredient } from "../../types";

interface IngredientListProps {
  ingredients: Ingredient[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <>
      <h3 className="text-lg font-medium text-gray-900 mb-2">材料</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {ingredients.map((ing, i) => (
          <li key={i} className="text-gray-600">
            {ing.name}: {ing.amount}
            {ing.unit}
          </li>
        ))}
      </ul>
    </>
  );
}
