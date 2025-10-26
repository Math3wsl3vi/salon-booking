"use client";
import React, { useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

const AddStylists = () => {
  const router = useRouter();

  const [stylist, setStylist] = useState<{
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
  }>({
    name: "",
    specialty: "Hair Specialist",
    bio: "",
    imageUrl: "",
    rating: 5.0,
    expertise: [],
    email: "",
    phone: "+254",
    experience: "",
    status: "active"
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentExpertise, setCurrentExpertise] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setStylist({ ...stylist, [e.target.name]: e.target.value });
  };

  const addExpertise = () => {
    if (currentExpertise.trim() && !stylist.expertise.includes(currentExpertise.trim())) {
      setStylist({
        ...stylist,
        expertise: [...stylist.expertise, currentExpertise.trim()]
      });
      setCurrentExpertise("");
    }
  };

  const removeExpertise = (skill: string) => {
    setStylist({
      ...stylist,
      expertise: stylist.expertise.filter(s => s !== skill)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExpertise();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "stylists"), {
        name: stylist.name,
        specialty: stylist.specialty,
        bio: stylist.bio,
        imageUrl: stylist.imageUrl,
        rating: stylist.rating,
        expertise: stylist.expertise,
        email: stylist.email,
        phone: stylist.phone,
        experience: stylist.experience,
        status: stylist.status,
        createdAt: new Date(),
      });
      
      setMessage("Stylist added successfully!");
      setStylist({
        name: "",
        specialty: "Hair Specialist",
        bio: "",
        imageUrl: "",
        rating: 5.0,
        expertise: [],
        email: "",
        phone: "+254",
        experience: "",
        status: "active"
      });
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/stylists");
      }, 1500);
    } catch (error) {
      setMessage("Failed to add stylist. Check console for errors.");
      console.error("Error adding stylist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Predefined image suggestions for stylists
  const imageSuggestions = [
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop", // Female stylist 1
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", // Male stylist 1
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop", // Female stylist 2
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop", // Male stylist 2
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop", // Female stylist 3
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop" // Male stylist 3
  ];

  const specialtyOptions = [
    "Hair Specialist",
    "Color Expert",
    "Nail Artist",
    "Spa Therapist",
    "Skincare Expert",
    "Makeup Artist",
    "Barber",
    "Massage Therapist",
    "Esthetician",
    "Hair Stylist"
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F3] mt-20">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Add New Stylist
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Add a new stylist to your salon team
          </p>
          
          {message && (
            <p className={`text-sm text-center p-3 rounded-lg mb-6 ${
              message.includes("successfully") 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : "bg-red-100 text-red-700 border border-red-200"
            }`}>
              {message}
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={stylist.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Sarah Johnson"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty *
                </label>
                <select
                  name="specialty"
                  value={stylist.specialty}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                  {specialtyOptions.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={stylist.email}
                  onChange={handleChange}
                  placeholder="stylist@salon.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={stylist.phone}
                  onChange={handleChange}
                  placeholder="+254 XXX XXX XXX"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Experience and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={stylist.experience}
                  onChange={handleChange}
                  placeholder="e.g., 5+ years"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <select
                  name="rating"
                  value={stylist.rating}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                  <option value={5.0}>5.0 ★★★★★</option>
                  <option value={4.9}>4.9 ★★★★☆</option>
                  <option value={4.8}>4.8 ★★★★☆</option>
                  <option value={4.7}>4.7 ★★★★☆</option>
                  <option value={4.6}>4.6 ★★★★☆</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / Description *
              </label>
              <textarea
                name="bio"
                value={stylist.bio}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the stylist's background, skills, and approach..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
              />
            </div>

            {/* Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Expertise
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentExpertise}
                  onChange={(e) => setCurrentExpertise(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a skill (e.g., Balayage)"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                <button
                  type="button"
                  onClick={addExpertise}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Add
                </button>
              </div>
              
              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {stylist.expertise.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeExpertise(skill)}
                      className="text-white hover:text-gray-200 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Add specific skills and techniques the stylist specializes in
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={stylist.imageUrl}
                onChange={handleChange}
                required
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter a direct image URL. We recommend professional headshots.
              </p>

              {/* Image Suggestions */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Suggested profile images:
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {imageSuggestions.map((url, index) => (
                    <div 
                      key={index}
                      className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        stylist.imageUrl === url ? 'border-black ring-2 ring-black' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => setStylist({ ...stylist, imageUrl: url })}
                    >
                      <Image
                      width={500} 
                      height={500}
                        src={url} 
                        alt={`Suggestion ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {stylist.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <div className="border border-gray-300 rounded-lg p-2 max-w-xs">
                    <Image
                    width={500} 
                    height={500}
                      src={stylist.imageUrl} 
                      alt="Stylist preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={stylist.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold transition-all hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Stylist..." : "Add Stylist"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddStylists;