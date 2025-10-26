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
  Users,
  Star,
  Phone,
  Mail
} from "lucide-react";
import Image from "next/image";

type Stylist = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  rating: number;
  expertise: string[];
  email: string;
  phone: string;
  experience: string;
  status: "active" | "inactive";
  createdAt: Timestamp;
};

const Stylists = () => {
  const router = useRouter();
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [filteredStylists, setFilteredStylists] = useState<Stylist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stylistsRef = collection(db, "stylists");

    const unsubscribe = onSnapshot(stylistsRef, (snapshot) => {
      const stylistsData: Stylist[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Stylist));

      // Sort by creation date (newest first)
      const sortedStylists = stylistsData.sort((a, b) => 
        (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
      );

      setStylists(sortedStylists);
      setFilteredStylists(sortedStylists);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter stylists based on search and filters
  useEffect(() => {
    let result = stylists;

    // Search filter
    if (searchTerm) {
      result = result.filter(stylist =>
        stylist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stylist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stylist.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stylist.expertise.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Specialty filter
    if (specialtyFilter !== "all") {
      result = result.filter(stylist => stylist.specialty === specialtyFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(stylist => stylist.status === statusFilter);
    }

    setFilteredStylists(result);
  }, [stylists, searchTerm, specialtyFilter, statusFilter]);

  // Toggle stylist status
  const toggleStylistStatus = async (stylistId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, "stylists", stylistId), {
        status: currentStatus === "active" ? "inactive" : "active",
      });
    } catch (error) {
      console.error("Error updating stylist status:", error);
    }
  };

  // Delete stylist
  const deleteStylist = async (stylistId: string, stylistName: string) => {
    if (confirm(`Are you sure you want to delete "${stylistName}"? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, "stylists", stylistId));
      } catch (error) {
        console.error("Error deleting stylist:", error);
        alert("Failed to delete stylist. Please try again.");
      }
    }
  };

  // Get specialty badge color
  const getSpecialtyBadge = (specialty: string) => {
    const colors = {
      "Hair Specialist": "bg-purple-100 text-purple-800 border-purple-200",
      "Color Expert": "bg-pink-100 text-pink-800 border-pink-200",
      "Nail Artist": "bg-blue-100 text-blue-800 border-blue-200",
      "Spa Therapist": "bg-green-100 text-green-800 border-green-200",
      "Skincare Expert": "bg-orange-100 text-orange-800 border-orange-200",
      "Makeup Artist": "bg-red-100 text-red-800 border-red-200",
      "Barber": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Massage Therapist": "bg-teal-100 text-teal-800 border-teal-200",
      "Esthetician": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Hair Stylist": "bg-violet-100 text-violet-800 border-violet-200",
    };
    return colors[specialty as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Get unique specialties for filter
  const uniqueSpecialties = [...new Set(stylists.map(stylist => stylist.specialty))];

  // Calculate statistics
  const totalStylists = stylists.length;
  const activeStylists = stylists.filter(stylist => stylist.status === "active").length;
  const averageRating = stylists.length > 0 
    ? (stylists.reduce((sum, stylist) => sum + stylist.rating, 0) / stylists.length).toFixed(1)
    : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F3] mt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stylists...</p>
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
            <h1 className="text-3xl font-bold text-gray-800">Stylists Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your salon team and stylist profiles
            </p>
          </div>
          <Button 
            onClick={() => router.push("/admin/AddStylists")}
            className="bg-black hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Stylist
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stylists</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStylists}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stylists</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStylists}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{averageRating} ★</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Specialties</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{uniqueSpecialties.length}</div>
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
                  placeholder="Search stylists by name, specialty, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {uniqueSpecialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
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

        {/* Stylists Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Stylists ({filteredStylists.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stylist</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStylists.map((stylist) => (
                  <TableRow key={stylist.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={stylist.imageUrl}
                            alt={stylist.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-semibold">{stylist.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {stylist.experience}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSpecialtyBadge(stylist.specialty)}>
                        {stylist.specialty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {stylist.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[120px]">{stylist.email}</span>
                          </div>
                        )}
                        {stylist.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{stylist.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{stylist.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {stylist.expertise.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                        {stylist.expertise.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            +{stylist.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={stylist.status === "active" 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {stylist.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStylistStatus(stylist.id, stylist.status)}
                          className={stylist.status === "active" 
                            ? "text-orange-500 border-orange-500 hover:bg-orange-50" 
                            : "text-green-500 border-green-500 hover:bg-green-50"
                          }
                        >
                          {stylist.status === "active" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/admin/stylists/edit/${stylist.id}`)}
                          className="text-blue-500 border-blue-500 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteStylist(stylist.id, stylist.name)}
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

            {filteredStylists.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {stylists.length === 0 ? (
                    <>
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">No stylists found</p>
                      <p className="mt-2">Get started by adding your first stylist</p>
                      <Button 
                        onClick={() => router.push("/admin/AddStylists")}
                        className="mt-4 bg-black hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Stylist
                      </Button>
                    </>
                  ) : (
                    <>
                      <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">No matching stylists</p>
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

export default Stylists;