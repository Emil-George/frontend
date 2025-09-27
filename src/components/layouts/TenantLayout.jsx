import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  CreditCard,
  Wrench,
  FileText,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Home,
  MessageCircle
} from 'lucide-react';
import '../../App.css';

const navigation = [
  {
    name: 'Dashboard',
    href: '/tenant',
    icon: LayoutDashboard,
    current: false
  },
  {
    name: 'Profile',
    href: '/tenant/profile',
    icon: User,
    current: false
  },
  {
    name: 'Payments',
    href: '/tenant/payments',
    icon: CreditCard,
    current: false,
    badge: '1'
  },
  {
    name: 'Maintenance',
    href: '/tenant/maintenance',
    icon: Wrench,
    current: false,
    badge: '1'
  },
  {
    name: 'Lease Agreement',
    href: '/tenant/lease',
    icon: FileText,
    current: false
  },
  {
    name: 'Messages',
    href: '/tenant/messages',
    icon: MessageCircle,
    current: false
  }
];

function TenantLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  const isCurrentPath = (path) => {
    if (path === '/tenant') {
      return location.pathname === '/tenant' || location.pathname === '/tenant/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <MobileSidebar navigation={navigation} isCurrentPath={isCurrentPath} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <DesktopSidebar navigation={navigation} isCurrentPath={isCurrentPath} />
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
            {/* Welcome message */}
            <div className="flex flex-1 items-center">
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-foreground">
                  Welcome, {user?.firstName}!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your tenancy and stay connected
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Quick actions */}
              <div className="hidden md:flex items-center gap-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/tenant/payments">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Rent
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/tenant/maintenance">
                    <Wrench className="h-4 w-4 mr-2" />
                    Request Service
                  </Link>
                </Button>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                  2
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
                        {getInitials(user?.firstName + ' ' + user?.lastName || 'Tenant')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex lg:flex-col lg:items-start">
                      <span className="text-sm font-semibold text-foreground">
                        {user?.firstName} {user?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">Tenant</span>
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
                  <DropdownMenuItem asChild>
                    <Link to="/tenant/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
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
            <p className="text-xs text-muted-foreground">Tenant Portal</p>
          </div>
        </div>
      </div>

      {/* Property info card */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center gap-x-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              123 Main Street
            </p>
            <p className="text-xs text-muted-foreground">Apt A1</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Rent Due</span>
          <Badge variant="outline" className="text-xs">Oct 1</Badge>
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
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-x-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-foreground">Account Status</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All payments up to date
              </p>
            </div>
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
            <p className="text-xs text-muted-foreground">Tenant Portal</p>
          </div>
        </div>
      </div>

      {/* Property info card */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center gap-x-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              123 Main Street
            </p>
            <p className="text-xs text-muted-foreground">Apt A1</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Rent Due</span>
          <Badge variant="outline" className="text-xs">Oct 1</Badge>
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
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="flex items-center gap-x-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-foreground">Account Status</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All payments up to date
              </p>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default TenantLayout;
