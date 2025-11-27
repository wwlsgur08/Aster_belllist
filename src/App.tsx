import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, Heart, Lightbulb, Brain, Palette, Music, Shield, Sparkles, Star, Check } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import attractionDataImage from 'figma:asset/17ca8ece44f536d43459cf6d99d460ad5cf03382.png';
import perfumeAnimationGif from 'figma:asset/35d6af83563aecc387c93c42f529e2ee74f824c3.png';
import perfumeBottleImage from 'figma:asset/90d745040abd19f97331312b839d2d46fbc46e8c.png';
import asterLogoImage from 'figma:asset/49cfaaaba870f96430af036f6c2b8cb2b4639530.png';

const TOTAL_SCREENS = 6;



export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextScreen = () => {
    if (currentScreen < TOTAL_SCREENS - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentScreen(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevScreen = () => {
    if (currentScreen > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentScreen(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') nextScreen();
    if (e.key === 'ArrowUp') prevScreen();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, isAnimating]);

  // Touch/Swipe handlers for vertical scrolling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe) nextScreen();
    if (isDownSwipe) prevScreen();
  };

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(to bottom, #0f172a, #1e3a8a, #312e81)'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >


      {/* Screen Content */}
      <motion.div
        key={currentScreen}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute inset-0"
      >
        {currentScreen === 0 && <Screen1 onNext={nextScreen} />}
        {currentScreen === 1 && <Screen2 />}
        {currentScreen === 2 && <Screen3 />}
        {currentScreen === 3 && <Screen4 />}
        {currentScreen === 4 && <Screen5 />}
        {currentScreen === 5 && <Screen6 />}
      </motion.div>

      {/* Navigation - 반응형 */}
      <div className="absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-3 md:gap-4 z-20">
        <button
          onClick={prevScreen}
          disabled={currentScreen === 0 || isAnimating}
          className="p-2 md:p-3 bg-blue-900/40 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-all border  " style={{ borderColor: "#22d3ee" }}
        >
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6  " style={{ color: "#67e8f9" }} />
        </button>

        <div className="flex flex-col gap-1.5 md:gap-2">
          {Array.from({ length: TOTAL_SCREENS }).map((_, index) => (
            <motion.div
              key={index}
              className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === currentScreen ? '#22d3ee' : '#475569',
                boxShadow: index === currentScreen ? '0 0 5px #22d3ee' : 'none'
              }}
              animate={index === currentScreen ? {
                boxShadow: ['0 0 5px #22d3ee', '0 0 15px #22d3ee', '0 0 5px #22d3ee']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ))}
        </div>

        <button
          onClick={nextScreen}
          disabled={currentScreen === TOTAL_SCREENS - 1 || isAnimating}
          className="p-2 md:p-3 bg-blue-900/40 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-all border  " style={{ borderColor: "#22d3ee" }}
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6  " style={{ color: "#67e8f9" }} />
        </button>
      </div>

      {/* Progress bar - 별자리 스타일 */}
      <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: "rgba(30, 41, 59, 0.5)" }}>
        <motion.div
          className="h-full relative" style={{ background: "linear-gradient(to right, #22d3ee, #5eead4, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentScreen + 1) / TOTAL_SCREENS) * 100}%` }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"
            animate={{
              boxShadow: ['0 0 5px #22d3ee', '0 0 15px #22d3ee', '0 0 5px #22d3ee']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// Screen 1: 시작 화면 - 반응형
function Screen1({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8">
      {/* 플로팅 별들 - 반응형 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 md:top-20 left-4 md:left-10"
        >
          <Star className="w-6 h-6 md:w-10 md:h-10  " style={{ color: "rgba(103, 232, 249, 0.6)" }} />
        </motion.div>
        <motion.div
          animate={{
            y: [20, 0, 20],
            x: [10, -10, 10],
            rotate: [0, -360, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 md:top-32 right-6 md:right-12"
        >
          <Star className="w-5 h-5 md:w-8 md:h-8  " style={{ color: "rgba(94, 234, 212, 0.5)" }} />
        </motion.div>
        <motion.div
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 md:bottom-32 left-6 md:left-10"
        >
          <Sparkles className="w-4 h-4 md:w-6 md:h-6  " style={{ color: "rgba(34, 211, 238, 0.7)" }} />
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center max-w-lg md:max-w-2xl mb-8 relative z-10"
      >
        {/* 중앙 별자리 일러스트 - 반응형 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 md:mb-10"
        >
          <div className="w-28 h-28 md:w-48 md:h-48 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6 relative shadow-2xl border-2 md:border-4" style={{ borderColor: "#22d3ee", background: "linear-gradient(to right, #3730a3, #1d4ed8)" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-12 h-12 md:w-20 md:h-20  " style={{ color: "#67e8f9" }} />
            </motion.div>

            {/* 주변 별들 - 반응형 */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-2 md:-top-4 -right-2 md:-right-4 w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(to right, #22d3ee, #5eead4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              <Star className="w-4 h-4 md:w-7 md:h-7  " style={{ color: "#312e81" }} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-1.5 md:-bottom-3 -left-1.5 md:-left-3 w-7 h-7 md:w-12 md:h-12 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(to right, #2dd4bf, #67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              <Heart className="w-3.5 h-3.5 md:w-6 md:h-6  " style={{ color: "#312e81" }} />
            </motion.div>
            <motion.div
              animate={{ rotate: 180, scale: [1, 1.15, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-0.5 md:-top-2 -left-3 md:-left-6 w-5 h-5 md:w-9 md:h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(to right, #67e8f9, #2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              <Star className="w-2.5 h-2.5 md:w-4 md:h-4  " style={{ color: "#312e81" }} />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-2xl md:text-5xl mb-4 md:mb-6 bg-clip-text text-transparent" style={{ color: "#ffffff", background: "linear-gradient(to right, #67e8f9, #99f6e4, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          나만의 매력, 향으로 만들다
        </motion.h1>

        <motion.p
          className="mb-6 md:mb-12  text-base md:text-xl" style={{ color: "#cbd5e1" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          별자리처럼 특별한 당신의 향수를 만들어보세요.
        </motion.p>

        {/* Start button - 반응형 */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="hover:from-cyan-300 hover:to-teal-400  px-8 md:px-12 py-3 md:py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-400/25 border  text-base md:text-lg" style={{ borderColor: "#67e8f9", color: "#312e81", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}
        >
          별자리 여행 시작하기
        </motion.button>

        {/* Swipe indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="mt-6 md:mt-10 flex items-center gap-2 justify-center  text-sm md:text-base" style={{ color: "#94a3b8" }}
        >
          <span>아래로 스와이프하세요</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 md:w-6 md:h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Screen 2: 레시피 확인 - 반응형
function Screen2() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg md:max-w-2xl"
      >
        {/* Step indicator - 반응형 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 border text-sm md:text-base"
          style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", borderColor: "#22d3ee", color: "#67e8f9" }}
        >
          <span className="w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm" style={{ color: "#312e81", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}>1</span>
          <span>나만의 별자리 확인하기</span>
        </motion.div>

        <h1 className="text-2xl md:text-4xl mb-3 md:mb-5  " style={{ color: "#ffffff" }}>당신의 매력, 별자리가 되다</h1>

        <p className="mb-6 md:mb-10 text-sm md:text-lg" style={{ color: "#cbd5e1" }}>
          당신의 매력 결과 카드에 나온 <strong className="px-2 py-1 rounded border" style={{ backgroundColor: "rgba(30, 41, 59, 0.5)", borderColor: "#22d3ee", color: "#22d3ee" }}>매력 점수</strong>를 확인하세요.
          <br />이 매력들이 당신만의 별자리를 만듭니다.
        </p>

        {/* Attraction score image - 반응형 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mx-auto mb-6"
        >
          <div className="max-w-xs md:max-w-md mx-auto relative">
            {/* 장식 별들 - 반응형 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-4 md:-top-6 -right-4 md:-right-6"
            >
              <Star className="w-6 h-6 md:w-10 md:h-10  " style={{ color: "rgba(34, 211, 238, 0.6)" }} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-3 md:-bottom-5 -left-3 md:-left-5"
            >
              <Sparkles className="w-5 h-5 md:w-8 md:h-8  " style={{ color: "rgba(45, 212, 191, 0.5)" }} />
            </motion.div>

            <h3 className="font-medium  mb-3 md:mb-4 text-center text-base md:text-xl" style={{ color: "#67e8f9" }}>매력 점수 예시 (본인의 카드를 확인해보세요.)</h3>
            <div className="p-3 md:p-5 rounded-2xl border  shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}>
              <ImageWithFallback
                src={attractionDataImage}
                alt="매력 점수 데이터"
                className="w-full h-auto rounded-xl"
                onError={() => console.log('Image loading error')}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Screen 3: 원액 조합하기 - 반응형 (모바일: 세로, 태블릿: 가로)
function Screen3() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4 md:px-12 py-6 md:py-8 overflow-y-auto">
      <div className="max-w-lg md:max-w-6xl w-full">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12 space-y-6 md:space-y-0">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:flex-1"
          >
            {/* Step indicator - 반응형 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 border text-sm md:text-base"
              style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", borderColor: "#22d3ee", color: "#67e8f9" }}
            >
              <span className="w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm" style={{ color: "#312e81", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}>2</span>
              <span>'별빛'으로 원액 조합하기</span>
            </motion.div>

            <h1 className="text-2xl md:text-4xl mb-3 md:mb-5  " style={{ color: "#ffffff" }}>매력 점수를 통해 향료를 채워주세요</h1>

            <p className="mb-6 md:mb-8  text-sm md:text-lg" style={{ color: "#cbd5e1" }}>
              선택한 매력들의 상위 카테고리에 해당하는 향 원료를 매력의 크기만큼 한 방울씩 넣어주세요.
              <br /><span className=" font-medium bg-slate-800/50 px-2 py-1 rounded border  " style={{ borderColor: "#22d3ee", color: "#22d3ee" }}>(20방울 ≈ 1ml)</span>
            </p>

            {/* Recipe example - 반응형 */}
            <div className="rounded-2xl p-4 md:p-6 border  shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}>
              <h3 className="mb-3 md:mb-5  text-base md:text-xl" style={{ color: "#67e8f9" }}>별자리 레시피:</h3>
              <div className="space-y-3 md:space-y-4">
                {/* 도덕성 및 양심 카테고리 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl p-3 md:p-5 border shadow-sm"
                  style={{ backgroundColor: "rgba(51, 65, 85, 0.5)", borderColor: "rgba(96, 165, 250, 0.3)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: "rgba(59, 130, 246, 0.3)", borderColor: "rgba(96, 165, 250, 0.5)" }}>
                        <Shield className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#93c5fd" }} />
                      </div>
                      <span className="font-medium text-sm md:text-base" style={{ color: "#e2e8f0" }}>도덕성 및 양심</span>
                    </div>
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full border text-sm md:text-base" style={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#22d3ee", color: "#22d3ee" }}>19방울</span>
                  </div>
                  <div className="text-xs md:text-sm pl-9 md:pl-13" style={{ color: "#94a3b8" }}>
                    양심 6+ 정직함 5+ 원칙 준수 3+ 진정성 3+ 약자보호 2
                  </div>
                </motion.div>

                {/* 지적호기심 및 개방성 카테고리 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl p-3 md:p-5 border shadow-sm"
                  style={{ backgroundColor: "rgba(51, 65, 85, 0.5)", borderColor: "rgba(45, 212, 191, 0.3)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: "rgba(20, 184, 166, 0.3)", borderColor: "rgba(45, 212, 191, 0.5)" }}>
                        <Lightbulb className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#5eead4" }} />
                      </div>
                      <span className="font-medium text-sm md:text-base" style={{ color: "#e2e8f0" }}>지적호기심 및 개방성</span>
                    </div>
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full border text-sm md:text-base" style={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#22d3ee", color: "#22d3ee" }}>7방울</span>
                  </div>
                  <div className="text-xs md:text-sm pl-9 md:pl-13" style={{ color: "#94a3b8" }}>
                    창의성 5+ 모험심 2
                  </div>
                </motion.div>

                {/* 정서적 안정 및 자기 인식 카테고리 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl p-3 md:p-5 border shadow-sm"
                  style={{ backgroundColor: "rgba(51, 65, 85, 0.5)", borderColor: "rgba(52, 211, 153, 0.3)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: "rgba(16, 185, 129, 0.3)", borderColor: "rgba(52, 211, 153, 0.5)" }}>
                        <Heart className="w-4 h-4 md:w-6 md:h-6" style={{ color: "#6ee7b7" }} />
                      </div>
                      <span className="font-medium text-sm md:text-base" style={{ color: "#e2e8f0" }}>정서적 안정 및 자기 인식</span>
                    </div>
                    <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full border text-sm md:text-base" style={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#22d3ee", color: "#22d3ee" }}>4방울</span>
                  </div>
                  <div className="text-xs md:text-sm pl-9 md:pl-13" style={{ color: "#94a3b8" }}>
                    현실 감각 4
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Visual - 반응형 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative flex justify-center md:flex-shrink-0"
          >
            <div className="relative">
              {/* 장식 별들 - 반응형 */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 md:-top-6 -right-4 md:-right-6"
              >
                <Star className="w-8 h-8 md:w-12 md:h-12  " style={{ color: "rgba(34, 211, 238, 0.6)" }} />
              </motion.div>
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-3 md:-bottom-5 -left-3 md:-left-5"
              >
                <Sparkles className="w-6 h-6 md:w-10 md:h-10  " style={{ color: "rgba(45, 212, 191, 0.5)" }} />
              </motion.div>

              <div className="relative rounded-2xl p-3 md:p-5 shadow-lg border  shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}>
                <ImageWithFallback
                  src={perfumeAnimationGif}
                  alt="향수 제작 과정"
                  className="w-64 h-64 md:w-96 md:h-96 object-contain rounded-xl"
                  onError={() => console.log('Animation image loading error')}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Screen 4: 베이스 채우기 - 반응형 (모바일: 세로, 태블릿: 가로)
function Screen4() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4 md:px-12 py-6 md:py-8 overflow-y-auto">
      <div className="max-w-lg md:max-w-6xl w-full">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12 space-y-6 md:space-y-0">
          {/* Visual - 반응형 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center md:flex-shrink-0"
          >
            <div className="relative">
              {/* 장식 요소들 - 반응형 */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-4 md:-top-6 -right-4 md:-right-6"
              >
                <Star className="w-8 h-8 md:w-12 md:h-12  " style={{ color: "rgba(34, 211, 238, 0.6)" }} />
              </motion.div>
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-3 md:-bottom-5 -left-3 md:-left-5"
              >
                <Sparkles className="w-6 h-6 md:w-10 md:h-10  " style={{ color: "rgba(45, 212, 191, 0.5)" }} />
              </motion.div>

              <div className="relative rounded-2xl p-4 md:p-6 border  shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}>
                <ImageWithFallback
                  src={perfumeBottleImage}
                  alt="향수병과 로고"
                  className="w-64 h-80 md:w-80 md:h-[26rem] object-contain"
                  onError={() => console.log('Bottle image loading error')}
                />
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="md:flex-1"
          >
            {/* Step indicator - 반응형 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 border text-sm md:text-base"
              style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", borderColor: "#22d3ee", color: "#67e8f9" }}
            >
              <span className="w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm" style={{ color: "#312e81", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}>3</span>
              <span>우주 베이스로 채우기</span>
            </motion.div>

            <h1 className="text-2xl md:text-4xl mb-3 md:mb-5  " style={{ color: "#ffffff" }}>별빛의 순간을 완성하세요</h1>

            <p className=" text-sm md:text-lg mb-6 md:mb-8" style={{ color: "#cbd5e1" }}>
              원액을 모두 넣었다면, 공병의 <strong className=" bg-slate-800/50 px-2 py-1 rounded border  " style={{ borderColor: "#22d3ee", color: "#22d3ee" }}>로고의 윗부분까지</strong> 향수 베이스로 가득 채워주세요.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl p-4 md:p-6 border  shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(to right, #22d3ee, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <Sparkles className="w-3.5 h-3.5 md:w-6 md:h-6  " style={{ color: "#312e81" }} />
                </div>
                <div>
                  <h3 className="font-medium  mb-1 md:mb-2 text-sm md:text-lg" style={{ color: "#67e8f9" }}>베이스 채우기 팁</h3>
                  <p className=" text-sm md:text-base" style={{ color: "#cbd5e1" }}>천천히 조심스럽게 부어서 거품이 생기지 않도록 주의하세요.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Screen 5: 완성 및 숙성 안내 - 반응형
function Screen5() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8 py-6 md:py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-lg md:max-w-3xl"
      >
        {/* Step indicator - 반응형 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-full mb-4 md:mb-6 border text-sm md:text-base"
          style={{ backgroundColor: "rgba(30, 41, 59, 0.6)", borderColor: "#22d3ee", color: "#67e8f9" }}
        >
          <span className="w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm" style={{ color: "#312e81", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}>4</span>
          <span>별자리 완성 및 숙성</span>
        </motion.div>

        <h1 className="text-2xl md:text-4xl mb-3 md:mb-5  " style={{ color: "#ffffff" }}>별빛에 시간을 더하는 과정</h1>
        <p className="mb-8 md:mb-12  text-sm md:text-lg" style={{ color: "#cbd5e1" }}>마지막 단계로 당신만의 향수를 완성해보세요.</p>

        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
          {/* Shake instruction - 반응형 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl p-5 md:p-8 text-center border  shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}
          >
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-5 border  " style={{ borderColor: "#22d3ee", background: "linear-gradient(to right, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.3))" }}
            >
              <Music className="w-7 h-7 md:w-12 md:h-12  " style={{ color: "#67e8f9" }} />
            </motion.div>
            <h3 className="font-medium  mb-1.5 md:mb-3 text-sm md:text-xl" style={{ color: "#67e8f9" }}>흔들어 섞기</h3>
            <p className=" text-xs md:text-base" style={{ color: "#cbd5e1" }}>뚜껑을 닫고 가볍게 <strong className=" " style={{ color: "#22d3ee" }}>10번</strong> 정도 흔들어주면 완성!</p>
          </motion.div>

          {/* Aging instruction - 반응형 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            className="rounded-2xl p-5 md:p-8 text-center border  shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}
          >
            <div className="w-14 h-14 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-5 relative border  " style={{ borderColor: "#22d3ee", background: "linear-gradient(to right, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.3))" }}>
              <Shield className="w-7 h-7 md:w-12 md:h-12  " style={{ color: "#67e8f9" }} />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-0.5 md:-top-1 -right-0.5 md:-right-1 w-3 h-3 md:w-5 md:h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(to right, #22d3ee, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                <Star className="w-1.5 h-1.5 md:w-2.5 md:h-2.5  " style={{ color: "#312e81" }} />
              </motion.div>
            </div>
            <h3 className="font-medium  mb-1.5 md:mb-3 text-sm md:text-xl" style={{ color: "#67e8f9" }}>별빛 숙성하기</h3>
            <p className=" text-xs md:text-base" style={{ color: "#cbd5e1" }}>서늘하고 어두운 곳에서 <strong className=" " style={{ color: "#22d3ee" }}>2주간 숙성</strong></p>
          </motion.div>
        </div>

        {/* Tip box - 반응형 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          className="border  rounded-2xl p-4 md:p-6 shadow-lg shadow-cyan-400" style={{ borderColor: "#22d3ee", background: "linear-gradient(to bottom right, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.6))" }}
        >
          <div className="flex items-start gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(to right, #22d3ee, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              <Lightbulb className="w-3.5 h-3.5 md:w-6 md:h-6  " style={{ color: "#312e81" }} />
            </div>
            <div className="text-left">
              <h3 className="font-medium  mb-1 md:mb-2 text-sm md:text-lg" style={{ color: "#67e8f9" }}>⭐ TIP</h3>
              <p className=" text-xs md:text-base" style={{ color: "#cbd5e1" }}>
                최고의 향을 위해, 서늘하고 어두운 곳에서 2주간 숙성하면
                알코올 향이 사라지고 향이 더욱 깊어집니다.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Screen 6: 마지막 화면 - 반응형
function Screen6() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const createSparkle = (e: React.MouseEvent) => {
    const newSparkle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    setSparkles(prev => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1500);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={createSparkle}
    >
      {/* 별자리 효과들 */}
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          initial={{ scale: 0, opacity: 1, x: sparkle.x, y: sparkle.y }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            y: sparkle.y - 50
          }}
          transition={{ duration: 1.5 }}
          className="absolute pointer-events-none z-30"
        >
          <Star className="w-6 h-6 md:w-10 md:h-10  " style={{ color: "#22d3ee" }} />
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 text-center px-4 md:px-8 max-w-lg md:max-w-2xl"
      >
        {/* Success 별자리 - 반응형 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
          className="w-28 h-28 md:w-48 md:h-48 mx-auto rounded-full flex items-center justify-center mb-6 md:mb-10 relative shadow-2xl border-2 md:border-4  " style={{ borderColor: "#22d3ee", background: "linear-gradient(to right, #3730a3, #1d4ed8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          <Check className="w-12 h-12 md:w-20 md:h-20  " style={{ color: "#67e8f9" }} />
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-4 md:-top-6 -right-4 md:-right-6 w-11 h-11 md:w-18 md:h-18 rounded-full flex items-center justify-center border" style={{ borderColor: "#67e8f9", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}
          >
            <Star className="w-6 h-6 md:w-10 md:h-10" style={{ color: "#312e81" }} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-3 md:-bottom-5 -left-3 md:-left-5 w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center border" style={{ borderColor: "#67e8f9", background: "linear-gradient(to right, #2dd4bf, #67e8f9)" }}
          >
            <Heart className="w-4 h-4 md:w-7 md:h-7" style={{ color: "#312e81" }} />
          </motion.div>
          <motion.div
            animate={{ rotate: 180, scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1.5 md:-top-3 -left-5 md:-left-8 w-7 h-7 md:w-12 md:h-12 rounded-full flex items-center justify-center border" style={{ borderColor: "#67e8f9", background: "linear-gradient(to right, #67e8f9, #2dd4bf)" }}
          >
            <Sparkles className="w-3.5 h-3.5 md:w-6 md:h-6" style={{ color: "#312e81" }} />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-xl md:text-4xl mb-4 md:mb-6  px-2 bg-clip-text text-transparent" style={{ color: "#ffffff", borderColor: "data-border-placeholder", background: "linear-gradient(to right, #67e8f9, #99f6e4, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          특별한 당신의 향이 완성되었습니다
        </motion.h1>

        <motion.p
          className="mb-8 md:mb-12  text-sm md:text-lg" style={{ color: "#cbd5e1" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          우주에서 가장 특별한 당신의 향기를 마음껏 즐겨주세요.
        </motion.p>

        {/* Aster 별자리 로고 - 반응형 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex items-center justify-center gap-2 md:gap-4 mb-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center border" style={{ borderColor: "#67e8f9", background: "linear-gradient(to right, #22d3ee, #14b8a6)" }}
          >
            <Star className="w-4 h-4 md:w-7 md:h-7" style={{ color: "#312e81" }} />
          </motion.div>
          <ImageWithFallback
            src={asterLogoImage}
            alt="Aster 로고"
            className="h-10 md:h-16 w-auto object-contain"
            onError={() => console.log('Aster logo loading error')}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 md:w-14 md:h-14 rounded-full flex items-center justify-center border" style={{ borderColor: "#67e8f9", background: "linear-gradient(to right, #2dd4bf, #67e8f9)" }}
          >
            <Sparkles className="w-4 h-4 md:w-7 md:h-7" style={{ color: "#312e81" }} />
          </motion.div>
        </motion.div>


      </motion.div>
    </div>
  );
}
