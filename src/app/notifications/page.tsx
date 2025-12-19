"use client"

export default function NotificationsPage() {
  // TODO: Replace with actual tRPC data fetching when notifications router is implemented
  const mockNotifications = [
    {
      id: 1,
      type: "gacha",
      title: "Legendary Pull: Azure Sky Dragon",
      message: "Incredible luck! You just pulled a 5-star Legendary card.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuADBUoN1brN6-kDDfuZt_FZhIRjGcc023An98v4U6Lh8-8M9HiVFLRa7dz0DEPKrTiZYWQsFDK5d1n47eBUy78sNxge0M3aaKPI0IJl48TRFYbP4g2QQxfS7yj7x30WxP0GgwBuCAmKBHfrGke7W_jGnG4LgZE5dv40z7YxthggrkmSJfKGtBhrgYXUJ-Nq7jZekAsnodGhLP5So4-L0I2eDH-D_5-rZDEDAmnrvcfiUQ1p-9xUQWM4TkJ_638mUqnB7Fwr5p7W3S3y",
      isRead: false,
      createdAt: "2 mins ago",
    },
    {
      id: 2,
      type: "order",
      title: "Order #8821 Shipped",
      message: 'Your order containing "Starter Deck: Fire" is on its way.',
      isRead: true,
      createdAt: "4 hours ago",
    },
  ]

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-[960px]">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Notifications</h1>
            <p className="text-text-secondary">
              Stay updated with your latest pulls.
            </p>
          </div>
          <button className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-sm">done_all</span>{" "}
            Mark all read
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <button className="bg-primary rounded-lg px-4 py-1.5 text-sm font-bold text-white">
            All
          </button>
          <button className="bg-surface-dark text-text-secondary rounded-lg px-4 py-1.5 text-sm">
            Gacha
          </button>
          <button className="bg-surface-dark text-text-secondary rounded-lg px-4 py-1.5 text-sm">
            Orders
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-surface-dark flex items-start gap-4 rounded-r-xl border-l-4 p-4 ${
                notification.type === "gacha"
                  ? "border-primary"
                  : "border-blue-500"
              }`}
            >
              {notification.imageUrl ? (
                <img
                  src={notification.imageUrl}
                  className="size-16 rounded-lg object-cover"
                  alt={notification.title}
                />
              ) : (
                <div
                  className={`flex size-16 items-center justify-center rounded-lg ${
                    notification.type === "gacha"
                      ? "bg-primary/20 text-primary"
                      : "bg-blue-900/20 text-blue-500"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">
                    {notification.type === "gacha"
                      ? "casino"
                      : "local_shipping"}
                  </span>
                </div>
              )}
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      notification.type === "gacha"
                        ? "bg-primary/20 text-primary"
                        : "rounded bg-blue-900/30 text-blue-400"
                    }`}
                  >
                    {notification.type.toUpperCase()}
                  </span>
                  {!notification.isRead && (
                    <span className="bg-primary size-2 rounded-full"></span>
                  )}
                </div>
                <p className="font-bold text-white">{notification.title}</p>
                <p className="text-text-secondary text-sm">
                  {notification.message}
                </p>
                <p className="text-text-secondary mt-2 text-xs">
                  {notification.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
