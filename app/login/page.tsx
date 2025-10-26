"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "@/configs/firebaseConfig";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { doc, setDoc } from "firebase/firestore";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  // ✅ Only navigate if user is found
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save additional user data to Firestore
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
          userType: "customer", // Default to customer for salon system
          createdAt: new Date(),
        });
      }

      const user: User = userCredential.user;
      localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email })
      );

      router.replace("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccess("Password reset link sent! Check your email.");
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send reset email.");
      }
    }
  };

  // ✅ Prevent rendering while checking auth state
  if (authLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[#FAF6F3]">
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="flex items-center flex-col">
          <CardTitle className="text-2xl font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
            Welcome to Our Maison de Beauté
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Login to your account" : "Create an account to book appointments"}
          </CardDescription>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {resetSuccess && <p className="text-green-500 text-sm text-center">{resetSuccess}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth}>
            <div className="grid w-full items-center gap-4">
              {!isLogin && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </div>
              </div>
            </div>
            <button 
              className="w-full bg-black text-white p-3 rounded-lg mt-4 font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed" 
              type="submit" 
              disabled={loading}
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {isLogin && (
            <p
              className="text-sm cursor-pointer text-blue-600 text-center mt-3 hover:text-blue-800 transition-colors"
              onClick={handleResetPassword}
            >
              Forgot Password?
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center mt-2">
          <p 
            className="text-sm cursor-pointer text-gray-600 hover:text-black transition-colors" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;