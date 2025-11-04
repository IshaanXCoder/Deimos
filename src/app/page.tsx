"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
// Icons will be replaced with simple SVGs or emojis for now
// import { Github, Twitter } from "lucide-react"

// Reusable Badge Component
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0)
  const [progress, setProgress] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3)
          }
          return 0
        }
        return prev + 2 // 2% every 100ms = 5 seconds total
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return
    setActiveCard(index)
    setProgress(0)
  }

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation */}
            <div className="w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0">
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className="w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30">
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <Link href="/" className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      Deimos
                    </Link>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 flex justify-start items-start hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <Link href="/benchmarks" className="flex justify-start items-center group">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans hover:text-[#37322F] transition-all duration-200 group-hover:scale-105">
                        Benchmarks
                      </div>
                    </Link>
                    <Link href="/docs" className="flex justify-start items-center group">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans hover:text-[#37322F] transition-all duration-200 group-hover:scale-105">
                        Docs
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <Link href="https://github.com/blocsoc-iitr/deimos" target="_blank" rel="noopener noreferrer" className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center hover:shadow-md transition-shadow">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-[#37322F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </Link>
                  <Link href="https://x.com/BlocSocIITR" target="_blank" rel="noopener noreferrer" className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center hover:shadow-md transition-shadow">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-[#37322F]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full sm:pl-0 sm:pr-0 pl-0 pr-0">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[80px] font-normal leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    Deimos
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    Comprehensive mobile benchmarking for zero-knowledge frameworks
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
                  <Link href="/benchmarks" className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center hover:bg-[#2F2A28] transition-colors">
                    <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                    <div className="flex flex-col justify-center text-white text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans">
                      View Benchmarks
                    </div>
                  </Link>
                </div>
              </div>

              <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
                  style={{
                    filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
                  }}
                />
              </div>

              <div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
                <div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[695.55px] bg-white shadow-[0px_8px_32px_rgba(0,0,0,0.12)] overflow-hidden rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] flex flex-col justify-start items-start border border-gray-100 backdrop-blur-sm">
                  {/* Dashboard Content */}
                  <div className="self-stretch flex-1 flex justify-start items-start">
                    {/* Main Content */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-full h-full overflow-hidden">
                        {/* Benchmark Dashboard */}
                        <div
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            activeCard === 0 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-8 relative">
                            <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="absolute top-4 left-10 text-xs text-gray-500">Live</div>
                            <div className="text-center relative z-10">
                              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-blue-700 backdrop-blur-sm">
                                📊 Performance Dashboard
                              </div>
                              <h3 className="text-xl sm:text-2xl font-bold text-[#37322F] mb-4">Mobile zkVM Benchmarks</h3>
                              <p className="text-[#605A57] mb-6 text-sm sm:text-base">Real-time performance metrics across frameworks</p>
                              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-sm">
                                <div className="bg-white/90 p-3 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow backdrop-blur-sm">
                                  <div className="font-semibold text-blue-600 flex items-center gap-1">
                                    ⚡ Halo2
                                  </div>
                                  <div className="text-[#605A57] text-xs">2.3s avg</div>
                                  <div className="w-full bg-blue-100 rounded-full h-1 mt-2">
                                    <div className="bg-blue-500 h-1 rounded-full w-3/4"></div>
                                  </div>
                                </div>
                                <div className="bg-white/90 p-3 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow backdrop-blur-sm">
                                  <div className="font-semibold text-purple-600 flex items-center gap-1">
                                    🎯 Noir
                                  </div>
                                  <div className="text-[#605A57] text-xs">1.8s avg</div>
                                  <div className="w-full bg-purple-100 rounded-full h-1 mt-2">
                                    <div className="bg-purple-500 h-1 rounded-full w-4/5"></div>
                                  </div>
                                </div>
                                <div className="bg-white/90 p-3 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow backdrop-blur-sm">
                                  <div className="font-semibold text-orange-600 flex items-center gap-1">
                                    🔄 Circom
                                  </div>
                                  <div className="text-[#605A57] text-xs">3.1s avg</div>
                                  <div className="w-full bg-orange-100 rounded-full h-1 mt-2">
                                    <div className="bg-orange-500 h-1 rounded-full w-2/3"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Testing */}
                        <div
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            activeCard === 1 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 flex items-center justify-center p-8 relative">
                            <div className="absolute top-4 right-4 flex gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                            </div>
                            <div className="text-center relative z-10">
                              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-green-700 backdrop-blur-sm">
                                📱 Cross-Platform
                              </div>
                              <h3 className="text-xl sm:text-2xl font-bold text-[#37322F] mb-4">Cross-Platform Testing</h3>
                              <p className="text-[#605A57] mb-6 text-sm sm:text-base">Flutter app testing on Android & iOS devices</p>
                              <div className="flex justify-center space-x-8">
                                <div className="text-center group">
                                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
                                    📱
                                  </div>
                                  <div className="text-sm font-medium text-green-700">Android</div>
                                  <div className="text-xs text-gray-500">API 21+</div>
                                </div>
                                <div className="text-center group">
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
                                    📱
                                  </div>
                                  <div className="text-sm font-medium text-blue-700">iOS</div>
                                  <div className="text-xs text-gray-500">iOS 12+</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ZK Frameworks */}
                        <div
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            activeCard === 2 ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-8 relative">
                            <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-gray-500">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              3 Frameworks
                            </div>
                            <div className="text-center relative z-10">
                              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-purple-700 backdrop-blur-sm">
                                🔧 Framework Support
                              </div>
                              <h3 className="text-xl sm:text-2xl font-bold text-[#37322F] mb-4">ZK Framework Support</h3>
                              <p className="text-[#605A57] mb-6 text-sm sm:text-base">Comprehensive testing across major frameworks</p>
                              <div className="flex justify-center flex-wrap gap-3">
                                <div className="px-4 py-2 bg-white/90 rounded-full text-sm font-medium border border-blue-200 hover:border-blue-300 transition-colors backdrop-blur-sm">
                                  <span className="text-blue-600">⚡</span> Halo2
                                </div>
                                <div className="px-4 py-2 bg-white/90 rounded-full text-sm font-medium border border-purple-200 hover:border-purple-300 transition-colors backdrop-blur-sm">
                                  <span className="text-purple-600">🎯</span> Noir
                                </div>
                                <div className="px-4 py-2 bg-white/90 rounded-full text-sm font-medium border border-orange-200 hover:border-orange-300 transition-colors backdrop-blur-sm">
                                  <span className="text-orange-600">🔄</span> Circom
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Left decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
                  {/* Feature Cards */}
                  <FeatureCard
                    title="Mobile Benchmarking"
                    description="Test zkVM performance directly on mobile devices with real-world conditions and constraints."
                    isActive={activeCard === 0}
                    progress={activeCard === 0 ? progress : 0}
                    onClick={() => handleCardClick(0)}
                  />
                  <FeatureCard
                    title="Cross-Platform Testing"
                    description="Flutter-based application ensures consistent testing across Android and iOS platforms."
                    isActive={activeCard === 1}
                    progress={activeCard === 1 ? progress : 0}
                    onClick={() => handleCardClick(1)}
                  />
                  <FeatureCard
                    title="Framework Coverage"
                    description="Comprehensive support for major ZK frameworks including Halo2, Noir, and Circom."
                    isActive={activeCard === 2}
                    progress={activeCard === 2 ? progress : 0}
                    onClick={() => handleCardClick(2)}
                  />
                </div>

                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Right decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Stack Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="3" width="4" height="6" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="1" width="4" height="8" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="2" y="4" width="1" height="1" fill="#37322F" />
                          <rect x="3.5" y="4" width="1" height="1" fill="#37322F" />
                          <rect x="2" y="5.5" width="1" height="1" fill="#37322F" />
                          <rect x="3.5" y="5.5" width="1" height="1" fill="#37322F" />
                          <rect x="8" y="2" width="1" height="1" fill="#37322F" />
                          <rect x="9.5" y="2" width="1" height="1" fill="#37322F" />
                          <rect x="8" y="3.5" width="1" height="1" fill="#37322F" />
                          <rect x="9.5" y="3.5" width="1" height="1" fill="#37322F" />
                          <rect x="8" y="5" width="1" height="1" fill="#37322F" />
                          <rect x="9.5" y="5" width="1" height="1" fill="#37322F" />
                        </svg>
                      }
                      text="Tech Stack"
                    />
                    <div className="w-full max-w-[472.55px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Built with modern tools
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      Leveraging cutting-edge zero-knowledge frameworks
                      <br className="hidden sm:block" />
                      and modern mobile development tools for comprehensive benchmarking.
                    </div>
                  </div>
                </div>

                {/* Tech Stack Grid */}
                <div className="self-stretch border-[rgba(55,50,47,0.12)] flex justify-center items-start border-t border-b-0">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Enhanced Tech Stack Grid */}
                    {[
                      { 
                        name: "zkmopro", 
                        description: "Mobile ZK Proofs",
                        link: "https://github.com/zkmopro/mopro",
                        logo: "/mopro.svg"
                      },
                      { 
                        name: "Halo2", 
                        description: "ZK Circuit Framework",
                        link: "https://github.com/zcash/halo2",
                        logo: "/halo2.png"
                      },
                      { 
                        name: "Noir", 
                        description: "ZK Programming Language",
                        link: "https://noir-lang.org/",
                        logo: "/noir.png"
                      },
                      { 
                        name: "Circom", 
                        description: "Circuit Compiler",
                        link: "https://docs.circom.io/",
                        logo: "/circom.png"
                      }
                    ].map((tech, index) => {
                      const isMobileFirstColumn = index % 2 === 0
                      const isDesktopFirstColumn = index % 4 === 0
                      const isDesktopLastColumn = index % 4 === 3

                      return (
                        <a
                          key={index}
                          href={tech.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            group h-28 xs:h-32 sm:h-36 md:h-40 lg:h-44 flex flex-col justify-center items-center gap-2 xs:gap-3 sm:gap-4
                            border-b border-[rgba(227,226,225,0.5)] hover:bg-white/50 transition-all duration-300
                            ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                            sm:border-r-[0.5px] sm:border-l-0
                            ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                            ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                            border-[#E3E2E1] hover:shadow-lg hover:scale-[1.02]
                          `}
                        >
                          {/* Logo/Icon */}
                          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 relative flex items-center justify-center transition-all duration-300 group-hover:scale-110 p-2">
                            <img 
                              src={tech.logo} 
                              alt={`${tech.name} logo`}
                              className={`object-contain filter group-hover:brightness-110 transition-all duration-300 drop-shadow-sm ${
                                tech.name === 'zkmopro' ? 'w-[120%] h-[120%]' : 
                                tech.name === 'Halo2' ? 'w-[80%] h-[80%]' : 
                                'w-full h-full'
                              }`}
                            />
                          </div>
                          
                          {/* Name and Description */}
                          <div className="text-center flex flex-col items-center gap-1">
                            <div className="text-[#37322F] text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-semibold leading-tight font-sans group-hover:text-[#2F2A28] transition-colors">
                              {tech.name}
                            </div>
                            <div className="text-[#605A57] text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base font-normal leading-tight font-sans opacity-75 group-hover:opacity-100 transition-opacity">
                              {tech.description}
                            </div>
                          </div>
                          
                          {/* External link indicator */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#605A57]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </a>
                      )
                    })}
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                {/* Header Section */}
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                          <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                        </svg>
                      }
                      text="Features"
                    />
                    <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Comprehensive zkVM testing suite
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      Everything you need to benchmark zero-knowledge virtual machines
                      <br />
                      on mobile devices with precision and reliability.
                    </div>
                  </div>
                </div>

                {/* Features Grid Content */}
                <div className="self-stretch flex justify-center items-start">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Top Left - Real-time Performance */}
                    <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Real-time Performance Metrics
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Monitor proving and verification times across different cryptographic algorithms with live updates and detailed analytics.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center p-6">
                          <div className="text-4xl mb-4">📊</div>
                          <div className="text-sm text-[#605A57]">Live performance tracking</div>
                        </div>
                      </div>
                    </div>

                    {/* Top Right - Cross-platform Support */}
                    <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                          Cross-platform Mobile Testing
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Flutter-based application ensures consistent testing experience across Android and iOS devices with native performance.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                        <div className="text-center p-6">
                          <div className="text-4xl mb-4">📱</div>
                          <div className="text-sm text-[#605A57]">Android & iOS support</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Left - Framework Integration */}
                    <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Multi-framework Integration
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Seamless integration with major ZK frameworks including Halo2, Noir, and Circom for comprehensive testing coverage.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative bg-gradient-to-br from-purple-50 to-pink-50">
                        <div className="text-center p-6">
                          <div className="text-4xl mb-4">🔧</div>
                          <div className="text-sm text-[#605A57]">Multiple ZK frameworks</div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Right - Cryptographic Algorithms */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          Cryptographic Algorithm Testing
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Comprehensive testing across various hashing algorithms including Poseidon, SHA256, and Keccak with detailed performance analysis.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative bg-gradient-to-br from-orange-50 to-red-50">
                        <div className="text-center p-6">
                          <div className="text-4xl mb-4">🔐</div>
                          <div className="text-sm text-[#605A57]">Multiple hash algorithms</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Source Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    
                    <div className="w-full max-w-[472.55px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      Built by the community
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      Deimos is a project developed by the members of BlocSoc IITR.
                      <br className="hidden sm:block" />
                      Join our community and contribute to the future of zkVM benchmarking.
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Link href="https://github.com/blocsoc-iitr/deimos" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#37322F] text-white rounded-full hover:bg-[#2F2A28] transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                      </Link>
                      <Link href="https://x.com/BlocSocIITR" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-[#37322F] text-[#37322F] rounded-full hover:bg-[#37322F] hover:text-white transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Follow Updates
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="w-full py-8 sm:py-12 md:py-16 border-t border-[rgba(55,50,47,0.12)] flex justify-center items-center">
                <div className="text-center">
                  <div className="text-[#605A57] text-sm mb-4">
                    © 2025 Deimos. Built by BlocSoc IITR.
                  </div>
                  <div className="flex justify-center gap-6">
                    <Link href="https://github.com/blocsoc-iitr/deimos" target="_blank" rel="noopener noreferrer" className="text-[#605A57] hover:text-[#37322F] transition-colors">
                      GitHub
                    </Link>
                    <Link href="https://x.com/BlocSocIITR" target="_blank" rel="noopener noreferrer" className="text-[#605A57] hover:text-[#37322F] transition-colors">
                      Twitter
                    </Link>
                    <Link href="/docs" className="text-[#605A57] hover:text-[#37322F] transition-colors">
                      Documentation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced FeatureCard component with better interactions
function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string
  description: string
  isActive: boolean
  progress: number
  onClick: () => void
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
        isActive
          ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset] transform scale-[1.02]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80 hover:bg-white/50"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isActive}
      aria-label={`${title}: ${description}`}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-gradient-to-r from-[#322D2B] to-[#4A453F] transition-all duration-100 ease-linear shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans group-hover:text-[#37322F]">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans group-hover:text-[#49423D]">
        {description}
      </div>
      
      {/* Interactive indicator */}
      <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full transition-all duration-300 ${
        isActive ? 'bg-[#322D2B] scale-100' : 'bg-[#E0DEDB] scale-75 hover:scale-100'
      }`} />
    </div>
  )
}