
import React, { useState, useEffect } from 'react';
import { Share2, Send, Facebook, Phone, MessageSquare, AlertCircle, Clock, X, Printer, CheckCircle, Loader2 } from 'lucide-react';
import { TopBanner } from './components/TopBanner';
import { Header } from './components/Header';
import { TaskModal } from './components/TaskModal';
import { Screen, Country, Provider, Plan, HistoryItem } from './types';
import { COUNTRIES, PROVIDERS, PLANS, QUESTIONS } from './data';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('COUNTRY_SELECT');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  // Task State
  const [taskStep, setTaskStep] = useState(0); // 0: Questions, 1: WhatsApp, 2: Generic Tasks, 3: Facebook
  const [questionIndex, setQuestionIndex] = useState(0);
  const [whatsappShares, setWhatsappShares] = useState(0);
  const [showTasks, setShowTasks] = useState(false);

  // Generic Tasks State (The 4 tasks)
  const [genericTaskStatus, setGenericTaskStatus] = useState([
    { id: 1, label: 'Join Telegram', icon: <Send size={18} />, completed: false, loading: false, link: 'https://t.me/' },
    { id: 2, label: 'Join Telegram 2', icon: <Send size={18} />, completed: false, loading: false, link: 'https://t.me/' },
    { id: 3, label: '2 Comment + 30 shares', icon: <MessageSquare size={18} />, completed: false, loading: false, link: 'https://instagram.com/' },
    { id: 4, label: 'Follow on WhatsApp Channel', icon: <Phone size={18} />, completed: false, loading: false, link: 'https://whatsapp.com/channel/' },
  ]);

  // Load History on Mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('recharge_history');
    if (savedHistory) {
        try {
            setHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }
  }, []);

  // Handlers
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (country.code === 'IN') {
        setCurrentScreen('PROVIDER_SELECT');
    } else {
        setShowComingSoon(true);
    }
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentScreen('PLAN_SELECT');
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentScreen('NUMBER_INPUT');
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only allow numbers and max 10 digits
      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
      setPhoneNumber(val);
  };

  const handleRechargeSubmit = () => {
    if (phoneNumber.length === 10) {
      setCurrentScreen('TASKS_FLOW');
      setShowTasks(true);
      setTaskStep(0); // Start with questions
    }
  };

  const handleQuestionAnswer = (answer: string) => {
    // Logic for Question 2 (Index 1) - Color Prediction
    if (questionIndex === 1 && answer === "हाँ") {
        window.open("https://t.me/", "_blank"); // Redirect to Telegram
    }
    // Logic for Question 3 (Index 2) - Earn Money
    if (questionIndex === 2 && answer === "हाँ") {
        window.open("https://t.me/", "_blank"); // Redirect to Telegram
    }

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setTaskStep(1); // Move to WhatsApp share
    }
  };

  const handleWhatsappShare = () => {
    // Exact text requested by user
    const message = `🌟 वाह! मैंने अभी-अभी अपना मोबाइल ₹489 में तुरंत रिचार्ज किया! 🎉
📱 बेहद तेज़, सुरक्षित और आसान मोबाइल रिचार्ज 🚀
⏱️ ना लाइन, ना इंतज़ार – बस तुरंत टॉप-अप ✅
🔒 100% सुरक्षित और भरोसेमंद प्लेटफ़ॉर्म

👉 Try it Now: https://modderakash.shop/

#MobileRecharge #InstantRecharge #Jio`;

    const encodedMessage = encodeURIComponent(message);
    window.location.href = `whatsapp://send?text=${encodedMessage}`;
    
    // Increment share count after a short delay to simulate return
    setTimeout(() => {
      const newCount = whatsappShares + 1;
      setWhatsappShares(newCount);
      if (newCount >= 2) { // Require 2 shares total
        // Reset generic tasks status when moving to next step to be safe
        setTaskStep(2); // Move to "Almost Done" tasks
      }
    }, 2000);
  };

  const handleGenericTaskClick = (index: number) => {
      const task = genericTaskStatus[index];
      if (task.completed || task.loading) return;

      // 1. Set Loading
      const newStatus = [...genericTaskStatus];
      newStatus[index].loading = true;
      setGenericTaskStatus(newStatus);

      // 2. Open Link
      window.open(task.link, '_blank');

      // 3. Simulate Verification (3 seconds)
      setTimeout(() => {
          setGenericTaskStatus(prev => {
              const updated = [...prev];
              updated[index].loading = false;
              updated[index].completed = true;
              return updated;
          });
      }, 3000);
  };

  const handleFacebookTask = () => {
      window.open("https://www.facebook.com/", "_blank");
      
      // Simulate verification then success
      setTimeout(() => {
          completeRechargeProcess();
      }, 2000);
  }

  const completeRechargeProcess = () => {
      // Generate Order Ref
      const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "REF";
      for ( let i = 0; i < 10; i++ ) {
          result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      setOrderRef(result);

      // Add to History
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('en-IN'),
          phoneNumber: phoneNumber,
          amount: selectedPlan?.price || '',
          providerName: selectedProvider?.name || '',
          providerLogo: selectedProvider?.logoUrl || '',
          refId: result
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('recharge_history', JSON.stringify(updatedHistory));

      // Move to success
      setTaskStep(4);
  };

  const handlePrintReceipt = () => {
      window.print();
  };

  // --- RENDER HELPERS ---

  const renderCountrySelect = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
         <div className="text-gray-500 text-sm font-medium">Select your location</div>
         <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
         >
             <Clock size={14} /> History
         </button>
      </div>
      
      <div className="space-y-3">
        {COUNTRIES.map((country) => (
          <button
            key={country.code}
            onClick={() => handleCountrySelect(country)}
            className="w-full bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all text-left group active:scale-[0.98]"
          >
            <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                <img src={country.img} alt={country.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="font-bold text-gray-800 text-lg">{country.name}</div>
              <div className="text-gray-400 text-sm font-medium">{country.dialCode}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProviderSelect = () => (
    <div className="p-4 space-y-4">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          onClick={() => handleProviderSelect(provider)}
          className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-500 hover:shadow-md transition-all text-left active:scale-[0.98]"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center p-2 bg-white border border-gray-100 shadow-sm">
             <img src={provider.logoUrl} alt={provider.name} className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{provider.name}</div>
            <div className="text-gray-500 text-sm">{provider.id === 'jio' ? "India's largest network" : (provider.id === 'airtel' ? "The smartphone network" : "Be unlimited")}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderPlanSelect = () => (
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input 
            type="text" 
            placeholder="Search by data or price..." 
            className="w-full p-3.5 pl-4 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      {PLANS.map((plan, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start hover:shadow-md transition-shadow">
          <div className="space-y-2">
            <div className="text-3xl font-extrabold text-gray-900">{plan.price}</div>
            <div className="text-xs text-gray-500 space-x-3 font-medium">
              <span>Validity: <span className="text-gray-800">{plan.validity}</span></span>
              <span>Data: <span className="text-gray-800">{plan.data}</span></span>
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {plan.benefits.map((benefit, i) => (
                <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg uppercase tracking-wide">
                  {benefit}
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => handlePlanSelect(plan)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all leading-tight"
          >
            FREE<br/><span className="text-xs opacity-90">Buy</span>
          </button>
        </div>
      ))}
    </div>
  );

  const renderNumberInput = () => (
    <div className="p-4 space-y-4">
      {/* Dynamic Plan Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -z-0 opacity-50"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
           <div>
               <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Selected Plan</div>
               <div className="text-4xl font-extrabold text-gray-900 mt-2">{selectedPlan?.price}</div>
           </div>
           {selectedProvider && (
               <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                   <img src={selectedProvider.logoUrl} alt={selectedProvider.name} className="w-full h-full object-contain" />
               </div>
           )}
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-4 border-t border-dashed border-gray-200 pt-4 relative z-10">
            <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Validity</div>
                <div className="text-base font-bold text-gray-800">{selectedPlan?.validity}</div>
            </div>
            <div>
                <div className="text-xs text-gray-400 font-bold uppercase mb-1">Data</div>
                <div className="text-base font-bold text-gray-800">{selectedPlan?.data}</div>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
         <h3 className="font-bold text-gray-800 text-xl">Enter Mobile Number</h3>
         <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number (+91)</label>
             <div className="flex gap-3">
                 <div className="w-16 flex items-center justify-center border border-gray-300 rounded-xl bg-gray-50 text-gray-800 font-bold shadow-sm">
                     {selectedCountry.dialCode}
                 </div>
                 <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                    placeholder="99999 99999"
                    className="flex-1 p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-xl tracking-widest"
                 />
             </div>
             <p className="text-xs text-gray-400 pt-1 font-medium">Please enter a valid 10-digit number</p>
         </div>

         <button 
            onClick={handleRechargeSubmit}
            disabled={phoneNumber.length !== 10}
            className={`w-full py-4 rounded-xl font-bold text-center transition-all shadow-lg text-sm uppercase tracking-wider ${phoneNumber.length === 10 ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]' : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'}`}
         >
             Proceed to Recharge
         </button>
      </div>
    </div>
  );

  // --- MODAL CONTENTS ---

  const renderQuestions = () => {
    const question = QUESTIONS[questionIndex];
    return (
      <TaskModal 
        title="Quick Questions" 
        subtitle="Please answer these questions to continue"
        icon={<span className="text-3xl font-bold text-blue-500">?</span>}
      >
        <div className="space-y-6">
           <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map(i => (
                  <div key={i} className={`h-2.5 w-2.5 rounded-full transition-colors ${i <= questionIndex ? 'bg-blue-500' : 'bg-gray-200'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-2 font-medium">{questionIndex + 1} of 3</span>
           </div>

           <h3 className="text-center font-bold text-gray-800 text-lg min-h-[60px] flex items-center justify-center leading-snug">
              {question.text}
           </h3>

           <div className="space-y-3">
              {question.options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleQuestionAnswer(opt)}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-100"
                  >
                      {opt}
                  </button>
              ))}
           </div>
           
           <p className="text-[10px] text-center text-gray-400 mt-4">
              All questions are required to proceed with your free recharge
           </p>
        </div>
      </TaskModal>
    );
  };

  const renderWhatsAppShare = () => {
      // 2 shares required
      const progress = (whatsappShares / 2) * 100;
      return (
        <TaskModal
            title="Complete This Task to Proceed"
            subtitle="Share our amazing recharge service with your friends on WhatsApp to unlock your recharge"
            icon={<Share2 className="text-green-500" size={32} />}
        >
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Progress</span>
                        <span className="text-blue-600">{Math.min(whatsappShares, 2)}/2 shares</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${Math.min(progress, 100)}%`}}></div>
                    </div>
                </div>

                <button 
                    onClick={handleWhatsappShare}
                    className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-100 active:scale-95 transition-all"
                >
                    <Share2 size={20} />
                    Share on WhatsApp
                </button>

                <div className="bg-blue-50 p-4 rounded-xl text-left space-y-2 border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide">How it works:</h4>
                    <ul className="text-xs text-blue-700 space-y-1.5 list-decimal pl-4 font-medium">
                        <li>Click "Share on WhatsApp" button</li>
                        <li>WhatsApp will open with a pre-filled message</li>
                        <li>Send the message to any contact or group</li>
                        <li>Share 2 times to unlock your recharge</li>
                    </ul>
                </div>

                <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed border border-gray-200">
                    Complete {Math.max(0, 2 - whatsappShares)} more shares
                </button>

                <p className="text-[10px] text-center text-gray-400">
                    This helps us provide free recharge services to everyone
                </p>
            </div>
        </TaskModal>
      );
  };

  const renderGenericTasks = () => {
      const completedCount = genericTaskStatus.filter(t => t.completed).length;
      const allCompleted = completedCount === genericTaskStatus.length;
      const progressPercent = (completedCount / genericTaskStatus.length) * 100;

      return (
        <TaskModal
            title="Almost Done!"
            subtitle="Complete these tasks to unlock the number"
            icon={<div className="text-3xl">🎉</div>}
        >
             <div className="space-y-4">
                <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Progress</span>
                        <span className="text-blue-600">{completedCount} of {genericTaskStatus.length} tasks completed</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{width: `${progressPercent}%`}}></div>
                    </div>
                </div>

                {genericTaskStatus.map((task, idx) => (
                    <button 
                        key={task.id}
                        onClick={() => handleGenericTaskClick(idx)}
                        disabled={task.completed || task.loading}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 
                            ${task.completed 
                                ? 'bg-green-50 text-green-700 border border-green-200 cursor-default shadow-none' 
                                : (idx === 2 ? 'bg-gradient-to-r from-purple-500 to-orange-500 text-white shadow-purple-200' : (idx === 3 ? 'bg-green-500 text-white shadow-green-200' : 'bg-blue-500 text-white shadow-blue-200'))}
                        `}
                    >
                        {task.loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : task.completed ? (
                            <CheckCircle size={20} />
                        ) : (
                            task.icon
                        )}
                        {task.label}
                    </button>
                ))}

                 <button 
                    onClick={() => allCompleted && setTaskStep(3)}
                    disabled={!allCompleted}
                    className={`w-full py-3.5 font-bold rounded-xl mt-2 transition-all ${allCompleted ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg hover:bg-blue-700 animate-pulse' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                    {allCompleted ? "Continue to Final Step" : `Complete ${genericTaskStatus.length - completedCount} more tasks`}
                </button>
                 <p className="text-[10px] text-center text-gray-400">
                    This helps us grow our community and provide better services
                </p>
             </div>
        </TaskModal>
      )
  }

  const renderFacebookTask = () => {
      return (
        <TaskModal
            title="Complete Process Task!"
            subtitle="Follow our Facebook Page to continue"
            icon={<Facebook className="text-blue-600" size={32} />}
        >
            <div className="space-y-6">
                 <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3">
                    <div className="bg-blue-600 p-2.5 rounded-full text-white shadow-sm">
                        <Facebook size={22} />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-bold text-blue-900">Follow our Facebook Page to continue</div>
                        <div className="text-xs text-blue-700 font-medium mt-0.5">Stay updated with our latest offers and services</div>
                    </div>
                 </div>

                 <button 
                    onClick={handleFacebookTask}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                    <Facebook size={20} />
                    Follow Facebook
                </button>

                 <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 border border-gray-200">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">How it works:</h4>
                    <ul className="text-xs text-gray-600 space-y-1.5 list-decimal pl-4 font-medium">
                        <li>Click "Follow Facebook" button</li>
                        <li>Facebook page will open in a new tab</li>
                        <li>Click the "Follow" or "Like" button on our page</li>
                        <li>Return here and wait for verification</li>
                    </ul>
                </div>

                <button disabled className="w-full py-3.5 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed border border-gray-200">
                    Complete Facebook Follow First
                </button>
                 <p className="text-[10px] text-center text-gray-400">
                   Following our page helps us provide better services and updates
                </p>
            </div>
        </TaskModal>
      )
  }

  const renderSuccess = () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          {/* Main Success Card - Identifyable for print */}
          <div id="receipt-card" className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]">
             {/* Receipt Header */}
             <div className="bg-white p-8 pb-4 text-center border-b border-dashed border-gray-200 relative">
                <div className="absolute top-4 right-4 text-gray-200">
                    <img src={selectedProvider?.logoUrl} className="w-20 opacity-10" />
                </div>

                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl border border-gray-100 p-2 flex items-center justify-center bg-white shadow-md">
                        <img src={selectedProvider?.logoUrl} alt={selectedProvider?.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedProvider?.name || 'Airtel'}</h2>
                        <p className="text-xs font-medium text-gray-500">The smartphone network</p>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-green-600 mb-2 flex justify-center items-center gap-2">
                    <CheckCircle className="text-green-500" size={28} />
                    Congratulations
                </h1>
                <p className="text-sm text-gray-700 mb-4 font-semibold leading-relaxed px-2">
                   {selectedCountry.dialCode} {phoneNumber} पर <span className="text-black font-bold text-lg">{selectedPlan?.price}</span> सफलतापूर्वक रिचार्ज कर दिया गया है।
                </p>
                
                <div className="bg-green-50 text-green-800 text-xs py-2 px-3 rounded-lg font-medium inline-block mb-2">
                    Transaction Successful
                </div>
             </div>

             {/* Order Details */}
             <div className="p-6 bg-gray-50">
                 <div className="bg-white p-5 rounded-xl text-center mb-6 border border-gray-200 shadow-sm">
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Order Reference</p>
                     <p className="font-mono text-xl font-bold text-gray-800 tracking-wider">{orderRef}</p>
                 </div>

                 <button onClick={() => window.location.reload()} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 mb-3 hover:bg-blue-700 transition-colors print-hidden">
                     Back to Plans
                 </button>
                 
                 <button 
                    onClick={handlePrintReceipt}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 print-hidden"
                 >
                     <Printer size={18} />
                     Print Receipt
                 </button>
             </div>
          </div>
          
          <style>{`
            @media print {
              body {
                visibility: hidden;
                background-color: white;
              }
              /* Hide all generic UI elements */
              button.print-hidden, .print-hidden {
                  display: none !important;
              }
              
              /* Isolate the receipt card */
              #receipt-card {
                visibility: visible;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
                border: 1px solid #ddd;
                border-radius: 0;
              }
              
              /* Ensure backgrounds print */
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          `}</style>
      </div>
  );
  
  const renderHistoryModal = () => (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Clock size={20} className="text-blue-600" /> Recharge History
                  </h2>
                  <button onClick={() => setShowHistory(false)} className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                      <X size={20} />
                  </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-3">
                  {history.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                          <Clock size={48} className="mx-auto mb-3 opacity-20" />
                          <p className="font-medium">No recharge history found.</p>
                      </div>
                  ) : (
                      history.map((item) => (
                          <div key={item.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl border border-gray-100 p-1 flex items-center justify-center bg-gray-50">
                                  {item.providerLogo ? <img src={item.providerLogo} className="w-full h-full object-contain" /> : <div className="font-bold text-xs">{item.providerName.substring(0,1)}</div>}
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                      <div className="font-bold text-gray-900 text-lg">{item.amount}</div>
                                      <div className="text-[10px] text-green-700 font-extrabold bg-green-100 px-2 py-1 rounded-md">SUCCESS</div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1 font-medium">{item.phoneNumber} • {item.date}</div>
                                  <div className="text-[10px] text-gray-400 font-mono mt-1">Ref: {item.refId}</div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>
  );

  // --- MAIN RENDER ---

  if (currentScreen === 'SUCCESS' || taskStep === 4) {
      return (
        <div className="min-h-screen bg-gray-100 font-sans">
             <TopBanner />
             {renderSuccess()}
             {/* Telegram FAB (Hidden on Success? Maybe show it) */}
             <a 
                href="https://t.me/" 
                target="_blank" 
                rel="noreferrer"
                className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl z-50 transition-transform hover:scale-110 active:scale-90 print-hidden"
            >
                <Send size={24} className="ml-[-2px] mt-[2px]" />
            </a>
        </div>
      )
  }

  // Determine Title based on screen
  let title = "Select Your Country";
  let onBack = undefined;
  if (currentScreen === 'PROVIDER_SELECT') {
      title = "Providers in India"; // In real app, dynamic based on country
      onBack = () => setCurrentScreen('COUNTRY_SELECT');
  } else if (currentScreen === 'PLAN_SELECT') {
      title = `${selectedProvider?.name} Plans` || "Plans";
      onBack = () => setCurrentScreen('PROVIDER_SELECT');
  } else if (currentScreen === 'NUMBER_INPUT') {
      title = "Complete Your Recharge";
      onBack = () => setCurrentScreen('PLAN_SELECT');
  } else if (currentScreen === 'TASKS_FLOW') {
      title = "Complete Your Recharge";
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <TopBanner />
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-xl relative">
        <Header title={title} onBack={onBack} />
        
        <div className="bg-gray-50 min-h-[calc(100vh-100px)]">
            {currentScreen === 'COUNTRY_SELECT' && renderCountrySelect()}
            {currentScreen === 'PROVIDER_SELECT' && renderProviderSelect()}
            {currentScreen === 'PLAN_SELECT' && renderPlanSelect()}
            {currentScreen === 'NUMBER_INPUT' && renderNumberInput()}
            {currentScreen === 'TASKS_FLOW' && renderNumberInput()}
        </div>

        {/* Coming Soon Modal */}
        {showComingSoon && (
            <TaskModal title="Notice" subtitle="" icon={<AlertCircle size={32} className="text-orange-500"/>}>
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">Coming Soon</h3>
                    <p className="text-gray-600">Free recharge offers are currently available for India only. We are expanding to {selectedCountry.name} soon!</p>
                    <button 
                        onClick={() => setShowComingSoon(false)}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200"
                    >
                        Okay, Got it
                    </button>
                </div>
            </TaskModal>
        )}
        
        {/* History Modal */}
        {showHistory && renderHistoryModal()}

        {/* Task Modals Overlay */}
        {showTasks && (
            <>
                {taskStep === 0 && renderQuestions()}
                {taskStep === 1 && renderWhatsAppShare()}
                {taskStep === 2 && renderGenericTasks()}
                {taskStep === 3 && renderFacebookTask()}
            </>
        )}
      </div>

       {/* Floating Telegram Button */}
       <a 
            href="https://t.me/" 
            target="_blank" 
            rel="noreferrer"
            className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl z-40 transition-transform hover:scale-110 active:scale-90 flex items-center justify-center border-2 border-white"
        >
            <Send size={24} className="ml-[-2px] mt-[1px]" />
        </a>
    </div>
  );
}
