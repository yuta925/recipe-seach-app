export function NoResults({ ingredient }: { ingredient: string }) {
  return (
    <div className="text-center py-8 text-gray-500">
      指定された材料「{ingredient}」を使用したレシピが見つかりませんでした。
    </div>
  );
}
