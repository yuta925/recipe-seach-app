import { useState } from "react";
import { PlusCircle, ChefHat } from "lucide-react";
import RecipeForm from "./components/RecipeForm";
import RecipeSearch from "./components/RecipeSearch";
import { Recipe } from "./types";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);

  const addRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              クッキングアシスタント
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            レシピを追加
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <RecipeForm
            onSubmit={addRecipe}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <RecipeSearch recipes={recipes} />
        )}
      </main>
    </div>
  );
}

export default App;
