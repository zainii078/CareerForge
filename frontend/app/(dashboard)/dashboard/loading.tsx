export default function DashboardLoading() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-[400px] bg-muted rounded-xl animate-pulse" />
        <div className="h-[400px] bg-muted rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
