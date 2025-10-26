"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/configs/firebaseConfig";
import {
  collection,
  Timestamp,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Calendar, Users, DollarSign, Filter } from "lucide-react";

type Booking = {
  id: string;
  userEmail: string;
  userId: string;
  serviceName: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt?: Timestamp;
  receiptUrl?: string;
  duration: number;
  stylistName: string;
  bookingDate: Timestamp;
  bookingTime: string;
  customerName: string;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const bookingsPerPage = 15;

  useEffect(() => {
    const bookingsRef = collection(db, "bookings");
  
    const unsubscribe = onSnapshot(bookingsRef, (snapshot) => {
      const updatedBookings: Booking[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userEmail: data.userEmail,
            userId: data.userId,
            status: data.status || "pending",
            duration: data.duration || 60,
            createdAt: data.createdAt || Timestamp.now(),
            receiptUrl: data.receiptUrl || "",
            serviceName: data.serviceName || "N/A",
            price: data.price || 0,
            stylistName: data.stylistName || "Not assigned",
            bookingDate: data.bookingDate || Timestamp.now(),
            bookingTime: data.bookingTime || "N/A",
            customerName: data.customerName || data.userEmail?.split('@')[0] || "Customer"
          };
        })
        .sort(
          (a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
        );
  
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
    });
  
    return () => unsubscribe();
  }, []);

  // Filter bookings based on search and status
  useEffect(() => {
    let result = bookings;

    // Search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.stylistName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [bookings, searchTerm, statusFilter]);

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: Booking["status"]) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  // Function to download report as CSV
  const downloadReport = () => {
    // Prepare CSV headers
    const headers = [
      "Service Name",
      "Customer Name",
      "Customer Email",
      "Stylist",
      "Duration (min)",
      "Price",
      "Booking Date",
      "Booking Time",
      "Status",
      "Booked At",
      "Receipt URL"
    ].join(",");
    
    // Prepare CSV rows
    const rows = filteredBookings.map(booking => {
      return [
        `"${booking.serviceName}"`,
        `"${booking.customerName}"`,
        `"${booking.userEmail}"`,
        `"${booking.stylistName}"`,
        booking.duration,
        `Ksh ${booking.price}`,
        `"${booking.bookingDate ? new Date(booking.bookingDate.toDate()).toLocaleDateString() : "N/A"}"`,
        `"${booking.bookingTime}"`,
        booking.status,
        `"${booking.createdAt ? new Date(booking.createdAt.toDate()).toLocaleString() : "N/A"}"`,
        `"${booking.receiptUrl || "N/A"}"`
      ].join(",");
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...rows].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `salon_bookings_report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status badge variant
  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate statistics
  const totalRevenue = bookings
    .filter(booking => booking.status === "completed")
    .reduce((sum, booking) => sum + booking.price, 0);

  const pendingBookings = bookings.filter(booking => booking.status === "pending").length;
  const confirmedBookings = bookings.filter(booking => booking.status === "confirmed").length;
  const completedBookings = bookings.filter(booking => booking.status === "completed").length;

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bookings Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage all salon appointments and bookings
          </p>
        </div>
        <Button onClick={downloadReport} className="bg-[#E8B4B8] hover:bg-[#E8B4B8]/90">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Ksh {totalRevenue.toLocaleString()}</div>
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
                placeholder="Search by customer, service, or stylist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Stylist</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Booking Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.serviceName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">{booking.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.stylistName}</TableCell>
                  <TableCell>{booking.duration} min</TableCell>
                  <TableCell>Ksh {booking.price}</TableCell>
                  <TableCell>
                    {booking.bookingDate 
                      ? new Date(booking.bookingDate.toDate()).toLocaleDateString() 
                      : "N/A"} at {booking.bookingTime}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {booking.receiptUrl ? (
                      <a 
                        href={booking.receiptUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:text-blue-700 underline text-sm"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateBookingStatus(booking.id, "confirmed")}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Confirm
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="text-red-500 border-red-500 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, "completed")}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {currentBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found matching your criteria.
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;