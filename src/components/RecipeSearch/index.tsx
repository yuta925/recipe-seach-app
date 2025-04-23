import { useState, useEffect } from "react";
import { Recipe } from "../../types";
import { supabase } from "../../lib/supabase";
import { SearchForm } from "../SearchForm";
import { NoResults } from "../NoResults";
import { RecipeDetails } from "../RecipeDetails";

export function RecipeSearch() {
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
      if (data && data.length > 0) {
        data.sort((a, b) => (a.name > b.name ? 1 : -1));
      }
      
      if (data) {
        const parsedRecipes = data.map((recipe) => ({
          ...recipe,
          ingredients: Array.isArray(recipe.ingredients)
            ? recipe.ingredients
            : JSON.parse(recipe.ingredients as string), // 型安全にパース
        })) as Recipe[];
  
        parsedRecipes.sort((a, b) => (a.name > b.name ? 1 : -1));
        setRecipes(parsedRecipes);
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
        <SearchForm
          value={searchIngredient}
          onChange={(searchIngredient) => setSearchIngredient(searchIngredient)}
          onSubmit={searchRecipes}
        />
      </div>

      {selectedRecipe ? (
        <RecipeDetails recipe={selectedRecipe} />
      ) : (
        searchIngredient && <NoResults ingredient={searchIngredient} />
      )}
    </div>
  );
}
