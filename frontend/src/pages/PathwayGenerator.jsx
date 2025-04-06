import { useState } from "react";
import { Check, Droplets, Leaf, Sun, AlertCircle } from "lucide-react";

const InputGroup = ({ label, type = "text", value, onChange, icon, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {icon && <span className="text-green-600">{icon}</span>}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border-2 border-green-200 rounded-lg focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all shadow-sm"
      {...props}
    />
  </div>
);

const SelectGroup = ({ label, value, onChange, options, icon }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      {icon && <span className="text-green-600">{icon}</span>}
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 border-2 border-green-200 rounded-lg bg-white focus:ring-4 focus:ring-green-300 shadow-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const PathWayGenerator = () => {
  const [inputs, setInputs] = useState({
    area: '',
    crop: '',
    harvestDate: '',
    sowingDate: '',
    budget: '',
    season: 'kharif',
    language: 'en',
    waterSupply: '',
    waterSufficiency: 'adequate',
    fertilizer: '',
    fertilizerName: 'urea'
  });

  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
  ];

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    const required = ['crop', 'area', 'waterSupply', 'fertilizer', 'budget'];
    return required.filter(f => !inputs[f]);
  };

  const generateGuidance = async (e) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const prompt = `
You are an Indian agricultural expert. Give farming guidance in the language identified by this language code: "${inputs.language}".
Use local terms, cultural context, and practical tips. Limit total words to 350–400.

**Farming Details**
- Crop: ${inputs.crop}
- Area: ${inputs.area} hectares
- Water: ${inputs.waterSupply} L/ha (${inputs.waterSufficiency})
- Fertilizer: ${inputs.fertilizer} kg/acre of ${inputs.fertilizerName}
- Budget: ₹${inputs.budget}
- Season: ${inputs.season}

**Guidance Format (Bullet Points, Local Units):**
1. Soil Preparation  
2. Water Management  
3. Fertilizer Schedule  
4. Crop Protection  
5. Yield Forecast
`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDIxYLzYWYYRv_Me8ALPfxAYCo6GmU6d2I`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || data.error) {
        console.error("Gemini error:", data?.error);
        throw new Error(data?.error?.message || "Unknown error");
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      // Improved formatting: remove stars, add proper paragraph spacing
      const formatted = aiText
        // Replace section headers with styled headings
        .replace(/\*\*(.+?)\*\*/g, '<h3 class="text-green-700 font-semibold text-lg mt-4 mb-2">$1</h3>')
        // Replace bullet points
        .replace(/--/g, '•')
        // Replace simple line breaks with proper paragraph spacing
        .replace(/\n\n/g, '</p><div class="border-b border-green-100 my-3"></div><p>')
        // Replace single line breaks within paragraphs
        .replace(/\n(?!\n)/g, '<br/>')
        // Wrap everything in paragraphs
        .replace(/^(.+)/, '<p>$1</p>');

      setResponse(formatted);
      setActiveTab('result');
    } catch (err) {
      console.error(err);
      setError("Failed to fetch guidance. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-8 text-center">
          <div className="inline-block bg-white p-4 rounded-full mb-4 shadow-md">
            <Leaf size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800">
            Smart Resource Management
          </h1>
          <p className="text-green-600 mt-2">Get personalized farming guidance in your language</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 font-medium text-center transition ${
                activeTab === 'form'
                  ? 'text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-green-600'
              }`}
              onClick={() => setActiveTab('form')}
            >
              Input Details
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center transition ${
                activeTab === 'result'
                  ? 'text-green-700 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-green-600'
              }`}
              onClick={() => setActiveTab('result')}
              disabled={!response}
            >
              Farming Plan
            </button>
          </div>
         
          <div className={`p-6 ${activeTab === 'form' ? 'block' : 'hidden'}`}>
            <form onSubmit={generateGuidance} className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4 flex items-start gap-3">
                  <Sun size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Fill in your farming details below to receive customized guidance based on your specific needs and conditions.
                  </p>
                </div>
              </div>
             
              <div className="space-y-6">
                <InputGroup
                  label="Crop Type"
                  value={inputs.crop}
                  onChange={(e) => handleInputChange('crop', e.target.value)}
                  placeholder="e.g., Rice, Wheat, Cotton"
                  icon={<Leaf size={16} />}
                />
               
                <InputGroup
                  label="Land Area (hectares)"
                  type="number"
                  value={inputs.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="e.g., 2.5"
                  min="0.1"
                  step="0.1"
                />
               
                <InputGroup
                  label="Water Supply (L/ha/day)"
                  type="number"
                  value={inputs.waterSupply}
                  onChange={(e) => handleInputChange('waterSupply', e.target.value)}
                  placeholder="e.g., 5000"
                  icon={<Droplets size={16} />}
                />
               
                <SelectGroup
                  label="Water Sufficiency"
                  value={inputs.waterSufficiency}
                  onChange={(e) => handleInputChange('waterSufficiency', e.target.value)}
                  options={[
                    { value: 'adequate', label: 'Adequate' },
                    { value: 'surplus', label: 'Surplus' },
                    { value: 'deficit', label: 'Deficit' }
                  ]}
                />
              </div>

              <div className="space-y-6">
                <InputGroup
                  label="Fertilizer (kg/acre)"
                  type="number"
                  value={inputs.fertilizer}
                  onChange={(e) => handleInputChange('fertilizer', e.target.value)}
                  placeholder="e.g., 100"
                />
               
                <SelectGroup
                  label="Fertilizer Type"
                  value={inputs.fertilizerName}
                  onChange={(e) => handleInputChange('fertilizerName', e.target.value)}
                  options={[
                    { value: 'urea', label: 'Urea' },
                    { value: 'dap', label: 'DAP' },
                    { value: 'organic', label: 'Organic' }
                  ]}
                />
               
                <InputGroup
                  label="Budget (₹)"
                  type="number"
                  value={inputs.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="e.g., 50000"
                />
               
                <div className="grid grid-cols-2 gap-4">
                  <SelectGroup
                    label="Season"
                    value={inputs.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    options={[
                      { value: 'kharif', label: 'Kharif' },
                      { value: 'rabi', label: 'Rabi' },
                      { value: 'zaid', label: 'Zaid' }
                    ]}
                    icon={<Sun size={16} />}
                  />
                 
                  <SelectGroup
                    label="Language"
                    value={inputs.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    options={languageOptions}
                  />
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="submit"
                onClick={generateGuidance}
                disabled={loading}
                className={`bg-green-600 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto hover:bg-green-700 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
                }`}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Get Farming Plan
                  </>
                )}
              </button>
            </div>
          </div>
         
          <div className={`${activeTab === 'result' ? 'block' : 'hidden'}`}>
            {response ? (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf size={20} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-green-800">
                    Your Farming Guidance
                  </h2>
                </div>
               
                <div className="p-6 border border-green-100 rounded-lg bg-green-50 shadow-sm">
                  <div className="prose max-w-none text-green-900 farming-plan"
                    dangerouslySetInnerHTML={{ __html: response }}
                  />
                </div>
               
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="text-green-700 border border-green-300 bg-white hover:bg-green-50 px-6 py-2.5 rounded-lg font-medium transition"
                  >
                    Edit Inputs
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-gray-500">
                Generate a farming plan to see results here
              </div>
            )}
          </div>
        </div>
       
        <footer className="text-center text-sm text-green-600 mt-8">
          Smart Farming Assistant • Helping farmers make informed decisions
        </footer>
      </div>
    </div>
  );
};

export default PathWayGenerator;