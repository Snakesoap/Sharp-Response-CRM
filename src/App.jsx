import React, { useState, useEffect } from 'react';
import { 
  Plus, Phone, MessageSquare, Search, Building2, User, Globe, 
  FileText, ChevronDown, X, Trash2, Edit3, Save, Filter,
  Flame, Send, Play, CheckCircle, XCircle
} from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 'cold', label: 'Cold', icon: Flame, color: 'bg-slate-600' },
  { id: 'contacted', label: 'Contacted', icon: Send, color: 'bg-yellow-600' },
  { id: 'demo_sent', label: 'Demo Sent', icon: Play, color: 'bg-blue-600' },
  { id: 'closed', label: 'Closed', icon: CheckCircle, color: 'bg-green-600' },
  { id: 'lost', label: 'Lost', icon: XCircle, color: 'bg-red-600' }
];

const NICHES = ['HVAC', 'Plumbing'];
const WEBSITE_STATUSES = ['None', 'Basic', 'Professional', 'Unknown'];

const INTRO_SCRIPT = `Hey, this is Princeton from Sharp Response AI Systems. I noticed your business online and wanted to reach out. We help contractors like you capture more leads with AI-powered solutions. Would you have 5 minutes this week to chat?`;

const defaultLead = {
  id: '',
  companyName: '',
  ownerName: '',
  phone: '',
  niche: 'HVAC',
  websiteStatus: 'Unknown',
  notes: '',
  stage: 'cold',
  createdAt: ''
};

export default function App() {
  const [leads, setLeads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [newLead, setNewLead] = useState({ ...defaultLead });
  const [searchQuery, setSearchQuery] = useState('');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('sharpResponseLeads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  // Save to localStorage whenever leads change
  useEffect(() => {
    localStorage.setItem('sharpResponseLeads', JSON.stringify(leads));
  }, [leads]);

  const generateId = () => `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleAddLead = () => {
    if (!newLead.companyName.trim()) return;
    
    const lead = {
      ...newLead,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    setLeads(prev => [lead, ...prev]);
    setNewLead({ ...defaultLead });
    setShowAddModal(false);
  };

  const handleUpdateLead = () => {
    if (!editingLead || !editingLead.companyName.trim()) return;
    
    setLeads(prev => prev.map(lead => 
      lead.id === editingLead.id ? editingLead : lead
    ));
    setEditingLead(null);
  };

  const handleDeleteLead = (id) => {
    if (window.confirm('Delete this lead?')) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
  };

  const handleStageChange = (leadId, newStage) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ));
  };

  const handleCall = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleText = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(INTRO_SCRIPT);
    window.location.href = `sms:${cleanPhone}?body=${encodedMessage}`;
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesNiche = nicheFilter === 'All' || lead.niche === nicheFilter;
    const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
    
    return matchesSearch && matchesNiche && matchesStage;
  });

  const getStageInfo = (stageId) => PIPELINE_STAGES.find(s => s.id === stageId) || PIPELINE_STAGES[0];

  const LeadCard = ({ lead }) => {
    const stageInfo = getStageInfo(lead.stage);
    const StageIcon = stageInfo.icon;
    
    return (
      <div className="bg-slate-800 rounded-xl p-4 md:p-5 border border-slate-700 hover:border-blue-500/50 transition-all duration-200 shadow-lg">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-lg truncate">{lead.companyName}</h3>
              <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                <User size={14} />
                <span className="truncate">{lead.ownerName || 'No owner listed'}</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditingLead(lead)}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDeleteLead(lead.id)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300">
              <Building2 size={12} />
              {lead.niche}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300">
              <Globe size={12} />
              {lead.websiteStatus}
            </span>
          </div>

          {/* Phone */}
          {lead.phone && (
            <p className="text-blue-400 font-mono text-sm">{formatPhone(lead.phone)}</p>
          )}

          {/* Notes */}
          {lead.notes && (
            <p className="text-slate-400 text-sm line-clamp-2 bg-slate-700/50 rounded-lg p-2">
              {lead.notes}
            </p>
          )}

          {/* Stage Selector */}
          <div className="relative">
            <select
              value={lead.stage}
              onChange={(e) => handleStageChange(lead.id, e.target.value)}
              className={`w-full appearance-none ${stageInfo.color} text-white text-sm font-medium rounded-lg px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {PIPELINE_STAGES.map(stage => (
                <option key={stage.id} value={stage.id} className="bg-slate-800">
                  {stage.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
          </div>

          {/* Action Buttons */}
          {lead.phone && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => handleCall(lead.phone)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                <Phone size={18} />
                <span>Call</span>
              </button>
              <button
                onClick={() => handleText(lead.phone)}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                <MessageSquare size={18} />
                <span>Text</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const LeadFormModal = ({ lead, setLead, onSave, onClose, title }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Company Name *</label>
            <input
              type="text"
              value={lead.companyName}
              onChange={(e) => setLead({ ...lead, companyName: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABC Plumbing Co."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Owner Name</label>
            <input
              type="text"
              value={lead.ownerName}
              onChange={(e) => setLead({ ...lead, ownerName: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={lead.phone}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Niche</label>
              <select
                value={lead.niche}
                onChange={(e) => setLead({ ...lead, niche: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {NICHES.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Website Status</label>
              <select
                value={lead.websiteStatus}
                onChange={(e) => setLead({ ...lead, websiteStatus: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {WEBSITE_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Pipeline Stage</label>
            <select
              value={lead.stage}
              onChange={(e) => setLead({ ...lead, stage: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {PIPELINE_STAGES.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              value={lead.notes}
              onChange={(e) => setLead({ ...lead, notes: e.target.value })}
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add any relevant notes..."
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!lead.companyName.trim()}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );

  const stageCounts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = leads.filter(l => l.stage === stage.id).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Sharp Response AI
              </h1>
              <p className="text-slate-400 text-sm hidden md:block">Lead Tracker CRM</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors shadow-lg shadow-blue-600/25"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* Pipeline Stats */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {PIPELINE_STAGES.map(stage => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => setStageFilter(stageFilter === stage.id ? 'All' : stage.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    stageFilter === stage.id 
                      ? `${stage.color} text-white ring-2 ring-white/20` 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon size={14} />
                  <span>{stage.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    stageFilter === stage.id ? 'bg-white/20' : 'bg-slate-600'
                  }`}>
                    {stageCounts[stage.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                showFilters || nicheFilter !== 'All'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-slate-800 rounded-xl border border-slate-700 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Niche</label>
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Niches</option>
                {NICHES.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Stage</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Stages</option>
                {PIPELINE_STAGES.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>
            {(nicheFilter !== 'All' || stageFilter !== 'All') && (
              <button
                onClick={() => { setNicheFilter('All'); setStageFilter('All'); }}
                className="self-end px-3 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lead Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <Building2 size={40} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {leads.length === 0 ? 'No leads yet' : 'No matching leads'}
            </h3>
            <p className="text-slate-500 mb-6">
              {leads.length === 0 
                ? 'Add your first lead to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {leads.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
              >
                <Plus size={20} />
                Add Your First Lead
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-4">
              Showing {filteredLeads.length} of {leads.length} leads
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLeads.map(lead => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add Lead Modal */}
      {showAddModal && (
        <LeadFormModal
          lead={newLead}
          setLead={setNewLead}
          onSave={handleAddLead}
          onClose={() => { setShowAddModal(false); setNewLead({ ...defaultLead }); }}
          title="Add New Lead"
        />
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <LeadFormModal
          lead={editingLead}
          setLead={setEditingLead}
          onSave={handleUpdateLead}
          onClose={() => setEditingLead(null)}
          title="Edit Lead"
        />
      )}
    </div>
  );
}
