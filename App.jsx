import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Users, 
  Store, 
  FileText, 
  Bell, 
  CreditCard, 
  Settings, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Download, 
  Share2, 
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  Mail,
  Phone,
  Heart,
  ShieldCheck,
  Zap,
  Info,
  UserPlus,
  ArrowLeftRight,
  LogOut,
  Lock,
  Smartphone,
  Banknote,
  CreditCard as CardIcon,
  Loader2,
  Languages,
  PiggyBank,
  Scissors,
  BriefcaseMedical
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithCustomToken, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  where
} from 'firebase/firestore';

// --- Firebase Configuration ---
const providedConfig = {
  apiKey: "AIzaSyDt1uh8mZ1fT7YZXCfchNvtctBZDQvRn-E",
  authDomain: "nikah-planner.firebaseapp.com",
  projectId: "nikah-planner",
  storageBucket: "nikah-planner.firebasestorage.app",
  messagingSenderId: "423300738000",
  appId: "1:423300738000:web:b8f977f29ebdd9b19a27d5",
  measurementId: "G-X7SSNMTLK2"
};

const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : providedConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'nikah-planner-my';

// --- Translations ---
const translations = {
  en: {
    dashboard: "Dashboard",
    checklist: "Checklist",
    budget: "Budget",
    collaborators: "Collaborators",
    pricing: "Pricing",
    savings: "Savings Tracker",
    attire: "Attire Sizes",
    emergency: "Emergency Kit",
    welcome: "Welcome",
    assalamualaikum: "Assalamualaikum",
    premiumMember: "Premium Member",
    upgradeNow: "Upgrade Now",
    createWedding: "Create New Wedding",
    signOut: "Sign Out",
    tasks: "Tasks",
    spent: "Spent",
    rsvp: "RSVP",
    done: "Done",
    pending: "Pending",
    payNow: "Pay Now",
    secureCheckout: "Secure Checkout",
    selectMethod: "Select Payment Method",
    chooseBank: "Choose your Bank",
    cardNum: "Card Number",
    expiry: "Expiry",
    cvc: "CVC",
    legalChecklist: "Legal Checklist",
    budgetTracker: "Budget Tracker",
    invite: "Invite",
    plannerEmail: "Planner's Email Address",
    peopleAccess: "People with Access",
    owner: "Owner",
    planner: "Wedding Planner",
    needHelp: "Need Help?",
    talkAdvisor: "Talk to Advisor",
    saveDate: "Save the Date",
    location: "Location",
    time: "Time",
    jakimCompliant: "JAKIM COMPLIANT",
    officialPortals: "Official Portals",
    bestValue: "BEST VALUE",
    save15: "Save 15%",
    target: "Target",
    current: "Current",
    remaining: "Remaining"
  },
  ms: {
    dashboard: "Papan Pemuka",
    checklist: "Senarai Semak",
    budget: "Bajet",
    collaborators: "Kolaborator",
    pricing: "Harga",
    savings: "Tabung Kahwin",
    attire: "Saiz Baju",
    emergency: "Kit Kecemasan",
    welcome: "Selamat Datang",
    assalamualaikum: "Assalamualaikum",
    premiumMember: "Ahli Premium",
    upgradeNow: "Naik Taraf Sekarang",
    createWedding: "Bina Projek Nikah",
    signOut: "Log Keluar",
    tasks: "Tugasan",
    spent: "Belanja",
    rsvp: "RSVP",
    done: "Selesai",
    pending: "Belum Selesai",
    payNow: "Bayar Sekarang",
    secureCheckout: "Pembayaran Selamat",
    selectMethod: "Pilih Kaedah Pembayaran",
    chooseBank: "Pilih Bank Anda",
    cardNum: "Nombor Kad",
    expiry: "Tarikh Tamat",
    cvc: "CVC",
    legalChecklist: "Senarai Semak Perundangan",
    budgetTracker: "Penjejak Bajet",
    invite: "Jemput",
    plannerEmail: "E-mel Perancang",
    peopleAccess: "Akses Pengguna",
    owner: "Pemilik",
    planner: "Perancang Perkahwinan",
    needHelp: "Perlu Bantuan?",
    talkAdvisor: "Hubungi Penasihat",
    saveDate: "Simpan Tarikh",
    location: "Lokasi",
    time: "Masa",
    jakimCompliant: "PATUH JAKIM",
    officialPortals: "Portal Rasmi",
    bestValue: "NILAI TERBAIK",
    save15: "Jimat 15%",
    target: "Sasaran",
    current: "Simpanan",
    remaining: "Baki"
  }
};

// --- JAKIM Checklist Template ---
const JAKIM_TEMPLATE = [
  { category: 'Preparation', task: 'Attend Premarital Course (Kursus Pra-Perkahwinan MBKPI)', task_ms: 'Hadir Kursus Pra-Perkahwinan (MBKPI)', status: 'pending', deadline: '6 Months Before', desc: 'Obtain the lifetime certificate recognized by JAKIM.', desc_ms: 'Dapatkan sijil seumur hidup yang diiktiraf oleh JAKIM.' },
  { category: 'Preparation', task: 'HIV Screening at Govt Clinic (Klinik Kesihatan)', task_ms: 'Saringan HIV di Klinik Kesihatan Kerajaan', status: 'pending', deadline: '3-6 Months Before', desc: 'Valid for 6 months only.', desc_ms: 'Sah laku untuk tempoh 6 bulan sahaja.' },
  { category: 'Legal', task: 'Online Application via SPPIM / State Portal', task_ms: 'Permohonan Dalam Talian melalui SPPIM / Portal Negeri', status: 'pending', deadline: '90 Days Before', desc: 'Fill in details at sppim.gov.my.', desc_ms: 'Isi butiran di sppim.gov.my atau portal negeri berkaitan.' },
  { category: 'Legal', task: "Obtain Groom's Permission Letter", task_ms: "Dapatkan Surat Kebenaran Berkahwin Lelaki", status: 'pending', deadline: '2 Months Before', desc: 'Required before bride submits application.', desc_ms: 'Diperlukan sebelum pihak perempuan menghantar permohonan.' },
  { category: 'Ceremony', task: 'Book Jurunikah (Tok Kadi)', task_ms: 'Tempah Jurunikah (Tok Kadi)', status: 'pending', deadline: '3 Weeks Before', desc: 'Confirm time and location with assigned official.', desc_ms: 'Sahkan masa dan lokasi dengan pegawai yang ditugaskan.' }
];

const EMERGENCY_KIT_TEMPLATE = [
  { item: 'Safety Pins', item_ms: 'Pin Peniti / Pin Baju', status: 'pending' },
  { item: 'Mini Sewing Kit', item_ms: 'Set Menjahit Kecil', status: 'pending' },
  { item: 'Mouthwash / Mints', item_ms: 'Pencuci Mulut / Gula-gula Mint', status: 'pending' },
  { item: 'Tissues / Wet Wipes', item_ms: 'Tisu / Tisu Basah', status: 'pending' },
  { item: 'Painkillers (Panadol)', item_ms: 'Ubat Tahan Sakit (Panadol)', status: 'pending' },
  { item: 'Double-sided Tape', item_ms: 'Pita Pelekat Dua Sisi', status: 'pending' }
];

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: `bg-[#1B4332] text-white hover:bg-[#2D6A4F] shadow-sm`,
    secondary: `bg-[#D4AF37] text-white hover:bg-[#C19A2E] shadow-sm`,
    outline: `border border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white`,
    ghost: `text-[#1B4332] hover:bg-gray-100`,
    danger: `bg-red-500 text-white hover:bg-red-600`
  };
  return (
    <button className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

// --- Payment Component ---
const PaymentGateway = ({ plan, onCancel, onSuccess, lang }) => {
  const [method, setMethod] = useState('fpx');
  const [loading, setLoading] = useState(false);
  const [bank, setBank] = useState('');
  const t = translations[lang];

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2500);
  };

  const fpxBanks = [
    'Maybank2u', 'CIMB Clicks', 'Public Bank', 'RHB Now', 'AmBank', 'Hong Leong Connect', 'UOB', 'Bank Islam'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-[#1B4332] p-6 text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase">{t.secureCheckout}</p>
            <h3 className="text-xl font-bold">RM {plan === 'yearly' ? '299.00' : '29.00'}</h3>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.selectMethod}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => setMethod('fpx')} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${method === 'fpx' ? 'border-[#D4AF37] bg-amber-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <Banknote className={method === 'fpx' ? 'text-[#1B4332]' : 'text-gray-400'} />
                <span className="text-[10px] font-black uppercase tracking-tighter">FPX</span>
              </button>
              <button onClick={() => setMethod('card')} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'border-[#D4AF37] bg-amber-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <CardIcon className={method === 'card' ? 'text-[#1B4332]' : 'text-gray-400'} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{lang === 'en' ? 'Card' : 'Kad'}</span>
              </button>
              <button onClick={() => setMethod('tng')} className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${method === 'tng' ? 'border-[#D4AF37] bg-amber-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <Smartphone className={method === 'tng' ? 'text-[#1B4332]' : 'text-gray-400'} />
                <span className="text-[10px] font-black uppercase tracking-tighter">TnG eWallet</span>
              </button>
            </div>
          </div>

          <div className="min-h-[160px]">
            {method === 'fpx' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500">{t.chooseBank}</label>
                <select className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#D4AF37] transition-all bg-gray-50 font-bold text-sm" value={bank} onChange={(e) => setBank(e.target.value)}>
                  <option value="">-- {lang === 'en' ? 'Select Bank' : 'Pilih Bank'} --</option>
                  {fpxBanks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}
            {method === 'card' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.cardNum}</label>
                  <input placeholder="0000 0000 0000 0000" className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-[#D4AF37] transition-all bg-gray-50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.expiry}</label><input placeholder="MM/YY" className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CVC</label><input placeholder="123" className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50" /></div>
                </div>
              </div>
            )}
            {method === 'tng' && (
              <div className="p-6 bg-gray-50 rounded-2xl text-center space-y-4">
                <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center text-white font-black">TnG</div>
                <p className="text-xs font-bold text-gray-600">{lang === 'en' ? 'Scan the QR code in your TnG app.' : 'Imbas kod QR di aplikasi TnG anda.'}</p>
              </div>
            )}
          </div>

          <Button className="w-full py-4 text-lg" variant="secondary" disabled={loading || (method === 'fpx' && !bank)} onClick={handlePay}>
            {loading ? <Loader2 className="animate-spin" /> : `${t.payNow} RM ${plan === 'yearly' ? '299.00' : '29.00'}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Auth Screen Component ---
const AuthScreen = ({ lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const t = translations[lang];

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-[#1B4332] rounded-2xl flex items-center justify-center mb-4">
            <Heart className="text-[#D4AF37]" size={32} fill="#D4AF37" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B4332]">Nikah Planner MY</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Kraf Diana Enterprise</p>
        </div>
        <form className="space-y-4" onSubmit={handleAuth}>
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" required />
          <Button type="submit" className="w-full py-4" disabled={loading}>
            {loading ? '...' : (isLogin ? t.signOut.replace('Out', 'In') : 'Sign Up')}
          </Button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-xs font-bold text-[#D4AF37]">
          {isLogin ? "Create Account" : "Login Instead"}
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [lang, setLang] = useState('ms'); 
  const [weddings, setWeddings] = useState([]);
  const [activeWedding, setActiveWedding] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentPlan, setPaymentPlan] = useState(null);

  const t = translations[lang];

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        getDoc(doc(db, 'artifacts', appId, 'users', u.uid, 'profile', 'status')).then(snap => {
          if (snap.exists()) setIsPremium(snap.data().isPremium);
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'weddings'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userWeddings = data.filter(w => w.ownerId === user.uid || (w.planners && w.planners.includes(user.email)));
      setWeddings(userWeddings);
      if (userWeddings.length > 0 && !activeWedding) setActiveWedding(userWeddings[0]);
      setLoading(false);
    }, (error) => console.error("Firestore Error:", error));
    return () => unsubscribe();
  }, [user]);

  const updateWeddingData = async (field, newData) => {
    if (!activeWedding) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'weddings', activeWedding.id), { [field]: newData });
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'status'), { isPremium: true, updatedAt: new Date().toISOString() });
    setIsPremium(true);
    setPaymentPlan(null);
    setActiveTab('dashboard');
  };

  if (loading && !user) return <div className="h-screen flex items-center justify-center font-bold text-[#1B4332] animate-pulse">NIKAH PLANNER MY...</div>;
  if (!user) return <AuthScreen lang={lang} />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-[#D4AF37]/20">
      {paymentPlan && <PaymentGateway lang={lang} plan={paymentPlan} onCancel={() => setPaymentPlan(null)} onSuccess={handlePaymentSuccess} />}
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-[#1B4332]"><Menu size={24}/></button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center"><Heart className="text-[#D4AF37]" size={20} fill="#D4AF37" /></div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm leading-none text-[#1B4332]">Nikah Planner</h1>
              <p className="text-[9px] text-[#D4AF37] font-black tracking-widest mt-1 uppercase">Malaysia</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ms' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-[#1B4332] hover:bg-gray-100 transition-colors"
          >
            <Languages size={14} className="text-[#D4AF37]" />
            {lang === 'en' ? 'BM' : 'EN'}
          </button>
          
          <div className="hidden md:block w-px h-6 bg-gray-100 mx-2"></div>

          {isPremium && <span className="hidden sm:block text-[9px] font-black uppercase text-[#D4AF37] bg-amber-50 px-3 py-1.5 rounded-full tracking-widest border border-amber-100">{t.premiumMember}</span>}
          <button onClick={() => signOut(auth)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex pt-16 h-screen overflow-hidden">
        <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-[70] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="space-y-1 overflow-y-auto max-h-full">
              {[
                { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
                { id: 'checklist', label: t.checklist, icon: CheckSquare },
                { id: 'budget', label: t.budget, icon: Wallet },
                { id: 'savings', label: t.savings, icon: PiggyBank },
                { id: 'attire', label: t.attire, icon: Scissors },
                { id: 'emergency', label: t.emergency, icon: BriefcaseMedical },
                { id: 'collaborators', label: t.collaborators, icon: UserPlus },
                { id: 'pricing', label: t.pricing, icon: CreditCard },
              ].map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20' : 'text-gray-400 hover:text-[#1B4332] hover:bg-gray-50'}`}>
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-auto pt-4">
              {!isPremium && (
                <div onClick={() => setActiveTab('pricing')} className="cursor-pointer p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3 group transition-all hover:bg-amber-100/50">
                  <Zap size={20} className="text-[#D4AF37]" fill="#D4AF37" />
                  <div>
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-tighter">FREE</p>
                    <p className="text-[11px] font-bold text-[#1B4332]">{t.upgradeNow}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-10 overflow-y-auto bg-[#F8F9FA]">
           {activeTab === 'dashboard' && activeWedding && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1B4332]">{activeWedding.name}</h2>
                    <p className="text-gray-500 flex items-center gap-2 mt-1"><Calendar size={16}/> {activeWedding.date}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black bg-[#D4AF37]/10 text-[#1B4332] px-3 py-2 rounded-full border border-[#D4AF37]/20 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-[#D4AF37]" /> {t.jakimCompliant}
                  </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600"><CheckCircle2 size={24}/></div>
                    <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.tasks}</p><h3 className="text-2xl font-bold">{activeWedding.checklist?.filter(t => t.status === 'completed').length || 0}/{activeWedding.checklist?.length || 0}</h3></div>
                  </Card>
                  <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600"><Wallet size={24}/></div>
                    <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.spent}</p><h3 className="text-2xl font-bold">RM {activeWedding.budget?.reduce((acc, c) => acc + c.actual, 0).toLocaleString() || 0}</h3></div>
                  </Card>
                  <Card className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><PiggyBank size={24}/></div>
                    <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t.savings}</p><h3 className="text-2xl font-bold">RM {activeWedding.savings?.current?.toLocaleString() || 0}</h3></div>
                  </Card>
                </div>
             </div>
           )}

           {activeTab === 'checklist' && activeWedding && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#1B4332]">{t.legalChecklist}</h2>
                <div className="space-y-3">
                  {(activeWedding.checklist || JAKIM_TEMPLATE).map((task, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${task.status === 'completed' ? 'bg-green-50/50 border-green-100 shadow-inner' : 'bg-white border-gray-100 hover:border-[#D4AF37]/30'}`}>
                      <div className="flex items-center gap-4">
                        <button onClick={() => {
                          const updated = [...(activeWedding.checklist || JAKIM_TEMPLATE)];
                          updated[i].status = updated[i].status === 'completed' ? 'pending' : 'completed';
                          updateWeddingData('checklist', updated);
                        }} className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${task.status === 'completed' ? 'bg-[#1B4332] border-[#1B4332] text-white' : 'border-gray-200'}`}>
                          {task.status === 'completed' && <CheckCircle2 size={16} />}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-[#1B4332]'}`}>{lang === 'en' ? task.task : (task.task_ms || task.task)}</p>
                          <p className="text-[10px] text-gray-400">{lang === 'en' ? task.desc : (task.desc_ms || task.desc)}</p>
                        </div>
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-tighter bg-amber-50 px-2 py-0.5 rounded-full">{task.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'savings' && activeWedding && (
             <div className="space-y-6 animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-[#1B4332]">{t.savings}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-[#1B4332] text-white">
                   <p className="text-[10px] font-black uppercase text-[#D4AF37] mb-2">{t.target}</p>
                   <h3 className="text-4xl font-bold">RM {activeWedding.savings?.target?.toLocaleString() || '0'}</h3>
                   <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                     <div><p className="text-[10px] uppercase text-green-200">{t.current}</p><p className="font-bold">RM {activeWedding.savings?.current?.toLocaleString() || '0'}</p></div>
                     <div className="text-right"><p className="text-[10px] uppercase text-green-200">{t.remaining}</p><p className="font-bold">RM {( (activeWedding.savings?.target || 0) - (activeWedding.savings?.current || 0) ).toLocaleString()}</p></div>
                   </div>
                 </Card>
                 <Card>
                    <h4 className="text-sm font-bold text-[#1B4332] mb-4">{lang === 'en' ? 'Update Progress' : 'Kemas Kini Simpanan'}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.target} (RM)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg text-sm" 
                          defaultValue={activeWedding.savings?.target}
                          onBlur={(e) => updateWeddingData('savings', { ...activeWedding.savings, target: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.current} (RM)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg text-sm" 
                          defaultValue={activeWedding.savings?.current}
                          onBlur={(e) => updateWeddingData('savings', { ...activeWedding.savings, current: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                 </Card>
               </div>
             </div>
           )}

           {activeTab === 'attire' && activeWedding && (
             <div className="space-y-6 animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-[#1B4332]">{t.attire}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {['Groom', 'Bride'].map(person => (
                   <Card key={person}>
                     <h4 className="font-bold text-[#1B4332] mb-4 border-b pb-2 flex items-center gap-2">
                       <Scissors size={16} className="text-[#D4AF37]" />
                       {lang === 'en' ? person : (person === 'Groom' ? 'Pengantin Lelaki' : 'Pengantin Perempuan')}
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                       {['Shoulder', 'Chest', 'Waist', 'Hips', 'Sleeve'].map(measure => (
                         <div key={measure}>
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{lang === 'en' ? measure : (measure === 'Shoulder' ? 'Bahu' : measure === 'Chest' ? 'Dada' : measure === 'Waist' ? 'Pinggang' : measure === 'Hips' ? 'Punggung' : 'Lengan')}</label>
                           <input 
                             placeholder="0.0 inch"
                             className="w-full p-2 border-b text-sm focus:border-[#D4AF37] outline-none"
                             defaultValue={activeWedding.attire?.[person.toLowerCase()]?.[measure.toLowerCase()]}
                             onBlur={(e) => {
                               const currentAttire = activeWedding.attire || {};
                               const personData = currentAttire[person.toLowerCase()] || {};
                               updateWeddingData('attire', { ...currentAttire, [person.toLowerCase()]: { ...personData, [measure.toLowerCase()]: e.target.value } });
                             }}
                           />
                         </div>
                       ))}
                     </div>
                   </Card>
                 ))}
               </div>
             </div>
           )}

           {activeTab === 'emergency' && activeWedding && (
             <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#1B4332]">{t.emergency}</h2>
                  <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    <BriefcaseMedical size={14} /> {lang === 'en' ? 'Essential for Wedding Day' : 'Penting untuk Hari Majlis'}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(activeWedding.emergencyKit || EMERGENCY_KIT_TEMPLATE).map((task, i) => (
                    <Card key={i} className={`flex items-center gap-4 py-4 transition-all ${task.status === 'completed' ? 'opacity-50' : ''}`}>
                       <button onClick={() => {
                          const updated = [...(activeWedding.emergencyKit || EMERGENCY_KIT_TEMPLATE)];
                          updated[i].status = updated[i].status === 'completed' ? 'pending' : 'completed';
                          updateWeddingData('emergencyKit', updated);
                        }} className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-colors ${task.status === 'completed' ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200'}`}>
                          {task.status === 'completed' && <CheckCircle2 size={16} />}
                       </button>
                       <p className={`text-sm font-bold text-[#1B4332] ${task.status === 'completed' ? 'line-through' : ''}`}>
                         {lang === 'en' ? task.item : task.item_ms}
                       </p>
                    </Card>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'pricing' && <SubscriptionPage onUpgrade={(plan) => setPaymentPlan(plan)} lang={lang} />}
           {activeTab === 'collaborators' && activeWedding && <CollaboratorsTab wedding={activeWedding} user={user} lang={lang} />}
           
           {/* Fallback for other tabs */}
           {['budget', 'vendors'].includes(activeTab) && (
             <div className="h-full flex items-center justify-center text-gray-400 italic">
               {lang === 'en' ? `${activeTab} feature coming soon...` : `Ciri ${activeTab} bakal menyusul...`}
             </div>
           )}
        </main>
      </div>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
    </div>
  );
}

// --- Collaborators Tab Component ---
const CollaboratorsTab = ({ wedding, user, lang }) => {
  const t = translations[lang];
  const [email, setEmail] = useState('');

  const addCollaborator = async () => {
    if (!email || !wedding.id) return;
    const weddingRef = doc(db, 'artifacts', appId, 'public', 'data', 'weddings', wedding.id);
    const updatedPlanners = [...(wedding.planners || []), email];
    await updateDoc(weddingRef, { planners: updatedPlanners });
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B4332]">{t.collaborators}</h2>
      <Card>
        <div className="flex gap-2">
          <input 
            placeholder={t.plannerEmail} 
            className="flex-1 p-3 border rounded-xl text-sm outline-none focus:ring-2 ring-[#D4AF37]/20" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={addCollaborator}>{t.invite}</Button>
        </div>
      </Card>
      <div className="space-y-3">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.peopleAccess}</h3>
        <Card className="p-0 overflow-hidden divide-y">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-[10px] font-bold">O</div>
              <p className="text-sm font-bold">{user.email || 'Current User'}</p>
            </div>
            <span className="text-[10px] font-black text-green-600 uppercase">{t.owner}</span>
          </div>
          {(wedding.planners || []).map((pEmail, i) => (
            <div key={i} className="p-4 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-bold">P</div>
                <p className="text-sm font-medium">{pEmail}</p>
              </div>
              <span className="text-[10px] font-black text-amber-600 uppercase">{t.planner}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// --- Subscription Page Component ---
const SubscriptionPage = ({ onUpgrade, lang }) => {
  const t = translations[lang];
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-[#1B4332]">{lang === 'en' ? 'Choose Your Plan' : 'Pilih Pelan Anda'}</h2>
        <p className="text-gray-500 text-sm">{lang === 'en' ? 'Unlock full Malaysia Nikah planning potential.' : 'Buka potensi penuh perancangan Nikah Malaysia anda.'}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-2 border-gray-100 flex flex-col hover:border-[#D4AF37]/50 transition-colors">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly</span>
          <div className="flex items-baseline gap-1 my-4">
            <span className="text-4xl font-bold text-[#1B4332]">RM 29</span>
            <span className="text-gray-400 text-xs">/month</span>
          </div>
          <Button variant="outline" className="w-full py-4 mt-auto" onClick={() => onUpgrade('monthly')}>Select</Button>
        </Card>
        <Card className="p-8 border-2 border-[#1B4332] bg-[#1B4332] text-white flex flex-col relative overflow-hidden shadow-xl">
          <div className="absolute top-4 right-[-35px] bg-[#D4AF37] text-white text-[10px] font-black px-10 py-1.5 rotate-45">{t.bestValue}</div>
          <span className="text-[10px] font-black text-green-200 uppercase tracking-widest">Yearly</span>
          <div className="flex items-baseline gap-1 my-4">
            <span className="text-4xl font-bold text-[#D4AF37]">RM 299</span>
            <span className="text-green-200 text-xs">/year</span>
          </div>
          <Button variant="secondary" className="w-full py-4 text-[#1B4332] mt-auto" onClick={() => onUpgrade('yearly')}>{t.save15}</Button>
        </Card>
      </div>
    </div>
  );
}
