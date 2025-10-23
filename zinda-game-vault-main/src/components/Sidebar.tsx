import { BookOpen, HelpCircle, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: "/guide", label: "Guide", icon: BookOpen },
    { to: "/help", label: "Help", icon: HelpCircle },
    { to: "/admin/login", label: "Admin", icon: Shield },
  ];

  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-16 md:w-20 border-r border-border/50 bg-sidebar">
      <nav className="flex flex-col gap-4 p-3 md:p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg transition-all group",
                "hover:bg-sidebar-accent hover:shadow-[0_0_20px_rgba(65,105,225,0.2)]",
                isActive && "bg-sidebar-accent shadow-[0_0_20px_rgba(65,105,225,0.3)]"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary"
              )} />
              <span className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
