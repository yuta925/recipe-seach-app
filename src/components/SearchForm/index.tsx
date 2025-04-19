import { Search } from "lucide-react";

interface SearchFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SearchForm({ value, onSubmit, onChange }: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-4">
      <div className="flex-1">
        <label
          htmlFor="ingredient"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          材料から検索
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="材料を入力してください"
          className="flex-1 rounded-md …"
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
  );
}
