import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  ArrowDown, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Award, 
  Activity, 
  FileText, 
  ChevronRight, 
  RotateCcw, 
  Info, 
  Vote, 
  Building, 
  TrendingUp, 
  MapPin, 
  HelpCircle, 
  Sparkles, 
  Check, 
  X,
  BookOpen,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Bot,
  UserCheck
} from "lucide-react";
import { MILESTONES, DRAG_ITEMS, QUIZ_QUESTIONS, COLLABORATIVE_TASKS } from "./data";
import { DragItem } from "./types";

export default function App() {
  // Theme & Layout state
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelYear, setTravelYear] = useState(2026);
  const [hasTraveled, setHasTraveled] = useState(false);

  // Time machine activation helper
  const activateTimeMachine = () => {
    setIsTraveling(true);
    let currentYear = 2026;
    const interval = setInterval(() => {
      currentYear -= 3;
      if (currentYear <= 1975) {
        currentYear = 1975;
        clearInterval(interval);
        setTimeout(() => {
          setIsTraveling(false);
          setHasTraveled(true);
          // Scroll dynamically to the timeline section
          const section = document.getElementById("timeline-section");
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }, 800);
      }
      setTravelYear(currentYear);
    }, 120);
  };

  // Milestone interactive states
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  const toggleMilestone = (id: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Milestone 1 ballot step
  const [activeBallotStep, setActiveBallotStep] = useState(0);
  const [hasCompletedMilestoneV, setHasCompletedMilestoneV] = useState(false);

  useEffect(() => {
    if (activeBallotStep === 4) {
      setHasCompletedMilestoneV(true);
    }
  }, [activeBallotStep]);

  // Milestone 2 limitations toggle
  const [showM2Limitations, setShowM2Limitations] = useState(false);

  // Milestone 3 breakthrough active tab
  const [activeBreakthroughTab, setActiveBreakthroughTab] = useState(0);

  // Milestone 4 Border area selection
  const [activeBorderArea, setActiveBorderArea] = useState<"tay_nam" | "phia_bac" | null>("tay_nam");

  // Milestone 5 limitations toggle
  const [showM5Limitations, setShowM5Limitations] = useState(false);

  // Milestone 6 Coupon Booklet toggle
  const [couponDecongested, setCouponDecongested] = useState(false);

  // Drag and Drop Game State
  const [sortedCards, setSortedCards] = useState<Record<string, "pending" | "bao_cap" | "hach_toan">>({});
  const [gameScore, setGameScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [wrongFeedbackId, setWrongFeedbackId] = useState<string | null>(null);

  // Drag handlers (HTML5)
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData("text/plain", itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetChest: "bao_cap" | "hach_toan") => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    sortCard(itemId, targetChest);
  };

  // Dynamic sorter logic
  const sortCard = (itemId: string, chest: "bao_cap" | "hach_toan") => {
    const item = DRAG_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (item.correctChest === chest) {
      if (sortedCards[itemId] !== chest) {
        setSortedCards(prev => ({ ...prev, [itemId]: chest }));
        setGameScore(prev => prev + 1);
      }
    } else {
      // Show error feedback
      setWrongFeedbackId(itemId);
      setTimeout(() => setWrongFeedbackId(null), 800);
    }
  };

  // Check if game complete
  useEffect(() => {
    const sortedCount = Object.keys(sortedCards).length;
    if (sortedCount === DRAG_ITEMS.length) {
      setGameFinished(true);
    }
  }, [sortedCards]);

  const resetGame = () => {
    setSortedCards({});
    setGameScore(0);
    setGameFinished(false);
  };

  // Multiple Choice Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCumulativeScore, setQuizCumulativeScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleQuizOptionClick = (optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(optionIdx);
  };

  const submitQuizAnswer = () => {
    if (quizSelectedOption === null || quizSubmitted) return;
    setQuizSubmitted(true);
    if (quizSelectedOption === QUIZ_QUESTIONS[currentQuizIdx].correctAnswer) {
      setQuizCumulativeScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    if (currentQuizIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuizIdx(0);
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setQuizCumulativeScore(0);
    setQuizCompleted(false);
  };

  // Local Clock to display real-time UTC standard
  const [currentUtcTime, setCurrentUtcTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentUtcTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="root-container" className="min-h-screen bg-retro-cream text-retro-charcoal selection:bg-retro-orange selection:text-white relative overflow-x-hidden">
      
      {/* TIME TRAVEL SHIP EFFECT OVERLAY */}
      <AnimatePresence>
        {isTraveling && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#12131A] text-white flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background cyber grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#E03E3E_1px,transparent_1px)] [background-size:16px_16px] opacity-20 animate-pulse"></div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center relative z-10 px-4"
            >
              <div className="w-24 h-24 bg-retro-red rounded-full mx-auto flex items-center justify-center mb-6 border border-white/20 animate-ping absolute -top-4 left-1/2 -transform -translate-x-1/2 opacity-30"></div>
              <div className="w-20 h-20 bg-retro-red rounded-full mx-auto flex items-center justify-center mb-6 border-2 border-white relative z-20 shadow-xl">
                <Clock className="w-10 h-10 text-white animate-spin" />
              </div>
              
              <h2 className="text-xl font-mono text-retro-orange tracking-widest uppercase mb-2">
                Kích hoạt cỗ máy thời gian
              </h2>
              
              <div className="text-7xl md:text-8xl font-display font-extrabold tracking-tighter my-4 text-white drop-shadow-lg">
                {travelYear}
              </div>
              
              <p className="text-sm text-yellow-200 uppercase tracking-wider max-w-sm mx-auto mt-2 font-mono">
                {travelYear > 1986 ? "Duyệt qua các giai đoạn hiện đại" : "Đang tiến vào thời kỳ tiền Đổi Mới"}
              </p>

              <div className="mt-8 space-y-1 text-xs text-gray-400 font-mono">
                <div>THIẾT LẬP KINH TẾ TRUNG ƯƠNG BAO CẤP... 100%</div>
                <div>ĐANG TRUY LỤC BIÊN NIÊN SỬ CHỦ NGHĨA XÃ HỘI...</div>
                <div className="text-retro-mint">ĐIỂM ĐẾN KHÓA: NĂM 1975</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER RAIL - INFO */}
      <header className="sticky top-0 z-40 bg-retro-cream/95 backdrop-blur-md border-b-2 border-retro-border/80 px-4 py-2.5 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-retro-red flex items-center justify-center text-white font-display font-extrabold text-sm shadow-sm">
            🇻🇳
          </div>
          <div>
            <h1 className="text-sm font-display font-bold tracking-tight text-retro-charcoal sm:text-base">
              HÀNH TRÌNH ĐỔI MỚI <span className="text-retro-red">1975 - 1986</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-retro-gray font-mono hidden sm:block">
              Tư liệu lịch sử Đảng & bước chuyển đổi tư duy kinh tế Việt Nam
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white border border-retro-border rounded text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-retro-red animate-pulse"></span>
            <span className="text-retro-gray uppercase tracking-wider">Thời gian hệ thống:</span>
            <span className="font-bold text-retro-charcoal">{currentUtcTime} (TP.Hồ Chí Minh)</span>
          </div>

          <a 
            href="#footer-tab" 
            className="text-xs font-mono font-medium text-retro-red hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Bảng AI & Human
          </a>
        </div>
      </header>

      {/* HERO SECTION / TẦNG 1 */}
      <section className="relative min-h-[90vh] flex flex-col justify-between pt-16 pb-12 px-4 shadow-inner overflow-hidden border-b-4 border-retro-charcoal bg-[radial-gradient(rgba(224,62,62,0.04)_1.5px,transparent_1.5px)] [background-size:24px_24px]">
        {/* Dynamic decorative backdrop circles representing historical spotlight */}
        <div className="absolute top-1/4 right-[-10%] w-96 h-96 rounded-full bg-retro-orange/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-[-5%] w-80 h-80 rounded-full bg-retro-yellow/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center my-auto px-2">
          {/* Historical flag label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-retro-red/10 border-2 border-retro-red/30 mb-8 select-none">
            <span className="w-2.5 h-2.5 rounded-full bg-retro-red animate-ping"></span>
            <span className="text-xs font-mono font-extrabold text-retro-red tracking-widest uppercase">
              Tài liệu chuyên đề học tập & tương tác
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-retro-charcoal leading-none mb-6">
            HÀNH TRÌNH ĐỔI MỚI
            <span className="block mt-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-retro-red to-retro-orange">
              1975 — 1986
            </span>
          </h1>

          <p className="text-base sm:text-xl text-retro-gray max-w-2xl mx-auto leading-relaxed mb-10 font-sans font-light">
            Trải nghiệm hành trình lịch sử đầy quả cảm. Tái hiện sống động từ việc hoàn thành thống nhất đất nước về mặt Nhà nước, cuộc đấu tranh giữ vững biên cương đến những bước chuyển tư duy kinh tế bứt phá ngoạn mục.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={activateTimeMachine}
              className="w-full sm:w-auto px-8 py-4 bg-retro-red hover:bg-retro-red-dark text-white font-display font-bold text-lg rounded-xl shadow-[4px_4px_0px_#1e1f22] border-2 border-retro-charcoal transition-all active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0px_#1e1f22] flex items-center justify-center gap-3 group"
            >
              <Zap className="w-5 h-5 text-retro-yellow group-hover:scale-125 transition-transform" />
              KÍCH HOẠT CỖ MÁY THỜI GIAN
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Little vector bounce arrow */}
        <div className="flex justify-center mt-12">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-10 h-10 rounded-full border-2 border-retro-border flex items-center justify-center text-retro-gray"
          >
            <ArrowDown className="w-5 h-5 text-retro-red" />
          </motion.div>
        </div>
      </section>

      {/* LÝ DO THỰC HIỆN SẢN PHẨM */}
      <section className="bg-retro-cream border-t-4 border-b-2 border-retro-charcoal py-12 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white border-4 border-retro-charcoal rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_rgba(30,31,34,1)] relative overflow-hidden">
            {/* Corner retro badge */}
            <div className="absolute top-0 right-0 bg-retro-orange text-white text-[10px] font-mono font-bold px-3 py-1 uppercase tracking-widest border-b-2 border-l-2 border-retro-charcoal rounded-bl-xl">
              Ý nghĩa khoa học
            </div>

            <div className="mb-6">
              <span className="px-3 py-1 bg-retro-yellow text-retro-charcoal font-mono text-xs font-bold uppercase tracking-widest border border-retro-charcoal rounded-full shadow-sm">
                Giai đoạn lịch sử 1975 - 1986
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-black text-retro-charcoal mt-3 uppercase tracking-tight">
                LÝ DO THỰC HIỆN SẢN PHẨM
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-retro-cream/50 p-5 rounded-xl border-2 border-retro-charcoal hover:shadow-[4px_4px_0px_rgba(30,31,34,1)] transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-retro-red font-bold text-lg">💡</span>
                  <h3 className="font-display font-bold text-retro-charcoal uppercase text-sm tracking-wide">
                    Về lý luận
                  </h3>
                </div>
                <p className="text-sm text-retro-gray leading-relaxed font-sans">
                  Hệ thống hóa bước chuyển tư duy quan trọng của Đảng; từ cơ chế bao cấp, duy ý chí sang thừa nhận quy luật thị trường (qua các cột mốc "Khoán chui", Chỉ thị 100, đổi mới "Giá - Lương - Tiền"); khẳng định hai nhiệm vụ chiến lược: Xây dựng và Bảo vệ Tổ quốc.
                </p>
              </div>

              <div className="bg-retro-cream/50 p-5 rounded-xl border-2 border-retro-charcoal hover:shadow-[4px_4px_0px_rgba(30,31,34,1)] transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-retro-mint font-bold text-lg">⚙️</span>
                  <h3 className="font-display font-bold text-retro-charcoal uppercase text-sm tracking-wide">
                    Về thực tiễn
                  </h3>
                </div>
                <p className="text-sm text-retro-gray leading-relaxed font-sans">
                  Số hóa và trực quan hóa các văn kiện, số liệu khô khan thành sản phẩm dễ tiếp cận; tái hiện sinh động khát vọng "xé rào" sáng tạo của nhân dân; đồng thời giáo dục lòng yêu nước và bài học "nhìn thẳng vào sự thật" để đổi mới.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CORE HISTORICAL SECTIONS CONTAINER */}
      <main id="timeline-section" className="relative py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <h2 className="text-center font-display font-extrabold text-3xl md:text-5xl uppercase text-retro-charcoal tracking-tight mb-4">
          Xây dựng chủ nghĩa xã hội và bảo vệ Tổ quốc (1975-1986)
        </h2>
        <p className="text-center text-retro-gray max-w-xl mx-auto mb-16 text-sm sm:text-base">
          Nhấn để mở rộng chi tiết các mốc lịch sử chính yếu. Các thông tin được thẩm tra 100% dựa trên tài liệu lịch sử Đảng Cộng sản Việt Nam.
        </p>

        {/* TIMELINE CONTAINER STUCK Y-AXIS */}
        <div className="relative">
          {/* Vertical central path line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-retro-red via-retro-orange to-retro-mint transform md:-translate-x-1/2 z-0"></div>

          {/* Render individual Milestones sequentially according to chronology */}
          <div className="space-y-16">
            
            {/* MILESTONE 1 */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              {/* Year indicator left */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:w-1/2 flex justify-start md:justify-end md:pr-12 md:pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-retro-red text-white font-display font-bold text-xl md:text-2xl rounded shadow-[3px_3px_0px_#1e1f22] border-2 border-retro-charcoal select-none">
                    1975 - 1976
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-retro-red border-4 border-retro-cream ring-2 ring-retro-red scale-110 hidden md:block"></span>
                </div>
              </motion.div>

              {/* Box middle content */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="md:w-1/2 pl-4 md:pl-12"
              >
                <div className="bg-white border-2 border-retro-charcoal rounded-xl shadow-[6px_6px_0px_rgba(30,31,34,0.1)] hover:shadow-[6px_6px_0px_rgba(224,62,62,0.15)] transition-all p-6 relative">
                  
                  {/* Clickable Header Area */}
                  <div 
                    onClick={() => toggleMilestone("milestone-1")}
                    className="cursor-pointer select-none group flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Decorative corner paperclip */}
                      <div className="text-xs font-mono text-retro-red flex items-center gap-1 uppercase mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-retro-red"></span>
                        Mốc 1
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-retro-charcoal tracking-tight group-hover:text-retro-red transition-colors">
                        Hoàn thành thống nhất đất nước về mặt nhà nước
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-retro-charcoal bg-retro-cream text-retro-charcoal group-hover:bg-retro-red group-hover:text-white transition-colors shrink-0 mt-4 md:mt-1">
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedMilestones["milestone-1"] ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {expandedMilestones["milestone-1"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-base text-retro-gray leading-relaxed mb-4">
                          Sau năm 1975, Đảng đề ra nhiệm vụ cấp bách là thống nhất hai bộ máy chính quyền khác nhau ở hai miền: Chính phủ Việt Nam Dân chủ Cộng hòa ở Miền Bắc và Chính phủ cách mạng lâm thời Cộng hòa miền Nam Việt Nam ở Miền Nam.
                        </p>

                        <div className="bg-retro-cream p-4 rounded-lg border border-retro-border text-sm text-retro-charcoal leading-relaxed mb-5">
                          <strong>Hội nghị Trung ương 24 khóa III (08/1975):</strong> Đề ra chủ trương đưa cả nước tiến nhanh, tiến mạnh lên chủ nghĩa xã hội; hoàn thành thống nhất nước nhà, chống âm mưu chia rẽ. 
                        </div>

                        {/* INTERACTIVE TAP TRIGGER: BALLOT BOX */}
                        <div className="bg-retro-yellow-light border-2 border-dashed border-retro-yellow rounded-xl p-5 mb-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-retro-yellow border border-retro-charcoal flex items-center justify-center text-retro-charcoal shadow-sm">
                              <Vote className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-base font-display font-semibold text-retro-charcoal">
                                Tiến trình Thống nhất hành chính
                              </h4>
                              <p className="text-xs text-retro-gray uppercase tracking-wider font-mono">
                                Chọn các mốc sự kiện dưới đây để xem tư liệu chính thức
                              </p>
                            </div>
                          </div>

                          {/* Step buttons selector */}
                          <div className="grid grid-cols-5 gap-1 mb-4">
                            {["Mốc I", "Mốc II", "Mốc III", "Mốc IV", "Mốc V"].map((label, idx) => (
                              <button
                                key={label}
                                onClick={() => setActiveBallotStep(idx)}
                                className={`py-1.5 px-1 rounded text-xs font-mono font-bold border transition-all ${
                                  activeBallotStep === idx 
                                    ? "bg-retro-red text-white border-retro-charcoal shadow-sm" 
                                    : "bg-white text-retro-gray border-retro-border hover:bg-amber-50"
                                  }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>

                          {/* Render active ballot step document content */}
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeBallotStep}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="bg-white rounded-lg border border-retro-border p-4 shadow-inner"
                            >
                              <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                                <span className="text-[10px] font-mono font-bold text-retro-red uppercase tracking-wider">
                                  {MILESTONES[0].details?.chronoEvents?.[activeBallotStep].date}
                                </span>
                                <span className="text-[10px] font-mono bg-retro-cream px-1.5 py-0.5 rounded text-retro-gray">
                                  Hồ sơ lưu trữ
                                </span>
                              </div>
                              <h5 className="font-display font-bold text-base text-retro-charcoal mb-1">
                                {MILESTONES[0].details?.chronoEvents?.[activeBallotStep].title}
                              </h5>
                              <p className="text-sm text-retro-gray leading-relaxed whitespace-pre-line">
                                {MILESTONES[0].details?.chronoEvents?.[activeBallotStep].desc}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* MEANING & ACHIEVEMENTS PANEL */}
                        <AnimatePresence>
                          {hasCompletedMilestoneV && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.4 }}
                              className="border-t pt-4 mt-2 overflow-hidden"
                            >
                              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-retro-red mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-retro-mint" />
                                Ý nghĩa thành tựu lịch sử:
                              </h4>
                              <p className="text-sm text-retro-gray leading-relaxed italic">
                                "Hoàn thành thống nhất nước nhà về mặt nhà nước là cơ sở vững chắc để thống nhất đất nước trên tất cả lĩnh vực khác, nhanh chóng tạo ra sức mạnh dân tộc tổng hợp; là điều kiện tiên quyết nhất để đưa cả nước hướng tới thời kỳ quá độ chủ nghĩa xã hội. Điều này chứng minh tư duy phản ứng chính trị nhạy bén của tập thể Đảng."
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            </div>

            {/* MILESTONE 2 */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              
              {/* Box Content - Left on MD */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="md:w-1/2 pr-4 md:pr-12 order-2 md:order-1"
              >
                <div className="bg-white border-2 border-retro-charcoal rounded-xl shadow-[6px_6px_0px_rgba(30,31,34,0.1)] hover:shadow-[6px_6px_0px_rgba(224,62,62,0.15)] transition-all p-6 relative">
                  
                  {/* Clickable Header Area */}
                  <div 
                    onClick={() => toggleMilestone("milestone-2")}
                    className="cursor-pointer select-none group flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Decorative corner tag */}
                      <div className="text-xs font-mono text-retro-red flex items-center gap-1 uppercase mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-retro-red"></span>
                        Mốc 2
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-retro-charcoal tracking-tight group-hover:text-retro-red transition-colors">
                        {MILESTONES[1].title}
                      </h3>
                      {MILESTONES[1].subTitle && (
                        <p className="text-base text-retro-red font-semibold mt-1">
                          {MILESTONES[1].subTitle}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-retro-charcoal bg-retro-cream text-retro-charcoal group-hover:bg-retro-red group-hover:text-white transition-colors shrink-0 mt-4 md:mt-1">
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedMilestones["milestone-2"] ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {expandedMilestones["milestone-2"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-base text-retro-gray leading-relaxed mb-4">
                          {MILESTONES[1].brief}
                        </p>

                        <p className="text-sm text-retro-gray bg-retro-cream border border-retro-border rounded-lg p-3 leading-relaxed mb-5 font-sans">
                          <strong className="text-retro-charcoal font-display">Nội dung cốt lõi:</strong> {MILESTONES[1].content}
                        </p>

                        {/* Highlights section rendering dynamic narrative */}
                        {MILESTONES[1].details?.narrative && (
                          <div className="space-y-3.5 mb-5">
                            <div className="text-xs font-mono text-retro-gray uppercase tracking-wider font-extrabold flex items-center gap-1.5 mb-2">
                              <BookOpen className="w-3.5 h-3.5 text-retro-red" />
                              Định hướng & Quyết sách Đại hội IV:
                            </div>
                            <div className="space-y-3">
                              {MILESTONES[1].details.narrative.split("\n\n").map((para, pIdx) => {
                                if (para.includes("đặc điểm lớn")) {
                                  return (
                                    <div key={pIdx} className="bg-gradient-to-r from-amber-50 to-orange-50/40 p-4 rounded-xl border border-retro-border border-l-4 border-l-retro-red shadow-[4px_4px_0px_rgba(230,57,70,0.06)] text-sm leading-relaxed text-retro-charcoal transition-all">
                                      <strong className="block font-display font-bold text-retro-red mb-2 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                                        <Activity className="w-4 h-4 text-retro-red animate-pulse" />
                                        Ba đặc điểm cách mạng nước ta giai đoạn này:
                                      </strong>
                                      <div className="whitespace-pre-line tracking-wide font-sans text-retro-charcoal font-medium leading-relaxed">
                                        {para}
                                      </div>
                                    </div>
                                  );
                                }
                                
                                const parts = para.split(": ");
                                if (parts.length > 1 && parts[0].length < 35) {
                                  return (
                                    <div key={pIdx} className="p-3.5 rounded-lg bg-orange-50/30 border border-retro-border text-sm">
                                      <strong className="block text-retro-charcoal mb-1 uppercase font-mono text-[11px]">
                                        {parts[0]}:
                                      </strong>
                                      <p className="text-retro-gray leading-relaxed font-sans">{parts.slice(1).join(": ")}</p>
                                    </div>
                                  );
                                }

                                return (
                                  <div key={pIdx} className="p-3.5 rounded-lg bg-retro-cream border border-retro-border text-sm text-retro-gray leading-relaxed font-sans">
                                    {para}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* INTERACTIVE CLICK: REVEAL HISTORICAL LIMITATIONS */}
                        {MILESTONES[1].details?.extraNarrative && (
                          <div className="border border-retro-border rounded-xl overflow-hidden mt-4">
                            <button
                              onClick={() => setShowM2Limitations(!showM2Limitations)}
                              className="w-full text-left bg-orange-100 hover:bg-orange-200 transition-colors px-4 py-3 flex items-center justify-between border-b border-retro-border"
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4.5 h-4.5 text-retro-red" />
                                <span className="text-xs font-mono font-bold tracking-tight text-retro-charcoal uppercase">
                                  ⚠️ Xem các hạn chế mang tính lịch sử (1976)
                                </span>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-retro-gray transition-transform ${showM2Limitations ? "rotate-90" : ""}`} />
                            </button>

                            <AnimatePresence>
                              {showM2Limitations && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden bg-retro-cream text-retro-charcoal border-t border-retro-border"
                                >
                                  <div className="p-4 text-sm font-sans tracking-wide leading-relaxed space-y-2">
                                    {MILESTONES[1].details.extraNarrative.split("\n").map((line, lIdx) => {
                                      if (line.includes("• Nhận thức mô hình:")) {
                                        return (
                                          <p key={lIdx} className="leading-6 flex items-start gap-1">
                                            <span>•</span>
                                            <span>
                                              <span className="text-retro-red font-bold bg-retro-red/10 text-xs px-1.5 py-0.5 rounded border border-retro-red/20 mr-1 shadow-sm font-sans">Nhận thức mô hình:</span>
                                              <span className="text-retro-gray">{line.substring(line.indexOf("Nhận thức mô hình:") + "Nhận thức mô hình:".length)}</span>
                                            </span>
                                          </p>
                                        );
                                      }
                                      if (line.includes("• Mục tiêu và thời gian:")) {
                                        return (
                                          <p key={lIdx} className="leading-6 flex items-start gap-1">
                                            <span>•</span>
                                            <span>
                                              <span className="text-retro-red font-bold bg-retro-red/10 text-xs px-1.5 py-0.5 rounded border border-retro-red/20 mr-1 shadow-sm font-sans">Mục tiêu và thời gian:</span>
                                              <span className="text-retro-gray">{line.substring(line.indexOf("Mục tiêu và thời gian:") + "Mục tiêu và thời gian:".length)}</span>
                                            </span>
                                          </p>
                                        );
                                      }
                                      if (line.includes("• Chỉ tiêu kinh tế:")) {
                                        return (
                                          <p key={lIdx} className="leading-6 flex items-start gap-1">
                                            <span>•</span>
                                            <span>
                                              <span className="text-retro-red font-bold bg-retro-red/10 text-xs px-1.5 py-0.5 rounded border border-retro-red/20 mr-1 shadow-sm font-sans">Chỉ tiêu kinh tế:</span>
                                              <span className="text-retro-gray">{line.substring(line.indexOf("Chỉ tiêu kinh tế:") + "Chỉ tiêu kinh tế:".length)}</span>
                                            </span>
                                          </p>
                                        );
                                      }
                                      return (
                                        <p key={lIdx} className={line.startsWith("⚠️") ? "text-retro-orange font-bold text-xs uppercase tracking-widest pb-1 font-mono" : "text-retro-gray pl-3.5"}>
                                          {line}
                                        </p>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>

              {/* Year indicator right */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:w-1/2 flex justify-start md:pl-12 md:pt-4 order-1 md:order-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-retro-red border-4 border-retro-cream ring-2 ring-retro-red scale-110 hidden md:block"></span>
                  <div className="px-4 py-2 bg-retro-red text-white font-display font-bold text-xl md:text-2xl rounded shadow-[3px_3px_0px_#1e1f22] border-2 border-retro-charcoal select-none">
                    1976
                  </div>
                </div>
              </motion.div>

            </div>

            {/* MILESTONE 3 */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              
              {/* Year indicator left */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:w-1/2 flex justify-start md:justify-end md:pr-12 md:pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-retro-orange text-white font-display font-bold text-xl md:text-2xl rounded shadow-[3px_3px_0px_#1e1f22] border-2 border-retro-charcoal select-none">
                    1979 - 1981
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-retro-orange border-4 border-retro-cream ring-2 ring-retro-orange scale-110 hidden md:block"></span>
                </div>
              </motion.div>

              {/* Box Content - Right */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="md:w-1/2 pl-4 md:pl-12"
              >
                <div className="bg-white border-2 border-retro-charcoal rounded-xl shadow-[6px_6px_0px_rgba(30,31,34,0.1)] hover:shadow-[6px_6px_0px_rgba(255,107,74,0.15)] transition-all p-6 relative">
                  
                  {/* Clickable Header Area */}
                  <div 
                    onClick={() => toggleMilestone("milestone-3")}
                    className="cursor-pointer select-none group flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Decorative corner paperclip */}
                      <div className="text-xs font-mono text-retro-orange flex items-center gap-1 uppercase mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-retro-orange"></span>
                        Mốc 3
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-retro-charcoal tracking-tight group-hover:text-retro-orange transition-colors">
                        Những bước đột phá kinh tế đầu tiên
                      </h3>
                      <p className="text-base text-retro-orange font-semibold mt-1">
                        Thử nghiệm vượt rào và khởi đầu tháo gỡ rào cản hành chính
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-retro-charcoal bg-retro-cream text-retro-charcoal group-hover:bg-retro-orange group-hover:text-white transition-colors shrink-0 mt-4 md:mt-1">
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedMilestones["milestone-3"] ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {expandedMilestones["milestone-3"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-base text-retro-gray leading-relaxed mb-4">
                          Nhận diện khủng hoảng vật tư tiêu dùng trầm trọng, Đảng đã ban hành các chính sách đột khởi nhằm phá vỡ thế bao cấp kìm hãm ở cả nông nghiệp lẫn công nghiệp quốc doanh.
                        </p>

                        {/* INTERACTIVE BREAKTHROUGHS SELECTOR */}
                        <div className="bg-retro-mint-light border-2 border-retro-mint rounded-xl p-4 mb-3">
                          <div className="text-xs font-mono text-retro-mint mb-3 uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-retro-mint" />
                            3 Quyết định đột phá nông - công nghiệp
                          </div>

                          {/* Tab Navigation buttons */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {["1. Hội nghị Trung ương 6", "2. Chỉ thị 100", "3. Quyết định 25&26"].map((label, idx) => (
                              <button
                                key={label}
                                onClick={() => setActiveBreakthroughTab(idx)}
                                className={`px-3 py-1.5 text-xs rounded-lg font-display font-bold border transition-all ${
                                  activeBreakthroughTab === idx
                                    ? "bg-retro-mint text-white border-retro-charcoal shadow-sm"
                                    : "bg-white text-retro-gray border-retro-border hover:bg-emerald-50"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>

                          <AnimatePresence mode="wait">
                            {activeBreakthroughTab === 0 && (
                              <motion.div
                                key="bt-0"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white p-4 rounded-lg border border-retro-border text-sm leading-relaxed"
                              >
                                <div className="font-bold text-retro-charcoal mb-1 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-retro-red/10 text-retro-red font-mono text-[10px]">Tháng 8/1979</span>
                                  Hội nghị Trung ương 6 (Bước đột phá số 1)
                                </div>
                                <p className="text-retro-gray mb-2">
                                  Đề xuất sửa chữa sai lầm quản trị, tháo bỏ dây xích cấm đoán để cho <strong className="text-retro-red">"sản xuất bung ra"</strong> một cách tự nhiên.
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-sm text-retro-gray font-sans">
                                  <li>Miễn thuế toàn bộ cho đất mới khai hoang, phục hóa.</li>
                                  <li>Cho phép người dân hưởng trọn vẹn sản phẩm thừa tự làm ra.</li>
                                  <li>Bắt đầu dỡ bỏ các trạm kiểm soát rườm rà để tự do thông thương.</li>
                                </ul>
                              </motion.div>
                            )}

                            {activeBreakthroughTab === 1 && (
                              <motion.div
                                key="bt-1"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white p-4 rounded-lg border border-retro-border text-sm leading-relaxed"
                              >
                                <div className="font-bold text-retro-charcoal mb-1 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-retro-red/10 text-retro-red font-mono text-[10px]">Tháng 1/1981</span>
                                  Chỉ thị số 100-CT/Trung ương (Khoán mẫu Nông nghiệp)
                                </div>
                                <p className="text-retro-gray mb-2">
                                  Chính thức thừa nhận và nhân rộng hình thức khoán sản phẩm đến nhóm và người lao động (sau hiện tượng <strong className="text-retro-red">"khoán chui"</strong>).
                                </p>
                                <ul className="list-disc pl-4 space-y-1 text-sm text-retro-gray">
                                  <li>Giao khoán sản phẩm trực tiếp đến nhóm và cá nhân người nông dân.</li>
                                  <li>Người dân tự chủ các khâu gieo cấy, trực tiếp chăm sóc và tự gặt thu hoạch.</li>
                                  <li>Hưởng trọn phần việc vượt mức khoán, được mua bán tự do ngoài chợ đen cũ.</li>
                                </ul>
                                <div className="mt-2 text-retro-mint font-bold text-[10px] uppercase">
                                  Kết quả: Thắng lợi to lớn, sản lượng lúa lương thực vọt dốc lịch sử!
                                </div>
                              </motion.div>
                            )}

                            {activeBreakthroughTab === 2 && (
                              <motion.div
                                key="bt-2"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white p-4 rounded-lg border border-retro-border text-sm leading-relaxed"
                              >
                                <div className="font-bold text-retro-charcoal mb-1 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-retro-red/10 text-retro-red font-mono text-[10px]">Tháng 1/1981</span>
                                  Quyết định 25-CP & 26-CP (Quyền chủ động Xí nghiệp)
                                </div>
                                <p className="text-retro-gray mb-3">
                                  • Cho phép các xí nghiệp quốc doanh lớn được tự chủ về hoạt động công nghệ và tài chính.
                                </p>
                                <p className="text-retro-gray leading-relaxed">
                                  • Mở rộng hình thức trả lương khoán, lương sản phẩm và vận dụng hình thức tiền thưởng trong các đơn vị sản xuất kinh doanh của Nhà nước.
                                </p>
                                <div className="mt-2 text-retro-mint font-bold text-[10px] uppercase">
                                  Kết quả: Sản xuất công nghiệp vượt kịch bản dự kiến!
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>

            </div>

            {/* MILESTONE 4 */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              
              {/* Box Content - Left on MD */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="md:w-1/2 pr-4 md:pr-12 order-2 md:order-1"
              >
                <div className="bg-white border-2 border-retro-charcoal rounded-xl shadow-[6px_6px_0px_rgba(30,31,34,0.1)] hover:shadow-[6px_6px_0px_rgba(220,50,49,0.15)] transition-all p-6 relative">
                  
                  {/* Clickable Header Area */}
                  <div 
                    onClick={() => toggleMilestone("milestone-4")}
                    className="cursor-pointer select-none group flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Decorative corner tag */}
                      <div className="text-xs font-mono text-retro-red flex items-center gap-1 uppercase mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-retro-red"></span>
                        Mốc 4
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-retro-charcoal tracking-tight group-hover:text-retro-red transition-colors">
                        {MILESTONES[3].title}
                      </h3>
                      {MILESTONES[3].subTitle && (
                        <p className="text-sm text-retro-red font-semibold mt-1">
                          {MILESTONES[3].subTitle}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-retro-charcoal bg-retro-cream text-retro-charcoal group-hover:bg-retro-red group-hover:text-white transition-colors shrink-0 mt-4 md:mt-1">
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedMilestones["milestone-4"] ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {expandedMilestones["milestone-4"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-base text-retro-gray leading-relaxed mb-4">
                          {MILESTONES[3].brief}
                        </p>

                        <p className="text-sm text-retro-gray bg-retro-cream border border-retro-border rounded-lg p-3 leading-relaxed mb-5 font-sans">
                          <strong className="text-retro-charcoal font-display">Nội dung cốt lõi:</strong> {MILESTONES[3].content}
                        </p>

                        {/* INTERACTIVE BORDER CHOOSE DIALOGUE WITH CUSTOM GRAPHIC */}
                        <div className="bg-white border border-retro-border rounded-xl p-4 shadow-inner">
                          <h4 className="text-sm font-mono font-bold text-retro-gray mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                            <Target className="w-4 h-4 text-retro-red" />
                            {MILESTONES[3].details?.narrative || "Sơ đồ chiến lược quân sự bảo vệ chủ quyền (1978-1979)"}
                          </h4>

                          {/* Highly responsive custom vector graphic that represents Vietnam border selectors */}
                          <div className="relative w-full h-40 bg-retro-cream rounded-lg border border-retro-border mb-4 flex items-center justify-center overflow-hidden">
                            {/* Decorative Compass Rose */}
                            <div className="absolute bottom-2 right-2 text-[9px] font-mono text-retro-gray/50 text-right">
                              <div>VĨ ĐỘ VIỆT NAM</div>
                              <div>1979 BẢO ĐỒ</div>
                            </div>

                            {/* Schematic S-shaped outline via geometric visualizer */}
                            <svg viewBox="0 0 100 100" className="absolute h-36 opacity-30 text-retro-gray/70 filter drop-shadow">
                              <path 
                                d="M48,15 Q55,10 65,15 T50,30 T45,45 T55,60 T60,75 T42,90" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="6" 
                                strokeLinecap="round"
                              />
                              {/* Paracel & Spratly Islands marks */}
                              <circle cx="80" cy="55" r="2" fill="currentColor"/>
                              <circle cx="85" cy="78" r="2" fill="currentColor"/>
                            </svg>

                            {/* Interactive Target Dots on map */}
                            {/* Northern Point */}
                            <button 
                              onClick={() => setActiveBorderArea("phia_bac")}
                              className={`absolute top-5 left-[54%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${activeBorderArea === "phia_bac" ? "bg-retro-red animate-ping" : "bg-retro-red/80"} transition-all`}></div>
                              <div className="w-2 h-2 rounded-full bg-retro-red border border-white absolute"></div>
                              <span className="text-[10px] font-mono font-bold bg-white border border-retro-charcoal px-1 rounded-sm mt-1 whitespace-nowrap shadow-sm group-hover:scale-105 transition-all font-sans">
                                Biên giới Phía Bắc 🏔️
                              </span>
                            </button>

                            {/* Southern Point */}
                            <button 
                              onClick={() => setActiveBorderArea("tay_nam")}
                              className={`absolute bottom-4 left-[38%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${activeBorderArea === "tay_nam" ? "bg-retro-red animate-ping" : "bg-retro-red/80"} transition-all`}></div>
                              <div className="w-2 h-2 rounded-full bg-retro-red border border-white absolute"></div>
                              <span className="text-[10px] font-mono font-bold bg-white border border-retro-charcoal px-1 rounded-sm mt-1 whitespace-nowrap shadow-sm group-hover:scale-105 transition-all font-sans">
                                Biên giới Tây Nam 🛡️
                              </span>
                            </button>
                          </div>

                          {/* Switch layout controller toggles */}
                          <div className="flex gap-2 mb-3">
                            <button
                              onClick={() => setActiveBorderArea("tay_nam")}
                              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-display font-medium border flex items-center justify-center gap-1.5 transition-all ${
                                activeBorderArea === "tay_nam"
                                  ? "bg-retro-red text-white border-retro-charcoal shadow-sm font-semibold"
                                  : "bg-retro-cream text-retro-charcoal border-retro-border hover:bg-red-50/50"
                              }`}
                            >
                              <Shield className="w-3.5 h-3.5" />
                              Giữ Biên Tây Nam (12/1978)
                            </button>

                            <button
                              onClick={() => setActiveBorderArea("phia_bac")}
                              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-display font-medium border flex items-center justify-center gap-1.5 transition-all ${
                                activeBorderArea === "phia_bac"
                                  ? "bg-retro-red text-white border-retro-charcoal shadow-sm font-semibold"
                                  : "bg-retro-cream text-retro-charcoal border-retro-border hover:bg-red-50/50"
                              }`}
                            >
                              <Shield className="w-3.5 h-3.5" />
                              Giữ Biên Phía Bắc (02/1979)
                            </button>
                          </div>

                          {/* Explanatory content dynamic card */}
                          <AnimatePresence mode="wait">
                            {activeBorderArea === "tay_nam" && (() => {
                              const pointText = MILESTONES[3].details?.points?.[0] || "";
                              const colonIdx = pointText.indexOf(":");
                              const label = colonIdx > -1 ? pointText.substring(0, colonIdx) : "Bảo vệ biên giới phía Tây Nam";
                              const body = colonIdx > -1 ? pointText.substring(colonIdx + 1).trim() : pointText;

                              const highlightBody = (text: string) => {
                                const wordsToHighlight = [
                                  "Từ tháng 4/1975",
                                  "Pôn Pốt",
                                  "diệt chủng",
                                  "ngày 26/12/1978",
                                  "giải phóng thủ đô Phnôm Pênh vào ngày 07/01/1979",
                                  "ngày 07/01/1979",
                                  "Ngày 18/02/1979"
                                ];
                                return (
                                  <div className="leading-relaxed font-sans text-retro-charcoal whitespace-pre-line text-sm">
                                    {text.split(/(Từ tháng 4\/1975|Từ tháng 4-1975|Pôn Pốt|diệt chủng|ngày 26\/12\/1978|ngày 07\/01\/1979|Ngày 18\/02\/1979)/).map((part, i) => {
                                      if (wordsToHighlight.includes(part)) {
                                        return <strong key={i} className="text-retro-red font-semibold">{part}</strong>;
                                      }
                                      return part;
                                    })}
                                  </div>
                                );
                              };

                              return (
                                <motion.div
                                  key="border-sw"
                                  initial={{ opacity: 0, scale: 0.98 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="bg-retro-cream p-4 rounded-lg border border-retro-border text-sm"
                                >
                                  <div className="flex items-center gap-1.5 text-retro-red font-bold mb-2 font-display text-sm uppercase tracking-wide">
                                    <span>🛡️</span> {label}
                                  </div>
                                  <div className="text-retro-charcoal leading-relaxed font-sans">
                                    {highlightBody(body)}
                                  </div>
                                </motion.div>
                              );
                            })()}

                            {activeBorderArea === "phia_bac" && (() => {
                              const pointText = MILESTONES[3].details?.points?.[1] || "";
                              const colonIdx = pointText.indexOf(":");
                              const label = colonIdx > -1 ? pointText.substring(0, colonIdx) : "Bảo vệ biên giới phía Bắc (Tây Bắc)";
                              const body = colonIdx > -1 ? pointText.substring(colonIdx + 1).trim() : pointText;

                              const highlightBody = (text: string) => {
                                const wordsToHighlight = [
                                  "Ngày 17/02/1979",
                                  "hơn 60 vạn quân",
                                  "ngày 18/03/1979"
                                ];
                                return (
                                  <div className="leading-relaxed font-sans text-retro-charcoal whitespace-pre-line text-sm">
                                    {text.split(/(Ngày 17\/02\/1979|hơn 60 vạn quân|ngày 18\/03\/1979)/).map((part, i) => {
                                      if (wordsToHighlight.includes(part)) {
                                        return <strong key={i} className="text-retro-red font-semibold">{part}</strong>;
                                      }
                                      return part;
                                    })}
                                  </div>
                                );
                              };

                              return (
                                <motion.div
                                  key="border-north"
                                  initial={{ opacity: 0, scale: 0.98 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="bg-retro-cream p-4 rounded-lg border border-retro-border text-sm"
                                >
                                  <div className="flex items-center gap-1.5 text-retro-red font-bold mb-2 font-display text-sm uppercase tracking-wide">
                                    <span>🏔️</span> {label}
                                  </div>
                                  <div className="text-retro-charcoal leading-relaxed font-sans">
                                    {highlightBody(body)}
                                  </div>
                                </motion.div>
                              );
                            })()}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>

              {/* Year indicator right */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:w-1/2 flex justify-start md:pl-12 md:pt-4 order-1 md:order-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-retro-red border-4 border-retro-cream ring-2 ring-retro-red scale-110 hidden md:block"></span>
                  <div className="px-4 py-2 bg-retro-red text-white font-display font-bold text-xl md:text-2xl rounded shadow-[3px_3px_0px_#1e1f22] border-2 border-retro-charcoal select-none">
                    1978 - 1979
                  </div>
                </div>
              </motion.div>

            </div>

            {/* MILESTONE 5 */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              
              {/* Year indicator left */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:w-1/2 flex justify-start md:justify-end md:pr-12 md:pt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 bg-retro-orange text-white font-display font-bold text-xl md:text-2xl rounded shadow-[3px_3px_0px_#1e1f22] border-2 border-retro-charcoal select-none">
                    1982
                  </div>
                  <span className="w-3.5 h-3.5 rounded-full bg-retro-orange border-4 border-retro-cream ring-2 ring-retro-orange scale-110 hidden md:block"></span>
                </div>
              </motion.div>

              {/* Box Content - Right */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="md:w-1/2 pl-4 md:pl-12"
              >
                <div className="bg-white border-2 border-retro-charcoal rounded-xl shadow-[6px_6px_0px_rgba(30,31,34,0.1)] hover:shadow-[6px_6px_0px_rgba(255,107,74,0.15)] transition-all p-6 relative">
                  
                  {/* Clickable Header Area */}
                  <div 
                    onClick={() => toggleMilestone("milestone-5")}
                    className="cursor-pointer select-none group flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Decorative corner tag */}
                      <div className="text-xs font-mono text-retro-orange flex items-center gap-1 uppercase mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-retro-orange"></span>
                        Mốc 5
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-retro-charcoal tracking-tight group-hover:text-retro-orange transition-colors">
                        Đại hội đại biểu toàn quốc lần thứ V của Đảng
                      </h3>

                      <p className="text-base text-retro-orange font-semibold mt-1">
                        {MILESTONES[4].subTitle}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-retro-charcoal bg-retro-cream text-retro-charcoal group-hover:bg-retro-orange group-hover:text-white transition-colors shrink-0 mt-4 md:mt-1">
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedMilestones["milestone-5"] ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {expandedMilestones["milestone-5"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 mb-5">
                          <div className="p-4 bg-retro-cream border border-retro-border rounded-lg text-sm leading-relaxed space-y-3 font-sans text-retro-charcoal">
                            <p className="font-bold text-base text-retro-orange border-b border-retro-border pb-1.5 font-display mb-1">
                              Đại hội V đã bổ sung đường lối chung do Đại hội IV đề ra những quan điểm mới:
                            </p>
                            <ul className="space-y-2 list-none pl-0">
                              <li className="flex items-start gap-2">
                                <span className="text-retro-charcoal mt-1">•</span>
                                <span>Khẳng định nước ta đang ở chặng đường đầu tiên của thời kỳ quá độ lên chủ nghĩa xã hội với những khó khăn về kinh tế, chính trị, văn hóa, xã hội.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-retro-charcoal mt-1">•</span>
                                <span>Nhiệm vụ của chặng đường trước mắt là ổn định tiến lên cải thiện một bước đời sống vật chất và văn hóa của nhân dân.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-retro-charcoal mt-1">•</span>
                                <span>Tiếp tục xây dựng cơ sở vật chất-kỹ thuật của chủ nghĩa xã hội, chủ yếu nhằm thúc đẩy sản xuất nông nghiệp, hàng tiêu dùng và xuất khẩu.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-retro-charcoal mt-1">•</span>
                                <span>Đáp ứng nhu cầu của công cuộc phòng thủ đất nước, củng cố quốc phòng, giữ vững an ninh, trật tự xã hội.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-retro-charcoal mt-1">•</span>
                                <span>Đại hội V thông qua các nhiệm vụ về kinh tế, văn hóa, xã hội, đối ngoại và quyết định xây dựng Đảng vững mạnh toàn diện, nâng cao sức chiến đấu và gắn bó với nhân dân.</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-retro-charcoal mt-1">•</span>
                                <span>Đại hội V đã có những bước phát triển nhận thức mới, tìm tòi đổi mới trong bước quá độ lên chủ nghĩa xã hội, trước hết là về mặt kinh tế.</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* INTERACTIVE COMPONENT: COLLAPSE BLOCKS OF BARRIER LIMITATIONS */}
                        <div className="border border-retro-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => setShowM5Limitations(!showM5Limitations)}
                            className="w-full text-left bg-orange-100 hover:bg-orange-200 transition-colors px-4 py-3 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4.5 h-4.5 text-retro-red animate-pulse" />
                              <span className="text-sm font-mono font-bold tracking-tight text-retro-charcoal uppercase">
                                4 Hạn chế cơ chế cần đập vỡ (Đại hội V)
                              </span>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-retro-gray transition-transform ${showM5Limitations ? "rotate-90" : ""}`} />
                          </button>

                          <AnimatePresence>
                            {showM5Limitations && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-retro-cream text-retro-charcoal border-t border-retro-border"
                              >
                                <div className="p-4 text-sm font-sans select-none space-y-3">
                                  <div className="flex gap-2.5 items-start">
                                    <span className="text-retro-orange font-bold font-mono">1.</span>
                                    <div className="text-retro-gray leading-relaxed">Chưa thấy hết sự cần thiết duy trì nền kinh tế nhiều thành phần; chưa xác định rõ việc kết hợp kế hoạch hóa với tôn trọng cơ chế thị trường.</div>
                                  </div>
                                  <div className="flex gap-2.5 items-start pt-2 border-t border-retro-border">
                                    <span className="text-retro-orange font-bold font-mono">2.</span>
                                    <div className="text-retro-gray leading-relaxed">Chủ trương còn nóng vội, muốn hoàn thành nhanh cải tạo xã hội chủ nghĩa ở miền Nam chỉ trong thời gian 5 năm ngắn.</div>
                                  </div>
                                  <div className="flex gap-2.5 items-start pt-2 border-t border-retro-border">
                                    <span className="text-retro-orange font-bold font-mono">3.</span>
                                    <div className="text-retro-gray leading-relaxed">Tiếp tục rót vốn quốc gia tràn lan thâm hụt vào công nghiệp nặng xây dựng to lớn mà chưa hoạt động hiệu quả.</div>
                                  </div>
                                  <div className="flex gap-2.5 items-start pt-2 border-t border-retro-border">
                                    <span className="text-retro-orange font-bold font-mono">4.</span>
                                    <div className="text-retro-gray leading-relaxed">Không quyết đoán chuyển dứt khoát nhiều vốn vật tư để ưu ái phát triển cho nông nghiệp cả nước và sản xuất công nghiệp hàng tiêu dùng.</div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>

            </div>

            {/* MILESTONE 6 */}
            <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
              
              {/* Box Content - Left */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="md:w-1/2 pr-4 md:pr-12 order-2 md:order-1"
              >
                <div className="bg-white border-2 border-retro-charcoal rounded-xl shadow-[6px_6px_0px_rgba(30,31,34,0.1)] hover:shadow-[6px_6px_0px_rgba(16,185,129,0.15)] transition-all p-6 relative">
                  
                  {/* Clickable Header Area */}
                  <div 
                    onClick={() => toggleMilestone("milestone-6")}
                    className="cursor-pointer select-none group flex items-start justify-between gap-4"
                  >
                    <div className="flex-1">
                      {/* Decorative corner tag */}
                      <div className="text-xs font-mono text-retro-mint flex items-center gap-1 uppercase mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-retro-mint"></span>
                        Mốc 6
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-retro-charcoal tracking-tight group-hover:text-retro-mint transition-colors">
                        Quá trình cụ thể hóa đổi mới qua các Hội nghị Trung ương
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-retro-charcoal bg-retro-cream text-retro-charcoal group-hover:bg-retro-mint group-hover:text-white transition-colors shrink-0 mt-2">
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${expandedMilestones["milestone-6"] ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Collapsible Content */}
                  <AnimatePresence initial={false}>
                    {expandedMilestones["milestone-6"] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-base text-retro-gray leading-relaxed mb-4">
                          Giai đoạn trước thềm Đại hội VI, Đảng tổ chức nhiều hội nghị bàn thảo quyết định gỡ nghẽn mạch máu lưu thông phân phối của cơ chế bao cấp rườm rà.
                        </p>

                        {/* GRID TABLE DETAILED */}
                        <div className="overflow-x-auto border border-retro-border rounded-lg mb-4 text-sm">
                          <table className="w-full text-left font-sans border-collapse">
                            <thead>
                              <tr className="bg-retro-cream border-b border-retro-border font-bold text-retro-charcoal">
                                <th className="p-2 border-r border-retro-border font-display">Hội nghị Trung ương</th>
                                <th className="p-2 border-r border-retro-border">Nội dung chính</th>
                                <th className="p-2">Giải pháp áp dụng</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-retro-border text-sm text-retro-gray">
                              <tr>
                                <td className="p-2 border-r border-retro-border font-medium text-retro-charcoal">Hội nghị Trung ương 6 (07/1984)</td>
                                <td className="p-2 border-r border-retro-border">Giải quyết cấp bách phân phối lưu thông.</td>
                                <td className="p-2">Điều chỉnh biểu giá lương thực, gia tăng thu mua hàng ngoài luồng, kiểm soát tự do thương mại.</td>
                              </tr>
                              <tr>
                                <td className="p-2 border-r border-retro-border font-medium text-retro-charcoal">Hội nghị Trung ương 7 (12/1984)</td>
                                <td className="p-2 border-r border-retro-border">Xác định mặt trận số một hàng đầu.</td>
                                <td className="p-2">Tập trung tuyệt đối cơ sở vật chất lấy nông nghiệp (lương thực, thực phẩm) làm trọng tâm sinh hoạt.</td>
                              </tr>
                              <tr>
                                <td className="p-2 border-r border-retro-border font-medium text-retro-charcoal">Hội nghị Trung ương 8 (06/1985)</td>
                                <td className="p-2 border-r border-retro-border">Xóa bỏ bao cấp trong Giá - Lương - Tiền.</td>
                                <td className="p-2 font-semibold text-retro-red">Hủy bỏ cơ chế bao cấp tiêu chuẩn, chuyển dứt khoát sang hạch toán kinh doanh XHCN.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* INTERACTIVE COUPON BOOK GRAPHIC */}
                        <div className="bg-amber-50 border-2 border-retro-border rounded-xl p-4 mb-4 relative overflow-hidden">
                          <div className="absolute -top-3 -right-3 w-16 h-16 border-4 border-retro-red rounded-full flex items-center justify-center font-display font-black text-retro-red text-xs uppercase tracking-tight transform rotate-12 select-none pointer-events-none">
                            XÓA BỎ
                          </div>

                          <div className="flex items-start gap-3.5">
                            <div className="p-2 bg-retro-cream border border-retro-border rounded flex flex-col items-center select-none shadow animate-wiggle">
                              <span className="text-[10px] font-mono font-bold text-red-600 border-b w-full text-center uppercase">1985</span>
                              <div className="text-2xl">🎫</div>
                              <span className="text-[9px] font-mono text-gray-500 font-bold">TEM PHIẾU</span>
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="text-sm font-display font-bold text-retro-charcoal uppercase flex items-center gap-1">
                                Chủ trương xóa quan liêu bao cấp trong giá và lương
                              </h4>
                            </div>
                          </div>

                          <button
                            onClick={() => setCouponDecongested(!couponDecongested)}
                            className={`w-full py-2 px-3 rounded text-sm font-display font-medium border flex items-center justify-center gap-2 transition-all mt-3 ${
                              couponDecongested 
                                ? "bg-retro-mint text-white border-retro-charcoal shadow-sm font-semibold"
                                : "bg-retro-orange text-white border-retro-charcoal hover:bg-orange-500 shadow-sm"
                            }`}
                          >
                            {couponDecongested ? "Hủy kích hoạt" : "Đọc sắc lệnh cải cách chế độ tem phiếu"}
                            <BookOpen className="w-4 h-4" />
                          </button>

                          <AnimatePresence>
                            {couponDecongested && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 bg-white border border-retro-border rounded-lg p-3.5 space-y-2 text-sm text-retro-charcoal font-sans"
                              >
                                <div className="flex items-start gap-1.5">
                                  <span className="text-retro-red font-bold">✓</span>
                                  <span>Tính đủ chi phí hợp lý trong giá thành sản phẩm.</span>
                                </div>
                                <div className="flex items-start gap-1.5 pt-1.5 border-t border-dashed border-retro-border">
                                  <span className="text-retro-red font-bold">✓</span>
                                  <span>Giá cả bảo đảm bù đắp chi phí thực tế hợp lý, người sản xuất có lợi nhuận thỏa đáng và Nhà nước từng bước có tích lũy.</span>
                                </div>
                                <div className="flex items-start gap-1.5 pt-1.5 border-t border-dashed border-retro-border">
                                  <span className="text-retro-red font-bold">✓</span>
                                  <span>Xóa bỏ tình trạng Nhà nước mua thấp, bán thấp và bù lỗ;</span>
                                </div>
                                <div className="flex items-start gap-1.5 pt-1.5 border-t border-dashed border-retro-border">
                                  <span className="text-retro-red font-bold">✓</span>
                                  <span>Thực hiện cơ chế một giá trong toàn bộ hệ thống,</span>
                                </div>
                                <div className="flex items-start gap-1.5 pt-1.5 border-t border-dashed border-retro-border">
                                  <span className="text-retro-red font-bold">✓</span>
                                  <span>Thực hiện trả lương bằng tiền có hàng hóa bảo đảm,</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* HEROIC QUOTE: POLITBURO AUGUST 1986 */}
                        <div className="bg-retro-red/5 border-l-4 border-retro-red p-4 rounded-r-lg">
                          <h4 className="text-sm font-mono font-bold uppercase text-retro-red mb-1.5 flex items-center gap-1">
                            <span>💥</span> Hội nghị Bộ Chính trị (08/1986) - Đỉnh cao tự phê bình:
                          </h4>
                          <div className="space-y-2 text-sm text-retro-charcoal font-medium leading-relaxed font-sans font-sans">
                            <div>• <strong>Về cơ cấu sản xuất:</strong> chúng ta đã chủ quan, nóng vội đề ra một số chủ trương quá lớn về quy mô, quá cao về nhịp độ xây dựng cơ bản và phát triển sản xuất.</div>
                            <div>• <strong>Về cải tạo xã hội chủ nghĩa:</strong> chúng ta đã phạm nhiều khuyết điểm trong cải tạo xã hội chủ nghĩa.</div>
                            <div>• <strong>Về cơ chế quản lý kinh tế:</strong> cần bố trí lại cơ cấu kinh tế phải đi đôi với đổi mới cơ chế quản lý kinh tế, làm cho hai mặt ăn khớp với nhau tạo ra động lực mới thúc đẩy sản xuất phát triển.</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>

              {/* Year indicator right */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:w-1/2 flex justify-start md:pl-12 md:pt-4 order-1 md:order-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-retro-mint border-4 border-retro-cream ring-2 ring-retro-mint scale-110 hidden md:block"></span>
                  <div className="px-4 py-2 bg-retro-mint text-white font-display font-bold text-xl md:text-2xl rounded shadow-[3px_3px_0px_#1e1f22] border-2 border-retro-charcoal select-none">
                    1984 - 1986
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </main>

      {/* GAME ASSESSMENT SECTION / TẦNG 4A */}
      <section className="bg-retro-cream border-t-4 border-b-2 border-retro-charcoal py-16 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          
          <div className="text-center mb-10">
            <span className="px-3 py-1 bg-retro-yellow text-retro-charcoal font-mono text-xs font-bold uppercase tracking-widest border border-retro-charcoal rounded-full shadow-sm">
              Hoạt Động Tương Tác 01 🕹️
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase mt-3 tracking-tight text-retro-charcoal">
              Trò Chơi Duyệt Chính Sách Kinh Tế
            </h2>
            <p className="text-sm text-retro-gray max-w-xl mx-auto mt-2">
              Kéo thả hoặc lựa chọn nhanh các tấm thẻ chính sách kinh tế vào đúng hai tủ rương [Bao Cấp] hoặc [Hạch Toán Mới] để đột phá nhận thức tư duy đổi mới.
            </p>
          </div>

          {/* FIRST INTERACTION: SORTING GAME */}
          <div className="bg-white border-2 border-retro-charcoal rounded-2xl p-6 shadow-[5px_5px_0px_#1e1f22] relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-retro-yellow font-mono text-[9px] font-bold text-retro-charcoal border-l border-b border-retro-charcoal rounded-bl-lg uppercase tracking-wider">
              Trực quan hóa tư duy
            </div>

            <h3 className="text-lg md:text-xl font-display font-extrabold text-retro-charcoal uppercase mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-retro-yellow" />
              Duyệt chính sách kinh tế
            </h3>
            <p className="text-xs text-retro-gray mb-4 font-sans leading-relaxed">
              <strong>Nhiệm vụ:</strong> Kéo các tấm thẻ chính sách kinh tế vào hai chiếc rương chứa <strong className="text-retro-red">[ Bao Cấp ]</strong> hoặc <strong className="text-retro-mint">[ Hạch Toán Mới ]</strong> sao cho thích hợp nhất. 
              <span className="block mt-1 italic text-[11px] text-retro-orange font-mono">
                *Lời khuyên: Bạn có thể nhấn trực tiếp các nút trên thẻ trên điện thoại!
              </span>
            </p>

            {/* Chest drops zones visual */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              
              {/* OLD SUBSIDY CHEST */}
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "bao_cap")}
                className="bg-red-50/50 border-2 border-dashed border-retro-red rounded-xl p-4 flex flex-col items-center justify-between text-center min-h-[140px] transition-all hover:bg-red-50 relative"
              >
                <div className="text-2xl select-none">📦</div>
                <h4 className="text-sm font-display font-black text-retro-red uppercase tracking-tight mt-1.5">
                  Cơ Chế Bao Cấp Cũ
                </h4>
                <div className="text-xs font-mono text-retro-gray mt-1 uppercase font-semibold">
                  Đặt tại đây
                </div>

                {/* Render already sorted items inside chest */}
                <div className="w-full mt-3 space-y-1">
                  {DRAG_ITEMS.filter(item => sortedCards[item.id] === "bao_cap").map(item => (
                    <div key={item.id} className="bg-white border border-retro-red rounded py-1 px-1.5 text-xs text-retro-red font-mono flex items-center justify-between">
                      <span className="truncate">{item.text.slice(0, 20)}...</span>
                      <Check className="w-3.5 h-3.5 text-retro-mint shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* NEW INDOOR COMMERCE CHEST */}
              <div 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "hach_toan")}
                className="bg-emerald-50/50 border-2 border-dashed border-retro-mint rounded-xl p-4 flex flex-col items-center justify-between text-center min-h-[140px] transition-all hover:bg-emerald-50 relative"
              >
                <div className="text-2xl select-none">🪙</div>
                <h4 className="text-sm font-display font-black text-retro-mint uppercase tracking-tight mt-1.5">
                  Cơ Chế Hạch Toán Mới
                </h4>
                <div className="text-xs font-mono text-retro-gray mt-1 uppercase font-semibold">
                  Đặt tại đây
                </div>

                {/* Render already sorted items inside chest */}
                <div className="w-full mt-3 space-y-1">
                  {DRAG_ITEMS.filter(item => sortedCards[item.id] === "hach_toan").map(item => (
                    <div key={item.id} className="bg-white border border-retro-mint rounded py-1 px-1.5 text-xs text-retro-mint font-mono flex items-center justify-between">
                      <span className="truncate">{item.text.slice(0, 20)}...</span>
                      <Check className="w-3.5 h-3.5 text-retro-mint shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Policy cards stack visual */}
            <div className="space-y-3.5">
              {gameFinished ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-retro-mint bg-opacity-10 rounded-xl p-5 text-center border-2 border-retro-mint text-retro-mint mb-2"
                >
                  <Award className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                  <h4 className="font-display font-extrabold text-base uppercase">Thắng lợi vẻ vang! 🎉</h4>
                  <p className="text-sm text-retro-charcoal mt-1.5 leading-relaxed">
                    Bạn đã sắp đặt chuẩn xác 100% các tư duy chính sách trước thềm đổi mới! Từ đó mở toang cơ chế kìm kẹp phát triển đất nước.
                  </p>
                  <button 
                    onClick={resetGame}
                    className="mt-4 px-5 py-2.5 bg-retro-mint hover:bg-emerald-600 font-display font-bold text-sm text-white rounded border border-retro-charcoal transition-all inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Chơi Lại Từ Đầu
                  </button>
                </motion.div>
              ) : (
                <div>
                  <div className="text-xs font-mono text-retro-gray mb-2 uppercase tracking-wide font-bold">
                    Thẻ bày sẵn ({DRAG_ITEMS.filter(item => !sortedCards[item.id]).length} thẻ còn lại):
                  </div>
                  
                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                    <AnimatePresence mode="popLayout">
                      {DRAG_ITEMS.filter(item => !sortedCards[item.id]).map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: -20 }}
                          transition={{ duration: 0.25 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          className={`bg-retro-cream border-2 border-retro-charcoal rounded-lg p-3.5 cursor-grab active:cursor-grabbing transition-transform select-none relative ${
                            wrongFeedbackId === item.id ? "animate-shake bg-red-100 border-retro-red" : "hover:scale-[1.01]"
                          }`}
                        >
                          <div className="text-sm font-medium text-retro-charcoal pr-8 leading-relaxed">
                            {item.text}
                          </div>
                          
                          {/* Display wrong warning badge */}
                          {wrongFeedbackId === item.id && (
                            <div className="absolute top-2 right-2 text-xs font-mono font-bold text-retro-red uppercase animate-pulse">
                              Sai rương! ❌
                            </div>
                          )}

                          {/* Instant responsive button helpers for touch platforms / easy click experience */}
                          <div className="flex flex-wrap gap-2.5 mt-3.5 pt-3 border-t border-dashed border-retro-border">
                            <span className="text-xs font-mono text-retro-gray my-auto hidden sm:block">Lựa chọn nhanh:</span>
                            <button
                              onClick={() => sortCard(item.id, "bao_cap")}
                              className="px-2.5 py-1.5 rounded bg-red-100 hover:bg-red-200 text-retro-red text-xs font-mono font-bold border border-retro-charcoal/20 transition-transform active:scale-95 z-10 relative"
                            >
                              ← Chọn Bao Cấp
                            </button>
                            <button
                              onClick={() => sortCard(item.id, "hach_toan")}
                              className="px-2.5 py-1.5 rounded bg-emerald-100 hover:bg-emerald-200 text-retro-mint text-xs font-mono font-bold border border-retro-charcoal/20 transition-transform active:scale-95 z-10 relative"
                            >
                              Chọn Hạch Toán →
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

          </div>

        </motion.div>
      </section>

      {/* QUIZ ASSESSMENT SECTION / TẦNG 4B */}
      <section className="bg-retro-cream border-t-2 border-b-4 border-retro-charcoal py-16 px-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          
          <div className="text-center mb-10">
            <span className="px-3 py-1 bg-retro-orange text-white font-mono text-xs font-bold uppercase tracking-widest border border-retro-charcoal rounded-full shadow-sm">
              Hoạt Động Tương Tác 02 📝
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold uppercase mt-3 tracking-tight text-retro-charcoal">
              Khảo Sát Nhận Thức Sử Học
            </h2>
            <p className="text-sm text-retro-gray max-w-xl mx-auto mt-2">
              Ôn luyện các mốc thời điểm, nghị quyết then chốt trong chặng đường dựng nước qua bài kiểm tra lịch sử Đảng.
            </p>
          </div>

          {/* SECOND INTERACTION: QUIZ */}
          <div className="bg-white border-2 border-retro-charcoal rounded-2xl p-6 shadow-[5px_5px_0px_#1e1f22] relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-retro-orange font-mono text-[9px] font-bold text-white border-l border-b border-retro-charcoal rounded-bl-lg uppercase tracking-wider">
              Trắc nghiệm nhanh
            </div>

            <h3 className="text-lg md:text-xl font-display font-extrabold text-retro-charcoal uppercase mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-retro-orange" />
              Khảo sát nhận thức sử học
            </h3>
            
            {!quizCompleted ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuizIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <span className="text-xs font-mono font-bold text-retro-gray uppercase">
                      Câu hỏi {currentQuizIdx + 1} / {QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-xs font-mono bg-retro-cream px-2 py-0.5 rounded text-retro-orange font-bold">
                      Điểm: {quizCumulativeScore}
                    </span>
                  </div>

                  <h4 className="text-sm md:text-base font-display font-bold text-retro-charcoal leading-snug mb-4">
                    {QUIZ_QUESTIONS[currentQuizIdx].question}
                  </h4>

                  {/* Render Options list */}
                  <div className="space-y-2.5 mb-5">
                    {QUIZ_QUESTIONS[currentQuizIdx].options.map((option, idx) => {
                      let btnStyle = "bg-retro-cream hover:bg-amber-50 text-retro-charcoal border-retro-border";
                      
                      if (quizSelectedOption === idx && !quizSubmitted) {
                        btnStyle = "bg-orange-50 border-retro-orange text-retro-charcoal";
                      } else if (quizSubmitted) {
                        if (idx === QUIZ_QUESTIONS[currentQuizIdx].correctAnswer) {
                          btnStyle = "bg-emerald-100 border-retro-mint text-emerald-800 font-bold";
                        } else if (quizSelectedOption === idx) {
                          btnStyle = "bg-red-100 border-retro-red text-red-800";
                        } else {
                          btnStyle = "bg-slate-50 text-slate-400 border-slate-200 opacity-60";
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizOptionClick(idx)}
                          whileHover={!quizSubmitted ? { scale: 1.01, x: 4 } : {}}
                          whileTap={!quizSubmitted ? { scale: 0.99 } : {}}
                          className={`w-full text-left p-3.5 rounded-lg text-sm font-sans tracking-tight border-2 transition-all flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5.5 h-5.5 rounded bg-white shadow-sm border text-xs font-bold flex items-center justify-center shrink-0 font-mono text-retro-charcoal">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{option}</span>
                          
                          {quizSubmitted && idx === QUIZ_QUESTIONS[currentQuizIdx].correctAnswer && (
                            <Check className="w-4.5 h-4.5 text-retro-mint shrink-0 my-auto" />
                          )}
                          {quizSubmitted && quizSelectedOption === idx && idx !== QUIZ_QUESTIONS[currentQuizIdx].correctAnswer && (
                            <X className="w-4.5 h-4.5 text-retro-red shrink-0 my-auto" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Submit actions & explanation */}
                  <div className="space-y-4">
                    {!quizSubmitted ? (
                      <button
                        onClick={submitQuizAnswer}
                        disabled={quizSelectedOption === null}
                        className={`w-full py-3.5 bg-retro-orange hover:bg-orange-500 font-display font-bold text-sm uppercase tracking-wider text-white rounded-lg border-2 border-retro-charcoal shadow-[3px_3px_0px_#1e1f22] transition-all flex items-center justify-center gap-1.5 ${
                          quizSelectedOption === null ? "opacity-50 cursor-not-allowed" : "active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1e1f22]"
                        }`}
                      >
                        Xác nhận câu trả lời
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </button>
                    ) : (
                      <div className="space-y-3.5">
                        {/* Explanation block */}
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-retro-cream p-4 rounded-lg border border-retro-border text-sm leading-relaxed"
                        >
                          <div className="font-mono font-bold text-xs uppercase text-retro-orange mb-1.5 flex items-center gap-1">
                            <Info className="w-4 h-4 text-retro-orange" />
                            Giải thích lịch sử Đảng:
                          </div>
                          <p className="text-retro-gray">{QUIZ_QUESTIONS[currentQuizIdx].explanation}</p>
                        </motion.div>

                        <button
                          onClick={nextQuizQuestion}
                          className="w-full py-3.5 bg-retro-charcoal hover:bg-retro-gray font-display font-bold text-sm uppercase tracking-wider text-white rounded-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          Tiếp theo
                          <ChevronRight className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 select-none"
              >
                <Award className="w-16 h-16 mx-auto mb-2 text-retro-yellow animate-bounce" />
                <h4 className="font-display font-bold text-lg uppercase tracking-tight text-retro-charcoal">
                  Hoàn thành bài kiểm tra lịch sử
                </h4>
                
                <div className="text-5xl font-display font-extrabold text-retro-red my-4">
                  {quizCumulativeScore} / {QUIZ_QUESTIONS.length}
                </div>

                <p className="text-sm text-retro-gray max-w-xs mx-auto leading-relaxed mb-6">
                  {quizCumulativeScore === QUIZ_QUESTIONS.length 
                    ? "Xuất sắc! Bạn đã có nhận thức lịch sử vô cùng tường tận, am hiểu sâu sắc mốc chuyển mình kinh tế nước nhà!"
                    : "Khá tốt! Bạn đã thu nhặt được các mốc thời điểm, nghị quyết quan trọng nhất trong chặng đường dựng nước."}
                </p>

                <button
                  onClick={restartQuiz}
                  className="px-6 py-3 bg-retro-red text-white hover:bg-retro-red-dark font-display font-bold text-sm uppercase rounded border-2 border-retro-charcoal shadow-[3px_3px_0px_#1e1f22] inline-flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-4.5 h-4.5" /> Thử sức lại
                </button>
              </motion.div>
            )}

          </div>

        </motion.div>
      </section>

      {/* DETAILED COORDINATION BOARD (FOOTER SECTION) / TẦNG 5 */}
      <section id="footer-tab" className="bg-retro-cream text-retro-charcoal border-t-4 border-retro-charcoal py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          
          <div className="text-center mb-12">
            <span className="px-3 py-1 bg-retro-charcoal/5 text-retro-orange font-mono text-[10px] font-bold uppercase tracking-widest border border-retro-charcoal/20 rounded-full">
              Thẩm Định Tiêu Chí Phân Cấp 🇻🇳
            </span>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="w-10 h-0.5 bg-retro-charcoal/30"></span>
              <h2 className="text-2xl md:text-4xl font-display font-extrabold uppercase tracking-tight text-retro-charcoal">
                MÔ HÌNH PHỐI HỢP AI & HUMAN
              </h2>
              <span className="w-10 h-0.5 bg-retro-charcoal/30"></span>
            </div>
            <p className="text-sm text-retro-gray mt-2 max-w-xl mx-auto leading-relaxed">
              Minh chứng trực quan về sự cộng tác biên niên sử thông minh giữa trợ lý thiết kế AI và con người (sinh viên kiểm duyệt) để thiết lập công nghệ giáo dục đổi mới.
            </p>
          </div>

          {/* Grid layout containing AI performance and Human audit columns side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-10">
            
            {/* AI ROLE COL */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-retro-charcoal rounded-2xl p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(30,31,34,1)]"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4 border-b border-retro-border pb-4">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-retro-red to-orange-600 text-white font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] border border-white/20 hover:scale-105 transition-all duration-300 select-none shrink-0 group">
                    <Bot className="w-6 h-6 text-white group-hover:rotate-6 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold leading-none text-retro-charcoal text-base">
                      {COLLABORATIVE_TASKS[0].title}
                    </h4>
                    <span className="text-xs font-mono text-retro-orange uppercase font-bold tracking-wider">
                      Trợ lý Kỹ thuật & Sinh mã
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {COLLABORATIVE_TASKS[0].details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-retro-gray leading-relaxed font-sans flex items-start gap-2">
                      <span className="text-retro-red font-bold shrink-0 mt-0.5">⚡</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-retro-border text-xs font-mono text-retro-gray uppercase tracking-widest font-semibold">
                Trạng thái: Hoàn thiện tối ưu 100%
              </div>
            </motion.div>

            {/* HUMAN ROLE COL */}
            <motion.div 
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-2 border-retro-charcoal rounded-2xl p-6 flex flex-col justify-between shadow-[4px_4px_0px_rgba(30,31,34,1)]"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4 border-b border-retro-border pb-4">
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-emerald-600 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] border border-white/20 hover:scale-105 transition-all duration-300 select-none shrink-0 group">
                    <UserCheck className="w-6 h-6 text-white group-hover:-rotate-6 transition-transform" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold leading-none text-retro-charcoal text-base">
                      {COLLABORATIVE_TASKS[1].title}
                    </h4>
                    <span className="text-xs font-mono text-retro-mint uppercase font-bold tracking-wider">
                      Sinh viên làm chủ & Thẩm định
                    </span>
                  </div>
                </div>

                <ul className="space-y-3">
                  {COLLABORATIVE_TASKS[1].details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-retro-gray leading-relaxed font-sans flex items-start gap-2">
                      <span className="text-retro-mint font-bold shrink-0 mt-0.5">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-retro-border text-xs font-mono text-retro-gray uppercase tracking-widest font-semibold">
                Trương kiểm duyệt: Sinh viên hoàn tất kiểm duyệt 100%
              </div>
            </motion.div>

          </div>

          {/* Core metadata credits details / design credentials labels */}
          <div className="border-t border-retro-charcoal/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-retro-gray font-mono gap-4 text-center sm:text-left">
            <div>
              &copy; 1975 - 1986 HÀNH TRÌNH ĐỔI MỚI KINH TẾ VIỆT NAM. 
              <br/>
              Bản ghi giáo khoa lịch sử Đảng phục vụ bảo vệ đồ án và thuyết trình khoa học.
            </div>
            

          </div>

        </motion.div>
      </section>

    </div>
  );
}
