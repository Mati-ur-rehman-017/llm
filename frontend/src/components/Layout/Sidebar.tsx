import type { ActiveTab } from "../../types";

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const tabs: { id: ActiveTab; label: string; icon: string }[] = [
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "documents", label: "Documents", icon: "📄" },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <nav className="flex w-48 flex-col gap-1 border-r border-gray-200 bg-gray-50 p-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-emerald-100 text-emerald-800"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
