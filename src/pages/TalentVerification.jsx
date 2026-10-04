import React, { useState, useMemo } from 'react';
import VerificationHero from '../components/verification/VerificationHero';
import CandidateSearchFilter from '../components/verification/CandidateSearchFilter';
import CandidateCard from '../components/verification/CandidateCard';
import VerificationDetailModal from '../components/verification/VerificationDetailModal';
import JobRequirementMatchWidget from '../components/verification/JobRequirementMatchWidget';
import { MOCK_CANDIDATES } from '../data/talentVerificationData';
import { Users, ShieldCheck, SearchX } from 'lucide-react';

export default function TalentVerification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [filters, setFilters] = useState({
    epfoOnly: false,
    esicOnly: false,
    employmentVerifiedOnly: false,
    immediatelyAvailableOnly: false,
    expBucket: 'all'
  });

  const resetFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setFilters({
      epfoOnly: false,
      esicOnly: false,
      employmentVerifiedOnly: false,
      immediatelyAvailableOnly: false,
      expBucket: 'all'
    });
  };

  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((candidate) => {
      // Search query (Name or Skill or Role)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(q);
        const matchesRole = candidate.role.toLowerCase().includes(q);
        if (!matchesName && !matchesRole) return false;
      }

      // Location filter
      if (locationFilter.trim()) {
        const loc = locationFilter.toLowerCase();
        if (!candidate.location.toLowerCase().includes(loc)) return false;
      }

      // Checkboxes
      if (filters.epfoOnly && candidate.verification.epfoStatus !== 'Verified') {
        return false;
      }
      if (filters.esicOnly && candidate.verification.esicStatus !== 'Verified') {
        return false;
      }
      if (
        filters.employmentVerifiedOnly &&
        candidate.verification.overallStatus !== 'Verified Employment Signal'
      ) {
        return false;
      }
      if (filters.immediatelyAvailableOnly && !candidate.immediatelyAvailable) {
        return false;
      }

      // Experience buckets
      if (filters.expBucket === '1-3' && (candidate.experienceYears < 1 || candidate.experienceYears > 3)) {
        return false;
      }
      if (filters.expBucket === '3-5' && (candidate.experienceYears < 3 || candidate.experienceYears > 5)) {
        return false;
      }
      if (filters.expBucket === '5+' && candidate.experienceYears < 5) {
        return false;
      }

      return true;
    });
  }, [searchQuery, locationFilter, filters]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <VerificationHero />

      {/* Requirement Match Widget */}
      <JobRequirementMatchWidget />

      {/* Search & Filter Controls */}
      <CandidateSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {/* Candidates List Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Verified Talent Directory ({filteredCandidates.length})
        </h3>
        <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
          Showing {filteredCandidates.length} of {MOCK_CANDIDATES.length} candidates
        </span>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onViewDetails={setSelectedCandidate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
          <SearchX className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">No Candidates Match Your Filters</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria, clearing verification filters, or broadening location preferences.
          </p>
          <button
            onClick={resetFilters}
            className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCandidate && (
        <VerificationDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
