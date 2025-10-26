"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  DollarSign,
  Clock
} from "lucide-react";
import Image from "next/image";

type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string;
  imageUrl: string;
  active: boolean;
  createdAt: Timestamp;
};

const ServicesAdmin = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = collection(db, "services");

    const unsubscribe = onSnapshot(servicesRef, (snapshot) => {
      const servicesData: Service[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Service));

      // Sort by creation date (newest first)
      const sortedServices = servicesData.sort((a, b) => 
        (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
      );

      setServices(sortedServices);
      setFilteredServices(sortedServices);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter services based on search and filters
  useEffect(() => {
    let result = services;

    // Search filter
    if (searchTerm) {
      result = result.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(service => service.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(service => 
        statusFilter === "active" ? service.active : !service.active
      );
    }

    setFilteredServices(result);
  }, [services, searchTerm, categoryFilter, statusFilter]);

  // Toggle service active status
  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "services", serviceId), {
        active: !currentStatus,
      });
    } catch (error) {
      console.error("Error updating service status:", error);
    }
  };

  // Delete service
  const deleteService = async (serviceId: string, serviceName: string) => {
    if (confirm(`Are you sure you want to delete "${serviceName}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "services", serviceId));
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete service. Please try again.");
      }
    }
  };

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    const colors = {
      Hair: "bg-purple-100 text-purple-800 border-purple-200",
      Nails: "bg-pink-100 text-pink-800 border-pink-200",
      Skin: "bg-blue-100 text-blue-800 border-blue-200",
      Spa: "bg-green-100 text-green-800 border-green-200",
      Makeup: "bg-orange-100 text-orange-800 border-orange-200",
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  // Calculate statistics
  const totalServices = services.length;
  const activeServices = services.filter(service => service.active).length;
  const totalRevenuePotential = services.reduce((sum, service) => sum + service.price, 0);
  const averagePrice = totalServices > 0 ? Math.round(totalRevenuePotential / totalServices) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F3] mt-20">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage all salon services and pricing
            </p>
          </div>
          <Button 
            onClick={() => router.push("/admin/AddService")}
            className="bg-black hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Services</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">KSH {averagePrice.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">KSH {totalRevenuePotential.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Hair">Hair</SelectItem>
                  <SelectItem value="Nails">Nails</SelectItem>
                  <SelectItem value="Skin">Skin</SelectItem>
                  <SelectItem value="Spa">Spa</SelectItem>
                  <SelectItem value="Makeup">Makeup</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Services ({filteredServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={service.imageUrl}
                            alt={service.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryBadge(service.category)}>
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {service.duration} min
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      KSH {service.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={service.active 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleServiceStatus(service.id, service.active)}
                          className={service.active 
                            ? "text-orange-500 border-orange-500 hover:bg-orange-50" 
                            : "text-green-500 border-green-500 hover:bg-green-50"
                          }
                        >
                          {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/services/edit/${service.id}`)}
                          className="text-blue-500 border-blue-500 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteService(service.id, service.name)}
                          className="text-red-500 border-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {services.length === 0 ? (
                    <>
                      <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">No services found</p>
                      <p className="mt-2">Get started by adding your first service</p>
                      <Button 
                        onClick={() => router.push("/admin/services/add")}
                        className="mt-4 bg-black hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Service
                      </Button>
                    </>
                  ) : (
                    <>
                      <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">No matching services</p>
                      <p className="mt-2">Try adjusting your search or filters</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesAdmin;