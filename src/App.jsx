import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Activity, Calculator, User, Stethoscope, Printer, ChevronDown, ExternalLink, RefreshCw, Lock, ShieldCheck } from 'lucide-react';

// --- UI Components ---

const LevelBadge = ({ level }) => {
  const colors = {
    1: "bg-green-100 text-green-800 border-green-200 print:border-green-800 print:text-green-900",
    2: "bg-yellow-100 text-yellow-800 border-yellow-200 print:border-yellow-600 print:text-yellow-900",
    3: "bg-orange-100 text-orange-800 border-orange-200 print:border-orange-600 print:text-orange-900",
    4: "bg-red-100 text-red-800 border-red-200 print:border-red-600 print:text-red-900"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${colors[level] || colors[1]} print:bg-transparent print:border`}>
      第 {level} 級
    </span>
  );
};

const ChecklistItem = ({ label, isChecked, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all 
      ${isChecked 
        ? 'bg-green-50 border-green-500 hover:bg-green-100' 
        : 'bg-red-50 border-red-300 hover:bg-red-100 hover:border-red-400'}`}
  >
    <span className="text-gray-700 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-bold ${isChecked ? 'text-green-700' : 'text-red-600'}`}>
          {isChecked ? '合格' : '不合格'}
      </span>
      {isChecked ? (
          <CheckCircle2 className="w-6 h-6 text-green-600" />
      ) : (
          <XCircle className="w-6 h-6 text-red-500" />
      )}
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, unit, placeholder, type = "number" }) => (
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-500 mb-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {unit && <span className="absolute right-3 top-2 text-sm text-gray-400">{unit}</span>}
    </div>
  </div>
);

// --- Anze Care Logo Component (CSS 模擬您的圖片) ---
const AnzeLogo = () => (
  <div className="flex items-center gap-3 select-none">
    {/* Logo 圖示部分 */}
    <div className="relative w-12 h-12 flex items-center justify-center">
       {/* 外框與 A 字樣的模擬 */}
       <div className="w-full h-full border-l-4 border-b-4 border-gray-500 rounded-bl-3xl absolute left-0 bottom-0"></div>
       <span className="text-4xl font-bold text-[#2e5090] relative z-10" style={{ fontFamily: 'Arial, sans-serif' }}>A</span>
       <div className="w-2 h-2 bg-[#2e5090] absolute top-2 right-1 rounded-full opacity-0"></div>
    </div>
    
    {/* 文字部分 */}
    <div className="flex flex-col justify-center">
      <h1 className="text-2xl font-bold text-[#2e5090] leading-none tracking-wide" style={{ fontFamily: '"Microsoft JhengHei", sans-serif' }}>
        安澤健康顧問
      </h1>
      <h2 className="text-[0.6rem] font-bold text-[#2e5090] leading-none tracking-[0.2em] mt-1">
        ANZECARE CONSULTING
      </h2>
    </div>
  </div>
);

// --- Constants ---
const INITIAL_CHECKLIST = {
    hospitalCertified: false, historySurvey: false, physical_heightWeight: false, physical_waist: false,
    physical_vision: false, physical_color: false, physical_hearing: false, physical_bp: false,
    physical_systemic: false, xray_chest: false, urine_protein: false, urine_blood: false,
    blood_hb: false, blood_wbc: false, blood_sugar: false, blood_alt: false,
    blood_creatinine: false, blood_cholesterol: false, blood_hdl: false, blood_tg: false,
};

const INITIAL_HEALTH_DATA = {
    height: '', weight: '', waist: '', sbp: '', dbp: '', sugar_ac: '',
    cholesterol: '', ldl: '', hdl: '', tg: '', wbc: '', hb: '', plt: '',
    alt: '', creatinine: '', uric_acid: '', urine_protein: 'normal', 
    xray_result: 'normal', xray_other: ''
};

// --- Main Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('checklist'); 
  const [personalInfo, setPersonalInfo] = useState({ name: '', age: '' });
  const [gender, setGender] = useState('male');
  const [checklist, setChecklist] = useState({ ...INITIAL_CHECKLIST });
  const [healthData, setHealthData] = useState({ ...INITIAL_HEALTH_DATA });

  // Checklist Structure
  const checklistStructure = [
    { category: "行政與問卷", items: [{ key: 'hospitalCertified', label: '是否為認可醫療機構所提供之報告', hasLink: true }, { key: 'historySurvey', label: '作業經歷/病史/生活習慣問卷' }] },
    { category: "一般理學檢查", items: [{ key: 'physical_heightWeight', label: '身高 & 體重' }, { key: 'physical_waist', label: '腰圍' }, { key: 'physical_vision', label: '視力 & 辨色力' }, { key: 'physical_hearing', label: '聽力' }, { key: 'physical_bp', label: '血壓' }, { key: 'physical_systemic', label: '各系統理學檢查 (醫生問診)' }] },
    { category: "儀器與尿液檢查", items: [{ key: 'xray_chest', label: '胸部 X 光 (大片)' }, { key: 'urine_protein', label: '尿蛋白' }, { key: 'urine_blood', label: '尿潛血' }] },
    { category: "血液檢查", items: [{ key: 'blood_hb', label: '血色素 (Hb)' }, { key: 'blood_wbc', label: '白血球 (WBC)' }, { key: 'blood_sugar', label: '血糖 (AC Sugar)' }, { key: 'blood_alt', label: '肝功能 (ALT/GPT)' }, { key: 'blood_creatinine', label: '肌酸酐 (Creatinine)' }, { key: 'blood_cholesterol', label: '膽固醇 (Total/HDL)' }, { key: 'blood_tg', label: '三酸甘油酯 (TG)' }] }
  ];

  const handleInputChange = (e) => setHealthData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePersonalInfoChange = (e) => setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleChecklistChange = (key) => setChecklist(prev => ({ ...prev, [key]: !prev[key] }));

  const handleReset = () => {
    if (window.confirm("確定要清除所有資料嗎？\n\n注意：此動作將清除所有已輸入的個資與檢查數值，無法復原。")) {
      setPersonalInfo({ name: '', age: '' });
      setGender('male');
      setChecklist({ ...INITIAL_CHECKLIST });
      setHealthData({ ...INITIAL_HEALTH_DATA });
      setActiveTab('checklist');
    }
  };

  const calculateResults = useMemo(() => {
    const results = [];
    let maxLevel = 1;
    const addResult = (item, value, level, refRange, advice, unit = '') => {
      if (level > maxLevel) maxLevel = level;
      results.push({ item, value, level, refRange, advice, unit });
    };
    const advices = { 4: "第4級：藥物治療 + 個案管理 (3個月內需追蹤)", 3: "第3級：就醫診治 + 個案管理 (6個月內需追蹤數值)", 2: "第2級：衛生指導 (年度追蹤)", 1: "第1級：自主健康管理" };

    // Logic
    if (healthData.height && healthData.weight) {
      const bmi = (parseFloat(healthData.weight) / Math.pow(parseFloat(healthData.height)/100, 2)).toFixed(1);
      let l = 1, a = advices[1];
      if (bmi >= 30) { l = 4; a = "中度肥胖"; } else if (bmi >= 27) { l = 3; a = "輕度肥胖"; } else if (bmi >= 24.1) { l = 2; a = "過重"; }
      addResult("BMI", bmi, l, "18.5-24", a);
    }
    if (healthData.waist) {
        const w = parseFloat(healthData.waist);
        let l = 1;
        if ((gender === 'male' && w >= 90) || (gender === 'female' && w >= 80)) l = 2;
        addResult("腰圍", w, l, gender === 'male' ? "<90" : "<80", l === 2 ? "腹部肥胖，建議運動飲食控制" : "正常", "cm");
    }
    if (healthData.sbp && healthData.dbp) {
        const s = parseFloat(healthData.sbp), d = parseFloat(healthData.dbp);
        let l = 1;
        if (s >= 160 || d >= 100) l = 4; else if (s >= 140 || d >= 90) l = 3; else if (s >= 120 || d >= 80) l = 2;
        addResult("血壓", `${s}/${d}`, l, "SB<120, DB<80", advices[l], "mmHg");
    }
    if (healthData.sugar_ac) {
        const v = parseFloat(healthData.sugar_ac);
        let l = 1;
        if (v >= 240) l = 4; else if (v >= 126) l = 3; else if (v >= 100) l = 2;
        addResult("空腹血糖", v, l, "74-109", advices[l], "mg/dl");
    }
    if (healthData.cholesterol) {
        const v = parseFloat(healthData.cholesterol);
        let l = 1;
        if (v >= 300) l = 4; else if (v >= 240) l = 3; else if (v > 200) l = 2;
        addResult("總膽固醇", v, l, "<200", advices[l], "mg/dl");
    }
    if (healthData.ldl) {
        const v = parseFloat(healthData.ldl);
        let l = 1;
        if (v >= 200) l = 4; else if (v >= 190) l = 3; else if (v >= 140) l = 2;
        addResult("低密度膽固醇(LDL)", v, l, "<100", advices[l], "mg/dl");
    }
    if (healthData.hdl) {
        const v = parseFloat(healthData.hdl);
        let l = 1;
        if ((gender === 'male' && v < 40) || (gender === 'female' && v < 50)) l = 2;
        addResult("高密度膽固醇(HDL)", v, l, gender === 'male' ? ">40" : ">50", l === 2 ? "數值偏低，建議運動" : "正常", "mg/dl");
    }
    if (healthData.tg) {
        const v = parseFloat(healthData.tg);
        let l = 1;
        if (v >= 501) l = 4; else if (v >= 301) l = 3; else if (v >= 151) l = 2;
        addResult("三酸甘油酯", v, l, "<150", advices[l], "mg/dl");
    }
    if (healthData.wbc) {
        const v = parseFloat(healthData.wbc);
        let l = 1;
        if (v >= 15100 || v <= 2100) l = 4; else if ((v >= 13000) || (v <= 3500)) l = 3; else if ((v >= 11000) || (v < 13000)) l = 2; 
        if (v > 11000 && v < 13000) l = 2;
        addResult("白血球 (WBC)", v, l, "4000-11000", advices[l], "/ul");
    }
    if (healthData.hb) {
        const v = parseFloat(healthData.hb);
        let l = 1;
        if (gender === 'male') { if (v < 9) l = 4; else if (v < 11) l = 3; else if (v < 13) l = 2; }
        else { if (v < 7) l = 4; else if (v < 9) l = 3; else if (v < 11) l = 2; }
        addResult("血色素 (Hb)", v, l, gender === 'male' ? "13-18" : "11-16", advices[l], "gm/dl");
    }
    if (healthData.alt) {
        const v = parseFloat(healthData.alt);
        let l = 1;
        if (v >= 101) l = 4; else if (v >= 80) l = 3; else if (v >= 41) l = 2;
        addResult("肝功能 (GPT/ALT)", v, l, gender === 'male' ? "0-41" : "0-31", advices[l], "U/L");
    }
    if (healthData.creatinine) {
        const v = parseFloat(healthData.creatinine);
        let l = 1;
        if (v > 2.0) l = 4; else if (v >= 1.4) l = 3; else if (v >= 1.3) l = 2;
        addResult("肌酸酐 (Cr)", v, l, gender === 'male' ? "0.7-1.2" : "0.5-0.9", advices[l], "mg/dl");
    }
    if (healthData.uric_acid) {
        const v = parseFloat(healthData.uric_acid);
        let l = 1;
        if (v > 10) l = 4; else if (v >= 8) l = 3; else if (v >= 7) l = 2;
        addResult("尿酸", v, l, "<7", advices[l], "mg/dl");
    }
    if (healthData.urine_protein && healthData.urine_protein !== 'normal') {
        let l = 1, v = healthData.urine_protein;
        if (v === '4+') l = 4; else if (v === '2+' || v === '3+') l = 3; else if (v === '1+') l = 2;
        addResult("尿蛋白", v, l, "-", advices[l]);
    }
    if (healthData.xray_result) {
        let l = 1, v = healthData.xray_result, txt = "", adv = "自主健康管理";
        if (v === 'normal') txt = "正常 / 無明顯異常";
        else if (v === 'calcified') txt = "鈣化點";
        else if (v === 'scoliosis') txt = "脊椎側彎";
        else if (v === 'nodule_large') { l = 4; txt = "肺結節 > 1CM"; adv = "需立即就醫確認"; }
        else if (v === 'tb_suspect') { l = 4; txt = "疑似肺浸潤/肺結核"; adv = "需立即就醫確認"; }
        else if (v === 'other') { l = 2; txt = healthData.xray_other ? `其他：${healthData.xray_other}` : "其他 (未輸入說明)"; adv = "請確認異常狀況是否需追蹤"; }
        addResult("胸部 X 光", txt, l, "正常", adv);
    }
    return { results, maxLevel };
  }, [healthData, gender]);

  const failedChecklistItems = useMemo(() => {
    const failed = [];
    checklistStructure.forEach(cat => cat.items.forEach(item => { if (!checklist[item.key]) failed.push({ category: cat.category, label: item.label }); }));
    return failed;
  }, [checklist]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans print:bg-white">
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-wide">新進人員體檢報告智能檢核系統</h1>
              <span className="text-xs text-slate-300">安澤健康顧問 | ANZECARE CONSULTING</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={handleReset} className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"><RefreshCw className="w-3 h-3" /> 重置/清除資料</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-20 print:p-0 print:max-w-none print:w-full">
        <div className="print:hidden mb-4 bg-slate-100 p-2 rounded text-xs text-gray-500 flex items-center gap-2 justify-center border border-slate-200">
           <Lock className="w-3 h-3" /><span>個資保護聲明：本系統採純前端運作，資料不儲存，關閉即清除。</span>
        </div>

        <div className="print:hidden space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2"><User className="w-4 h-4" /> 受檢者基本資料</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col"><label className="text-xs font-semibold text-gray-500 mb-1">受檢者姓名</label><input type="text" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} placeholder="請輸入姓名" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></div>
                <div className="flex flex-col"><label className="text-xs font-semibold text-gray-500 mb-1">年齡</label><div className="relative"><input type="number" name="age" value={personalInfo.age} onChange={handlePersonalInfoChange} placeholder="請輸入年齡" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /><span className="absolute right-3 top-2 text-sm text-gray-400">歲</span></div></div>
                <div className="flex flex-col"><label className="text-xs font-semibold text-gray-500 mb-1">性別</label><div className="flex gap-2 h-[42px]"><button onClick={() => setGender('male')} className={`flex-1 rounded transition-colors font-medium ${gender === 'male' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>男性</button><button onClick={() => setGender('female')} className={`flex-1 rounded transition-colors font-medium ${gender === 'female' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'}`}>女性</button></div></div>
            </div>
            </div>

            <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
            <button onClick={() => setActiveTab('checklist')} className={`pb-3 px-4 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'checklist' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><FileText className="w-4 h-4" /> 法規項目檢核</button>
            <button onClick={() => setActiveTab('data')} className={`pb-3 px-4 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'data' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Stethoscope className="w-4 h-4" /> 數據輸入</button>
            <button onClick={() => setActiveTab('report')} className={`pb-3 px-4 font-medium flex items-center gap-2 whitespace-nowrap ${activeTab === 'report' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}><Calculator className="w-4 h-4" /> 檢核報告產出</button>
            </div>

            {activeTab === 'checklist' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4"><h3 className="font-bold text-blue-800">檢查報告完整性檢核</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{checklistStructure.map((cat, i) => (<div key={i} className="space-y-2"><h4 className="text-sm font-bold text-gray-500 border-b pb-1">{cat.category}</h4>{cat.items.map(item => (<div key={item.key}><ChecklistItem label={item.label} isChecked={checklist[item.key]} onClick={() => handleChecklistChange(item.key)} />{item.hasLink && <a href="https://hrpts.osha.gov.tw/Home/CertifiedHospInfoSearch" target="_blank" className="text-xs text-blue-500 flex items-center gap-1"><ExternalLink className="w-3 h-3"/> 查詢認可機構</a>}</div>))}</div>))}</div>
                <div className="flex justify-end"><button onClick={() => setActiveTab('data')} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2">下一步 <ChevronDown className="w-4 h-4 rotate-[-90deg]" /></button></div>
            </div>
            )}

            {activeTab === 'data' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">1. 基礎與代謝指標</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><InputField label="身高" name="height" value={healthData.height} onChange={handleInputChange} unit="cm" /><InputField label="體重" name="weight" value={healthData.weight} onChange={handleInputChange} unit="kg" /><InputField label="腰圍" name="waist" value={healthData.waist} onChange={handleInputChange} unit="cm" /><InputField label="空腹血糖" name="sugar_ac" value={healthData.sugar_ac} onChange={handleInputChange} unit="mg/dl" /><InputField label="收縮壓" name="sbp" value={healthData.sbp} onChange={handleInputChange} unit="mmHg" /><InputField label="舒張壓" name="dbp" value={healthData.dbp} onChange={handleInputChange} unit="mmHg" /></div></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">2. 血脂數據</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><InputField label="總膽固醇" name="cholesterol" value={healthData.cholesterol} onChange={handleInputChange} unit="mg/dl" /><InputField label="LDL 低密度" name="ldl" value={healthData.ldl} onChange={handleInputChange} unit="mg/dl" /><InputField label="HDL 高密度" name="hdl" value={healthData.hdl} onChange={handleInputChange} unit="mg/dl" /><InputField label="三酸甘油酯" name="tg" value={healthData.tg} onChange={handleInputChange} unit="mg/dl" /></div></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">3. 器官功能與血液</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><InputField label="ALT (GPT)" name="alt" value={healthData.alt} onChange={handleInputChange} unit="U/L" /><InputField label="肌酸酐 (Cr)" name="creatinine" value={healthData.creatinine} onChange={handleInputChange} unit="mg/dl" /><InputField label="尿酸" name="uric_acid" value={healthData.uric_acid} onChange={handleInputChange} unit="mg/dl" /><InputField label="白血球 (WBC)" name="wbc" value={healthData.wbc} onChange={handleInputChange} unit="/ul" /><InputField label="血色素 (Hb)" name="hb" value={healthData.hb} onChange={handleInputChange} unit="gm/dl" /><InputField label="血小板" name="plt" value={healthData.plt} onChange={handleInputChange} unit="萬" /></div></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">4. 質性檢查結果</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-500 mb-1">尿蛋白</label><select name="urine_protein" value={healthData.urine_protein} onChange={handleInputChange} className="p-2 border border-gray-300 rounded"><option value="normal">陰性 (-) 或 偽陽性 (+/-)</option><option value="1+">1+</option><option value="2+">2+</option><option value="3+">3+</option><option value="4+">4+</option></select></div>
                    <div className="flex flex-col"><label className="text-xs font-semibold text-gray-500 mb-1">胸部 X 光</label><select name="xray_result" value={healthData.xray_result} onChange={handleInputChange} className="p-2 border border-gray-300 rounded mb-2"><option value="normal">正常 / 無明顯異常</option><option value="calcified">鈣化點</option><option value="scoliosis">脊椎側彎</option><option value="nodule_large">肺結節 &gt; 1CM</option><option value="tb_suspect">疑似肺浸潤/肺結核</option><option value="other">其他 (自行輸入)</option></select>{healthData.xray_result === 'other' && <InputField label="請輸入結果" name="xray_other" type="text" value={healthData.xray_other} onChange={handleInputChange} />}</div></div></div>
                <div className="flex justify-end"><button onClick={() => setActiveTab('report')} className="bg-green-600 text-white px-6 py-2 rounded-lg shadow flex items-center gap-2"><Calculator className="w-5 h-5" /> 檢核報告產出</button></div>
            </div>
            )}
        </div>

        {/* --- A4 Report --- */}
        <div className={`${activeTab === 'report' ? 'block' : 'hidden print:block'} bg-white shadow-lg mx-auto print:shadow-none print:m-0 w-full md:w-[210mm] min-h-[297mm] p-[10mm] print:p-0 text-sm`}>
            <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4 mb-4">
                <AnzeLogo />
                <div className="text-right"><div className="text-gray-500 text-xs">報告產出日期</div><div className="text-lg font-bold font-mono">{new Date().toLocaleDateString()}</div></div>
            </div>

            <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 border-l-4 border-slate-600 pl-2 mb-2 uppercase">受檢者基本資料</h3>
                <div className="grid grid-cols-3 border border-gray-300 rounded bg-gray-50"><div className="p-3 border-r"><span className="text-xs text-gray-500 block">姓名</span><span className="font-bold text-lg">{personalInfo.name || "---"}</span></div><div className="p-3 border-r"><span className="text-xs text-gray-500 block">性別</span><span className="font-bold text-lg">{gender === 'male' ? '男' : '女'}</span></div><div className="p-3"><span className="text-xs text-gray-500 block">年齡</span><span className="font-bold text-lg">{personalInfo.age || "---"} 歲</span></div></div>
            </div>

            <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 border-l-4 border-slate-600 pl-2 mb-2 uppercase">法規項目檢核結果</h3>
                {failedChecklistItems.length === 0 ? <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /><span className="font-bold">檢核合格：所有法定應檢查項目皆已齊全。</span></div> : <div className="border border-red-200 rounded"><div className="bg-red-50 p-2 border-b border-red-200 flex items-center gap-2 text-red-800"><XCircle className="w-5 h-5" /><span className="font-bold">檢核不合格：發現缺漏項目，請補件。</span></div><table className="w-full text-xs text-left"><thead className="bg-gray-100"><tr><th className="p-2">類別</th><th className="p-2">缺漏項目</th><th className="p-2">建議</th></tr></thead><tbody>{failedChecklistItems.map((item, i) => (<tr key={i} className="border-t"><td className="p-2">{item.category}</td><td className="p-2 font-bold text-red-600">{item.label}</td><td className="p-2">建議改善/補件</td></tr>))}</tbody></table></div>}
            </div>

            <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 border-l-4 border-slate-600 pl-2 mb-2 uppercase">健康分級判定</h3>
                <div className={`p-4 rounded-lg border-2 flex items-center justify-between ${calculateResults.maxLevel === 1 ? 'bg-green-50 border-green-500 text-green-900' : calculateResults.maxLevel === 4 ? 'bg-red-50 border-red-500 text-red-900' : 'bg-yellow-50 border-yellow-500 text-yellow-900'}`}>
                    <div><div className="text-xs font-bold opacity-70 mb-1">總體分級結果</div><div className="text-2xl font-bold">第 {calculateResults.maxLevel} 級 {calculateResults.maxLevel === 1 ? "(正常)" : "(異常)"}</div><div className="text-sm mt-1 font-medium">{calculateResults.maxLevel === 1 ? "自主健康管理" : calculateResults.maxLevel === 4 ? "藥物治療 + 個案管理" : "衛生指導 / 就醫診治"}</div></div><div className="text-4xl font-bold opacity-20">{calculateResults.maxLevel}</div>
                </div>
            </div>

            <div className="mb-6"><h3 className="text-sm font-bold text-gray-900 border-l-4 border-slate-600 pl-2 mb-2 uppercase">各項檢查結果明細</h3>
                {calculateResults.results.length === 0 ? <div className="text-gray-400 text-center py-4 border rounded">尚未輸入數據</div> : <table className="w-full text-sm border-collapse border border-gray-300"><thead className="bg-slate-100"><tr><th className="border p-2 text-left">檢查項目</th><th className="border p-2 text-right">檢測值</th><th className="border p-2 text-center">參考標準</th><th className="border p-2 text-center">分級</th></tr></thead><tbody>{calculateResults.results.map((item, i) => (<tr key={i} className={item.level > 1 ? "bg-red-50 print:bg-gray-50" : ""}><td className="border p-2 font-medium">{item.item}</td><td className="border p-2 text-right font-mono font-bold">{item.value} {item.unit}</td><td className="border p-2 text-center text-xs">{item.refRange}</td><td className="border p-2 text-center"><LevelBadge level={item.level} /></td></tr>))}</tbody></table>}
            </div>

            {calculateResults.results.filter(r => r.level > 1).length > 0 && (
                <div className="mb-6 break-inside-avoid"><h3 className="text-sm font-bold text-gray-900 border-l-4 border-slate-600 pl-2 mb-2 uppercase">異常項目管理建議</h3><div className="border border-gray-300 rounded bg-white">{calculateResults.results.filter(r => r.level > 1).map((item, i) => (<div key={i} className="p-3 border-b last:border-0 flex gap-4 items-start"><div className="w-1/4 font-bold text-gray-800 text-xs pt-0.5">{item.item}</div><div className="flex-1 text-xs text-gray-600"><span className="text-red-600 font-bold mr-2">[異常]</span>{item.advice}</div></div>))}</div></div>
            )}

            <div className="mt-8 pt-4 border-t-2 border-gray-300 text-center text-xs text-gray-400"><p>本報告由 安澤顧問-新進人員體檢報告智能檢核系統 自動產出，僅供勞工健康管理參考，不取代醫師正式診斷。</p><p>安澤管理顧問股份有限公司 | 你的勞工健康服務夥伴</p></div>
        </div>

        {activeTab === 'report' && (<div className="fixed bottom-6 right-6 print:hidden animate-in fade-in"><button onClick={handlePrint} className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold transition-transform hover:scale-105"><Printer className="w-5 h-5" /> 立即列印報告 (PDF)</button></div>)}
      </main>
      <style>{`@media print { @page { size: A4; margin: 0; } body { background: white; -webkit-print-color-adjust: exact; } body > * { display: none; } body > div { display: block; } header { display: none !important; } }`}</style>
    </div>
  );
};

export default App;