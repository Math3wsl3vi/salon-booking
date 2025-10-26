"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";
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
import { Search, Download, Filter, User, Phone, Calendar } from "lucide-react";
import { db } from "@/configs/firebaseConfig";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: Timestamp;
  status?: "active" | "inactive";
  totalBookings?: number;
  lastBooking?: Timestamp;
  loyaltyPoints?: number;
}

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loyaltyFilter, setLoyaltyFilter] = useState<string>("all");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Customer, "id">),
      }));
      
    });

    return () => unsubscribe();
  }, []);

  // Filter customers based on search and filters
  useEffect(() => {
    let result = customers;

    // Search filter
    if (searchTerm) {
      result = result.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(customer => customer.status === statusFilter);
    }

    // Loyalty filter
    if (loyaltyFilter !== "all") {
      if (loyaltyFilter === "high") {
        result = result.filter(customer => (customer.loyaltyPoints || 0) >= 100);
      } else if (loyaltyFilter === "medium") {
        result = result.filter(customer => 
          (customer.loyaltyPoints || 0) >= 50 && (customer.loyaltyPoints || 0) < 100
        );
      } else if (loyaltyFilter === "low") {
        result = result.filter(customer => (customer.loyaltyPoints || 0) < 50);
      }
    }

    setFilteredCustomers(result);
  }, [customers, searchTerm, statusFilter, loyaltyFilter]);

  // Customer statistics
  const activeCustomers = customers.filter(c => c.status !== "inactive").length;
  const newCustomersThisMonth = customers.filter(c => {
    if (!c.createdAt) return false;
    const customerDate = c.createdAt.toDate();
    const now = new Date();
    return customerDate.getMonth() === now.getMonth() && 
           customerDate.getFullYear() === now.getFullYear();
  }).length;

  const highValueCustomers = customers.filter(c => (c.loyaltyPoints || 0) >= 100).length;

  // Update customer status
  const updateCustomerStatus = async (customerId: string, status: "active" | "inactive") => {
    try {
      await updateDoc(doc(db, "users", customerId), {
        status: status
      });
    } catch (error) {
      console.error("Error updating customer status:", error);
    }
  };

  // Download customers report
  const downloadReport = () => {
    const headers = ["Name", "Email", "Phone", "Status", "Total Bookings", "Loyalty Points", "Last Booking", "Member Since"];
    const rows = filteredCustomers.map(customer => [
      `"${customer.name || "N/A"}"`,
      `"${customer.email}"`,
      `"${customer.phone || "N/A"}"`,
      customer.status || "active",
      customer.totalBookings || 0,
      customer.loyaltyPoints || 0,
      customer.lastBooking ? customer.lastBooking.toDate().toLocaleDateString() : "Never",
      customer.createdAt ? customer.createdAt.toDate().toLocaleDateString() : "N/A"
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `salon_customers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    return status === "active" ? "default" : "secondary";
  };

  // Get loyalty badge variant
  const getLoyaltyBadge = (points: number) => {
    if (points >= 100) return "default";
    if (points >= 50) return "secondary";
    return "outline";
  };

  const getLoyaltyLevel = (points: number) => {
    if (points >= 100) return "Gold";
    if (points >= 50) return "Silver";
    return "Bronze";
  };

  return (
    <div className="p-6 space-y-6 mt-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage all registered customers and their booking history
          </p>
        </div>
        <Button onClick={downloadReport} className="bg-black hover:bg-gray-800">
          <Download className="w-4 h-4 mr-2" />
          Export Customers
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeCustomers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {newCustomersThisMonth}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {highValueCustomers}
            </div>
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
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={loyaltyFilter} onValueChange={setLoyaltyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loyalty Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">Gold (100+ pts)</SelectItem>
                <SelectItem value="medium">Silver (50-99 pts)</SelectItem>
                <SelectItem value="low">Bronze (0-49 pts)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Loyalty Level</TableHead>
                <TableHead>Last Booking</TableHead>
                <TableHead>Member Since</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{customer.name || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone || "No phone"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(customer.status || "active")}>
                      {customer.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">
                      {customer.totalBookings || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getLoyaltyBadge(customer.loyaltyPoints || 0)}>
                      {getLoyaltyLevel(customer.loyaltyPoints || 0)}
                      <span className="ml-1">({customer.loyaltyPoints || 0} pts)</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.lastBooking ? 
                      customer.lastBooking.toDate().toLocaleDateString() : 
                      "Never"
                    }
                  </TableCell>
                  <TableCell>
                    {customer.createdAt ? 
                      customer.createdAt.toDate().toLocaleDateString() : 
                      "N/A"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={customer.status || "active"}
                      onValueChange={(value: "active" | "inactive") => 
                        updateCustomerStatus(customer.id, value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No customers found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomersPage;