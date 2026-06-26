import React, { useState, useEffect } from "react";
import { Lead } from "../types";
import { Shield, Key, Eye, Trash2, CheckCircle, Clock, Archive, RefreshCw, X, Filter, Search, Phone, Mail, Calendar, ChevronDown } from "lucide-react";

interface AdminPortalProps {
  onClose: () => void;
}

export default function AdminPortal({ onClose }: AdminPortalProps) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/leads?passcode=${encodeURIComponent(passcode)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setLeads(data.leads);
        setIsAuthenticated(true);
        // Save passcode locally to maintain session
        localStorage.setItem("jc_admin_passcode", passcode);
      } else {
        throw new Error(data.error || "Incorrect passcode. Access denied.");
      }
    } catch (err: any) {
      setError(err.message || "Unauthorized access.");
    } finally {
      setLoading(false);
    }
  };

  // Check for saved session on load
  useEffect(() => {
    const saved = localStorage.getItem("jc_admin_passcode");
    if (saved) {
      setPasscode(saved);
      // Automatically attempt login
      fetch(`/api/leads?passcode=${encodeURIComponent(saved)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLeads(data.leads);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("jc_admin_passcode");
          }
        })
        .catch(() => {
          localStorage.removeItem("jc_admin_passcode");
        });
    }
  }, []);

  // Filter and search leads
  useEffect(() => {
    let result = leads;

    if (filterStatus !== "all") {
      result = result.filter((l) => l.status === filterStatus);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.email && l.email.toLowerCase().includes(q)) ||
          l.phone.includes(q) ||
          l.service.toLowerCase().includes(q) ||
          (l.carType && l.carType.toLowerCase().includes(q)) ||
          (l.vehicle && l.vehicle.make && l.vehicle.make.toLowerCase().includes(q)) ||
          (l.vehicle && l.vehicle.model && l.vehicle.model.toLowerCase().includes(q))
      );
    }

    setFilteredLeads(result);
  }, [leads, filterStatus, searchQuery]);

  const refreshLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/leads?passcode=${encodeURIComponent(passcode)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setLeads(data.leads);
      } else {
        throw new Error(data.error || "Session expired.");
      }
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
      localStorage.removeItem("jc_admin_passcode");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${id}?passcode=${encodeURIComponent(passcode)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Update local state smoothly
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus as any } : l))
        );
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update lead status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;

    try {
      const response = await fetch(`/api/leads/${id}?passcode=${encodeURIComponent(passcode)}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete lead.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jc_admin_passcode");
    setIsAuthenticated(false);
    setPasscode("");
    setLeads([]);
  };

  // Lead statistics
  const kpis = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    archived: leads.filter((l) => l.status === "archived").length,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* 1. PASSCODE AUTHORIZATION VIEW */}
      {!isAuthenticated ? (
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#d4af37]/10 text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#d4af37]/20">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Admin Portal</h3>
            <p className="text-xs text-gray-400 mt-1">
              Authorized personnel only. Please input passcode.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter passcode (default is 1234)"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.08] transition-all placeholder-gray-600 font-mono tracking-widest text-center"
                />
                <Key size={16} className="text-gray-500 absolute left-3 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-3 rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] text-neutral-900 font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <>
                  <Eye size={14} /> Unlock Console
                </>
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-600">
              Passcode can be set using the <code className="bg-neutral-900 text-gray-400 px-1 py-0.5 rounded">ADMIN_PASSCODE</code> environment variable.
            </p>
          </div>
        </div>
      ) : (
        /* 2. MAIN CRM DASHBOARD VIEW */
        <div className="w-full max-w-5xl h-[90vh] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/[0.02] border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#d4af37]/10 text-[#d4af37] p-2 rounded-xl border border-[#d4af37]/20">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  JC's Detailing Lead CRM
                  <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                    Secure
                  </span>
                </h3>
                <p className="text-xs text-gray-400">Manage client detailing inquiries and booking pipeline</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                onClick={refreshLeads}
                disabled={loading}
                className="p-2.5 rounded-xl border border-white/10 text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
                title="Refresh leads"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl border border-red-500/30 text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors text-xs font-semibold cursor-pointer"
              >
                Log Out
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl border border-white/10 text-gray-400 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* KPI Mini-Dashboard */}
          <div className="grid grid-cols-4 border-b border-white/10 divide-x divide-white/10">
            <div className="p-4 bg-white/[0.01] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Pipeline</div>
              <div className="text-xl md:text-2xl font-black text-white mt-1">{kpis.total}</div>
            </div>
            <div className="p-4 bg-white/[0.01] text-center">
              <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center justify-center gap-1">
                <Clock size={10} /> New Leads
              </div>
              <div className="text-xl md:text-2xl font-black text-red-500 mt-1">{kpis.new}</div>
            </div>
            <div className="p-4 bg-white/[0.01] text-center">
              <div className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider flex items-center justify-center gap-1">
                <CheckCircle size={10} /> Contacted
              </div>
              <div className="text-xl md:text-2xl font-black text-[#d4af37] mt-1">{kpis.contacted}</div>
            </div>
            <div className="p-4 bg-white/[0.01] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center justify-center gap-1">
                <Archive size={10} /> Archived
              </div>
              <div className="text-xl md:text-2xl font-black text-gray-400 mt-1">{kpis.archived}</div>
            </div>
          </div>

          {/* Filtering Header */}
          <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search leads name, vehicle, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.08] transition-all placeholder-gray-500"
              />
              <Search size={14} className="text-gray-500 absolute left-3 top-2.5" />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === "all" ? "bg-[#d4af37] text-neutral-900" : "bg-white/[0.03] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("new")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === "new" ? "bg-red-500 text-white animate-pulse" : "bg-white/[0.03] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilterStatus("contacted")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === "contacted" ? "bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30" : "bg-white/[0.03] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                Contacted
              </button>
              <button
                onClick={() => setFilterStatus("archived")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filterStatus === "archived" ? "bg-neutral-800 text-gray-300" : "bg-white/[0.03] text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                Archived
              </button>
            </div>
          </div>

          {/* Lead Cards List Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <Search size={40} className="text-gray-700 mb-3" />
                <p className="text-sm font-semibold">No leads matched your filters.</p>
                <p className="text-xs text-gray-600 mt-1">New inquiry submissions will instantly sync here.</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className={`border rounded-2xl p-5 bg-white/[0.02] shadow-md transition-all relative overflow-hidden ${
                    lead.status === "new"
                      ? "border-red-500/40 bg-red-500/[0.03]"
                      : lead.status === "contacted"
                      ? "border-[#d4af37]/40"
                      : "border-white/10"
                  }`}
                >
                  {/* Status strip */}
                  <div
                    className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                      lead.status === "new"
                        ? "bg-red-500"
                        : lead.status === "contacted"
                        ? "bg-[#d4af37]"
                        : "bg-neutral-700"
                    }`}
                  />

                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-white tracking-tight">{lead.name}</h4>
                        <span className="text-xs text-gray-400 font-mono">• {lead.id}</span>
                        {lead.status === "new" && (
                          <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider animate-pulse">
                            NEW INQUIRY
                          </span>
                        )}
                        {lead.status === "contacted" && (
                          <span className="bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                            CONTACTED
                          </span>
                        )}
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                        <a
                          href={`tel:${lead.phone}`}
                          className="hover:text-[#d4af37] flex items-center gap-1 transition-colors"
                        >
                          <Phone size={12} /> {lead.phone}
                        </a>
                        {lead.email && (
                          <>
                            <span className="text-neutral-800">|</span>
                            <a
                              href={`mailto:${lead.email}`}
                              className="hover:text-[#d4af37] flex items-center gap-1 transition-colors"
                            >
                              <Mail size={12} /> {lead.email}
                            </a>
                          </>
                        )}
                        <span className="text-neutral-800">|</span>
                        <span className="flex items-center gap-1 text-gray-500 font-mono">
                          <Calendar size={12} /> {new Date(lead.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Actions dropdown-style or simple group */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 self-end md:self-auto">
                      <button
                        onClick={() => handleStatusChange(lead.id, "contacted")}
                        disabled={lead.status === "contacted"}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border cursor-pointer transition-all ${
                          lead.status === "contacted"
                            ? "bg-[#d4af37]/10 text-[#d4af37]/50 border-transparent"
                            : "bg-white/[0.03] text-[#d4af37] border-white/10 hover:bg-[#d4af37]/10"
                        }`}
                        title="Mark contacted"
                      >
                        <CheckCircle size={14} /> <span className="hidden sm:inline">Contacted</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(lead.id, "archived")}
                        disabled={lead.status === "archived"}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 border cursor-pointer transition-all ${
                          lead.status === "archived"
                            ? "bg-neutral-800 text-gray-600 border-transparent"
                            : "bg-white/[0.03] text-gray-400 border-white/10 hover:bg-white/[0.06] hover:text-white"
                        }`}
                        title="Archive Lead"
                      >
                        <Archive size={14} /> <span className="hidden sm:inline">Archive</span>
                      </button>

                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-2 rounded-xl text-xs font-semibold bg-red-500/5 text-red-400 border border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Core Inquiry Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-4 bg-white/[0.02] rounded-xl p-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Vehicle Details</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        {lead.carType ? lead.carType : ""}
                        {lead.vehicle && (lead.vehicle.make || lead.vehicle.model) ? (
                          <>
                            {lead.carType ? " - " : ""}
                            {lead.vehicle.year ? `${lead.vehicle.year} ` : ""}
                            {lead.vehicle.make} {lead.vehicle.model}
                          </>
                        ) : null}
                        {!lead.carType && (!lead.vehicle || (!lead.vehicle.make && !lead.vehicle.model)) && (
                          <span className="text-gray-500 italic">Not Specified</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Selected Service</div>
                      <div className="text-sm font-bold text-[#d4af37] mt-0.5">{lead.service}</div>
                    </div>

                    <div className="md:col-span-3">
                      <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Inquiry details / notes</div>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed bg-white/[0.02] border border-white/10 p-2.5 rounded-lg whitespace-pre-line font-sans">
                        {lead.description || <span className="text-gray-600 italic">No notes provided. Customer requested direct booking contact.</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
