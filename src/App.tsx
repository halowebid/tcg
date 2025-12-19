import React, { useState } from "react"

import { AdminLayout, PublicLayout } from "./components/Layouts"
import {
  AdminCreateCardScreen,
  AdminDashboardScreen,
  AdminEventScreen,
  AdminInventoryScreen,
  AdminMilestonesScreen,
  AdminSettingsScreen,
  AdminUserEditScreen,
} from "./screens/AdminScreens"
import {
  AuthScreen,
  CheckoutScreen,
  CollectionScreen,
  GachaPullScreen,
  LandingScreen,
  MarketplaceScreen,
  NotificationsScreen,
  ProductDetailScreen,
  UserMilestonesScreen,
  UserProfileScreen,
} from "./screens/PublicScreens"

// Define the screens available in the app
type ScreenKey =
  | "landing"
  | "marketplace"
  | "detail"
  | "gacha"
  | "collection"
  | "checkout"
  | "profile"
  | "user_milestones"
  | "notifications"
  | "auth"
  | "admin_dashboard"
  | "admin_inventory"
  | "admin_create"
  | "admin_event"
  | "admin_user"
  | "admin_milestones"
  | "admin_settings"

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenKey>("landing")

  // Simple router logic
  const renderScreen = () => {
    switch (currentScreen) {
      case "landing":
        return <LandingScreen />
      case "marketplace":
        return <MarketplaceScreen />
      case "detail":
        return <ProductDetailScreen />
      case "gacha":
        return <GachaPullScreen />
      case "collection":
        return <CollectionScreen />
      case "checkout":
        return <CheckoutScreen />
      case "profile":
        return <UserProfileScreen />
      case "user_milestones":
        return <UserMilestonesScreen />
      case "notifications":
        return <NotificationsScreen />
      case "auth":
        return <AuthScreen />
      // Admin screens
      case "admin_dashboard":
        return <AdminDashboardScreen />
      case "admin_inventory":
        return (
          <AdminInventoryScreen
            onCreate={() => setCurrentScreen("admin_create")}
          />
        )
      case "admin_create":
        return <AdminCreateCardScreen />
      case "admin_event":
        return <AdminEventScreen />
      case "admin_user":
        return <AdminUserEditScreen />
      case "admin_milestones":
        return <AdminMilestonesScreen />
      case "admin_settings":
        return <AdminSettingsScreen />
      default:
        return <LandingScreen />
    }
  }

  // Determine layout based on screen
  const isAdmin = currentScreen.startsWith("admin_")
  const isAuth = currentScreen === "auth"

  // Navigation Menu for Demo purposes (Floating)
  const NavMenu = () => (
    <div className="group fixed bottom-4 left-4 z-[9999]">
      <button className="bg-primary hover:bg-primary-hover rounded-full p-3 text-white shadow-lg transition-all">
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="bg-surface-dark border-border-dark absolute bottom-14 left-0 hidden max-h-[80vh] w-64 overflow-y-auto rounded-xl border p-2 shadow-2xl group-hover:block">
        <p className="text-text-secondary px-3 py-2 text-xs font-bold uppercase">
          Public
        </p>
        <button
          onClick={() => setCurrentScreen("landing")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Home / Landing
        </button>
        <button
          onClick={() => setCurrentScreen("marketplace")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Marketplace
        </button>
        <button
          onClick={() => setCurrentScreen("detail")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Item Detail
        </button>
        <button
          onClick={() => setCurrentScreen("gacha")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Gacha Pull
        </button>
        <button
          onClick={() => setCurrentScreen("collection")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          My Collection
        </button>
        <button
          onClick={() => setCurrentScreen("checkout")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Checkout
        </button>
        <button
          onClick={() => setCurrentScreen("notifications")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Notifications
        </button>
        <button
          onClick={() => setCurrentScreen("profile")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          User Profile
        </button>
        <button
          onClick={() => setCurrentScreen("user_milestones")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          User Milestones
        </button>
        <button
          onClick={() => setCurrentScreen("auth")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Auth Pages
        </button>

        <p className="text-text-secondary mt-2 px-3 py-2 text-xs font-bold uppercase">
          Admin
        </p>
        <button
          onClick={() => setCurrentScreen("admin_dashboard")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentScreen("admin_inventory")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Inventory
        </button>
        <button
          onClick={() => setCurrentScreen("admin_create")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Create Card
        </button>
        <button
          onClick={() => setCurrentScreen("admin_event")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Edit Event
        </button>
        <button
          onClick={() => setCurrentScreen("admin_user")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Edit User
        </button>
        <button
          onClick={() => setCurrentScreen("admin_milestones")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Milestone Config
        </button>
        <button
          onClick={() => setCurrentScreen("admin_settings")}
          className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-white/5"
        >
          Settings
        </button>
      </div>
    </div>
  )

  if (isAuth) {
    return (
      <>
        <NavMenu />
        {renderScreen()}
      </>
    )
  }

  return (
    <>
      <NavMenu />
      {isAdmin ? (
        <AdminLayout
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        >
          {renderScreen()}
        </AdminLayout>
      ) : (
        <PublicLayout>{renderScreen()}</PublicLayout>
      )}
    </>
  )
}

export default App
