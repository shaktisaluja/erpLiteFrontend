import React, { useState } from "react";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/login";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSuccess } from "../redux/authSlice";
import { loginService } from "../service/authService";

const getAuthEntity = (payload) => payload?.data || payload;
const getToken = (payload) =>
  getAuthEntity(payload)?.token ||
  getAuthEntity(payload)?.accessToken ||
  "";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const authData = await loginService(data);
      const token = getToken(authData);

      if (!token) {
        throw new Error("Token missing in login response");
      }

      localStorage.setItem("token", token);
      dispatch(loginSuccess(authData));

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-['Inter']">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-[440px] relative">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
          
          {/* Header */}
          <div className="mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              <LogIn className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 mt-2 text-[15px]">
              Please enter your details to sign in to erpLite.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className={`flex items-center bg-slate-50 border ${errors.email ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50'} rounded-2xl px-4 transition-all duration-200`}>
                <Mail className="text-slate-400 shrink-0" size={18} />
                <input
                  type="email"
                  {...register("email")}
                  autoComplete="off"
                  placeholder="name@company.com"
                  className="w-full bg-transparent px-3 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none text-[15px]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className={`flex items-center bg-slate-50 border ${errors.password ? 'border-red-300 ring-2 ring-red-50' : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50'} rounded-2xl px-4 transition-all duration-200`}>
                <Lock className="text-slate-400 shrink-0" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {errors.password.message}
                </p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-[15px] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign in to dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link (Optional but good for UI) */}
          <p className="text-center text-slate-500 text-sm mt-8">
            Don't have an account?{" "}
            <a href="#" className="text-indigo-600 font-semibold hover:underline">
              Contact Admin
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          &copy; 2026 erpLite. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
