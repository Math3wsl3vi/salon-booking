"use client";
import React from "react";
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

const AdminDashboard = () => {
  const dashboardCards = [
    {
      title: "Appointments",
      description: "Manage today's bookings & schedule",
      href: "/admin/orders",
      icon: Calendar,
      count: "24",
      color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
    },
    {
      title: "Customers",
      description: "Manage customers & stylists",
      href: "/admin/users",
      icon: Users,
      count: "156",
      color: "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    },
    {
      title: "Services",
      description: "Manage services & pricing",
      href: "/admin/services-admin",
      icon: Scissors,
      count: "12",
      color: "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
    },
    {
      title: "Stylists",
      description: "Manage beauty professionals",
      href: "/admin/stylists",
      icon: UserCheck,
      count: "8",
      color: "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
    },
    {
      title: "Revenue",
      description: "View earnings & analytics",
      href: "/admin/revenue",
      icon: DollarSign,
      count: "Ksh 48.2K",
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
    { label: "Today's Appointments", value: "12", change: "+2" },
    { label: "Pending Bookings", value: "5", change: "-1" },
    { label: "Monthly Revenue", value: "Ksh 48.2K", change: "+12%" },
    { label: "Active Stylists", value: "8", change: "+1" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-20 font-popppinspins">
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
              {[
                { time: "09:00 AM", service: "Haircut", customer: "Sarah Johnson", stylist: "Emma Wilson" },
                { time: "10:30 AM", service: "Manicure", customer: "Mike Davis", stylist: "Lisa Brown" },
                { time: "02:00 PM", service: "Hair Color", customer: "Jennifer Smith", stylist: "Alex Taylor" },
                { time: "04:30 PM", service: "Facial", customer: "Robert Wilson", stylist: "Maria Garcia" }
              ].map((appointment, index) => (
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
              ))}
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