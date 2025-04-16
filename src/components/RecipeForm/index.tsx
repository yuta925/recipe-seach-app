import React, { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Recipe, Ingredient } from "../../types";

interface RecipeFormProps {
  onSubmit: (recipe: Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState<number>(0);
  const [cookTime, setCookTime] = useState<number>(0);
  const [servings, setServings] = useState<number>(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: 0, unit: "g" },
  ]);
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredIngredients = ingredients.filter(
      (ing) => ing.name.trim() !== ""
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      user_id: user.id,
      name,
      prep_time: prepTime,
      cook_time: cookTime,
      servings,
      ingredients: filteredIngredients,
      instructions,
    };

    const { error } = await supabase.from("recipes").insert({
      ...newRecipe,
      ingredients: JSON.stringify(newRecipe.ingredients),
    });
    if (!error) {
      onSubmit(newRecipe);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 0, unit: "g" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">新しいレシピを追加</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              レシピ名
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="prepTime"
                className="block text-sm font-medium text-gray-700"
              >
                下準備時間（分）
              </label>
              <input
                type="number"
                id="prepTime"
                value={prepTime}
                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="cookTime"
                className="block text-sm font-medium text-gray-700"
              >
                調理時間（分）
              </label>
              <input
                type="number"
                id="cookTime"
                value={cookTime}
                onChange={(e) => setCookTime(parseInt(e.target.value))}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-medium text-gray-700"
              >
                何人分
              </label>
              <input
                type="number"
                id="servings"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value))}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              材料
            </label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(index, "name", e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="材料名"
                />
                <input
                  type="number"
                  value={ingredient.amount}
                  onChange={(e) =>
                    updateIngredient(
                      index,
                      "amount",
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="量"
                  min="0"
                  step="0.1"
                />
                <select
                  value={ingredient.unit}
                  onChange={(e) =>
                    updateIngredient(index, "unit", e.target.value)
                  }
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="個">個</option>
                  <option value="本">本</option>
                  <option value="枚">枚</option>
                  <option value="大さじ">大さじ</option>
                  <option value="小さじ">小さじ</option>
                </select>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-sm text-orange-600 hover:text-orange-700"
            >
              + 材料を追加
            </button>
          </div>

          <div>
            <label
              htmlFor="instructions"
              className="block text-sm font-medium text-gray-700"
            >
              作り方
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              保存
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
