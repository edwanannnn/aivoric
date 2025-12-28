import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Zap, Globe, Cpu, MessageSquare, Terminal, CheckCircle, X, Send, Activity, Lock, Loader2, Check } from 'lucide-react';

/**
 * CONFIGURATION & THEME
 * Palet Warna: The Void & The Spark
 */
const THEME = {
  colors: {
    obsidian: '#050505',
    spaceGrey: '#121212',
    electricBlue: '#007AFF',
    liquidSilver: '#E5E5E5',
    cyanAura: 'rgba(0, 122, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.1)'
  },
  fonts: {
    heading: "'Syne', sans-serif", // Fallback untuk Clash Display
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace"
  }
};

// KONFIGURASI KONTAK
const CONTACT_CONFIG = {
  whatsapp: "6289517634196", // Format sanitasi tanpa + atau spasi
  waMessage: "Halo Aivoric, saya tertarik untuk diskusi mengenai otomasi bisnis.",
  getWaLink: () => `https://wa.me/6289517634196?text=${encodeURIComponent("Halo Aivoric, saya tertarik untuk diskusi mengenai otomasi bisnis.")}`
};

/**
 * MICRO-INTERACTION: Custom Cursor
 * Lingkaran kecil Electric Blue dengan efek invert saat hover text.
 */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringText, setIsHoveringText] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over text or interactive elements
      const target = e.target;
      const computedStyle = window.getComputedStyle(target);
      if (
        target.tagName === 'P' || 
        target.tagName === 'H1' || 
        target.tagName === 'H2' || 
        target.tagName === 'SPAN' || 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'IMG' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      ) {
        setIsHoveringText(true);
      } else {
        setIsHoveringText(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-blue-500 pointer-events-none z-[9999] mix-blend-difference"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
        scale: isHoveringText ? 2.5 : 1,
        opacity: 1
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5
      }}
    />
  );
};

/**
 * MICRO-INTERACTION: Magnetic Button
 * Tombol yang tertarik ke arah kursor.
 */
const MagneticButton = ({ children, className, onClick, href, disabled }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Apply magnetic force (limited range)
    if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
      x.set(distanceX * 0.3);
      y.set(distanceY * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
      href={disabled ? undefined : href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      disabled={disabled}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </Component>
  );
};

/**
 * COMPONENT: Bento Card with Hover Glow
 * Latar belakang glassmorphism dengan efek glow mengikuti mouse.
 */
const BentoCard = ({ children, className, colSpan }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div
      className={`relative rounded-3xl border border-white/10 bg-[#121212]/70 backdrop-blur-xl overflow-hidden group ${className} ${colSpan}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 122, 255, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full p-8 flex flex-col justify-between z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * COMPONENT: Live Automation Terminal
 * Simulasi "Pulse of Nexus"
 */
const LiveTerminal = () => {
  const [logs, setLogs] = useState([
    { id: 1, text: "System initialized...", type: "info" },
    { id: 2, text: "Connecting to n8n webhook...", type: "info" },
  ]);

  useEffect(() => {
    const newLogs = [
      { text: "Lead captured: PT. Maju Jaya", type: "success" },
      { text: "Enriching data via Gemini 1.5...", type: "process" },
      { text: "Score: 85 (High Intent)", type: "info" },
      { text: "Notifying Maestro via Telegram...", type: "success" },
      { text: "Workflow 'Sales_Auto' executed in 230ms", type: "info" },
      { text: "Checking database health...", type: "process" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      const log = newLogs[index];
      const time = new Date().toLocaleTimeString('id-ID', { hour12: false });
      
      setLogs(prev => {
        const updated = [...prev, { id: Date.now(), text: log.text, type: log.type, time }];
        if (updated.length > 6) updated.shift();
        return updated;
      });

      index = (index + 1) % newLogs.length;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-12 font-mono text-xs md:text-sm bg-black/80 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-500" />
          <span className="text-gray-400">NEXUS_CORE_V1.4</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-500 text-[10px]">ONLINE</span>
        </div>
      </div>
      <div className="space-y-2 h-[160px] overflow-hidden flex flex-col justify-end">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2"
            >
              <span className="text-gray-600">[{log.time}]</span>
              <span className={`
                ${log.type === 'success' ? 'text-green-400' : ''}
                ${log.type === 'process' ? 'text-yellow-400' : ''}
                ${log.type === 'info' ? 'text-blue-300' : ''}
              `}>
                {log.type === 'process' && '⚡ '}
                {log.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * COMPONENT: Chat Widget
 * Bubble Chat to WhatsApp (Aris's Logic)
 */
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Init, 1: Name/Needs, 2: Thinking, 3: Redirect
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setStep(2); // Thinking animation
    
    // Simulate Gemini Processing
    setTimeout(() => {
      setStep(3);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans"
          >
            <div className="bg-[#050505] p-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Aivoric Assistant</h4>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>

            <div className="p-4 h-64 overflow-y-auto bg-[#121212]">
              {step === 0 && (
                <div className="flex gap-3">
                  <div className="bg-[#2a2a2a] p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-gray-200">
                    Halo! Saya asisten AI Aivoric. Ada yang bisa saya bantu terkait otomatisasi bisnis Anda?
                  </div>
                </div>
              )}
              {step >= 2 && (
                <div className="mt-4 flex gap-3">
                  <div className="bg-[#2a2a2a] p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-gray-200">
                    <span className="text-gray-400 italic text-xs">Pesan Anda: {input}</span>
                  </div>
                </div>
              )}
              {step === 2 && (
                 <div className="mt-4 flex gap-3">
                   <div className="bg-[#2a2a2a] p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-gray-200 flex items-center gap-2">
                     <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                     <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                   </div>
                 </div>
              )}
               {step === 3 && (
                <div className="mt-4 flex gap-3">
                  <div className="bg-[#2a2a2a] p-3 rounded-tr-xl rounded-bl-xl rounded-br-xl text-sm text-gray-200">
                    Analisis selesai. Saya melihat potensi efisiensi tinggi. Mari lanjut diskusi teknis di WhatsApp dengan engineer kami.
                    <a 
                      href={CONTACT_CONFIG.getWaLink()}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="block mt-2 bg-green-600 text-white text-center py-2 rounded-lg text-xs font-bold hover:bg-green-500 transition"
                    >
                      Buka WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>

            {step === 0 && (
              <div className="p-3 bg-[#050505] border-t border-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik kebutuhan..."
                  className="flex-1 bg-[#1a1a1a] text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 transition"
                >
                  <Send size={16} className="text-white" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <MagneticButton 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,122,255,0.5)] hover:bg-blue-500 transition-colors z-50"
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
      </MagneticButton>
    </div>
  );
};

/**
 * MAIN APP
 */
export default function AivoricLanding() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Form Submission State Logic
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate API Call & AI Processing Delay
    setTimeout(() => {
      setFormStatus('success');
      // Reset after 3 seconds
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Syne:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Syne', sans-serif;
        }
        .mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <CustomCursor />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            
            {/* LOGO SECTION - LIVE */}
            <img 
              src="https://i.postimg.cc/wMSkCrDS/Gemini-Generated-Image-8n4v5d8n4v5d8n4v.png" 
              alt="Aivoric Logo" 
              className="h-10 w-auto object-contain mr-2 rounded-full border border-white/10 shadow-[0_0_15px_rgba(0,122,255,0.3)]" 
            />

            <span className="font-bold text-xl tracking-tight">AIVORIC.ID</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <MagneticButton 
            href={CONTACT_CONFIG.getWaLink()}
            className="hidden md:block px-6 py-2 rounded-full border border-white/20 text-sm hover:bg-white hover:text-black transition-all duration-300 text-center"
          >
            Start Automation
          </MagneticButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>
        </div>

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-mono text-blue-300 tracking-wider">SYSTEM OPTIMIZED</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="block text-white">Otomasi Bukan Pilihan.</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
              Ini Keunggulan Anda.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hentikan kebocoran profit akibat proses manual. Kami membangun sistem saraf digital 
            yang memastikan bisnis Anda beroperasi dengan presisi maksimal.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <MagneticButton 
              href={CONTACT_CONFIG.getWaLink()}
              className="group px-8 py-4 bg-blue-600 rounded-full font-semibold text-white hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              Amankan Konsultasi
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <button className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-300">
              Lihat Demo
            </button>
          </div>

          {/* SIMULATED TERMINAL */}
          <LiveTerminal />
        </motion.div>
      </section>

      {/* SERVICES: BENTO GRID */}
      <section id="services" className="py-24 px-6 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Architecture</h2>
            <p className="text-gray-400 max-w-xl">
              Kami tidak menjual website. Kami membangun ekosistem cerdas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Service 1 */}
            <BentoCard colSpan="md:col-span-2" className="bg-gradient-to-br from-[#121212] to-[#0a0a0a]">
              <div className="z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Bot className="text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Customer Engagement</h3>
                <p className="text-gray-400">
                  Respon instan 24/7 tanpa beban gaji tambahan. Presisi data menghilangkan kesalahan manusia 
                  dalam penyampaian informasi produk.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>
            </BentoCard>

            {/* Service 2 */}
            <BentoCard colSpan="md:col-span-1">
              <div className="z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Globe className="text-purple-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Intelligent Ecosystem</h3>
                <p className="text-gray-400 text-sm">
                  Website yang "berpikir". Terintegrasi total dengan database operasional Anda untuk memaksimalkan konversi.
                </p>
              </div>
            </BentoCard>

            {/* Service 3 */}
            <BentoCard colSpan="md:col-span-1">
              <div className="z-10">
                 <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Activity className="text-green-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Real-Time Data</h3>
                <p className="text-gray-400 text-sm">
                  Visibilitas penuh. Dasbor manajemen yang selalu akurat tanpa input manual.
                </p>
              </div>
            </BentoCard>

            {/* Service 4 */}
            <BentoCard colSpan="md:col-span-2">
              <div className="z-10 flex flex-col h-full justify-between">
                <div>
                   <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <Zap className="text-orange-400" size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Workflow Mastery (n8n)</h3>
                  <p className="text-gray-400 max-w-lg">
                    Reduksi biaya operasional dengan mengotomatisasi alur kerja kompleks antar platform. 
                    Biarkan robot mengerjakan hal repetitif, Anda fokus pada strategi.
                  </p>
                </div>
                {/* Visual Representation of Nodes */}
                <div className="flex items-center gap-4 mt-8 opacity-50">
                   <div className="px-3 py-1 rounded bg-white/10 text-xs font-mono">Trigger</div>
                   <div className="h-px w-8 bg-white/20"></div>
                   <div className="px-3 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-mono">AI Process</div>
                   <div className="h-px w-8 bg-white/20"></div>
                   <div className="px-3 py-1 rounded bg-green-500/20 text-green-300 text-xs font-mono">Action</div>
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="py-24 px-6 border-t border-white/5 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-blue-500 text-sm tracking-widest mb-4 block">ARCHITECTS OF EFFICIENCY</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            Kami mengubah kompleksitas menjadi <span className="text-blue-500">kejelasan yang menguntungkan.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Di Aivoric.id, kami percaya bahwa setiap detik yang dihabiskan untuk tugas administratif adalah kerugian strategis. 
            Kami hadir sebagai partner bagi para visioner yang menolak diperlambat oleh sistem usang.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 border-t border-white/10 pt-12">
            <div>
              <div className="text-3xl font-bold text-white mb-1">99%</div>
              <div className="text-xs text-gray-500 font-mono">UPTIME GUARANTEE</div>
            </div>
             <div>
              <div className="text-3xl font-bold text-white mb-1">&lt;100ms</div>
              <div className="text-xs text-gray-500 font-mono">RESPONSE TIME</div>
            </div>
             <div>
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-xs text-gray-500 font-mono">AUTO-PILOT</div>
            </div>
             <div>
              <div className="text-3xl font-bold text-white mb-1">100+</div>
              <div className="text-xs text-gray-500 font-mono">WORKFLOWS BUILT</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / LEAD CAPTURE */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/5"></div>
        <div className="max-w-xl mx-auto relative z-10 bg-[#121212] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Mulai Transformasi Digital</h2>
            <p className="text-gray-400 text-sm">
              Jangan biarkan kompetitor Anda mengotomatisasi lebih dulu.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Nama Lengkap</label>
              <input type="text" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Email Bisnis</label>
              <input type="email" className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="john@company.com" required />
            </div>
             <div>
              <label className="block text-xs font-mono text-gray-500 mb-1 uppercase">Tantangan Utama</label>
              <textarea className="w-full bg-[#050505] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition h-24 resize-none" placeholder="Proses manual apa yang ingin Anda hilangkan?" required></textarea>
            </div>
            
            <MagneticButton 
              className={`w-full font-bold py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(0,122,255,0.3)] hover:shadow-[0_0_30px_rgba(0,122,255,0.5)] flex items-center justify-center gap-2
                ${formStatus === 'success' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'}
              `}
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'idle' && (
                <>Kirim & Analisis via AI</>
              )}
              {formStatus === 'submitting' && (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing Intelligence...</span>
                </>
              )}
              {formStatus === 'success' && (
                <>
                  <Check className="text-white" size={20} />
                  <span>Data Sent to Nexus Core!</span>
                </>
              )}
            </MagneticButton>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
              <Lock size={12} />
              <span>Data Anda diamankan dengan enkripsi kelas industri.</span>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#050505] text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Cpu size={16} />
          <span className="font-mono text-sm">POWERED BY AIVORIC CORE</span>
        </div>
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Aivoric.id. All systems operational.
        </p>
      </footer>

      <ChatWidget />
    </div>
  );
}
