"use client";
import React, { useState } from "react";
import { db } from "@/configs/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AddService = () => {
  const router = useRouter();

  const [service, setService] = useState<{
    name: string;
    category: string;
    price: string;
    duration: string;
    description: string;
    imageUrl: string;
  }>({
    name: "",
    category: "Hair",
    price: "",
    duration: "",
    description: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "services"), {
        name: service.name,
        category: service.category,
        price: Number(service.price),
        duration: Number(service.duration),
        description: service.description,
        imageUrl: service.imageUrl,
        active: true,
        createdAt: new Date(),
      });
      
      setMessage("Service added successfully!");
      setService({
        name: "",
        category: "Hair",
        price: "",
        duration: "",
        description: "",
        imageUrl: "",
      });
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/admin/services-admin");
      }, 1500);
    } catch (error) {
      setMessage("Failed to add service. Check console for errors.");
      console.error("Error adding service:", error);
    } finally {
      setLoading(false);
    }
  };

  // Predefined image suggestions for each category
  const imageSuggestions = {
    Hair: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop"
    ],
    Nails: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop"
    ],
    Skin: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop"
    ],
    Spa: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop"
    ],
    Makeup: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1512496015859-e910535c0f2f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1595475888562-2d84d06adc7a?w=400&h=300&fit=crop"
    ],
    Other: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop"
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF6F3] mt-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-serif text-[#2C2C2C] mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
            Add New Service
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Add a new service to your salon menu
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
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="name"
                value={service.name}
                onChange={handleChange}
                required
                placeholder="e.g., Haircut & Styling"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* Category and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={service.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                >
                  <option value="Hair">Hair</option>
                  <option value="Nails">Nails</option>
                  <option value="Skin">Skin</option>
                  <option value="Spa">Spa</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={service.duration}
                  onChange={handleChange}
                  required
                  min="15"
                  step="15"
                  placeholder="e.g., 60"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (KSH) *
              </label>
              <input
                type="number"
                name="price"
                value={service.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g., 1500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={service.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the service in detail..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={service.imageUrl}
                onChange={handleChange}
                required
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter a direct image URL. We recommend using high-quality images from Unsplash.
              </p>

              {/* Image Suggestions */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Suggested images for {service.category}:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {imageSuggestions[service.category as keyof typeof imageSuggestions]?.map((url, index) => (
                    <div 
                      key={index}
                      className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        service.imageUrl === url ? 'border-black ring-2 ring-black' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => setService({ ...service, imageUrl: url })}
                    >
                      <Image
                      width={300} 
                      height={400}
                        src={url} 
                        alt={`Suggestion ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Preview */}
              {service.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <div className="border border-gray-300 rounded-lg p-2 max-w-xs">
                    <Image
                    width={300} 
                    height={400}
                      src={service.imageUrl} 
                      alt="Service preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop';
                      }}
                    />
                  </div>
                </div>
              )}
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
                {loading ? "Adding Service..." : "Add Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;