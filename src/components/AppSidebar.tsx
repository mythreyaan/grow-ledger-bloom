import { Home, Sprout, FileText, Shield, BarChart3, LogOut } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, user, logout } = useAuth();
  const currentPath = location.pathname;

  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "hover:bg-muted/50";

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
    toast.success("Signed out successfully");
  };

  const farmerItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "My Plants", url: "/#plants", icon: Sprout },
    { title: "Analytics", url: "/#analytics", icon: BarChart3 },
    { title: "My Claims", url: "/#claims", icon: FileText },
  ];

  const authorityItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "All Plants", url: "/#plants", icon: Sprout },
    { title: "Review Claims", url: "/#claims", icon: Shield },
    { title: "Analytics", url: "/#analytics", icon: BarChart3 },
  ];

  const items = userRole === 'authority' ? authorityItems : farmerItems;

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <div className="p-4 flex items-center gap-3">
        <Sprout className="w-8 h-8 text-primary" />
        {!collapsed && (
          <div>
            <h2 className="font-bold text-lg gradient-nature bg-clip-text text-transparent">GrowLedger</h2>
            <p className="text-xs text-muted-foreground">Blockchain Verified</p>
          </div>
        )}
      </div>

      <Separator />

      <SidebarContent className="mt-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Navigation</span>
              {userRole && (
                <Badge variant="secondary" className="text-xs">
                  {userRole === 'authority' ? 'Authority' : 'Farmer'}
                </Badge>
              )}
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={collapsed ? "h-5 w-5" : "mr-3 h-5 w-5"} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          {!collapsed && user && (
            <div className="mb-4 p-3 glass-card rounded-lg">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          )}
          
          <SidebarMenuButton onClick={handleLogout} className="w-full text-destructive hover:bg-destructive/10">
            <LogOut className={collapsed ? "h-5 w-5" : "mr-3 h-5 w-5"} />
            {!collapsed && <span>Sign Out</span>}
          </SidebarMenuButton>
        </div>
      </SidebarContent>

      <div className="absolute top-2 right-2">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
}
