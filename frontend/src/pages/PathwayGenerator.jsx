import { useState, useEffect } from "react";
import { Check, Droplets, Leaf, Sun, AlertCircle, Globe } from "lucide-react";

// Multilingual content
const translations = {
  en: {
    title: "Smart Resource Management",
    subtitle: "Get personalized farming guidance in your language",
    tabForm: "Input Details",
    tabResult: "Farming Plan",
    infoBanner: "Fill in your farming details below to receive customized guidance based on your specific needs and conditions.",
    cropType: "Crop Type",
    cropPlaceholder: "e.g., Rice, Wheat, Cotton",
    landArea: "Land Area (hectares)",
    waterSupply: "Water Supply (L/ha/day)",
    waterSufficiency: "Water Sufficiency",
    waterOptions: {
      adequate: "Adequate",
      surplus: "Surplus",
      deficit: "Deficit"
    },
    fertilizer: "Fertilizer (kg/acre)",
    fertilizerType: "Fertilizer Type",
    fertilizerOptions: {
      urea: "Urea",
      dap: "DAP",
      organic: "Organic"
    },
    budget: "Budget (₹)",
    season: "Season",
    seasonOptions: {
      kharif: "Kharif",
      rabi: "Rabi",
      zaid: "Zaid"
    },
    language: "Language",
    errorPrefix: "Please fill in: ",
    generateButton: "Get Farming Plan",
    generating: "Generating...",
    resultTitle: "Your Farming Guidance",
    noResult: "Generate a farming plan to see results here",
    editInputs: "Edit Inputs",
    footer: "Smart Farming Assistant • Helping farmers make informed decisions"
  },
  hi: {
    title: "स्मार्ट संसाधन प्रबंधन",
    subtitle: "अपनी भाषा में व्यक्तिगत कृषि मार्गदर्शन प्राप्त करें",
    tabForm: "विवरण दर्ज करें",
    tabResult: "खेती योजना",
    infoBanner: "अपनी विशिष्ट आवश्यकताओं और स्थितियों के आधार पर अनुकूलित मार्गदर्शन प्राप्त करने के लिए नीचे अपने खेती विवरण भरें।",
    cropType: "फसल प्रकार",
    cropPlaceholder: "जैसे, धान, गेहूं, कपास",
    landArea: "भूमि क्षेत्र (हेक्टेयर)",
    waterSupply: "जल आपूर्ति (ली/हे/दिन)",
    waterSufficiency: "जल पर्याप्तता",
    waterOptions: {
      adequate: "पर्याप्त",
      surplus: "अधिशेष",
      deficit: "कमी"
    },
    fertilizer: "उर्वरक (किग्रा/एकड़)",
    fertilizerType: "उर्वरक प्रकार",
    fertilizerOptions: {
      urea: "यूरिया",
      dap: "डीएपी",
      organic: "जैविक"
    },
    budget: "बजट (₹)",
    season: "मौसम",
    seasonOptions: {
      kharif: "खरीफ",
      rabi: "रबी",
      zaid: "जायद"
    },
    language: "भाषा",
    errorPrefix: "कृपया भरें: ",
    generateButton: "खेती योजना प्राप्त करें",
    generating: "जनरेट कर रहा है...",
    resultTitle: "आपका कृषि मार्गदर्शन",
    noResult: "परिणाम देखने के लिए एक खेती योजना जनरेट करें",
    editInputs: "इनपुट संपादित करें",
    footer: "स्मार्ट कृषि सहायक • किसानों को सूचित निर्णय लेने में मदद करना"
  },
  mr: {
    title: "स्मार्ट संसाधन व्यवस्थापन",
    subtitle: "आपल्या भाषेत वैयक्तिक शेती मार्गदर्शन मिळवा",
    tabForm: "तपशील भरा",
    tabResult: "शेती योजना",
    infoBanner: "आपल्या विशिष्ट गरजा आणि परिस्थितींवर आधारित सानुकूलित मार्गदर्शन प्राप्त करण्यासाठी खाली आपले शेती तपशील भरा.",
    cropType: "पीक प्रकार",
    cropPlaceholder: "उदा., तांदूळ, गहू, कापूस",
    landArea: "जमीन क्षेत्र (हेक्टर)",
    waterSupply: "पाणी पुरवठा (ली/हे/दिवस)",
    waterSufficiency: "पाणी पुरेसेपणा",
    waterOptions: {
      adequate: "पुरेसे",
      surplus: "अतिरिक्त",
      deficit: "कमतरता"
    },
    fertilizer: "खत (किलो/एकर)",
    fertilizerType: "खत प्रकार",
    fertilizerOptions: {
      urea: "युरिया",
      dap: "डीएपी",
      organic: "सेंद्रिय"
    },
    budget: "बजेट (₹)",
    season: "हंगाम",
    seasonOptions: {
      kharif: "खरीप",
      rabi: "रबी",
      zaid: "जायद"
    },
    language: "भाषा",
    errorPrefix: "कृपया भरा: ",
    generateButton: "शेती योजना मिळवा",
    generating: "तयार करत आहे...",
    resultTitle: "आपले शेती मार्गदर्शन",
    noResult: "येथे परिणाम पाहण्यासाठी एक शेती योजना तयार करा",
    editInputs: "इनपुट संपादित करा",
    footer: "स्मार्ट शेती सहाय्यक • शेतकऱ्यांना माहितीपूर्ण निर्णय घेण्यास मदत करणे"
  },
  ta: {
    title: "ஸ்மார்ட் வள மேலாண்மை",
    subtitle: "உங்கள் மொழியில் தனிப்பயனாக்கப்பட்ட விவசாய வழிகாட்டுதலைப் பெறுங்கள்",
    tabForm: "விவரங்களை உள்ளிடவும்",
    tabResult: "விவசாய திட்டம்",
    infoBanner: "உங்கள் குறிப்பிட்ட தேவைகள் மற்றும் நிலைமைகளின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட வழிகாட்டுதலைப் பெற கீழே உங்கள் விவசாய விவரங்களை நிரப்பவும்.",
    cropType: "பயிர் வகை",
    cropPlaceholder: "எ.கா., அரிசி, கோதுமை, பருத்தி",
    landArea: "நில பரப்பளவு (ஹெக்டேர்)",
    waterSupply: "நீர் வழங்கல் (லி/ஹெக்/நாள்)",
    waterSufficiency: "நீர் போதுமானது",
    waterOptions: {
      adequate: "போதுமானது",
      surplus: "மிகை",
      deficit: "பற்றாக்குறை"
    },
    fertilizer: "உரம் (கிலோ/ஏக்கர்)",
    fertilizerType: "உர வகை",
    fertilizerOptions: {
      urea: "யூரியா",
      dap: "டிஏபி",
      organic: "இயற்கை"
    },
    budget: "பட்ஜெட் (₹)",
    season: "பருவம்",
    seasonOptions: {
      kharif: "காரிஃப்",
      rabi: "ரபி",
      zaid: "ஜாயத்"
    },
    language: "மொழி",
    errorPrefix: "தயவுசெய்து நிரப்பவும்: ",
    generateButton: "விவசாய திட்டத்தைப் பெறுக",
    generating: "உருவாக்குகிறது...",
    resultTitle: "உங்கள் விவசாய வழிகாட்டுதல்",
    noResult: "இங்கே முடிவுகளைக் காண ஒரு விவசாயத் திட்டத்தை உருவாக்கவும்",
    editInputs: "உள்ளீடுகளைத் திருத்தவும்",
    footer: "ஸ்மார்ட் விவசாய உதவியாளர் • விவசாயிகள் தகவலறிந்த முடிவுகளை எடுக்க உதவுதல்"
  },
  te: {
    title: "స్మార్ట్ వనరుల నిర్వహణ",
    subtitle: "మీ భాషలో వ్యక్తిగతీకరించిన వ్యవసాయ మార్గదర్శకత్వాన్ని పొందండి",
    tabForm: "వివరాలను నమోదు చేయండి",
    tabResult: "వ్యవసాయ ప్రణాళిక",
    infoBanner: "మీ నిర్దిష్ట అవసరాలు మరియు పరిస్థితుల ఆధారంగా అనుకూలీకరించిన మార్గదర్శకత్వాన్ని పొందడానికి దిగువ మీ వ్యవసాయ వివరాలను నింపండి.",
    cropType: "పంట రకం",
    cropPlaceholder: "ఉదా., వరి, గోధుమ, పత్తి",
    landArea: "భూమి విస్తీర్ణం (హెక్టార్లు)",
    waterSupply: "నీటి సరఫరా (లీ/హెక్/రోజు)",
    waterSufficiency: "నీటి సరిపోతుంది",
    waterOptions: {
      adequate: "తగినంత",
      surplus: "మిగులు",
      deficit: "లోటు"
    },
    fertilizer: "ఎరువు (కిలోలు/ఎకరం)",
    fertilizerType: "ఎరువు రకం",
    fertilizerOptions: {
      urea: "యూరియా",
      dap: "డిఎపి",
      organic: "సేంద్రీయ"
    },
    budget: "బడ్జెట్ (₹)",
    season: "సీజన్",
    seasonOptions: {
      kharif: "ఖరీఫ్",
      rabi: "రబీ",
      zaid: "జైద్"
    },
    language: "భాష",
    errorPrefix: "దయచేసి నింపండి: ",
    generateButton: "వ్యవసాయ ప్రణాళికను పొందండి",
    generating: "రూపొందిస్తోంది...",
    resultTitle: "మీ వ్యవసాయ మార్గదర్శకత్వం",
    noResult: "ఇక్కడ ఫలితాలను చూడటానికి ఒక వ్యవసాయ ప్రణాళికను రూపొందించండి",
    editInputs: "ఇన్‌పుట్‌లను సవరించండి",
    footer: "స్మార్ట్ వ్యవసాయ సహాయకుడు • రైతులు సమాచారం ఆధారిత నిర్ణయాలు తీసుకోవడానికి సహాయం చేస్తుంది"
  }
};

// Mapping of language names for selection
const languageNames = {
  en: "English",
  hi: "हिंदी (Hindi)",
  mr: "मराठी (Marathi)",
  ta: "தமிழ் (Tamil)",
  te: "తెలుగు (Telugu)"
};

const InputGroup = ({ label, type = "text", value, onChange, icon, placeholder, ...props }) => (
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
      placeholder={placeholder}
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
  const [interfaceLanguage, setInterfaceLanguage] = useState('en');

  // Initialize interface language from user's selection or browser preference
  useEffect(() => {
    // Set initial interface language from user selection if available
    const savedLanguage = localStorage.getItem('interfaceLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      setInterfaceLanguage(savedLanguage);
    } else {
      // Or try to detect from browser
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setInterfaceLanguage(browserLang);
      }
    }
  }, []);

  // Save interface language preference
  useEffect(() => {
    localStorage.setItem('interfaceLanguage', interfaceLanguage);
  }, [interfaceLanguage]);

  // Current translation based on selected interface language
  const t = translations[interfaceLanguage];

  // Create language options for dropdown
  const languageOptions = Object.keys(translations).map(code => ({
    value: code,
    label: languageNames[code]
  }));

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = () => {
    const required = ['crop', 'area', 'waterSupply', 'fertilizer', 'budget'];
    return required.filter(f => !inputs[f]);
  };

  // Change both interface and content language
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setInterfaceLanguage(newLang);
    handleInputChange('language', newLang);
  };

  const generateGuidance = async (e) => {
    e.preventDefault();
    const missing = validateForm();
    if (missing.length > 0) {
      setError(`${t.errorPrefix}${missing.join(', ')}`);
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
            {t.title}
          </h1>
          <p className="text-green-600 mt-2">{t.subtitle}</p>
          
          {/* Interface language selector */}
          <div className="mt-4">
            <div className="inline-flex items-center bg-white rounded-full px-3 py-1.5 border border-green-200 shadow-sm">
              <Globe size={16} className="text-green-600 mr-2" />
              <select 
                value={interfaceLanguage} 
                onChange={handleLanguageChange}
                className="text-sm bg-transparent border-none focus:ring-0 text-green-800"
              >
                {languageOptions.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
              {t.tabForm}
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
              {t.tabResult}
            </button>
          </div>
         
          <div className={`p-6 ${activeTab === 'form' ? 'block' : 'hidden'}`}>
            <form onSubmit={generateGuidance} className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4 flex items-start gap-3">
                  <Sun size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    {t.infoBanner}
                  </p>
                </div>
              </div>
             
              <div className="space-y-6">
                <InputGroup
                  label={t.cropType}
                  value={inputs.crop}
                  onChange={(e) => handleInputChange('crop', e.target.value)}
                  placeholder={t.cropPlaceholder}
                  icon={<Leaf size={16} />}
                />
               
                <InputGroup
                  label={t.landArea}
                  type="number"
                  value={inputs.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="e.g., 2.5"
                  min="0.1"
                  step="0.1"
                />
               
                <InputGroup
                  label={t.waterSupply}
                  type="number"
                  value={inputs.waterSupply}
                  onChange={(e) => handleInputChange('waterSupply', e.target.value)}
                  placeholder="e.g., 5000"
                  icon={<Droplets size={16} />}
                />
               
                <SelectGroup
                  label={t.waterSufficiency}
                  value={inputs.waterSufficiency}
                  onChange={(e) => handleInputChange('waterSufficiency', e.target.value)}
                  options={[
                    { value: 'adequate', label: t.waterOptions.adequate },
                    { value: 'surplus', label: t.waterOptions.surplus },
                    { value: 'deficit', label: t.waterOptions.deficit }
                  ]}
                />
              </div>

              <div className="space-y-6">
                <InputGroup
                  label={t.fertilizer}
                  type="number"
                  value={inputs.fertilizer}
                  onChange={(e) => handleInputChange('fertilizer', e.target.value)}
                  placeholder="e.g., 100"
                />
               
                <SelectGroup
                  label={t.fertilizerType}
                  value={inputs.fertilizerName}
                  onChange={(e) => handleInputChange('fertilizerName', e.target.value)}
                  options={[
                    { value: 'urea', label: t.fertilizerOptions.urea },
                    { value: 'dap', label: t.fertilizerOptions.dap },
                    { value: 'organic', label: t.fertilizerOptions.organic }
                  ]}
                />
               
                <InputGroup
                  label={t.budget}
                  type="number"
                  value={inputs.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="e.g., 50000"
                />
               
                <div className="grid grid-cols-2 gap-4">
                  <SelectGroup
                    label={t.season}
                    value={inputs.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    options={[
                      { value: 'kharif', label: t.seasonOptions.kharif },
                      { value: 'rabi', label: t.seasonOptions.rabi },
                      { value: 'zaid', label: t.seasonOptions.zaid }
                    ]}
                    icon={<Sun size={16} />}
                  />
                 
                  <SelectGroup
                    label={t.language}
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
                    {t.generating}
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    {t.generateButton}
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
                    {t.resultTitle}
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
                    {t.editInputs}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-16 text-center text-gray-500">
                {t.noResult}
              </div>
            )}
          </div>
        </div>
       
        <footer className="text-center text-sm text-green-600 mt-8">
          {t.footer}
        </footer>
      </div>
    </div>
  );
};

export default PathWayGenerator;