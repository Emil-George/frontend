import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const PropertyForm = ({ property, onClose, onSave }) => {
  const [formData, setFormData] = useState(property || {
    name: '',
    address: '',
    mapLink: '',
    managerOwnerName: '',
    numberOfUnits: 0,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'numberOfUnits' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Property Name</Label>
        <Input id="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={formData.address} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="mapLink">Map Link (Optional)</Label>
        <Input id="mapLink" value={formData.mapLink} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="managerOwnerName">Manager/Owner Name</Label>
        <Input id="managerOwnerName" value={formData.managerOwnerName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="numberOfUnits">Number of Units</Label>
        <Input id="numberOfUnits" type="number" value={formData.numberOfUnits} onChange={handleChange} required min="0" />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Property</Button>
      </DialogFooter>
    </form>
  );
};

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllProperties();
      setProperties(response.data);
    } catch (err) {
      setError('Failed to fetch properties.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = () => {
    setEditingProperty(null);
    setIsFormOpen(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setIsFormOpen(true);
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await adminAPI.deleteProperty(id);
        fetchProperties();
      } catch (err) {
        setError('Failed to delete property.');
        console.error('Error deleting property:', err);
      }
    }
  };

  const handleSaveProperty = async (formData) => {
    try {
      if (formData.id) {
        await adminAPI.updateProperty(formData.id, formData);
      } else {
        await adminAPI.createProperty(formData);
      }
      fetchProperties();
    } catch (err) {
      setError('Failed to save property.');
      console.error('Error saving property:', err);
    }
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p className="text-destructive">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Property Management</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">All Properties</CardTitle>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddProperty} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
              </DialogHeader>
              <PropertyForm
                property={editingProperty}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSaveProperty}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <p className="text-muted-foreground">No properties found. Add one to get started!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Manager/Owner</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Tenants</TableHead>
                  <TableHead>Vacancies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>{property.address}</TableCell>
                    <TableCell>{property.managerOwnerName}</TableCell>
                    <TableCell>{property.numberOfUnits}</TableCell>
                    <TableCell>{property.currentTenantsCount}</TableCell>
                    <TableCell>{property.vacanciesCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProperty(property)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPage;
