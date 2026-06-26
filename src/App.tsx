import React, { useState, useRef } from "react";
import {
  Sparkles,
  Car,
  Shield,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  Star,
  Award,
  ShieldCheck,
  Droplets,
  ArrowRight,
  Check,
  Menu,
  X,
  Lock,
  MessageSquare,
  Wrench,
  ThumbsUp,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { motion } from "motion/react";
import AdminPortal from "./components/AdminPortal";
import BeforeAfterGallery from "./components/BeforeAfterGallery";

// Import generated hero image
const HERO_IMAGE = "/src/assets/images/realistic_detailing_hero_1782495615276.jpg";

// Premium Fluid Liquid Animation Configs
const liquidTransition = {
  type: "spring",
  stiffness: 65,
  damping: 14,
  mass: 1.15
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
};

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: liquidTransition
  }
};

const fadeInScaleVariant = {
  hidden: { opacity: 0, scale: 0.94, filter: "blur(8px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: liquidTransition
  }
};

const slideInLeftVariant = {
  hidden: { opacity: 0, x: -50, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: liquidTransition
  }
};

const slideInRightVariant = {
  hidden: { opacity: 0, x: 50, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: liquidTransition
  }
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    carType: "SUV",
    service: "Signature Full Detail"
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const bookingFormRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        // Reset form
        setBookingForm({
          name: "",
          phone: "",
          carType: "SUV",
          service: "Signature Full Detail"
        });
      } else {
        throw new Error(data.error || "Failed to submit booking inquiry.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-200 font-sans selection:bg-[#d4af37]/30 selection:text-white relative overflow-hidden">
      
      {/* Frosted Glass Ambient background orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-[#d4af37]/10 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[30%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[130px]"></div>
        <div className="absolute top-[40%] left-[25%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-amber-500/5 rounded-full blur-[130px]"></div>
      </div>

      {/* 2. HEADER & NAVIGATION */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-40 bg-white/[0.03] backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* SVG BRAND LOGO */}
          <a href="#" className="flex items-center gap-2.5 group">
            <svg id="logo-svg" viewBox="0 0 100 100" className="w-12 h-12 flex-shrink-0">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#d4af37" strokeWidth="0.75" strokeDasharray="3 2" />
              {/* Crown representation */}
              <g fill="#d4af37">
                <path d="M 32 60 L 30 45 L 38 52 L 50 35 L 62 52 L 70 45 L 68 60 Z" />
                {/* Crown Gems */}
                <circle cx="30" cy="43" r="1.5" />
                <circle cx="38" cy="50" r="1.5" />
                <circle cx="50" cy="33" r="2" />
                <circle cx="62" cy="50" r="1.5" />
                <circle cx="70" cy="43" r="1.5" />
              </g>
              {/* Swirly Line flourish */}
              <path d="M 28 65 Q 50 69 72 65" fill="none" stroke="#d4af37" strokeWidth="1" />
              {/* Center star flourish */}
              <polygon points="50,62 51.5,64.5 54,65 52,66.5 52.5,69 50,67.5 47.5,69 48,66.5 46,65 48.5,64.5" fill="#d4af37" />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-black tracking-[0.18em] text-[#d4af37] leading-none">JC'S</span>
              <span className="text-[10px] font-semibold tracking-[0.42em] text-gray-400 mt-1 uppercase leading-none">Detailing</span>
            </div>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-colors">Services</a>
            <a href="#our-work" className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-colors">Our Work</a>
            <a href="#booking" className="text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-[#d4af37] transition-colors">Book Now</a>
          </nav>

          {/* HEADER ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:5553453382" className="text-sm font-semibold text-gray-300 hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
              <Phone size={14} className="text-[#d4af37]" /> (555) 345-DETA
            </a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#booking"
              className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-neutral-950 font-bold uppercase tracking-wider text-xs py-2.5 px-5 rounded-full hover:opacity-90 transition-all shadow-[0_2px_15px_rgba(212,175,55,0.2)]"
            >
              Inquire Now
            </motion.a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#d4af37] hover:text-white transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="md:hidden bg-[#0c0c0c] border-t border-neutral-900 px-4 py-6 space-y-4"
          >
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold uppercase tracking-wider text-gray-300 hover:text-[#d4af37] py-2"
            >
              Services
            </a>
            <a
              href="#our-work"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold uppercase tracking-wider text-gray-300 hover:text-[#d4af37] py-2"
            >
              Our Work
            </a>
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold uppercase tracking-wider text-gray-300 hover:text-[#d4af37] py-2"
            >
              Book Now
            </a>
            <div className="pt-4 border-t border-neutral-900 flex flex-col gap-3">
              <a href="tel:5553453382" className="text-sm font-bold text-[#d4af37] flex items-center gap-1.5">
                <Phone size={14} /> Call us: (555) 345-DETA
              </a>
              <a
                href="#booking"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#d4af37] text-neutral-900 text-center font-bold uppercase tracking-widest text-xs py-3 rounded-xl"
              >
                Book Mobilization
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* 3. LUXURIOUS SPACIOUS HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden py-32 md:py-44 px-4">
        {/* Background photo with premium gradient overlay (dark at the top, fully visible at the bottom) */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.65 }}
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            src={HERO_IMAGE}
            alt="Showroom polished car"
            className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Linear gradient: top is dark for header readability, fading to completely transparent at the bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent" />
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="max-w-4xl mx-auto text-center relative z-10 space-y-10"
        >
          
          <motion.div variants={fadeInUpVariant} className="space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.45em] text-[#d4af37]/90 block">
              JC'S SIGNATURE MOBILIZATION
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] uppercase font-sans">
              AUTOMOTIVE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5deb3] to-[#d4af37] tracking-wider">
                PERFECTION.
              </span>
            </h1>
          </motion.div>

          <motion.p 
            variants={fadeInUpVariant}
            className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed tracking-wide font-sans font-medium"
          >
            Masterfully crafted paint correction and ceramic preservation, delivered with absolute precision to your driveway.
          </motion.p>

          <motion.div 
            variants={fadeInUpVariant}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4"
          >
            <motion.a
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 8px 35px rgba(212,175,55,0.45)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              href="#booking"
              className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-neutral-950 font-black uppercase tracking-[0.15em] text-[10px] py-4.5 px-10 rounded-full shadow-[0_4px_30px_rgba(212,175,55,0.3)] flex items-center gap-2"
            >
              Book Mobile Service <ArrowRight size={11} strokeWidth={3} />
            </motion.a>
            <motion.a
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.25)",
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              href="#services"
              className="border border-white/10 bg-white/[0.03] backdrop-blur-md text-gray-200 font-bold uppercase tracking-[0.15em] text-[10px] py-4.5 px-10 rounded-full transition-all duration-300"
            >
              View Detailing Packages
            </motion.a>
          </motion.div>

        </motion.div>
      </section>

      {/* 4. PREMIUM BENTO SERVICES GRID */}
      <section id="services" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/10">
        <motion.div 
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37]">
            JC'S SIGNATURE SOLUTIONS
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-3 uppercase tracking-tight">
            Our Detailing Masterpieces
          </h2>
          <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mt-4" />
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          
          {/* Card 1 */}
          <motion.div 
            variants={fadeInUpVariant}
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(212,175,55,0.1)",
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#d4af37]/30 hover:bg-white/[0.06] rounded-2xl p-6 transition-colors duration-300 group cursor-pointer"
          >
            <div className="bg-[#d4af37]/10 w-11 h-11 rounded-lg flex items-center justify-center text-[#d4af37] mb-5 border border-[#d4af37]/15">
              <Droplets size={20} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#d4af37] transition-colors">
              Signature Interior Restoration
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Full deep fiber sanitization, hot-water carpet extraction, dashboard hydration, and leather conditioning to restore fabric to absolute clean state.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
              <span className="text-gray-500 uppercase tracking-widest font-mono">Value</span>
              <span className="text-white font-bold font-mono">From $200</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={fadeInUpVariant}
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(212,175,55,0.1)",
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#d4af37]/30 hover:bg-white/[0.06] rounded-2xl p-6 transition-colors duration-300 group cursor-pointer"
          >
            <div className="bg-[#d4af37]/10 w-11 h-11 rounded-lg flex items-center justify-center text-[#d4af37] mb-5 border border-[#d4af37]/15">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#d4af37] transition-colors">
              Ceramic Paint Correction
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Multi-stage machine polishing removing 85%+ of swirls and scratches, followed by aerospace-grade ceramic coating for wet-look deep gloss.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
              <span className="text-gray-500 uppercase tracking-widest font-mono">Value</span>
              <span className="text-white font-bold font-mono">From $350</span>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={fadeInUpVariant}
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(212,175,55,0.1)",
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#d4af37]/30 hover:bg-white/[0.06] rounded-2xl p-6 transition-colors duration-300 group cursor-pointer"
          >
            <div className="bg-[#d4af37]/10 w-11 h-11 rounded-lg flex items-center justify-center text-[#d4af37] mb-5 border border-[#d4af37]/15">
              <Car size={20} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#d4af37] transition-colors">
              The Ultimate Full Detail
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Our ultimate combination: Full deep steam interior restoration + dual-stage paint correction + protective ceramic glass wax shell enhancement.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
              <span className="text-gray-500 uppercase tracking-widest font-mono">Value</span>
              <span className="text-white font-bold font-mono">From $500</span>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            variants={fadeInUpVariant}
            whileHover={{ 
              y: -8, 
              scale: 1.02, 
              boxShadow: "0 20px 40px rgba(212,175,55,0.1)",
              transition: { type: "spring", stiffness: 400, damping: 20 }
            }}
            className="bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-[#d4af37]/30 hover:bg-white/[0.06] rounded-2xl p-6 transition-colors duration-300 group cursor-pointer"
          >
            <div className="bg-[#d4af37]/10 w-11 h-11 rounded-lg flex items-center justify-center text-[#d4af37] mb-5 border border-[#d4af37]/15">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase group-hover:text-[#d4af37] transition-colors">
              Express Renewal Care
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Mobile premium foam bath, hand dry, quick interior vacuum, clean console surfaces, window polishing, and high-gloss tire protectant.
            </p>
            <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center text-xs">
              <span className="text-gray-500 uppercase tracking-widest font-mono">Value</span>
              <span className="text-white font-bold font-mono">From $120</span>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 5. SHOWROOM RESULTS GALLERY (Our Work) */}
      <section id="our-work" className="py-24 border-y border-white/10 bg-[#06090f]/50 px-4">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37] flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-[#d4af37]" /> EVIDENCE OF PERFECTION
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-3 uppercase tracking-tight">
              Showroom Results
            </h2>
            <p className="text-xs text-gray-400 mt-3 max-w-lg mx-auto leading-relaxed">
              Witness the immaculate quality of our paint correction, interior rejuvenation, and forged alloy protection treatments under precise clinical lighting.
            </p>
            <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mt-5" />
          </motion.div>

          {/* Showroom Before & After Gallery Card Grid */}
          <BeforeAfterGallery />

        </div>
      </section>

      {/* 6. WHY CHOOSE JC'S (BENEFITS) */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            
            <motion.div variants={slideInLeftVariant}>
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37]">
                UNCOMPROMISING STANDARDS
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-3 uppercase tracking-tight">
                We Bring the Studio <br />
                <span className="text-[#d4af37]">To Your Driveway.</span>
              </h2>
              <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-lg">
                Unlike traditional car washes that use dirty abrasive brushes or recycle hard mineral water, JC's Mobile Detailing operates a fully customized detailing center on wheels. We deliver flawless luxury treatments without you ever leaving your home.
              </p>

              <div className="space-y-4 mt-8">
                
                <div className="flex gap-4">
                  <div className="bg-[#d4af37]/10 text-[#d4af37] w-10 h-10 rounded-lg flex items-center justify-center border border-[#d4af37]/20 flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-tight">100% Self-Sufficient Rig</h4>
                    <p className="text-xs text-gray-400 mt-1">Our premium custom detail trucks carry their own onboard high-pressure clean water supply and quiet, high-efficiency electrical generator. We don't need your water faucet or outlet.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#d4af37]/10 text-[#d4af37] w-10 h-10 rounded-lg flex items-center justify-center border border-[#d4af37]/20 flex-shrink-0">
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-tight">Aerospace-Grade Chemistry</h4>
                    <p className="text-xs text-gray-400 mt-1">We utilize only pH-neutral specialized surfactants, non-greasy UV-absorbers, and nano-silica (SiO2) ceramic sealants to preserve and protect your car's premium materials.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-[#d4af37]/10 text-[#d4af37] w-10 h-10 rounded-lg flex items-center justify-center border border-[#d4af37]/20 flex-shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white uppercase tracking-tight">5-Star Satisfaction Guarantee</h4>
                    <p className="text-xs text-gray-400 mt-1">Every car undergoes a mandatory 21-point luxury inspection after treatment. If any speck of dust, smudge, or stain is missed, we re-clean it instantly on the spot.</p>
                  </div>
                </div>

              </div>
            </motion.div>

            {/* Custom collage card representation */}
            <motion.div variants={fadeInScaleVariant} className="relative flex justify-center items-center p-8 bg-gradient-to-tr from-white/[0.01] to-white/[0.03] border border-white/5 rounded-3xl h-80 w-full overflow-hidden shadow-2xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-[80px] pointer-events-none" />
              
              {/* Spinning slow circular border */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 rounded-full border border-dashed border-[#d4af37]/20"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 rounded-full border border-double border-amber-500/10"
              />

              {/* Pulsing main shield */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  borderRadius: ["42% 58% 70% 30% / 45% 45% 55% 55%", "70% 30% 52% 48% / 60% 40% 60% 40%", "42% 58% 70% 30% / 45% 45% 55% 55%"]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-40 h-40 bg-gradient-to-br from-[#d4af37]/20 to-amber-500/5 backdrop-blur-md flex flex-col items-center justify-center border border-[#d4af37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
              >
                <Award size={36} className="text-[#d4af37] animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4af37] mt-3 font-bold">5-STAR</span>
                <span className="text-[8px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">DETAIL CERTIFIED</span>
              </motion.div>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 8. RESERVATIONS & BOOKING SECTION */}
      <section id="booking" ref={bookingFormRef} className="py-24 px-4 bg-gradient-to-b from-[#05070a] to-[#0b0f19] relative border-t border-white/10">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-[#d4af37]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[35%] h-[35%] bg-amber-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Premium copy */}
            <motion.div 
              variants={slideInLeftVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="lg:col-span-5 space-y-8"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#d4af37]">
                  EXCLUSIVE COMMISSION
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white mt-3 uppercase tracking-tight leading-none">
                  Secure Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f5deb3] to-[#d4af37]">Mobilization</span>
                </h2>
                <p className="text-sm text-gray-400 mt-4 leading-relaxed font-sans">
                  We operate a specialized mobile studio with strictly limited availability. Submit your vehicle's technical requirements to lock in your priority appointment.
                </p>
              </div>

              <div className="space-y-6 font-sans">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#d4af37] flex-shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Comprehensive Shield</h4>
                    <p className="text-[11px] text-gray-400 mt-1">Full garagekeepers liability coverage up to $2,000,000 for ultimate safety.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#d4af37] flex-shrink-0">
                    <Car size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Independent Support Rig</h4>
                    <p className="text-[11px] text-gray-400 mt-1">Onboard high-pressure deionized water reservoirs and silent electrical generation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-[#d4af37] flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Elite Dispatch Desk</h4>
                    <p className="text-[11px] text-gray-400 mt-1">Direct scheduling desk confirmation via phone or email within 15 minutes.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Premium Booking Form */}
            <motion.div 
              variants={slideInRightVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="lg:col-span-7"
            >
              <div className="bg-white/[0.01] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden hover:border-[#d4af37]/20 transition-all duration-500">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

                {submitSuccess ? (
                  <div className="py-16 text-center space-y-6">
                    <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20 shadow-lg">
                      <Check size={32} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-white uppercase tracking-wider">Inquiry Registered</h4>
                      <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                        Your mobilization request is successfully lodged in our private queue. Our chief detailing dispatcher will contact you in under 15 minutes.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="text-xs font-mono font-bold text-[#d4af37] tracking-wider uppercase border border-[#d4af37]/20 px-6 py-2.5 rounded-full bg-[#d4af37]/5 hover:bg-[#d4af37]/10 transition-colors cursor-pointer"
                    >
                      Submit Another Vehicle
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    
                    {/* Customer Name */}
                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-bold">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="E.g., Alexander Mercer"
                        required
                        value={bookingForm.name}
                        onChange={handleInputChange}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] transition-all placeholder-gray-600"
                      />
                    </div>

                    {/* Phone Connection */}
                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-bold">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="E.g., (555) 019-2834"
                        required
                        value={bookingForm.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4af37] focus:bg-white/[0.06] transition-all placeholder-gray-600"
                      />
                    </div>

                    {/* Car Type Select */}
                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-bold">Car Type *</label>
                      <select
                        name="carType"
                        value={bookingForm.carType}
                        onChange={handleInputChange}
                        className="w-full bg-[#05070a] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Truck">Truck</option>
                        <option value="Exotic / Supercar">Exotic / Supercar</option>
                      </select>
                    </div>

                    {/* Dropdown service */}
                    <div>
                      <label className="block text-[9px] font-mono uppercase tracking-wider text-gray-400 mb-2 font-bold">Select Detailing Treatment *</label>
                      <select
                        name="service"
                        value={bookingForm.service}
                        onChange={handleInputChange}
                        className="w-full bg-[#05070a] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-all cursor-pointer"
                      >
                        <option value="Signature Full Detail">Signature Full Detail</option>
                        <option value="Signature Interior Restoration">Signature Interior Restoration</option>
                        <option value="Ceramic Paint Correction">Ceramic Paint Correction</option>
                        <option value="Express Renewal Care">Express Renewal Care</option>
                      </select>
                    </div>

                    {submitError && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-3 rounded-xl text-center font-medium">
                        {submitError}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02, opacity: 0.95 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-neutral-900 font-bold uppercase tracking-[0.2em] text-[10px] py-4 rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {submitting ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <>
                          Request Detailing Quote <ArrowRight size={12} />
                        </>
                      )}
                    </motion.button>

                    <div className="text-center">
                      <p className="text-[9px] text-gray-500 font-mono tracking-wider">
                        🛡️ SECURE PORTAL • ON-DEMAND SCHEDULING
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="py-20 border-t border-white/10 px-4">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            variants={fadeInUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#d4af37]">
              COMMON QUESTIONS
            </span>
            <h2 className="text-3xl font-black text-white mt-3 uppercase tracking-tight">
              Frequently Answered
            </h2>
            <div className="w-16 h-[2px] bg-[#d4af37] mx-auto mt-4" />
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="space-y-6"
          >
            
            <motion.div 
              variants={fadeInUpVariant}
              whileHover={{ 
                y: -4, 
                borderColor: "rgba(212,175,55,0.25)",
                backgroundColor: "rgba(255,255,255,0.035)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 transition-colors duration-300 cursor-pointer"
            >
              <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span className="text-[#d4af37]">Q.</span> Do you need to connect to my house water or electricity?
              </h4>
              <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                No. JC's Detailing dispatch vehicles are completely self-sufficient. Every rig is equipped with an onboard 120-gallon deionized water reservoir and a silent medical-grade generator. We can detail your vehicle in an apartment parking garage, office complex, or a remote job site with zero disruption.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUpVariant}
              whileHover={{ 
                y: -4, 
                borderColor: "rgba(212,175,55,0.25)",
                backgroundColor: "rgba(255,255,255,0.035)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 transition-colors duration-300 cursor-pointer"
            >
              <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span className="text-[#d4af37]">Q.</span> What is the duration of a standard detailing session?
              </h4>
              <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                Express Renewal details take about 1.5 hours. Signature Interior Restorations typically require 2 to 3 hours, and Ceramic Paint Corrections can take 4 to 6 hours depending on the level of defect removal requested.
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUpVariant}
              whileHover={{ 
                y: -4, 
                borderColor: "rgba(212,175,55,0.25)",
                backgroundColor: "rgba(255,255,255,0.035)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 transition-colors duration-300 cursor-pointer"
            >
              <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span className="text-[#d4af37]">Q.</span> Do you have insurance to cover premium luxury vehicles?
              </h4>
              <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                Yes, JC's Detailing holds full comprehensive garagekeepers liability insurance covering up to $2,000,000. Our technicians are factory-trained master detailers experienced in handling luxury sports cars, vintage exotics, and electric vehicles.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </section>

      {/* 10. LUXURY FOOTER & SECURE PORTAL LOCK */}
      <footer className="bg-white/[0.02] border-t border-white/10 py-12 px-4 text-center backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2.5">
            <svg id="logo-footer-svg" viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0 opacity-80">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#d4af37" strokeWidth="1.5" />
              <g fill="#d4af37">
                <path d="M 32 60 L 30 45 L 38 52 L 50 35 L 62 52 L 70 45 L 68 60 Z" />
              </g>
              <path d="M 28 65 Q 50 69 72 65" fill="none" stroke="#d4af37" strokeWidth="1" />
            </svg>
            <div className="text-left">
              <span className="font-serif text-sm font-black tracking-widest text-[#d4af37] block">JC'S DETAILING</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-widest">Showroom Perfection • Delivered Mobile</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 font-mono">
            © 2026 JC's Detailing. All rights reserved. Built with premium custom craftsmanship.
          </div>

          {/* Hidden Admin/CRM console activator link */}
          <button
            onClick={() => setAdminOpen(true)}
            className="text-[10px] text-gray-700 hover:text-[#d4af37] transition-colors flex items-center gap-1 uppercase font-semibold font-mono tracking-wider cursor-pointer"
          >
            <Lock size={10} /> Authorized Staff Portal
          </button>
        </div>
      </footer>

      {/* ADMIN CONSOLE PORTAL MODAL DIALOG */}
      {adminOpen && (
        <AdminPortal onClose={() => setAdminOpen(false)} />
      )}

    </div>
  );
}
