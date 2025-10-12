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
import { useState, useEffect } from 'react';
import { tenantAPI } from '../../services/api';
import { adminAPI } from '../../services/api';
import MaintenanceRequestDetails from '../../components/maintenance/MaintenanceRequestDetails';
// Import UI components from ShadCN
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We can add state for pagination later if needed
  // const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call the new API function. We'll fetch the first 10 for now.
        const response = await adminAPI.getTenants({ page: 0, size: 10 });
        
        // The backend response nests the list under a "tenants" key.
        setTenants(response.data.tenants || []);

      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch tenants.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []); // Runs once when the component mounts

      const handleStatusChange = async (tenantId, newStatus) => {
    try {
      const updatedTenant = await adminAPI.updateTenant(tenantId, { status: newStatus });
      
      // Update the tenant in the local state to reflect the change immediately
      setTenants(currentTenants =>
        currentTenants.map(t => (t.id === tenantId ? updatedTenant.data : t))
      );
      alert('Tenant status updated successfully!');

    } catch (error) {
      console.error("Failed to update status:", error);
      alert('Failed to update status.');
    }
  };

    const handleEdit = (tenant) => {
    const newPhoneNumber = prompt("Enter new phone number for " + tenant.user.firstName + ":", tenant.user.phoneNumber);
    if (newPhoneNumber) {
      adminAPI.updateTenant(tenant.id, { phoneNumber: newPhoneNumber })
        .then(updatedTenant => {
          setTenants(currentTenants =>
            currentTenants.map(t => (t.id === tenant.id ? updatedTenant.data : t))
          );
          alert('Phone number updated!');
        })
        .catch(err => alert('Failed to update phone number.'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tenants</CardTitle>
        <CardDescription>A list of all tenants in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading tenants...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Property Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead> {/* New Column */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map((tenant) => (
          <TableRow key={tenant.id}>
            <TableCell>{tenant.user.firstName} {tenant.user.lastName}</TableCell>
            <TableCell>{tenant.propertyAddress}</TableCell>
            <TableCell>
              <Badge variant={tenant.status === 'ACTIVE' ? 'default' : 'secondary'}>
                {tenant.status}
              </Badge>
            </TableCell>
            {/* New Actions Cell */}
            <TableCell className="text-right space-x-2">
              <Button size="sm" onClick={() => handleEdit(tenant)}>Edit</Button>
              {tenant.status === 'PENDING' || tenant.status==='INACTIVE' && (
                <Button size="sm" variant="outline" onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}>
                  Activate
                </Button>
              )}
              {tenant.status === 'ACTIVE' && (
                <Button size="sm" variant="outline" onClick={() => handleStatusChange(tenant.id, 'INACTIVE')}>
                  Deactivate
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentsPlaceholder() {

    const handleConnectStripe = async () => {
    try {
      // You need to create this function in your api.js file
      const response = await adminAPI.createStripeConnectAccount(); 
      const { onboardingUrl } = response.data;
      
      // Redirect the admin to the Stripe onboarding page
      window.location.href = onboardingUrl;
    } catch (error) {
      console.error("Could not create Stripe Connect account:", error);
      alert("Failed to start Stripe connection.");
    }
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
      <Card>
        <CardContent className="p-6">
                <Button onClick={handleConnectStripe}>
        Stripe Connect
      </Button>
          <p className="text-muted-foreground">Connect with Stripe to Receive Payments</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MaintenancePlaceholder() {
  const { user } = useAuth();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for filtering by status
  const [filterStatus, setFilterStatus] = useState(null); // null = ALL

  // 1. NEW STATE: To manage sorting by priority
  const [sortBy, setSortBy] = useState('createdAt'); // Default sort by date
  const [sortDir, setSortDir] = useState('desc'); // Default to most recent

  // 2. UPDATED useEffect: Now re-runs when sort state changes
  useEffect(() => {
    const fetchAdminRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        // 3. DYNAMIC PARAMS: Add sort parameters to the API call
        const params = {
          // Add status filter if one is selected
          ...(filterStatus && { status: filterStatus.toUpperCase() }),
          
          // Add the new sorting parameters
          sortBy: sortBy,
          sortDir: sortDir,
        };

        const response = await adminAPI.getMaintenanceRequests(params);
        setRequests(response.data.requests || []);

      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch maintenance requests');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAdminRequests();
    }
  }, [user, filterStatus, sortBy, sortDir]); // Dependency array now includes sort states

  // 4. NEW HANDLER: Function to handle sort button clicks
  const handleSortByPriority = () => {
    setSortBy('priority');
    setSortDir('desc'); // 'desc' for enums often means higher priority first (e.g., URGENT > HIGH > MEDIUM)
  };

  const handleSortByDate = () => {
    setSortBy('createdAt');
    setSortDir('desc');
  };

  
    const handleRequestDeleted = (deletedRequestId) => {
    // Update the 'requests' state by filtering out the item that was just deleted.
    setRequests(currentRequests =>
      currentRequests.filter(req => req.id !== deletedRequestId)
    );
  };

    const handleRequestUpdate = async (requestId, updateData) => {
    try {
      // Call the new API function
      const response = await tenantAPI.updateMaintenanceRequestStatus(requestId, updateData);
      const updatedRequest = response.data;

      // Update the 'requests' list to reflect the changes
      setRequests(currentRequests =>
        currentRequests.map(req => 
          req.id === requestId ? updatedRequest : req
        )
      );
      
      // You can add a success notification here if you like
      // alert('Request updated successfully!');

    } catch (error) {
      console.error("Failed to update request:", error);
      alert('Failed to update request.');
      // Re-throw the error so the child component knows the save failed
      throw error;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
          <CardDescription>
            Filter and sort service requests from all tenants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter and Sort Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Filter by Status:</span>
              <Button variant={!filterStatus ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(null)}>All</Button>
              <Button variant={filterStatus === 'PENDING' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('PENDING')}>Pending</Button>
              <Button variant={filterStatus === 'COMPLETED' ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus('COMPLETED')}>Completed</Button>
            </div>

            {/* 5. NEW UI: Sort Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Sort by:</span>
              <Button variant={sortBy === 'createdAt' ? 'default' : 'outline'} size="sm" onClick={handleSortByDate}>Most Recent</Button>
              <Button variant={sortBy === 'priority' ? 'default' : 'outline'} size="sm" onClick={handleSortByPriority}>Priority</Button>
            </div>
          </div>

          {/* Display Area */}
          <div className="space-y-4">
            {loading ? (
              <p>Loading requests...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              requests.length > 0 ? (
                // UPDATE THIS PART: Pass the new handler as a prop
                requests.map(request => (
                  <MaintenanceRequestDetails 
                    key={request.id} 
                    request={request}
                    currentUser={user} // Pass the user down if needed for role checks
                    onDeleteSuccess={handleRequestDeleted}
                    onStatusUpdate={handleRequestUpdate}  // Pass the deletion handler
                    // Pass other handlers like onStatusUpdate if you have them
                  />
                ))
              )  : (
                <p>No maintenance requests match the current filters.</p>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </>
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
