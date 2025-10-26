"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Users, 
  Scissors, 
  BarChart3, 
  Settings, 
  DollarSign,
  Clock,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/configs/firebaseConfig";

// Define types for our data
interface DashboardStats {
  totalAppointments: number;
  totalCustomers: number;
  totalServices: number;
  totalStylists: number;
  totalRevenue: number;
  todaysAppointments: number;
  pendingBookings: number;
  monthlyRevenue: number;
  activeStylists: number;
}

interface Appointment {
  time: string;
  service: string;
  customer: string;
  stylist: string;
  date: Date;
}

interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  stylistName: string;
  date: Timestamp;
  time: string;
  status: string;
  price: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Ksh ${amount?.toLocaleString() || '0'}`;
  };

  // Fetch dashboard data from Firebase
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get current month range
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Fetch all collections in parallel
      const [
        stylistsSnapshot,
        servicesSnapshot,
        customersSnapshot,
        bookingsSnapshot,
        todaysBookingsSnapshot,
        monthlyBookingsSnapshot,
        pendingBookingsSnapshot
      ] = await Promise.all([
        getDocs(collection(db, "stylists")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "customers")),
        getDocs(collection(db, "bookings")),
        getDocs(query(
          collection(db, "bookings"),
          where("date", ">=", Timestamp.fromDate(today)),
          where("date", "<", Timestamp.fromDate(tomorrow))
        )),
        getDocs(query(
          collection(db, "bookings"),
          where("date", ">=", Timestamp.fromDate(firstDayOfMonth)),
          where("date", "<=", Timestamp.fromDate(lastDayOfMonth)),
          where("status", "in", ["completed", "confirmed"])
        )),
        getDocs(query(
          collection(db, "bookings"),
          where("status", "==", "pending")
        ))
      ]);

      // Calculate stats
      const totalStylists = stylistsSnapshot.size;
      const totalServices = servicesSnapshot.size;
      const totalCustomers = customersSnapshot.size;
      const totalAppointments = bookingsSnapshot.size;
      const todaysAppointments = todaysBookingsSnapshot.size;
      const pendingBookings = pendingBookingsSnapshot.size;

      // Calculate monthly revenue
      const monthlyRevenue = monthlyBookingsSnapshot.docs.reduce((total, doc) => {
        const booking = doc.data() as Booking;
        return total + (booking.price || 0);
      }, 0);

      // Calculate active stylists (stylists with bookings today)
      const activeStylistsToday = new Set(
        todaysBookingsSnapshot.docs.map(doc => doc.data().stylistId || doc.data().stylistName)
      ).size;

      // Get recent appointments for today
      const todayAppointments = todaysBookingsSnapshot.docs
        .map(doc => {
          const booking = doc.data() as Booking;
          return {
            time: booking.time,
            service: booking.serviceName,
            customer: booking.customerName,
            stylist: booking.stylistName,
            date: booking.date.toDate()
          };
        })
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(0, 4); // Limit to 4 appointments

      setStats({
        totalAppointments,
        totalCustomers,
        totalServices,
        totalStylists,
        totalRevenue: monthlyRevenue,
        todaysAppointments,
        pendingBookings,
        monthlyRevenue,
        activeStylists: activeStylistsToday
      });

      setRecentAppointments(todayAppointments);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time listener for bookings
  useEffect(() => {
    fetchDashboardData();

    // Real-time listener for bookings changes
    const unsubscribe = onSnapshot(collection(db, "bookings"), () => {
      fetchDashboardData();
    });

    return () => unsubscribe();
  }, []);

  const dashboardCards = [
    {
      title: "Appointments",
      description: "Manage today's bookings & schedule",
      href: "/admin/orders",
      icon: Calendar,
      count: stats?.todaysAppointments?.toString() || "0",
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
    },
    {
      title: "Customers",
      description: "Manage customers & stylists",
      href: "/admin/users",
      icon: Users,
      count: stats?.totalCustomers?.toString() || "0",
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    },
    {
      title: "Services",
      description: "Manage services & pricing",
      href: "/admin/services-admin",
      icon: Scissors,
      count: stats?.totalServices?.toString() || "0",
      color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
    },
    {
      title: "Stylists",
      description: "Manage beauty professionals",
      href: "/admin/stylists",
      icon: UserCheck,
      count: stats?.totalStylists?.toString() || "0",
      color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
    },
    {
      title: "Revenue",
      description: "View earnings & analytics",
      href: "/admin/revenue",
      icon: DollarSign,
      count: formatCurrency(stats?.monthlyRevenue || 0),
      color: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
    },
    {
      title: "Reports",
      description: "Business insights & reports",
      href: "/admin/reports",
      icon: BarChart3,
      count: "Monthly",
      color: "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
    }
  ];

  const quickStats = [
    { 
      label: "Today's Appointments", 
      value: stats?.todaysAppointments?.toString() || "0", 
      change: "+2" 
    },
    { 
      label: "Pending Bookings", 
      value: stats?.pendingBookings?.toString() || "0", 
      change: "-1" 
    },
    { 
      label: "Monthly Revenue", 
      value: formatCurrency(stats?.monthlyRevenue || 0), 
      change: "+12%" 
    },
    { 
      label: "Active Stylists", 
      value: stats?.activeStylists?.toString() || "0", 
      change: "+1" 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 mt-20 font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 mt-20 font-poppins flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading dashboard: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20 font-poppins">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Salon Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your beauty salon operations</p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="bg-white border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  <span className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Link key={card.title} href={card.href} className="block">
              <Card className={`border-2 transition-all duration-200 hover:shadow-md hover:scale-105 h-full ${card.color}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{card.count}</span>
                    <div className="text-sm px-2 py-1 bg-white rounded-full border">
                      View All
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              {"Today's"} Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{appointment.time}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{appointment.customer}</p>
                      <p className="text-sm text-gray-500">{appointment.stylist}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No appointments for today
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/bookings/new">
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                  <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium text-gray-700">Create New Booking</p>
                  <p className="text-sm text-gray-500">Schedule an appointment</p>
                </div>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/services/new">
                  <div className="p-3 bg-white border rounded-lg text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <Scissors className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-700">Add Service</p>
                  </div>
                </Link>
                
                <Link href="/admin/stylists/new">
                  <div className="p-3 bg-white border rounded-lg text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <UserCheck className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-gray-700">Add Stylist</p>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;