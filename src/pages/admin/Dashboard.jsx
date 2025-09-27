import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home, 
  CreditCard, 
  Wrench, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminLayout from '../../components/layouts/AdminLayout';
import AdminDashboardCharts from '../../components/dashboard/AdminDashboardCharts';
import '../../App.css';

function AdminDashboard() {
  const { user, logout } = useAuth();

  // Mock data for dashboard
  const stats = {
    totalTenants: 24,
    activeTenants: 22,
    pendingTenants: 2,
    totalProperties: 8,
    monthlyRevenue: 28800,
    collectionRate: 94.5,
    pendingPayments: 3,
    overduePayments: 1,
    maintenanceRequests: {
      pending: 5,
      inProgress: 3,
      completed: 12
    },
    leaseAgreements: {
      active: 22,
      expiringSoon: 4,
      pendingSignature: 2
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'payment',
      message: 'Payment received from John Doe - $1,200',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'New maintenance request from Jane Smith - Plumbing issue',
      time: '4 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'lease',
      message: 'Lease agreement signed by Mike Johnson',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'payment',
      message: 'Payment overdue from Sarah Wilson - $1,500',
      time: '2 days ago',
      status: 'warning'
    }
  ];

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome stats={stats} activities={recentActivities} />} />
        <Route path="/tenants" element={<TenantsPlaceholder />} />
        <Route path="/payments" element={<PaymentsPlaceholder />} />
        <Route path="/maintenance" element={<MaintenancePlaceholder />} />
        <Route path="/leases" element={<LeasesPlaceholder />} />
      </Routes>
    </AdminLayout>
  );
}

function DashboardHome({ stats, activities }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your property management operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.collectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.maintenanceRequests.pending}</div>
            <p className="text-xs text-muted-foreground">
              Maintenance requests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add New Tenant
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Lease Agreement
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Wrench className="mr-2 h-4 w-4" />
              Assign Maintenance
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {activity.status === 'pending' && (
                      <Clock className="h-5 w-5 text-blue-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts and Analytics */}
      <AdminDashboardCharts />
    </div>
  );
}

// Placeholder components for other routes
function TenantsPlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tenant Management</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Tenant management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsPlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Payment management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MaintenancePlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Maintenance management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function LeasesPlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Lease Agreements</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Lease management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
