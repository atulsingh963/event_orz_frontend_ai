import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';
import '../../styles/createEvent.css';

const CreateEventNew = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    category: 'other',
    eventDate: '',
    startTime: '',
    endTime: '',
    attendees: 0,

    // Step 2: Venue
    venue: '',

    // Step 3: Required Talents
    requiredTalents: [],

    // Step 4: Add-ons
    addOns: []
  });

  const [talentInput, setTalentInput] = useState({
    skill: '',
    count: 1,
    description: ''
  });

  const [addonInput, setAddonInput] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 1
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (currentStep === 2) {
      fetchVenues();
    }
  }, [currentStep]);

  const fetchVenues = async () => {
    try {
      const data = await venueService.getVenues();
      setVenues(data);
    } catch (err) {
      setError('Failed to load venues');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTalent = () => {
    if (talentInput.skill) {
      setFormData({
        ...formData,
        requiredTalents: [...formData.requiredTalents, { ...talentInput }]
      });
      setTalentInput({ skill: '', count: 1, description: '' });
    }
  };

  const handleRemoveTalent = (index) => {
    setFormData({
      ...formData,
      requiredTalents: formData.requiredTalents.filter((_, i) => i !== index)
    });
  };

  const handleAddAddon = () => {
    if (addonInput.name && addonInput.price > 0) {
      setFormData({
        ...formData,
        addOns: [...formData.addOns, { ...addonInput }]
      });
      setAddonInput({ name: '', description: '', price: 0, quantity: 1 });
    }
  };

  const handleRemoveAddon = (index) => {
    setFormData({
      ...formData,
      addOns: formData.addOns.filter((_, i) => i !== index)
    });
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
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        requiredSkills: formData.requiredTalents // Backend still expects requiredSkills
      };
      const event = await eventService.createEvent(eventData);
      navigate(`/organizer/events/${event._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Basic Info' },
      { number: 2, title: 'Venue' },
      { number: 3, title: 'Talents' },
      { number: 4, title: 'Add-ons' }
    ];

    return (
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div key={step.number} className="step-indicator-item">
            <div className={`step-circle ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span className="step-title">{step.title}</span>
            {index < steps.length - 1 && <div className={`step-line ${currentStep > step.number ? 'completed' : ''}`} />}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="form-step">
      <h2>Event Basic Information</h2>
      <p className="step-description">Let's start with the basics of your event</p>

      <div className="form-grid">
        <div className="form-group full-width">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a catchy event title"
            className="input-large"
          />
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your event in detail"
            className="input-large"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange} className="input-large">
            <option value="conference">Conference</option>
            <option value="concert">Concert</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate</option>
            <option value="party">Party</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expected Attendees</label>
          <input
            type="number"
            name="attendees"
            value={formData.attendees}
            onChange={handleChange}
            min="0"
            placeholder="Number of guests"
            className="input-large"
          />
        </div>

        <div className="form-group">
          <label>Event Date *</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            className="input-large"
          />
        </div>

        <div className="form-group">
          <label>Start Time *</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="input-large"
          />
        </div>

        <div className="form-group">
          <label>End Time *</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="input-large"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const selectedVenue = venues.find(v => v._id === formData.venue);

    return (
      <div className="form-step">
        <h2>Choose Your Venue</h2>
        <p className="step-description">Select the perfect location for your event</p>

        <div className="venues-selection-grid">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className={`venue-selection-card ${formData.venue === venue._id ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, venue: venue._id })}
            >
              <div className="venue-selection-image">
                {venue.images && venue.images.length > 0 ? (
                  <img src={venue.images[0]} alt={venue.name} />
                ) : (
                  <div className="venue-placeholder-small">
                    <span>{venue.name.charAt(0)}</span>
                  </div>
                )}
                {formData.venue === venue._id && (
                  <div className="selection-badge">✓ Selected</div>
                )}
              </div>
              <div className="venue-selection-info">
                <h3>{venue.name}</h3>
                <p className="venue-location">📍 {venue.location.city}, {venue.location.state}</p>
                <p className="venue-capacity">👥 Capacity: {venue.capacity} people</p>
                <p className="venue-price">₹{venue.pricePerDay}/day</p>
              </div>
            </div>
          ))}
        </div>

        {selectedVenue && (
          <div className="selected-venue-summary">
            <h3>Selected Venue: {selectedVenue.name}</h3>
            <p>Price: ₹{selectedVenue.pricePerDay}/day</p>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="form-step">
      <h2>Required Talents</h2>
      <p className="step-description">What type of performers do you need for your event?</p>

      <div className="talent-input-section">
        <div className="talent-form-group">
          <label>Talent Type *</label>
          <input
            type="text"
            value={talentInput.skill}
            onChange={(e) => setTalentInput({ ...talentInput, skill: e.target.value })}
            placeholder="e.g., Singer, Dancer, DJ, Host, Magician"
            className="input-large"
          />
        </div>

        <div className="talent-form-group">
          <label>How Many? *</label>
          <input
            type="number"
            value={talentInput.count}
            onChange={(e) => setTalentInput({ ...talentInput, count: parseInt(e.target.value) })}
            min="1"
            className="input-large"
          />
        </div>

        <div className="talent-form-group full-width">
          <label>Description (Optional)</label>
          <input
            type="text"
            value={talentInput.description}
            onChange={(e) => setTalentInput({ ...talentInput, description: e.target.value })}
            placeholder="Any specific requirements or preferences"
            className="input-large"
          />
        </div>

        <button type="button" onClick={handleAddTalent} className="btn-add-item">
          + Add Talent
        </button>
      </div>

      <div className="added-items-list">
        <h3>Required Talents ({formData.requiredTalents.length})</h3>
        {formData.requiredTalents.length === 0 ? (
          <p className="empty-state-text">No talents added yet. Add at least one talent type.</p>
        ) : (
          <div className="items-grid">
            {formData.requiredTalents.map((talent, index) => (
              <div key={index} className="item-card">
                <div className="item-header">
                  <h4>{talent.skill}</h4>
                  <button onClick={() => handleRemoveTalent(index)} className="btn-remove-item">×</button>
                </div>
                <p className="item-detail">Quantity: {talent.count}</p>
                {talent.description && <p className="item-description">{talent.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const selectedVenue = venues.find(v => v._id === formData.venue);
    const venueAddOns = selectedVenue?.availableAddOns || [];

    const handleToggleAddon = (venueAddon) => {
      const existingIndex = formData.addOns.findIndex(a => a.name === venueAddon.name);

      if (existingIndex >= 0) {
        // Remove if already selected
        setFormData({
          ...formData,
          addOns: formData.addOns.filter((_, i) => i !== existingIndex)
        });
      } else {
        // Add with default quantity of 1
        setFormData({
          ...formData,
          addOns: [...formData.addOns, { ...venueAddon, quantity: 1 }]
        });
      }
    };

    const updateQuantity = (index, newQuantity) => {
      const updatedAddOns = [...formData.addOns];
      updatedAddOns[index].quantity = parseInt(newQuantity) || 1;
      setFormData({ ...formData, addOns: updatedAddOns });
    };

    const isSelected = (addonName) => {
      return formData.addOns.some(a => a.name === addonName);
    };

    const getTotalCost = () => {
      return formData.addOns.reduce((total, addon) => total + (addon.price * addon.quantity), 0);
    };

    return (
      <div className="form-step">
        <h2>Event Add-ons (Optional)</h2>
        <p className="step-description">
          Select from {selectedVenue?.name}'s available add-on services
        </p>

        {venueAddOns.length === 0 ? (
          <div className="empty-state-text">
            <p>This venue doesn't have any add-ons available. You can skip this step.</p>
          </div>
        ) : (
          <>
            <div className="addons-catalog">
              <h3>Available Add-ons</h3>
              <div className="addons-grid">
                {venueAddOns.map((addon, index) => (
                  <div
                    key={index}
                    className={`addon-catalog-card ${isSelected(addon.name) ? 'selected' : ''}`}
                    onClick={() => handleToggleAddon(addon)}
                  >
                    {isSelected(addon.name) && (
                      <div className="addon-selected-badge">✓</div>
                    )}
                    <div className="addon-category-tag">{addon.category}</div>
                    <h4>{addon.name}</h4>
                    <p className="addon-catalog-desc">{addon.description}</p>
                    <div className="addon-catalog-price">₹{addon.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="selected-addons-summary">
              <h3>Selected Add-ons ({formData.addOns.length})</h3>
              {formData.addOns.length === 0 ? (
                <p className="empty-state-text">No add-ons selected yet. Click on add-ons above to select them.</p>
              ) : (
                <>
                  <div className="selected-addons-list">
                    {formData.addOns.map((addon, index) => (
                      <div key={index} className="selected-addon-item">
                        <div className="selected-addon-info">
                          <h4>{addon.name}</h4>
                          <p>{addon.description}</p>
                        </div>
                        <div className="selected-addon-controls">
                          <label>Qty:</label>
                          <input
                            type="number"
                            min="1"
                            value={addon.quantity}
                            onChange={(e) => updateQuantity(index, e.target.value)}
                            className="quantity-input"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="addon-subtotal">₹{addon.price * addon.quantity}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAddon(index);
                            }}
                            className="btn-remove-small"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="addons-total">
                    <span>Total Add-ons Cost:</span>
                    <span className="total-amount">₹{getTotalCost()}</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="create-event-fullscreen">
      <div className="create-event-container">
        {renderStepIndicator()}

        {error && <div className="error-message-fullscreen">{error}</div>}

        <div className="step-content">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <div className="step-navigation">
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="btn-nav btn-cancel"
          >
            Cancel
          </button>

          <div className="nav-buttons-right">
            {currentStep > 1 && (
              <button onClick={prevStep} className="btn-nav btn-previous">
                ← Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button onClick={nextStep} className="btn-nav btn-next">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-nav btn-submit" disabled={loading}>
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventNew;
