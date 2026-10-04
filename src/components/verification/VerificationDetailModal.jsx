import React from 'react';
import { X, ShieldCheck, Building2, CheckCircle2, AlertTriangle, Info, Check, Lock } from 'lucide-react';

export default function VerificationDetailModal({ candidate, onClose }) {
  if (!candidate) return null;

  const {
    name,
    role,
    location,
    verification,
    trustScore,
    trustBreakdown,
    employmentHistory
  } = candidate;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
              Consent-Based Verification Audit
            </span>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {name}
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300">
                {verification.overallStatus}
              </span>
            </h3>
            <p className="text-xs text-slate-500">{role} • {location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 md:p-6 space-y-6">

          {/* Privacy Safeguard Callout Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Privacy Protection Policy:</strong> Sensitive government identifiers (UAN, Aadhaar, ESIC IP numbers) and salary numbers are masked by default. All data shown represents candidate-authorized boolean match signals.
            </div>
          </div>

          {/* Trust Score Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Composite Trust Index Breakdown
              </h4>
              <span className="text-lg font-extrabold text-blue-700 bg-blue-100 px-3 py-0.5 rounded-lg">
                {trustScore} / 100
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Employment History Signal', score: trustBreakdown.employmentVerification, max: 40 },
                { label: 'Experience & Tenure Consistency', score: trustBreakdown.experienceConsistency, max: 20 },
                { label: 'Trade Skill Evidence', score: trustBreakdown.skillEvidence, max: 20 },
                { label: 'Profile Completeness', score: trustBreakdown.profileCompleteness, max: 10 },
                { label: 'Recent Activity Signal', score: trustBreakdown.recentActivity, max: 10 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>{item.label}</span>
                    <span className="font-bold text-slate-800">{item.score} / {item.max}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employment History Cards */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Verified Employment Records (Signal Matching)
            </h4>

            <div className="space-y-3">
              {employmentHistory.map((job, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{job.company}</h5>
                      <p className="text-slate-600">{job.role} • {job.duration}</p>
                    </div>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                      Matched
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-md ${
                      job.epfoMatched ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {job.epfoMatched ? <Check className="w-3 h-3" /> : null}
                      EPFO Signal: {job.epfoMatched ? 'Verified' : 'Not Found'}
                    </span>

                    <span className={`inline-flex items-center gap-1 font-semibold px-2.5 py-1 rounded-md ${
                      job.esicMatched ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {job.esicMatched ? <Check className="w-3 h-3" /> : null}
                      ESIC Signal: {job.esicMatched ? 'Verified' : 'Not Found'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informational Prototype Disclaimer */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Prototype Notice:</strong> The Trust Score is a simulated hiring signal generated from consent-based verification indicators and candidate-submitted details. It is not an official government rating or government-issued document.
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs md:text-sm font-semibold py-2 px-5 rounded-xl transition"
          >
            Close Audit Modal
          </button>
        </div>

      </div>
    </div>
  );
}
