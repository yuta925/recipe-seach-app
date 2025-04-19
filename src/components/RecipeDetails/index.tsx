import { Clock, Cookie } from "lucide-react";
import { Recipe } from "../../types";
import { IngredientList } from "../IngredientList";

interface RecipeDetailsProps {
  recipe: Recipe;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Cookie className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-semibold">{recipe.name}</h2>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              下準備: {recipe.prep_time}分
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              調理時間: {recipe.cook_time}分
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{recipe.servings}人分</span>
          </div>
        </div>
      </div>
      <div className="grid …">{/* prep_time, cook_time, servings */}</div>
      <IngredientList ingredients={recipe.ingredients} />
      {/* Recipe instructions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">作り方</h3>
        <p className="text-gray-600 whitespace-pre-line">
          {recipe.instructions}
        </p>
      </div>
    </div>
  );
}
