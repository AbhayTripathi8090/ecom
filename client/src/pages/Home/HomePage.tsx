import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Truck } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>Next Generation E-Commerce</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your Shopping Experience With{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              AuraMarket
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Discover curated premium collections, seamless checkout flows, real-time tracking, and instant delivery right to your doorstep.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/register">
              <Button size="lg" className="group">
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In to Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Express Delivery</h3>
          <p className="text-slate-400 text-sm">
            Lightning-fast shipping options with live order location updates.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Secure Payments</h3>
          <p className="text-slate-400 text-sm">
            Bank-grade end-to-end encrypted payment integrations and refunds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Curated Products</h3>
          <p className="text-slate-400 text-sm">
            Handpicked quality items verified for durability and aesthetics.
          </p>
        </div>
      </section>
    </div>
  );
};
