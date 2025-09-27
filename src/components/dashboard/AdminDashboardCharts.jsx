import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  AlertTriangle,
  Calendar,
  Clock
} from 'lucide-react';

// Mock data for charts
const monthlyRevenue = [
  { month: 'Jan', revenue: 24000, expenses: 8000, profit: 16000 },
  { month: 'Feb', revenue: 26400, expenses: 8200, profit: 18200 },
  { month: 'Mar', revenue: 25200, expenses: 7800, profit: 17400 },
  { month: 'Apr', revenue: 27600, expenses: 8400, profit: 19200 },
  { month: 'May', revenue: 28800, expenses: 8600, profit: 20200 },
  { month: 'Jun', revenue: 30000, expenses: 9000, profit: 21000 },
];

const paymentStatus = [
  { name: 'Paid', value: 85, color: '#22c55e' },
  { name: 'Pending', value: 12, color: '#eab308' },
  { name: 'Overdue', value: 3, color: '#ef4444' },
];

const maintenanceRequests = [
  { month: 'Jan', pending: 8, completed: 15, inProgress: 5 },
  { month: 'Feb', pending: 6, completed: 18, inProgress: 4 },
  { month: 'Mar', pending: 10, completed: 12, inProgress: 7 },
  { month: 'Apr', pending: 5, completed: 20, inProgress: 3 },
  { month: 'May', pending: 7, completed: 16, inProgress: 6 },
  { month: 'Jun', pending: 5, completed: 22, inProgress: 3 },
];

const occupancyRate = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 89 },
  { month: 'Apr', rate: 96 },
  { month: 'May', rate: 98 },
  { month: 'Jun', rate: 100 },
];

function AdminDashboardCharts() {
  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Overview
            </CardTitle>
            <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                <Bar dataKey="profit" fill="#22c55e" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Occupancy Rate
            </CardTitle>
            <CardDescription>Property occupancy over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={occupancyRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Occupancy Rate']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status and Maintenance Trends */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Status Distribution
            </CardTitle>
            <CardDescription>Current month payment breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {paymentStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Requests
            </CardTitle>
            <CardDescription>Monthly maintenance request trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={maintenanceRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  name="Pending"
                />
                <Line 
                  type="monotone" 
                  dataKey="inProgress" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="In Progress"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Important metrics for property management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collection Rate</span>
                <span className="text-sm text-muted-foreground">94.5%</span>
              </div>
              <Progress value={94.5} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +2.1% from last month
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Occupancy Rate</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Progress value={100} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +4% from last month
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maintenance Response</span>
                <span className="text-sm text-muted-foreground">2.3 days</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingDown className="h-3 w-3" />
                -0.5 days improvement
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tenant Satisfaction</span>
                <span className="text-sm text-muted-foreground">4.7/5</span>
              </div>
              <Progress value={94} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +0.2 from last month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Important deadlines and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lease renewal - Unit 101</p>
                  <p className="text-xs text-muted-foreground">Due in 3 days</p>
                </div>
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Property inspection - Building A</p>
                  <p className="text-xs text-muted-foreground">Scheduled for next week</p>
                </div>
                <Badge variant="secondary" className="text-xs">Medium</Badge>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance review meeting</p>
                  <p className="text-xs text-muted-foreground">Friday at 2:00 PM</p>
                </div>
                <Badge variant="outline" className="text-xs">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground">John Doe - $1,200 • 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New tenant registered</p>
                  <p className="text-xs text-muted-foreground">Sarah Wilson - Unit 205 • 4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Maintenance request</p>
                  <p className="text-xs text-muted-foreground">HVAC issue - Unit 102 • 6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardCharts;
