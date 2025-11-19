import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Edit, Save, Trash2, X, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { tenantAPI } from '../../services/api';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

function MaintenanceRequestDetails({ request, currentUser, onStatusUpdate, onFeedbackSubmit, onDeleteSuccess }) {
  if (!request)
    return <div className="p-6 text-center text-muted-foreground">No request selected.</div>;

  const isAdmin = currentUser?.role === 'ADMIN';
  const isTenant = currentUser?.role === 'TENANT';
  const canFeedback = isTenant && request.status === 'COMPLETED' && !request.rating;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: request.status,
    assignedTo: request.assignedTo || '',
    adminNotes: request.adminNotes || '',
  });
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete request "${request.title}"?`)) return;
    try {
      await tenantAPI.deleteMaintenanceRequest(request.id);
      alert('Deleted successfully');
      onDeleteSuccess?.(request.id);
    } catch (e) {
      alert('Failed to delete');
    }
  };

  const handleSave = async () => {
    await onStatusUpdate(request.id, editData);
    setIsEditing(false);
  };

  const renderStars = (rating, setRating) =>
    [1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`h-5 w-5 cursor-pointer ${
          s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
        onClick={() => setRating?.(s)}
      />
    ));

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{request.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge className={STATUS_COLORS[request.status]}>{request.status}</Badge>
              <Badge variant="outline">{request.priority}</Badge>
              <Badge variant="outline">{request.category}</Badge>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        <hr />

        {/* Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><b>Created:</b> {format(new Date(request.createdAt), 'MMM dd, yyyy')}</p>
          <p><b>Updated:</b> {format(new Date(request.updatedAt), 'MMM dd, yyyy')}</p>
          <p><b>Tenant:</b> {request.tenant?.name || 'N/A'}</p>
          <p><b>Email:</b> {request.tenant?.email}</p>
          <p><b>Phone:</b> {request.tenant?.phone}</p>
          <p><b>Address:</b> {request.tenant?.propertyAddress}</p>
        </div>

        <hr />

        {/* Admin edit or info */}
        {isAdmin && (
          <>
            {isEditing ? (
              <div className="grid gap-3">
                <Label>Status</Label>
                <select
                  className="border rounded-md px-3 py-2"
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <Label>Assigned To</Label>
                <input
                  className="border rounded-md px-3 py-2"
                  value={editData.assignedTo}
                  onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
                  placeholder="Technician name"
                />
                <Label>Notes</Label>
                <Textarea
                  value={editData.adminNotes}
                  onChange={(e) => setEditData({ ...editData, adminNotes: e.target.value })}
                  placeholder="Internal notes..."
                />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {request.assignedTo && <p><b>Assigned To:</b> {request.assignedTo}</p>}
                {request.adminNotes && <p><b>Notes:</b> {request.adminNotes}</p>}
              </div>
            )}
          </>
        )}

        {/* Files */}
        {request.files?.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Attachments</h4>
            {request.files.map((f) => (
              <div key={f.id} className="flex justify-between items-center text-sm border p-2 rounded-md">
                <span>{f.originalFilename}</span>
                <div className="flex gap-2">
                  {f.fileType === 'IMAGE' && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(f.viewUrl)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => window.open(f.downloadUrl)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {request.status === 'COMPLETED' && (
          <div className="space-y-3">
            <h4 className="font-medium">Feedback</h4>
            {request.rating ? (
              <div className="flex items-center gap-2">{renderStars(request.rating)}</div>
            ) : canFeedback ? (
              <>
                {!showFeedback ? (
                  <Button size="sm" onClick={() => setShowFeedback(true)}>
                    Leave Feedback
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-1">{renderStars(feedback.rating, (r) => setFeedback({ ...feedback, rating: r }))}</div>
                    <Textarea
                      placeholder="Comment..."
                      value={feedback.comment}
                      onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    />
                    <Button
                      size="sm"
                      disabled={!feedback.rating}
                      onClick={() => onFeedbackSubmit(request.id, feedback)}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Feedback not available yet.</p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="pt-2 border-t text-sm text-muted-foreground">
          <p>Created on {format(new Date(request.createdAt), 'MMM dd, yyyy')}</p>
          {request.status !== 'PENDING' && <p>Status: {request.status}</p>}
          {request.completedAt && <p>Completed on {format(new Date(request.completedAt), 'MMM dd, yyyy')}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default MaintenanceRequestDetails;
