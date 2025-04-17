import { useState, useEffect } from "react";
import { PlusCircle, ChefHat, LogOut } from "lucide-react";
import RecipeForm from "./components/RecipeForm";
import RecipeSearch from "./components/RecipeSearch";
import Auth from "./components/Auth";
import { Recipe } from "./types";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-orange-500">読み込み中...</div>
      </div>
    );
  }

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              レシピを追加
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <LogOut className="h-5 w-5 mr-2" />
              ログアウト
            </button>
          </div>
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
