import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, MessageCircle } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card shadow-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="hover:bg-secondary" />
        <div className="hidden md:flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search customers, sales..."
            className="bg-secondary border-0 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
          <span className="text-xs font-semibold text-primary-foreground">VP</span>
        </div>
      </div>
    </header>
  );
}