import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

export default function CandidateSearchFilter({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  filters,
  setFilters,
  resetFilters
}) {
  const handleCheckboxChange = (field) => {
    setFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleExpChange = (expBucket) => {
    setFilters(prev => ({
      ...prev,
      expBucket: prev.expBucket === expBucket ? 'all' : expBucket
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm mb-8 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter &amp; Search Talent
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      {/* Search Inputs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name or skill (e.g., CNC, Electrician)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
          />
        </div>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Location (e.g., Indore, Pithampur, Bhopal)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
          />
        </div>
      </div>

      {/* Checkboxes & Experience Buckets */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Verification &amp; Availability Signals:
        </span>
        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
          <label className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={filters.epfoOnly}
              onChange={() => handleCheckboxChange('epfoOnly')}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">EPFO Signal Available</span>
          </label>

          <label className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={filters.esicOnly}
              onChange={() => handleCheckboxChange('esicOnly')}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">ESIC Signal Available</span>
          </label>

          <label className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={filters.employmentVerifiedOnly}
              onChange={() => handleCheckboxChange('employmentVerifiedOnly')}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">Employment Fully Verified</span>
          </label>

          <label className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl cursor-pointer transition select-none">
            <input
              type="checkbox"
              checked={filters.immediatelyAvailableOnly}
              onChange={() => handleCheckboxChange('immediatelyAvailableOnly')}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="font-medium text-slate-700">⚡ Immediately Available</span>
          </label>
        </div>
      </div>

      {/* Experience Range Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Experience Range:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All Experience' },
            { id: '1-3', label: '1 - 3 Years' },
            { id: '3-5', label: '3 - 5 Years' },
            { id: '5+', label: '5+ Years' }
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => handleExpChange(b.id)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                filters.expBucket === b.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
