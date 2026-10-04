import React from 'react';
import { ShieldCheck, MapPin, Briefcase, Zap, ChevronRight, CheckCircle, Clock } from 'lucide-react';

export default function CandidateCard({ candidate, onViewDetails }) {
  const {
    name,
    role,
    experienceYears,
    location,
    readinessScore,
    immediatelyAvailable,
    verification,
    trustScore
  } = candidate;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h4 className="text-lg font-bold text-slate-900 leading-snug flex items-center gap-1.5">
              {name}
              {verification.epfoStatus === 'Verified' && (
                <ShieldCheck className="w-4 h-4 text-blue-600 inline-block" title="Verified Employment Signal" />
              )}
            </h4>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-0.5">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {role}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {location}</span>
            </div>
          </div>

          {/* Trust Score Badge */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5 text-center shrink-0">
            <span className="text-base font-extrabold text-blue-700 leading-none block">{trustScore}</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Trust Index</span>
          </div>
        </div>

        {/* Readiness Tag */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-md">
            {experienceYears} Yrs Exp
          </span>
          {immediatelyAvailable && (
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" /> Ready to Join
            </span>
          )}
        </div>
      </div>

      {/* Verification Status Signals */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Verification Signal Indicators:
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            {verification.epfoStatus === 'Verified' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="text-slate-700 font-medium">EPFO: <strong>{verification.epfoStatus}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            {verification.esicStatus === 'Verified' ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="text-slate-700 font-medium">ESIC: <strong>{verification.esicStatus}</strong></span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewDetails(candidate)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
      >
        View Verification Details
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
