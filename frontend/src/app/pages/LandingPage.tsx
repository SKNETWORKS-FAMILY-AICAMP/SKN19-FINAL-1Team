import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const actionSteps = [
    {
      number: '01',
      keyword: 'CALL',
      title: '전화 한 통',
      description: 'STT 기술이 고객 음성을 실시간으로 분석합니다',
      result: '실시간 음성 인식'
    },
    {
      number: '02',
      keyword: 'CORRECT',
      title: '정확한 답변',
      description: 'AI가 3개의 데이터베이스에서 최적의 정보를 3초 내 제시합니다',
      result: '검색 시간 3초'
    },
    {
      number: '03',
      keyword: 'COLLECT',
      title: '완벽한 마무리',
      description: 'AI 기반 자동 요약과 문서 생성으로 후처리를 완료합니다',
      result: '후처리 시간 60% 단축'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white overflow-x-hidden">
      {/* Minimalist Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Single large gradient orb */}
        <motion.div
          className="absolute -top-1/2 -right-1/4 w-[1200px] h-[1200px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,71,171,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Accent gradient */}
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-[1000px] h-[1000px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,188,4,0.08) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
          <div className="max-w-[1200px] mx-auto w-full">
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-12 sm:mb-20"
            >
              {/* Main Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                className="mb-10 sm:mb-16"
              >
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-wider leading-none mb-4 sm:mb-6">
                  CALL
                  <span className="text-[#FBBC04] font-black tracking-normal" style={{ fontFamily: 'ui-monospace, monospace' }}>:</span>
                  ACT
                </h1>
                
                {/* Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                  style={{
                    fontWeight: 400,
                    letterSpacing: '0.05em'
                  }}
                >
                  <span className="text-[#0047AB]">CALL</span>
                  <span className="text-gray-700">+</span>
                  <span className="text-[#0047AB]">CORRECT</span>
                  <span className="text-gray-700">+</span>
                  <span className="text-[#0047AB]">COLLECT</span>
                </motion.div>
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="space-y-4 sm:space-y-6 mb-12 sm:mb-20"
              >
                <p 
                  className="text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed px-4"
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.02em',
                    lineHeight: '1.6'
                  }}
                >
                  상담원의 모든 행동이<br />
                  <span style={{ fontWeight: 500 }}>즉시 이어집니다</span>
                </p>

                <p 
                  className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4"
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.03em',
                    lineHeight: '1.7'
                  }}
                >
                  AI 기반 실시간 정보 검색부터 자동 후처리까지<br className="hidden sm:inline" />
                  카드사 상담의 새로운 기준
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <Button
                  onClick={() => navigate('/login')}
                  className="bg-[#0047AB] hover:bg-[#003580] text-white px-8 sm:px-12 py-5 sm:py-6 text-sm sm:text-base rounded-xl shadow-2xl hover:shadow-[#0047AB]/50 transition-all group"
                  style={{
                    fontWeight: 500,
                    letterSpacing: '0.05em'
                  }}
                >
                  시작하기
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 sm:mb-24"
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 leading-tight px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.02em'
                }}
              >
                상담 현장의 <span style={{ fontWeight: 500, color: 'white' }}>현실</span>
              </h2>
              <p 
                className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.03em',
                  lineHeight: '1.8'
                }}
              >
                정보 검색에 소요되는 시간,<br />
                반복되는 후처리 작업,<br />
                그리고 낮아지는 업무 효율
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 sm:gap-16 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div 
                  className="text-3xl sm:text-5xl text-gray-700 mb-2"
                  style={{ fontWeight: 200 }}
                >
                  5분+
                </div>
                <div 
                  className="text-xs sm:text-sm text-gray-600"
                  style={{ 
                    fontWeight: 400,
                    letterSpacing: '0.05em'
                  }}
                >
                  정보 검색
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl sm:text-5xl text-gray-700 mb-2"
                  style={{ fontWeight: 200 }}
                >
                  10분+
                </div>
                <div 
                  className="text-xs sm:text-sm text-gray-600"
                  style={{ 
                    fontWeight: 400,
                    letterSpacing: '0.05em'
                  }}
                >
                  후처리 작업
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl sm:text-5xl text-gray-700 mb-2"
                  style={{ fontWeight: 200 }}
                >
                  반복
                </div>
                <div 
                  className="text-xs sm:text-sm text-gray-600"
                  style={{ 
                    fontWeight: 400,
                    letterSpacing: '0.05em'
                  }}
                >
                  매 상담마다
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Solution - 3 Step Flow */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-transparent via-[#0047AB]/5 to-transparent">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 sm:mb-24"
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 leading-tight px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.02em'
                }}
              >
                <span style={{ fontWeight: 500, color: '#0047AB' }}>3단계</span>로 완성되는 상담
              </h2>
              <p 
                className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.03em',
                  lineHeight: '1.8'
                }}
              >
                전화부터 마무리까지, 끊김 없이 이어지는 워크플로우
              </p>
            </motion.div>

            {/* 3 Steps */}
            <div className="space-y-3 sm:space-y-4">
              {actionSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  onHoverStart={() => setHoveredStep(index)}
                  onHoverEnd={() => setHoveredStep(null)}
                  className="group relative"
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#0047AB]/10 to-transparent rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredStep === index ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 p-4 sm:p-10 border-l-2 border-white/10 group-hover:border-[#0047AB] transition-colors">
                    {/* Number */}
                    <div 
                      className="text-4xl sm:text-6xl text-gray-900 group-hover:text-[#0047AB]/20 transition-colors min-w-[60px] sm:min-w-[80px]"
                      style={{ fontWeight: 200 }}
                    >
                      {step.number}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div 
                        className="text-xs text-[#FBBC04] uppercase mb-2"
                        style={{
                          fontWeight: 500,
                          letterSpacing: '0.2em'
                        }}
                      >
                        {step.keyword}
                      </div>
                      <h3 
                        className="text-xl sm:text-2xl mb-2 sm:mb-3 group-hover:text-[#0047AB] transition-colors"
                        style={{
                          fontWeight: 400,
                          letterSpacing: '0.02em'
                        }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="text-sm sm:text-base text-gray-500 leading-relaxed mb-2 sm:mb-3"
                        style={{
                          fontWeight: 300,
                          letterSpacing: '0.02em',
                          lineHeight: '1.7'
                        }}
                      >
                        {step.description}
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0047AB]" />
                        <span 
                          className="text-xs text-gray-400"
                          style={{
                            fontWeight: 400,
                            letterSpacing: '0.03em'
                          }}
                        >
                          {step.result}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      animate={{ x: hoveredStep === index ? 8 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="hidden sm:block"
                    >
                      <ArrowRight className="w-8 h-8 text-gray-800 group-hover:text-[#0047AB] transition-colors" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Result Section */}
        <section className="py-20 sm:py-32 px-4 sm:px-6">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 sm:mb-24"
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 leading-tight px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.02em'
                }}
              >
                <span style={{ fontWeight: 500, color: 'white' }}>측정 가능한</span> 성과
              </h2>
              <p 
                className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.03em',
                  lineHeight: '1.8'
                }}
              >
                상담 효율성의 극적인 개선
              </p>
            </motion.div>

            {/* Improved Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-16 max-w-5xl mx-auto"
            >
              <div className="text-center group">
                <div className="mb-5">
                  <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-[#0047AB] mx-auto" />
                </div>
                <div 
                  className="text-4xl sm:text-5xl text-[#0047AB] mb-3"
                  style={{ fontWeight: 200 }}
                >
                  3초
                </div>
                <div 
                  className="text-sm sm:text-base text-gray-400 mb-1"
                  style={{
                    fontWeight: 400,
                    letterSpacing: '0.03em'
                  }}
                >
                  정보 검색
                </div>
                <div 
                  className="text-xs text-gray-600"
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.02em'
                  }}
                >
                  5분 → 3초
                </div>
              </div>
              
              <div className="text-center group">
                <div className="mb-5">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#0047AB] mx-auto" />
                </div>
                <div 
                  className="text-4xl sm:text-5xl text-[#0047AB] mb-3"
                  style={{ fontWeight: 200 }}
                >
                  60%
                </div>
                <div 
                  className="text-sm sm:text-base text-gray-400 mb-1"
                  style={{
                    fontWeight: 400,
                    letterSpacing: '0.03em'
                  }}
                >
                  시간 단축
                </div>
                <div 
                  className="text-xs text-gray-600"
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.02em'
                  }}
                >
                  10분 → 4분
                </div>
              </div>
              
              <div className="text-center group">
                <div className="mb-5">
                  <Phone className="w-10 h-10 sm:w-12 sm:h-12 text-[#0047AB] mx-auto" />
                </div>
                <div 
                  className="text-4xl sm:text-5xl text-[#0047AB] mb-3"
                  style={{ fontWeight: 200 }}
                >
                  99%
                </div>
                <div 
                  className="text-sm sm:text-base text-gray-400 mb-1"
                  style={{
                    fontWeight: 400,
                    letterSpacing: '0.03em'
                  }}
                >
                  FCR 달성
                </div>
                <div 
                  className="text-xs text-gray-600"
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.02em'
                  }}
                >
                  한 통화로 완료
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-8 leading-tight px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.02em',
                  lineHeight: '1.5'
                }}
              >
                상담의 품질을<br />
                <span style={{ fontWeight: 500, color: '#0047AB' }}>효율</span>로 증명하세요
              </h2>
              
              <Button
                onClick={() => navigate('/login')}
                className="bg-[#0047AB] hover:bg-[#003580] text-white px-10 sm:px-16 py-5 sm:py-7 text-base sm:text-lg rounded-xl shadow-2xl hover:shadow-[#0047AB]/50 transition-all group mb-6"
                style={{
                  fontWeight: 500,
                  letterSpacing: '0.05em'
                }}
              >
                시작하기
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p 
                className="text-xs sm:text-sm text-gray-600 px-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: '0.05em'
                }}
              >
                카드사 상담원을 위한 AI 기반 실시간 지원 시스템
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 sm:py-10 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0047AB] rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div 
                  className="text-sm sm:text-base"
                  style={{
                    fontWeight: 500,
                    letterSpacing: '0.05em'
                  }}
                >
                  CALL:ACT
                </div>
                <div 
                  className="text-xs text-gray-600"
                  style={{
                    fontWeight: 300,
                    letterSpacing: '0.03em'
                  }}
                >
                  AI 기반 실시간 상담 지원 시스템
                </div>
              </div>
            </div>
            <div 
              className="text-xs text-gray-600"
              style={{
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              © 2025 CALL:ACT. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
