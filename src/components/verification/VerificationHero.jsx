import React from 'react';
import { ShieldCheck, Users, CheckCircle2, Zap, AlertCircle, Lock } from 'lucide-react';
import { VERIFICATION_KPIS } from '../../data/talentVerificationData';

export default function VerificationHero() {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-blue-400" /> New Module
        </span>
        <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-200 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> DEMO DATA • SIMULATED SIGNALS
        </span>
      </div>

      {/* Main Headline */}
      <div className="max-w-3xl mb-6">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-3 text-white flex items-center gap-3 flex-wrap">
          <ShieldCheck className="w-8 h-8 text-blue-400 inline-block" />
          EPFO / ESIC Employment Verification &amp; Trust Marker
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Consent-driven employment history signals for blue-collar and trade talent discovery.
          Evaluates employer registration continuity and active contribution indicators without storing sensitive personal IDs.
        </p>
      </div>

      {/* Privacy & Compliance Callout Box */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 mb-8 text-xs md:text-sm text-slate-300 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Privacy First &amp; Compliance Safeguards:</strong>
          This prototype uses candidate consent signals. Strictly <strong>NO</strong> UAN, Aadhaar, ESIC IP numbers, or salary figures are accessed, stored, or displayed. Only boolean match indicators are surfaced.
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          "Consent-First Workflow",
          "Verified / Pending Signals",
          "Transparent Trust Score",
          "Verified Talent Match"
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs md:text-sm font-medium text-blue-100 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700/80">
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-white block">
            {VERIFICATION_KPIS.totalCandidates.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Total Candidates</span>
        </div>
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 block">
            {VERIFICATION_KPIS.employmentVerified.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Employment Verified</span>
        </div>
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-blue-400 block">
            {VERIFICATION_KPIS.epfoSignals.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 font-medium">EPFO Signals Matched</span>
        </div>
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-xl p-4 text-center">
          <span className="text-2xl md:text-3xl font-extrabold text-amber-400 block">
            {VERIFICATION_KPIS.highlyReady.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 font-medium">Highly Ready Candidates</span>
        </div>
      </div>
    </div>
  );
}
