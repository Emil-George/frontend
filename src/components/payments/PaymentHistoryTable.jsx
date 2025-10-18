import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { Label } from "../ui/label";
import { adminAPI } from '../../services/api';

const PaymentHistoryTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tenantNameFilter, setTenantNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size,
        sort: 'paymentDate,desc',
        ...(tenantNameFilter && { tenantName: tenantNameFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(dateRange?.from && { startDate: dateRange.from.toISOString().split('T')[0] }),
        ...(dateRange?.to && { endDate: dateRange.to.toISOString().split('T')[0] }),
      };
      const response = await adminAPI.getPaymentHistory(params);
      setPayments(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to fetch payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, size, tenantNameFilter, statusFilter, dateRange]);

  const handleSearch = () => {
    setPage(0); // Reset to first page on new search
    fetchPayments();
  };

  const handleClearFilters = () => {
    setTenantNameFilter('');
    setStatusFilter('');
    setDateRange({});
    setPage(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View and manage all tenant payments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="tenantName">Tenant Name</Label>
            <Input
              id="tenantName"
              placeholder="Filter by tenant name..."
              value={tenantNameFilter}
              onChange={(e) => setTenantNameFilter(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PARTIAL">Partial</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dateRange">Payment Date Range</Label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={handleClearFilters}>Clear</Button>
          </div>
        </div>

        {loading && <p>Loading payments...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Property/Unit</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.tenantName}</TableCell>
                      <TableCell>{payment.propertyAddress} {payment.unitNumber ? `- ${payment.unitNumber}` : ''}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.paymentDate || 'N/A'}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                      <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No payments found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryTable;