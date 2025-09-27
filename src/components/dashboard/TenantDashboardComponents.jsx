import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Home,
  Wrench,
  TrendingUp,
  Bell,
  Star,
  MessageCircle
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

// Mock data
const paymentHistory = [
  { id: 1, month: 'September 2024', amount: 1200, status: 'paid', date: '2024-09-01', method: 'Bank Transfer' },
  { id: 2, month: 'August 2024', amount: 1200, status: 'paid', date: '2024-08-01', method: 'Credit Card' },
  { id: 3, month: 'July 2024', amount: 1200, status: 'paid', date: '2024-07-01', method: 'Bank Transfer' },
  { id: 4, month: 'June 2024', amount: 1200, status: 'paid', date: '2024-06-01', method: 'Bank Transfer' },
  { id: 5, month: 'May 2024', amount: 1200, status: 'paid', date: '2024-05-01', method: 'Credit Card' },
];

const maintenanceHistory = [
  {
    id: 1,
    title: 'Kitchen Faucet Leak',
    description: 'Dripping faucet in kitchen sink',
    status: 'in_progress',
    priority: 'medium',
    date: '2024-09-20',
    assignedTo: 'Mike Johnson - Plumber',
    estimatedCompletion: '2024-09-25'
  },
  {
    id: 2,
    title: 'AC Unit Repair',
    description: 'Air conditioning not cooling properly',
    status: 'completed',
    priority: 'high',
    date: '2024-09-15',
    completedDate: '2024-09-16',
    rating: 5,
    feedback: 'Excellent service, very professional and quick response.'
  },
  {
    id: 3,
    title: 'Bathroom Light Fixture',
    description: 'Light fixture flickering in main bathroom',
    status: 'completed',
    priority: 'low',
    date: '2024-09-10',
    completedDate: '2024-09-12',
    rating: 4,
    feedback: 'Good work, arrived on time.'
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Rent Payment Due',
    date: '2024-10-01',
    type: 'payment',
    amount: 1200,
    description: 'Monthly rent payment'
  },
  {
    id: 2,
    title: 'Property Inspection',
    date: '2024-10-15',
    type: 'inspection',
    description: 'Annual property inspection'
  },
  {
    id: 3,
    title: 'Lease Renewal Discussion',
    date: '2024-11-01',
    type: 'lease',
    description: 'Discuss lease renewal options'
  }
];

function TenantDashboardComponents() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentsTab />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <MaintenanceTab />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <CalendarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab() {
  return (
    <>
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground">
              Due in 5 days (Oct 1)
            </p>
            <div className="mt-2">
              <Button size="sm" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$0</div>
            <p className="text-xs text-green-600">
              All payments up to date
            </p>
            <div className="mt-2">
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Kitchen faucet repair
            </p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">In Progress</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lease Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">
              Days until renewal
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Notifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance Update</p>
                  <p className="text-xs text-muted-foreground">
                    Your kitchen faucet repair has been scheduled for tomorrow at 10 AM
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment Confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    September rent payment of $1,200 has been processed successfully
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lease Reminder</p>
                  <p className="text-xs text-muted-foreground">
                    Your lease renewal is available. Contact management to discuss options
                  </p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">123 Main Street</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit</p>
                  <p className="text-sm font-medium">Apt A1</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="text-sm font-medium">$1,200</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lease End</p>
                  <p className="text-sm font-medium">Dec 31, 2024</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Lease Progress</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  9 months completed, 3 months remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function PaymentsTab() {
  return (
    <>
      {/* Payment Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Rent</span>
                <span className="text-sm font-medium">$1,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Security Deposit</span>
                <span className="text-sm font-medium">$1,200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Paid YTD</span>
                <span className="text-sm font-medium">$10,800</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Balance</span>
                  <span className="text-sm font-medium text-green-600">$0.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold">$1,200</div>
                <p className="text-sm text-muted-foreground">Due October 1, 2024</p>
              </div>
              <div className="space-y-2">
                <Button className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with Card
                </Button>
                <Button variant="outline" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Bank Transfer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payment Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">On-time Payments</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Average Days Early</span>
                  <span className="text-sm font-medium">3 days</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Excellent payment history</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent rent payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{payment.month}</p>
                    <p className="text-xs text-muted-foreground">
                      Paid on {format(new Date(payment.date), 'MMM dd, yyyy')} • {payment.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${payment.amount}</p>
                  <Badge variant="outline" className="text-xs">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function MaintenanceTab() {
  return (
    <>
      {/* Maintenance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">1</div>
              <p className="text-sm text-muted-foreground">Currently in progress</p>
              <Button size="sm" className="mt-3 w-full">
                <Wrench className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">2.1</div>
              <p className="text-sm text-muted-foreground">Average days</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">Faster than average</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-2xl font-bold">4.5</div>
              <p className="text-sm text-muted-foreground">Average rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance History</CardTitle>
          <CardDescription>Your service requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceHistory.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium">{request.title}</h4>
                      <Badge 
                        variant={
                          request.priority === 'high' ? 'destructive' : 
                          request.priority === 'medium' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {request.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {format(new Date(request.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {request.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {request.status === 'in_progress' && (
                      <Clock className="h-5 w-5 text-blue-500" />
                    )}
                    <Badge 
                      variant={request.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {request.status === 'in_progress' && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                    <p className="text-sm font-medium">Assigned to: {request.assignedTo}</p>
                    <p className="text-xs text-muted-foreground">
                      Estimated completion: {format(new Date(request.estimatedCompletion), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}

                {request.status === 'completed' && request.rating && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Your Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= request.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{request.feedback}"</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed: {format(new Date(request.completedDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function CalendarTab() {
  return (
    <>
      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Important dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {format(new Date(event.date), 'MMM')}
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {format(new Date(event.date), 'dd')}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.amount && (
                    <p className="text-sm font-medium text-green-600">${event.amount}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Badge 
                    variant={
                      event.type === 'payment' ? 'default' :
                      event.type === 'inspection' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {event.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Schedule Payment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Wrench className="mr-2 h-4 w-4" />
              Request Maintenance
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Management
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span>Rent due in 5 days</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Property inspection next week</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Lease renewal available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default TenantDashboardComponents;
