import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { adminAPI } from '../../services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Building2,
  LayoutDashboard,
  Users,
  CreditCard,
  Wrench,
  FileText,
  Settings,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Home
} from 'lucide-react';
import '../../App.css';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    current: false
  },
  {
    name: 'Tenants',
    href: '/admin/tenants',
    icon: Users,
    current: false,
    badge: ''
  },
  {
    name: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    current: false,
    badge: ''
  },
  {
    name: 'Maintenance',
    href: '/admin/maintenance',
    icon: Wrench,
    current: false,
    badge: ''
  },
  {
    name: 'Lease Agreements',
    href: '/admin/leases',
    icon: FileText,
    current: false,
    badge: ''
  },
  {
    name: 'Properties',
    href: '/admin/properties',
    icon: Home,
    current: false
  }
];

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [badgeCounts, setBadgeCounts] = useState({
    tenants: '',
    payments: '',
    maintenance: '',
    properties: ''
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

    useEffect(() => {
    const fetchBadgeCounts = async () => {
      try {
        const response = await adminAPI.getAdminDashboardStats();
        const data = response.data;
        setBadgeCounts({
          tenants: data.totalTenants > 0 ? String(data.totalTenants) : '',
          payments: data.pendingPayments > 0 ? String(data.pendingPayments) : '', // Assuming pendingPayments will be added to backend
          maintenance: data.pendingMaintenanceRequests > 0 ? String(data.pendingMaintenanceRequests) : '',
          properties: data.totalProperties > 0 ? String(data.totalProperties) : ''
        });
      } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
      }
    };
    fetchBadgeCounts();
  }, []);

  const navigationWithBadges = navigation.map(item => {
    if (item.name === 'Tenants') return { ...item, badge: badgeCounts.tenants };
    if (item.name === 'Payments') return { ...item, badge: badgeCounts.payments };
    if (item.name === 'Maintenance') return { ...item, badge: badgeCounts.maintenance };
    if (item.name === 'Properties') return { ...item, badge: badgeCounts.properties };
    return item;
  });

  const isCurrentPath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* <SheetContent side="left" className="w-64 p-0">
          <MobileSidebar navigation={navigation} isCurrentPath={isCurrentPath} /> */}
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebar navigation={navigationWithBadges} isCurrentPath={isCurrentPath} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        {/* <DesktopSidebar navigation={navigation} isCurrentPath={isCurrentPath} /> */}
        <DesktopSidebar navigation={navigationWithBadges} isCurrentPath={isCurrentPath} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Separator */}
          <div className="h-6 w-px bg-border lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            {/* Search */}
            <div className="relative flex flex-1 items-center">
              <div className="relative w-full max-w-md">
                <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground pl-3" />
                <input
                  className="block h-full w-full border-0 py-0 pl-10 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm bg-transparent"
                  placeholder="Search tenants, payments..."
                  type="search"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">View notifications</span>
              </Button>

              {/* Separator */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-x-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user?.firstName + ' ' + user?.lastName || 'Admin')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex lg:flex-col lg:items-start">
                      <span className="text-sm font-semibold text-foreground">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">Administrator</span>
                    </div>
                    <ChevronDown className="hidden lg:block h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function DesktopSidebar({ navigation, isCurrentPath }) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">NBJ Group</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        isCurrentPath(item.href) ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={isCurrentPath(item.href) ? 'secondary' : 'outline'} 
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <Link
              to="/admin/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-5 w-5 shrink-0" aria-hidden="true" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function MobileSidebar({ navigation, isCurrentPath }) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center gap-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">NBJ Group</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${
                        isCurrentPath(item.href) ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant={isCurrentPath(item.href) ? 'secondary' : 'outline'} 
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <Link
              to="/admin/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-5 w-5 shrink-0" aria-hidden="true" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminLayout;
