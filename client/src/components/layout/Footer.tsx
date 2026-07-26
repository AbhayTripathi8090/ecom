import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <div>
          © {new Date().getFullYear()} <span className="text-slate-200 font-semibold">AuraMarket</span>. All rights reserved.
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-200 transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};
