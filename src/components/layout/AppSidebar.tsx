import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Plus, 
  FileText, 
  Calculator,
  Eye,
  Settings
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Add Sale",
    url: "/add-sale",
    icon: Plus,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Sales List",
    url: "/sales",
    icon: FileText,
  },
  {
    title: "Products",
    url: "/products",
    icon: Eye,
  },
  {
    title: "Cashbook",
    url: "/cashbook",
    icon: Calculator,
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border bg-card shadow-card">
      <SidebarHeader className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-neumorphic">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-foreground">Vision Point</h2>
              <p className="text-sm text-muted-foreground">Optical Store</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-2">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-card"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}