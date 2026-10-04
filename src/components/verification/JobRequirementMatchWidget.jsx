import React from 'react';
import { Users, ShieldCheck, Zap, Award, Sparkles } from 'lucide-react';

export default function JobRequirementMatchWidget() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-100/80 px-2.5 py-1 rounded-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Employer Requirement Match Summary
          </span>
          <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
            Active Job Role: Senior Industrial CNC Operator (Indore &amp; Pithampur)
          </h3>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Real-time talent pool readiness matching verified employer criteria.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm shrink-0">
          <div className="text-center px-2">
            <span className="text-base font-extrabold text-slate-900 block leading-none">42</span>
            <span className="text-[11px] text-slate-500 font-medium">Candidates Match</span>
          </div>
          <div className="text-center px-2 border-l border-slate-100">
            <span className="text-base font-extrabold text-blue-600 block leading-none">23</span>
            <span className="text-[11px] text-slate-500 font-medium">Verified Signals</span>
          </div>
          <div className="text-center px-2 border-l border-slate-100">
            <span className="text-base font-extrabold text-emerald-600 block leading-none">12</span>
            <span className="text-[11px] text-slate-500 font-medium">Immediately Ready</span>
          </div>
          <div className="text-center px-2 border-l border-slate-100">
            <span className="text-base font-extrabold text-amber-600 block leading-none">8</span>
            <span className="text-[11px] text-slate-500 font-medium">High Readiness</span>
          </div>
        </div>
      </div>
    </div>
  );
}
