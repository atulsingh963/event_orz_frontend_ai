import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Star, ArrowRight, ArrowLeft, Check, X, AlertCircle } from 'lucide-react';

const CreateEventNew = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '', description: '', category: 'other', eventDate: '', startTime: '', endTime: '', attendees: 0,
    venue: '',
    requiredTalents: [],
    addOns: []
  });

  const [talentInput, setTalentInput] = useState({ skill: '', count: 1, description: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const venueId = searchParams.get('venueId');
    if (venueId) {
      setFormData(prev => ({ ...prev, venue: venueId }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentStep === 2) fetchVenues();
  }, [currentStep]);

  const fetchVenues = async () => {
    try {
      const data = await venueService.getVenues();
      setVenues(data);
    } catch (err) {
      setError('Failed to load venues');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTalent = () => {
    if (talentInput.skill) {
      setFormData({ ...formData, requiredTalents: [...formData.requiredTalents, { ...talentInput }] });
      setTalentInput({ skill: '', count: 1, description: '' });
    }
  };

  const handleRemoveTalent = (index) => {
    setFormData({ ...formData, requiredTalents: formData.requiredTalents.filter((_, i) => i !== index) });
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.description || !formData.eventDate || !formData.startTime || !formData.endTime) {
          setError('Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (!formData.venue) {
          setError('Please select a venue');
          return false;
        }
        return true;
      case 3:
        if (formData.requiredTalents.length === 0) {
          setError('Please add at least one required talent');
          return false;
        }
        return true;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const eventData = { ...formData, requiredSkills: formData.requiredTalents };
      const event = await eventService.createEvent(eventData);
      navigate(`/organizer/events/${event._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Basics' },
      { number: 2, title: 'Venue' },
      { number: 3, title: 'Talents' },
      { number: 4, title: 'Add-ons' }
    ];

    return (
      <div className="flex items-center justify-between relative mb-12 max-w-3xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-eventorz-purple rounded-full z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, idx) => (
          <div key={step.number} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 ${
              currentStep > step.number ? 'bg-eventorz-purple border-eventorz-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' :
              currentStep === step.number ? 'bg-eventorz-navy border-eventorz-purple text-eventorz-purple shadow-[0_0_15px_rgba(139,92,246,0.3)]' :
              'bg-eventorz-navy border-white/20 text-eventorz-slate'
            }`}>
              {currentStep > step.number ? <Check size={18} /> : step.number}
            </div>
            <span className={`absolute top-12 whitespace-nowrap text-xs font-semibold ${
              currentStep >= step.number ? 'text-white' : 'text-eventorz-slate'
            }`}>{step.title}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Event Information</h2>
        <p className="text-eventorz-muted">Let&apos;s start with the basics of your event</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="form-label">Event Title <span className="text-eventorz-red">*</span></label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Summer Music Festival" className="input-field" />
        </div>

        <div>
          <label className="form-label">Description <span className="text-eventorz-red">*</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe your event in detail" className="input-field resize-none"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Category <span className="text-eventorz-red">*</span></label>
            <select name="category" value={formData.category} onChange={handleChange} className="input-field bg-eventorz-navy/80 appearance-none">
              <option value="conference">Conference</option>
              <option value="concert">Concert</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate</option>
              <option value="party">Party</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="form-label">Expected Attendees</label>
            <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} min="0" placeholder="e.g. 500" className="input-field" />
          </div>
        </div>

        <div>
          <label className="form-label">Event Date <span className="text-eventorz-red">*</span></label>
          <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="input-field" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Start Time <span className="text-eventorz-red">*</span></label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="form-label">End Time <span className="text-eventorz-red">*</span></label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} className="input-field" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => {
    const selectedVenue = venues.find(v => v._id === formData.venue);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose Your Venue</h2>
          <p className="text-eventorz-muted">Select the perfect location for your event</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className={`glass-card cursor-pointer transition-all duration-300 relative overflow-hidden ${
                formData.venue === venue._id ? 'border-eventorz-purple shadow-[0_0_15px_rgba(139,92,246,0.3)] ring-2 ring-eventorz-purple' : 'hover:border-eventorz-purple/50'
              }`}
              onClick={() => setFormData({ ...formData, venue: venue._id })}
            >
              {formData.venue === venue._id && (
                <div className="absolute top-3 right-3 z-20 bg-eventorz-purple text-white p-1 rounded-full shadow-lg">
                  <Check size={16} />
                </div>
              )}
              <div className="h-40 relative">
                {venue.images?.length > 0 ? (
                  <img src={venue.images[0]} alt={venue.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=400'; }} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-3xl font-bold text-white/20">{venue.name[0]}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-eventorz-panel to-transparent opacity-90"></div>
                <div className="absolute bottom-3 left-3 text-white font-bold text-lg">₹{venue.pricePerDay}/day</div>
              </div>
              <div className="p-4 bg-eventorz-panel">
                <h3 className="font-bold text-lg mb-1 truncate">{venue.name}</h3>
                <div className="flex items-center text-sm text-eventorz-slate mb-2">
                  <MapPin size={14} className="mr-1 text-eventorz-purple" /> {venue.location.city}, {venue.location.state}
                </div>
                <div className="flex items-center text-sm text-eventorz-slate">
                  <Users size={14} className="mr-1 text-eventorz-purple" /> Capacity: {venue.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Required Talents</h2>
        <p className="text-eventorz-muted">What type of performers do you need?</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="form-label text-sm">Talent Type</label>
            <input type="text" value={talentInput.skill} onChange={(e) => setTalentInput({ ...talentInput, skill: e.target.value })} placeholder="e.g. Singer, DJ" className="input-field py-2" />
          </div>
          <div>
            <label className="form-label text-sm">Quantity</label>
            <input type="number" value={talentInput.count} onChange={(e) => setTalentInput({ ...talentInput, count: parseInt(e.target.value) })} min="1" className="input-field py-2" />
          </div>
          <button type="button" onClick={handleAddTalent} className="btn-primary py-2 w-full flex items-center justify-center gap-2">
            <Plus size={18} /> Add
          </button>
        </div>
        <div className="mt-4">
          <label className="form-label text-sm">Description (Optional)</label>
          <input type="text" value={talentInput.description} onChange={(e) => setTalentInput({ ...talentInput, description: e.target.value })} placeholder="Specific requirements" className="input-field py-2" />
        </div>
      </div>

      <div className="space-y-3">
        {formData.requiredTalents.map((talent, index) => (
          <div key={index} className="glass-panel p-4 flex items-center justify-between rounded-xl border-l-4 border-l-eventorz-purple">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-bold text-lg">{talent.skill}</h4>
                <span className="bg-eventorz-purple/20 text-eventorz-purple text-xs font-bold px-2 py-1 rounded-md">x{talent.count}</span>
              </div>
              {talent.description && <p className="text-sm text-eventorz-muted">{talent.description}</p>}
            </div>
            <button onClick={() => handleRemoveTalent(index)} className="w-8 h-8 rounded-full bg-eventorz-red/10 text-eventorz-red flex items-center justify-center hover:bg-eventorz-red/20 transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
        {formData.requiredTalents.length === 0 && (
          <div className="text-center py-8 text-eventorz-slate border border-dashed border-white/10 rounded-xl">
            No talents added yet. Add at least one talent type above.
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    const selectedVenue = venues.find(v => v._id === formData.venue);
    const venueAddOns = selectedVenue?.availableAddOns || [];

    const handleToggleAddon = (addon) => {
      const idx = formData.addOns.findIndex(a => a.name === addon.name);
      if (idx >= 0) setFormData({ ...formData, addOns: formData.addOns.filter((_, i) => i !== idx) });
      else setFormData({ ...formData, addOns: [...formData.addOns, { ...addon, quantity: 1 }] });
    };

    const updateQuantity = (index, qty) => {
      const newAddons = [...formData.addOns];
      newAddons[index].quantity = parseInt(qty) || 1;
      setFormData({ ...formData, addOns: newAddons });
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Event Add-ons</h2>
          <p className="text-eventorz-muted">Optional services from {selectedVenue?.name}</p>
        </div>

        {venueAddOns.length === 0 ? (
          <div className="text-center py-12 text-eventorz-slate">No add-ons available for this venue. You can finish event creation.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-eventorz-purple mb-4">Available Add-ons</h3>
              {venueAddOns.map((addon, idx) => {
                const isSelected = formData.addOns.some(a => a.name === addon.name);
                return (
                  <div key={idx} onClick={() => handleToggleAddon(addon)} className={`glass-card p-4 cursor-pointer transition-all ${isSelected ? 'border-eventorz-purple bg-eventorz-purple/5' : 'hover:bg-white/5'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-eventorz-purple border-eventorz-purple text-white' : 'border-eventorz-slate'}`}>
                          {isSelected && <Check size={14} />}
                        </div>
                        <h4 className="font-bold">{addon.name}</h4>
                      </div>
                      <span className="font-semibold text-eventorz-gold">₹{addon.price}</span>
                    </div>
                    <p className="text-sm text-eventorz-slate pl-7">{addon.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-eventorz-panel rounded-2xl p-6 border border-white/5 h-fit">
              <h3 className="font-semibold text-white mb-6 pb-4 border-b border-white/10">Selected Items</h3>
              {formData.addOns.length === 0 ? (
                <p className="text-eventorz-slate text-sm">No items selected.</p>
              ) : (
                <div className="space-y-4">
                  {formData.addOns.map((addon, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{addon.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-eventorz-muted">₹{addon.price} x</span>
                          <input type="number" min="1" value={addon.quantity} onChange={(e) => updateQuantity(idx, e.target.value)} className="bg-eventorz-navy border border-white/10 rounded w-16 px-2 py-1 text-xs outline-none" onClick={e => e.stopPropagation()} />
                        </div>
                      </div>
                      <div className="font-bold">₹{addon.price * addon.quantity}</div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-eventorz-purple">₹{formData.addOns.reduce((sum, a) => sum + (a.price * a.quantity), 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 relative w-full flex items-center justify-center">
      <div className="absolute top-0 right-0 w-96 h-96 bg-eventorz-purple/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-4xl glass-card relative z-10 p-8 md:p-10">
        {renderStepIndicator()}
        
        {error && <div className="bg-eventorz-red/10 text-eventorz-red p-4 rounded-xl mb-8 flex items-center gap-2 text-sm"><AlertCircle size={18} /> {error}</div>}

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </AnimatePresence>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">
          <button onClick={() => currentStep > 1 ? prevStep() : navigate('/organizer/dashboard')} className="btn-ghost">
            {currentStep > 1 ? <><ArrowLeft size={18} /> Previous</> : 'Cancel'}
          </button>
          
          {currentStep < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary bg-eventorz-green hover:bg-green-600 shadow-[0_0_15px_rgba(107,183,109,0.4)]">
              {loading ? 'Creating...' : 'Create Event'} <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventNew;
