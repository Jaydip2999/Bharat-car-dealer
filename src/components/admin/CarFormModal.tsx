import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Image as ImageIcon, Sparkles, AlertCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Car, BodyType, FuelType, TransmissionType, CarStatus } from '../../types';

interface Props {
  isOpen: boolean;
  carToEdit: Car | null;
  onClose: () => void;
  onSave: (carData: any) => Promise<void>;
}

export const CarFormModal: React.FC<Props> = ({
  isOpen,
  carToEdit,
  onClose,
  onSave
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [bodyType, setBodyType] = useState<BodyType>('SUV');
  const [year, setYear] = useState('2023');
  const [kilometers, setKilometers] = useState('25000');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [transmission, setTransmission] = useState<TransmissionType>('Manual');
  const [price, setPrice] = useState('14.50');
  const [estimatedEmi, setEstimatedEmi] = useState('23500');
  const [city, setCity] = useState('Delhi NCR');
  const [rto, setRto] = useState('DL-01');
  const [ownership, setOwnership] = useState<'1st Owner' | '2nd Owner'>('1st Owner');
  const [insurance, setInsurance] = useState('Zero Depreciation Comprehensive Insurance');
  const [safetyRating, setSafetyRating] = useState('5');
  const [inspectionScore, setInspectionScore] = useState('98');
  const [status, setStatus] = useState<CarStatus>('AVAILABLE');
  const [featured, setFeatured] = useState(false);
  const [tag, setTag] = useState('Certified Selection');
  const [color, setColor] = useState('Pearl White');
  const [primaryImageUrl, setPrimaryImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [featuresList, setFeaturesList] = useState<string[]>([
    'Panoramic Sunroof',
    'Touchscreen Infotainment',
    'Ventilated Front Seats',
    'Reverse Parking Camera',
    'Cruise Control'
  ]);
  const [newFeature, setNewFeature] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (carToEdit) {
      setBrand(carToEdit.brand);
      setModel(carToEdit.model);
      setVariant(carToEdit.variant);
      setBodyType(carToEdit.bodyType);
      setYear(carToEdit.year.toString());
      setKilometers(carToEdit.kilometers.toString());
      setFuelType(carToEdit.fuelType);
      setTransmission(carToEdit.transmission);
      setPrice(carToEdit.priceInLakhs.toString());
      setEstimatedEmi(carToEdit.estimatedEmi.toString());
      setCity(carToEdit.city);
      setRto(carToEdit.rto);
      setOwnership(carToEdit.ownership);
      setInsurance(carToEdit.insurance);
      setSafetyRating(carToEdit.safetyRating.toString());
      setInspectionScore(carToEdit.inspectionScore.toString());
      setStatus(carToEdit.status || 'AVAILABLE');
      setFeatured(Boolean(carToEdit.featured));
      setTag(carToEdit.tag || 'Certified Selection');
      setColor(carToEdit.color || 'Pearl White');

      const primary = carToEdit.imageUrl || (carToEdit.images && carToEdit.images[0]?.imageUrl) || '';
      setPrimaryImageUrl(primary);

      if (carToEdit.images && carToEdit.images.length > 1) {
        setAdditionalImages(carToEdit.images.slice(1).map(img => img.imageUrl));
      } else {
        setAdditionalImages([]);
      }

      setFeaturesList(carToEdit.features && carToEdit.features.length > 0 ? carToEdit.features : []);
    } else {
      // Default new car preset
      setBrand('Tata');
      setModel('Harrier');
      setVariant('XZ Plus Dark Edition');
      setBodyType('SUV');
      setYear('2023');
      setKilometers('22000');
      setFuelType('Diesel');
      setTransmission('Automatic');
      setPrice('18.75');
      setEstimatedEmi('29800');
      setCity('Delhi NCR');
      setRto('DL-03');
      setOwnership('1st Owner');
      setInsurance('Valid Zero Dep Insurance till Dec 2026');
      setSafetyRating('5');
      setInspectionScore('99');
      setStatus('AVAILABLE');
      setFeatured(true);
      setTag('Flagship Luxury');
      setColor('Oberon Black');
      setPrimaryImageUrl('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85');
      setAdditionalImages([
        'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=85',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85'
      ]);
      setFeaturesList([
        'Panoramic Sunroof',
        'JBL 9-Speaker Audio',
        'ADAS Level 2 Features',
        '360-Degree Camera',
        'Wireless Android Auto & CarPlay',
        'Electronic Parking Brake'
      ]);
    }
  }, [carToEdit, isOpen]);

  // Recalculate estimated EMI when price changes
  const handlePriceChange = (val: string) => {
    setPrice(val);
    const numPrice = parseFloat(val);
    if (!isNaN(numPrice) && numPrice > 0) {
      setEstimatedEmi(Math.round(numPrice * 100000 * 0.016).toString());
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setAdditionalImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSetAsPrimary = (idx: number) => {
    const selected = additionalImages[idx];
    const oldPrimary = primaryImageUrl;
    setPrimaryImageUrl(selected);
    setAdditionalImages(prev => {
      const next = [...prev];
      if (oldPrimary) {
        next[idx] = oldPrimary;
      } else {
        next.splice(idx, 1);
      }
      return next;
    });
  };

  const handleMoveImage = (idx: number, direction: 'left' | 'right') => {
    setAdditionalImages(prev => {
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !featuresList.includes(newFeature.trim())) {
      setFeaturesList(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feat: string) => {
    setFeaturesList(prev => prev.filter(f => f !== feat));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !variant || !price || !year) {
      setError('Please fill in all mandatory vehicle details.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const imagesPayload = [
      {
        imageUrl: primaryImageUrl || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85',
        altText: `${brand} ${model} Front Exterior`,
        isPrimary: true,
        sortOrder: 0
      },
      ...additionalImages.map((url, idx) => ({
        imageUrl: url,
        altText: `${brand} ${model} Photo ${idx + 2}`,
        isPrimary: false,
        sortOrder: idx + 1
      }))
    ];

    try {
      await onSave({
        brand,
        model,
        variant,
        bodyType,
        year: parseInt(year, 10),
        kilometers: parseInt(kilometers, 10),
        fuelType,
        transmission,
        price: parseFloat(price),
        estimatedEmi: parseInt(estimatedEmi, 10),
        city,
        rto,
        ownership,
        insurance,
        safetyRating: parseInt(safetyRating, 10),
        inspectionScore: parseInt(inspectionScore, 10),
        status,
        featured,
        tag,
        color,
        images: imagesPayload,
        features: featuresList
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save vehicle details');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {carToEdit ? `Edit Vehicle • ${carToEdit.brand} ${carToEdit.model}` : 'Add New Vehicle to Inventory'}
            </h3>
            <p className="text-xs text-slate-500">
              Bharat Wheels certified stock and inspection specifications
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">1. Vehicle Identity</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Brand *</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Tata, Mahindra, Hyundai"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Model *</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Harrier, Thar, Creta"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Variant *</label>
                <input
                  type="text"
                  required
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. XZ Plus Dark Edition"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Body Type</label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="MUV">MUV</option>
                  <option value="4x4">4x4</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Year *</label>
                <input
                  type="number"
                  required
                  min="2012"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="DCT/DCA">DCT/DCA</option>
                  <option value="AMT">AMT</option>
                  <option value="e-CVT">e-CVT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Hub */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">2. Pricing & Location</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Price (₹ Lakhs) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Monthly EMI (₹)</label>
                <input
                  type="number"
                  value={estimatedEmi}
                  onChange={(e) => setEstimatedEmi(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Dealership Hub City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Gurugram">Gurugram</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Kilometers Driven</label>
                <input
                  type="number"
                  value={kilometers}
                  onChange={(e) => setKilometers(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">RTO Registration</label>
                <input
                  type="text"
                  value={rto}
                  onChange={(e) => setRto(e.target.value)}
                  placeholder="e.g. DL-01, MH-02"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ownership</label>
                <select
                  value={ownership}
                  onChange={(e) => setOwnership(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="1st Owner">1st Owner</option>
                  <option value="2nd Owner">2nd Owner</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Inventory Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CarStatus)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="SOLD">SOLD</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Real Photos & Visuals */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">3. Real Photos (URLs)</h4>
              <span className="text-[11px] text-slate-400">High-resolution verified car photos</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Real Photo URL *</label>
              <input
                type="url"
                required
                value={primaryImageUrl}
                onChange={(e) => setPrimaryImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
              {primaryImageUrl && (
                <div className="mt-2 w-36 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
                  <img src={primaryImageUrl} alt="Primary Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Additional Gallery Photos</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Add side, interior, or cockpit photo URL"
                  className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Add Photo
                </button>
              </div>

              {additionalImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
                  {additionalImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                      <div className="aspect-16/10 w-full overflow-hidden">
                        <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-1.5 bg-white border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleSetAsPrimary(idx)}
                          className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-0.5"
                          title="Make Primary Cover Image"
                        >
                          <Star className="w-3 h-3" /> Cover
                        </button>
                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'left')}
                              className="p-0.5 hover:bg-slate-100 rounded text-slate-500"
                              title="Move Earlier"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                          )}
                          {idx < additionalImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'right')}
                              className="p-0.5 hover:bg-slate-100 rounded text-slate-500"
                              title="Move Later"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-0.5 hover:bg-rose-50 text-rose-600 rounded ml-1"
                            title="Remove Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Specifications & Highlights */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">4. Badges & Key Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Highlight Badge Tag</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Certified Selection, Top Variant"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Safety Rating (Stars)</label>
                <select
                  value={safetyRating}
                  onChange={(e) => setSafetyRating(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="5">5-Star Safety</option>
                  <option value="4">4-Star Safety</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Inspection Score (0-100)</label>
                <input
                  type="number"
                  min="85"
                  max="100"
                  value={inspectionScore}
                  onChange={(e) => setInspectionScore(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Key Features List</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature (e.g. Wireless Charger)"
                  className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {featuresList.map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <span>{feat}</span>
                    <button type="button" onClick={() => handleRemoveFeature(feat)} className="text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-75 text-slate-950 text-xs font-extrabold transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Vehicle...' : (carToEdit ? 'Update Vehicle' : 'Save to Inventory')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
