import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  FileText,
  Image,
  Download,
  Eye,
  Star,
  MessageSquare,
  Wrench,
  CheckCircle,
  AlertTriangle,
  Timer,
  Edit,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Timer },
  IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', icon: Wrench },
  COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: X }
};

const PRIORITY_CONFIG = {
  LOW: { color: 'bg-green-100 text-green-800' },
  MEDIUM: { color: 'bg-yellow-100 text-yellow-800' },
  HIGH: { color: 'bg-orange-100 text-orange-800' },
  URGENT: { color: 'bg-red-100 text-red-800' }
};

function MaintenanceRequestDetails({ 
  request, 
  currentUser, 
  onStatusUpdate, 
  onFeedbackSubmit,
  isUpdating = false 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: request.status,
    assignedTo: request.assignedTo || '',
    adminNotes: request.adminNotes || '',
    estimatedCompletion: request.estimatedCompletion || ''
  });
  const [feedback, setFeedback] = useState({
    rating: request.rating || 0,
    comment: request.tenantFeedback || ''
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';
  const isTenant = currentUser?.role === 'TENANT';
  const canProvideFeedback = isTenant && request.status === 'COMPLETED' && !request.rating;

  const StatusIcon = STATUS_CONFIG[request.status]?.icon || AlertTriangle;

  const handleSaveEdit = async () => {
    try {
      await onStatusUpdate(request.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      status: request.status,
      assignedTo: request.assignedTo || '',
      adminNotes: request.adminNotes || '',
      estimatedCompletion: request.estimatedCompletion || ''
    });
    setIsEditing(false);
  };

  const handleFeedbackSubmit = async () => {
    try {
      await onFeedbackSubmit(request.id, feedback);
      setShowFeedbackForm(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    return fileType === 'IMAGE' ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  const renderStarRating = (rating, interactive = false, onChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StatusIcon className="h-6 w-6" />
                <CardTitle className="text-xl">{request.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={STATUS_CONFIG[request.status]?.color}>
                  {request.status.replace('_', ' ')}
                </Badge>
                <Badge className={PRIORITY_CONFIG[request.priority]?.color}>
                  {request.priority} Priority
                </Badge>
                <Badge variant="outline">{request.category}</Badge>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isUpdating}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Request Details */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="mt-1 text-sm">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(request.updatedAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Information */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-muted-foreground">Tenant Information</Label>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>
                    {request.tenant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{request.tenant.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {request.tenant.email}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {request.tenant.phone}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {request.tenant.propertyAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Section */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={editData.status} 
                      onValueChange={(value) => setEditData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Assigned To</Label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={editData.assignedTo}
                      onChange={(e) => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))}
                      placeholder="Technician name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={editData.adminNotes}
                    onChange={(e) => setEditData(prev => ({ ...prev, adminNotes: e.target.value }))}
                    placeholder="Internal notes and updates"
                    className="min-h-[100px]"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {request.assignedTo && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                    <p className="mt-1 text-sm">{request.assignedTo}</p>
                  </div>
                )}
                
                {request.estimatedCompletion && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Estimated Completion</Label>
                    <p className="mt-1 text-sm">
                      {format(new Date(request.estimatedCompletion), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
                
                {request.adminNotes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Admin Notes</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{request.adminNotes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Files Section */}
      {request.files && request.files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attachments ({request.files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {request.files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.originalFilename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.fileSize)} • {format(new Date(file.uploadedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {file.fileType === 'IMAGE' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.viewUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.downloadUrl, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Section */}
      {request.status === 'COMPLETED' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {request.rating ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                  <div className="mt-1">
                    {renderStarRating(request.rating)}
                  </div>
                </div>
                {request.tenantFeedback && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Comments</Label>
                    <p className="mt-1 text-sm whitespace-pre-wrap">{request.tenantFeedback}</p>
                  </div>
                )}
              </div>
            ) : canProvideFeedback ? (
              <div className="space-y-4">
                {!showFeedbackForm ? (
                  <Button onClick={() => setShowFeedbackForm(true)}>
                    <Star className="h-4 w-4 mr-2" />
                    Provide Feedback
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Rating</Label>
                      <div className="mt-2">
                        {renderStarRating(feedback.rating, true, (rating) => 
                          setFeedback(prev => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Comments (Optional)</Label>
                      <Textarea
                        value={feedback.comment}
                        onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience with the service..."
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleFeedbackSubmit}
                        disabled={feedback.rating === 0}
                      >
                        Submit Feedback
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowFeedbackForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Feedback can be provided once the request is completed.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium">Request Created</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(request.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
                </p>
              </div>
            </div>
            
            {request.status !== 'PENDING' && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Status Updated</p>
                  <p className="text-xs text-muted-foreground">
                    Changed to {request.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )}
            
            {request.completedAt && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Request Completed</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(request.completedAt), 'MMM dd, yyyy \'at\' h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MaintenanceRequestDetails;
