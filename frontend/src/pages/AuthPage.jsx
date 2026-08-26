import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  EnvelopeSimple,
  LockKey,
  User,
  SignIn,
  UserPlus,
  Book,
  WarningCircle,
  Sparkle,
  Cards,
  PenNib,
} from "@phosphor-icons/react";
import { useAuthStore } from "../store/useAuthStore";

export const AuthPage = () => {
  const navigate = useNavigate();
  const [parentRef] = useAutoAnimate();
  const { login, register, isLoading, error } = useAuthStore();

  const [isLoginView, setIsLoginView] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = isLoginView
      ? await login(formData.email, formData.password)
      : await register(formData.name, formData.email, formData.password);

    if (success) {
      navigate("/");
    }
  };

  return (
    /* I transformed the layout into a full-bleed split screen */
    <div className="min-h-screen w-full flex bg-[#F7F6F3]">
      {/* LEFT COLUMN: Promotional/Marketing Side 
        I hide this completely on mobile/tablets (hidden lg:flex) 
      */}
      <div className="hidden lg:flex w-1/2 bg-bento-lavender border-r-2 border-slate-200 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative background elements to make it feel less empty */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#C4B2E0]/40 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-[20px] bg-white border-2 border-slate-200 border-b-4 flex items-center justify-center shadow-sm mb-8">
            <Book size={36} weight="duotone" className="text-violet-900" />
          </div>
          <h1 className="font-display text-5xl font-bold text-slate-800 leading-tight mb-6">
            Your mind, <br />
            beautifully organized.
          </h1>
          <p className="font-body text-lg text-slate-700 font-semibold max-w-md">
            CozyNotes combines the power of a modern database with the tactile
            feel of your favorite physical notebook.
          </p>
        </div>

        {/* Feature list to sell the app's value proposition */}
        <div className="relative z-10 flex flex-col gap-6 mt-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/60 border-2 border-white/80 flex items-center justify-center">
              <Cards size={24} weight="duotone" className="text-violet-900" />
            </div>
            <p className="font-semibold text-slate-800">
              Dynamic Bento Grid Architecture
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/60 border-2 border-white/80 flex items-center justify-center">
              <Sparkle size={24} weight="duotone" className="text-violet-900" />
            </div>
            <p className="font-semibold text-slate-800">
              Distraction-free, soft-brutalism design
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/60 border-2 border-white/80 flex items-center justify-center">
              <PenNib size={24} weight="duotone" className="text-violet-900" />
            </div>
            <p className="font-semibold text-slate-800">
              Rich media, to-dos, and journaling
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form 
        Takes full width on mobile, half width on desktop 
      */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div
          ref={parentRef}
          className="w-full max-w-md bg-white border-2 border-slate-200 border-b-8 rounded-4xl p-6 md:p-8 shadow-sm flex flex-col gap-6"
        >
          {/* Form Header (Only shows logo on mobile since desktop has it on the left) */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="lg:hidden w-16 h-16 rounded-[20px] bg-bento-peach border-2 border-[#DBA19C] border-b-4 flex items-center justify-center shadow-sm">
              <Book size={36} weight="duotone" className="text-rose-900" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-800 tracking-wide">
                {isLoginView ? "Welcome Back" : "Join CozyNotes"}
              </h2>
              <p className="font-body text-slate-500 font-semibold text-[15px] mt-1">
                {isLoginView
                  ? "Enter your credentials to access your workspace."
                  : "Create an account to start organizing your ideas."}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-bold">
              <WarningCircle size={24} weight="duotone" className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* I added a 'key' prop tied to the state. This forces React to destroy and remount 
            the form, triggering the explicit Tailwind animate-in transition cleanly.
          */}
          <form
            key={isLoginView ? "login" : "register"}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {!isLoginView && (
              <div className="relative">
                <User
                  size={20}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  /* I replaced the light sky focus with a highly accessible slate-800 dark border */
                  className="w-full h-14 pl-12 pr-4 bg-[#F7F6F3] border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 placeholder:text-slate-400 focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all outline-none"
                />
              </div>
            )}

            <div className="relative">
              <EnvelopeSimple
                size={20}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full h-14 pl-12 pr-4 bg-[#F7F6F3] border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 placeholder:text-slate-400 focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all outline-none"
              />
            </div>

            <div className="relative">
              <LockKey
                size={20}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-14 pl-12 pr-4 bg-[#F7F6F3] border-2 border-slate-200 rounded-2xl font-semibold text-slate-700 placeholder:text-slate-400 focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full h-14 bg-slate-800 text-white font-bold text-[15px] rounded-2xl flex items-center justify-center gap-2 border-2 border-slate-800 border-b-4 hover:-translate-y-1 active:translate-y-0 active:border-b-2 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLoginView ? (
                <>
                  <SignIn size={20} weight="bold" /> Sign In
                </>
              ) : (
                <>
                  <UserPlus size={20} weight="bold" /> Create Account
                </>
              )}
            </button>
          </form>

          {/* View Toggle */}
          <div className="text-center pt-2 border-t-2 border-slate-100">
            <p className="font-semibold text-slate-500 text-[14px]">
              {isLoginView
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="ml-2 text-slate-800 hover:text-slate-600 transition-colors focus:outline-none underline decoration-2 underline-offset-4"
              >
                {isLoginView ? "Register here" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
