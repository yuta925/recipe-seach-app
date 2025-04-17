import React, { useState, useEffect } from "react";
import { Search, Cookie, Clock } from "lucide-react";
import { Ingredient, Recipe } from "../../types";
import { supabase } from "../../lib/supabase";

interface RecipeSearchProps {
  recipes: Recipe[];
}

const RecipeSearch: React.FC<RecipeSearchProps> = () => {
  const [searchIngredient, setSearchIngredient] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id);

      if (data) {
        const transformedRecipes: Recipe[] = data.map((item) => ({
          id: item.id,
          user_id: item.user_id,
          name: item.name,
          prep_time: item.prep_time ?? 0, // nullの場合デフォルト値を設定
          cook_time: item.cook_time ?? 0,
          servings: item.servings ?? 1,
          ingredients: JSON.parse(
            item.ingredients as unknown as string
          ) as Ingredient[],
          instructions: item.instructions,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        setRecipes(transformedRecipes);
      }
    };

    fetchRecipes();
  }, []);

  const searchRecipes = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredient = searchIngredient.toLowerCase().trim();
    const matchingRecipes = recipes.filter((recipe) =>
      recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(ingredient)
      )
    );

    if (matchingRecipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
      setSelectedRecipe(matchingRecipes[randomIndex]);
    } else {
      setSelectedRecipe(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">レシピを検索</h2>
        <form onSubmit={searchRecipes} className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="ingredient"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              材料から検索
            </label>
            <input
              type="text"
              id="ingredient"
              value={searchIngredient}
              onChange={(e) => setSearchIngredient(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="材料を入力してください"
              required
            />
          </div>
          <button
            type="submit"
            className="self-end px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>

      {selectedRecipe && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Cookie className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold">{selectedRecipe.name}</h2>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  下準備: {selectedRecipe.prep_time}分
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  調理時間: {selectedRecipe.cook_time}分
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedRecipe.servings}人分
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">材料</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600">
                    {ingredient.name}: {ingredient.amount}
                    {ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">作り方</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedRecipe.instructions}
              </p>
            </div>
          </div>
        </div>
      )}

      {searchIngredient && !selectedRecipe && (
        <div className="text-center py-8 text-gray-500">
          指定された材料を使用したレシピが見つかりませんでした。
        </div>
      )}
    </div>
  );
};

export default RecipeSearch;
