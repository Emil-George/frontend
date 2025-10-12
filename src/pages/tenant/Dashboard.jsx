import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  CreditCard, 
  Wrench, 
  FileText, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TenantLayout from '../../components/layouts/TenantLayout';
import TenantDashboardComponents from '../../components/dashboard/TenantDashboardComponents';
import MaintenanceRequestForm from '../../components/maintenance/MaintenanceRequestForm';
import '../../App.css';

function TenantDashboard() {
  const { user } = useAuth();

  // Mock data for tenant dashboard
  const tenantData = {
    profile: {
      name: user?.firstName + ' ' + user?.lastName || 'John Doe',
      email: user?.email || 'john.doe@email.com',
      propertyAddress: '123 Main Street, Apt A1',
      leaseStart: '2024-01-01',
      leaseEnd: '2024-12-31',
      monthlyRent: 1200,
      securityDeposit: 1200
    },
    payments: {
      nextDue: {
        amount: 1200,
        dueDate: '2024-10-01',
        status: 'pending'
      },
      lastPayment: {
        amount: 1200,
        date: '2024-09-01',
        status: 'completed'
      },
      balance: 0,
      history: [
        { month: 'September 2024', amount: 1200, status: 'paid', date: '2024-09-01' },
        { month: 'August 2024', amount: 1200, status: 'paid', date: '2024-08-01' },
        { month: 'July 2024', amount: 1200, status: 'paid', date: '2024-07-01' }
      ]
    },
    maintenance: {
      active: 1,
      pending: 0,
      completed: 2,
      recent: [
        {
          id: 1,
          title: 'Kitchen Faucet Leak',
          status: 'in_progress',
          date: '2024-09-20',
          priority: 'medium'
        },
        {
          id: 2,
          title: 'AC Unit Repair',
          status: 'completed',
          date: '2024-09-15',
          priority: 'high'
        }
      ]
    },
    lease: {
      status: 'active',
      daysUntilExpiry: 92,
      renewalAvailable: true
    }
  };

  return (
    <TenantLayout>
      <Routes>
        <Route path="/" element={<TenantDashboardHome data={tenantData} />} />
        <Route path="/profile" element={<ProfilePlaceholder />} />
        <Route path="/payments" element={<PaymentsPlaceholder />} />
        <Route path="/maintenance" element={<MaintenancePlaceholder />} />
        <Route path="/lease" element={<LeasePlaceholder />} />
      </Routes>
    </TenantLayout>
  );
}

function TenantDashboardHome({ data }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {data.profile.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tenancy
        </p>
      </div>

      {/* Enhanced Dashboard Components */}
      <TenantDashboardComponents />
    </div>
  );
}

// Placeholder components for other routes
function ProfilePlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Profile management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsPlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Payment management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { tenantAPI } from '../../services/api';
import { useState } from 'react';

function MaintenancePlaceholder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    try {
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
      <h1 className="text-3xl font-bold tracking-tight">New Request</h1>
      <Card>
        <CardContent className="p-6">
          <div>
            <MaintenanceRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            {/* Optionally show success/error messages */}
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

function LeasePlaceholder() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Lease Agreement</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Lease management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default TenantDashboard;
