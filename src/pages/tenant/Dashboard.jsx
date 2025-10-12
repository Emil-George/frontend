import React, { useState, useEffect } from 'react'; // All React hooks imported here
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import TenantLayout from '../../components/layouts/TenantLayout';
import TenantDashboardComponents from '../../components/dashboard/TenantDashboardComponents';
import MaintenanceRequestForm from '../../components/maintenance/MaintenanceRequestForm';
import {tenantAPI } from '../../services/api'; // Import both api objects
import '../../App.css';

// Main Parent Component
function TenantDashboard() {
  const { user } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // This requires a backend endpoint at GET /api/dashboard/tenant
        const response = await tenantAPI.getTenantDashboardData(); 
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return <TenantLayout><p>Loading dashboard...</p></TenantLayout>;
  }

  if (error) {
    return <TenantLayout><p className="text-red-500">{error}</p></TenantLayout>;
  }

  return (
    <TenantLayout>
      <Routes>
        <Route path="/" element={<TenantDashboardHome data={dashboardData} />} />
        <Route path="/profile" element={<ProfilePlaceholder />} />
        <Route path="/payments" element={<PaymentsPlaceholder />} />
        <Route path="/maintenance" element={<MaintenancePlaceholder />} />
        <Route path="/lease" element={<LeasePlaceholder />} />
      </Routes>
    </TenantLayout>
  );
}

// Child Component for the Dashboard Home
function TenantDashboardHome({ data }) {
  if (!data) {
    return <p>No dashboard data available.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {data.profile?.name?.split(' ')[0] || 'Tenant'}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tenancy
        </p>
      </div>
      <TenantDashboardComponents data={data} />
    </div>
  );
}

// Child Component for the Maintenance Tab
function MaintenancePlaceholder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    try {
      // Using tenantAPI as it was in your original code
      await tenantAPI.createMaintenanceRequest(formData);
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">New Maintenance Request</h1>
      <Card>
        <CardContent className="p-6">
          <div>
            <MaintenanceRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            {submitSuccess && (
              <div className="mt-4 text-green-600">Request submitted successfully!</div>
            )}
            {submitError && (
              <div className="mt-4 text-red-600">{submitError}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Other Placeholder Components
function ProfilePlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      <Card><CardContent className="p-6"><p className="text-muted-foreground">Profile management features coming soon...</p></CardContent></Card>
    </div>
  );
}

function PaymentsPlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
      <Card><CardContent className="p-6"><p className="text-muted-foreground">Payment management features coming soon...</p></CardContent></Card>
    </div>
  );
}

function LeasePlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Lease Agreement</h1>
      <Card><CardContent className="p-6"><p className="text-muted-foreground">Lease management features coming soon...</p></CardContent></Card>
    </div>
  );
}

export default TenantDashboard;
