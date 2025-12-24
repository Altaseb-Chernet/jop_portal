import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Users, Briefcase, Mail, Phone, 
  MapPin, Rocket, Zap, Globe, 
  Layers, Cpu, Database, Cloud, Lock, Linkedin, Github,
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useRef, useEffect } from 'react';

const EASE_LINEAR: [number, number, number, number] = [0, 0, 1, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

export function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 1, 0.8]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div 
        style={{ y: backgroundY, opacity }}
        className="fixed inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-cyan-50 dark:from-primary-950/30 dark:via-gray-950 dark:to-cyan-950/30" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      </motion.div>

      {/* Floating Particles */}
      <FloatingParticles />
      
      {/* Mouse Trail Effect */}
      <MouseTrail />

      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Grid */}
        <FeaturesSection />
        
        {/* Stats Section with Ultimate Animations */}
        <StatsSection scrollYProgress={scrollYProgress} />
        
        {/* Team Section */}
        <TeamSection />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Role Cards */}
        <RoleCardsSection />
        
        {/* Contact Form Section */}
        <ContactSection />
        
        {/* CTA Section */}
        <CTASection />
      </div>

      {/* Scroll Progress Bar */}
      <ScrollProgress scrollYProgress={scrollYProgress} />
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary-400/10 dark:bg-primary-500/10"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
            scale: Math.random() * 0.3 + 0.1,
          }}
          animate={{
            x: [
              Math.random() * 100 + 'vw',
              Math.random() * 100 + 'vw',
              Math.random() * 100 + 'vw'
            ],
            y: [
              Math.random() * 100 + 'vh',
              Math.random() * 100 + 'vh',
              Math.random() * 100 + 'vh'
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: EASE_LINEAR
          }}
          style={{
            width: Math.random() * 20 + 10 + 'px',
            height: Math.random() * 20 + 10 + 'px',
          }}
        />
      ))}
    </div>
  );
}

function MouseTrail() {
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const trailRef = useRef<Array<{ x: number; y: number; id: number }>>([]);
  const counter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      counter.current += 1;
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: counter.current
      };
      
      trailRef.current = [newPoint, ...trailRef.current.slice(0, 9)];
      setTrail(trailRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="absolute w-2 h-2 rounded-full bg-primary-500/20 dark:bg-primary-400/20"
          initial={{ 
            x: point.x - 4, 
            y: point.y - 4,
            scale: 1,
            opacity: 0.5
          }}
          animate={{ 
            x: point.x - 4, 
            y: point.y - 4,
            scale: 0.5 + (index / trail.length) * 0.5,
            opacity: 0.1 + (index / trail.length) * 0.4
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

function ScrollProgress({ scrollYProgress }: { scrollYProgress: any }) {
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 z-50 origin-left"
    />
  );
}

function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: EASE_IN_OUT
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-full blur-3xl dark:from-primary-600/20 dark:to-purple-600/20"
          animate={floatAnimation}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl dark:from-blue-600/20 dark:to-cyan-600/20"
          animate={{
            ...floatAnimation,
            transition: { ...floatAnimation.transition, delay: 1 }
          }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center space-y-12 max-w-6xl mx-auto"
        >
          {/* Headline with Text Reveal */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-primary-500 to-cyan-500 mx-auto max-w-xs rounded-full"
            />
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
            >
              <span className="text-gray-900 dark:text-white block">
                Revolutionize Your
              </span>
              <motion.span
                initial={{ backgroundPosition: "200% center" }}
                animate={{ backgroundPosition: "-200% center" }}
                transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
                className="block bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                Hiring Ecosystem
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto"
            >
              An end-to-end talent intelligence platform connecting exceptional talent with 
              visionary organizations through intelligent matching and modern tools.
            </motion.p>
          </motion.div>

          {/* CTA Buttons with Hover Effects */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-xl blur opacity-0 transition-opacity"
              />
              <Link
                to="/jobs"
                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative">Explore Opportunities</span>
                <ArrowRight className="h-5 w-5 relative transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-8 py-4 shadow-sm hover:shadow transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: EASE_LINEAR }}
                >
                  <Rocket className="h-5 w-5" />
                </motion.div>
                <span>Start Free Trial</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Preview with Count Animation */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-200 dark:border-gray-800"
          >
            {[
              { value: '500+', label: 'Active Professionals' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '50+', label: 'Hiring Companies' },
              { value: '20+', label: 'Successful Matches' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.8 }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    delay: index * 0.1 + 0.8,
                    stiffness: 200,
                    damping: 15
                  }}
                  className="text-3xl font-bold text-primary-600 dark:text-primary-400"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400 dark:text-gray-500"
        >
          <ArrowRight className="h-6 w-6 rotate-90" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const directionRef = useRef(1); // Track slide direction

  const features = [
    {
      icon: <Cpu className="h-6 w-6" />,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms analyze skills and experience for perfect matches.',
      stats: '95% accuracy rate'
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: 'Collaborative Suite',
      description: 'End-to-end recruitment workflow with team collaboration.',
      stats: '40% faster hiring'
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Enterprise Security',
      description: 'End-to-end encryption and GDPR compliance.',
      stats: '99.9% uptime'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Network',
      description: 'Access to professionals across 150+ countries.',
      stats: '50K+ companies'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Smart Analytics',
      description: 'Real-time insights for data-driven hiring decisions.',
      stats: '100+ metrics'
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: 'Cloud Native',
      description: 'Built on scalable cloud infrastructure.',
      stats: 'Zero downtime'
    }
  ];

  // Auto-rotate features one by one
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        directionRef.current = 1; // Always moving forward for auto-rotate
        return (prev + 1) % features.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  // Single feature slide variants
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const handlePrev = () => {
    directionRef.current = -1;
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    directionRef.current = 1;
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: EASE_LINEAR }}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div 
            variants={containerVariants}
            className="inline-flex items-center gap-2 rounded-full bg-primary-50 dark:bg-primary-900/30 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: EASE_LINEAR }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            Features
          </motion.div>
          
          <motion.h2 
            variants={containerVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            <span className="block">Everything You Need for</span>
            <motion.span
              initial={{ backgroundPosition: "200% center" }}
              animate={{ backgroundPosition: "-200% center" }}
              transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
              className="bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Modern Hiring
            </motion.span>
          </motion.h2>
          
          <motion.p 
            variants={containerVariants}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Comprehensive tools designed to streamline the entire recruitment lifecycle
          </motion.p>
        </motion.div>

        {/* Single Feature Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:bg-primary-50 dark:hover:bg-gray-700"
            aria-label="Previous feature"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:scale-110 hover:bg-primary-50 dark:hover:bg-gray-700"
            aria-label="Next feature"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Feature Counter */}
          <div className="text-center mb-8">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              <span className="text-primary-600 dark:text-primary-400">{currentIndex + 1}</span>
              /{features.length}
            </span>
          </div>

          {/* Animated Feature Slide */}
          <AnimatePresence mode="wait" custom={directionRef.current}>
            <motion.div
              key={currentIndex}
              custom={directionRef.current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative"
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group relative max-w-2xl mx-auto"
              >
                {/* Hover Glow Effect */}
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                />
                
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    {/* Animated Icon with Navigation */}
                    <div className="flex flex-col items-center gap-6">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      >
                        {features[currentIndex].icon}
                      </motion.div>
                      
                      {/* Mini Progress Dots */}
                      <div className="flex gap-2">
                        {features.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              currentIndex === idx 
                                ? 'bg-primary-500 scale-125' 
                                : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {features[currentIndex].title}
                      </h3>
                      
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        {features[currentIndex].description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {features[currentIndex].stats}
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-4">
                          <button
                            onClick={handlePrev}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Previous feature"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleNext}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Next feature"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated Underline */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation Dots */}
          <div className="flex justify-center mt-12 gap-3 md:hidden">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  directionRef.current = index > currentIndex ? 1 : -1;
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index 
                    ? 'bg-primary-500 scale-125' 
                    : 'bg-gray-300 dark:bg-gray-700 hover:bg-primary-400'
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ scrollYProgress }: { scrollYProgress: any }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  const stats = [
    { value: '50+', label: 'Active Professionals', icon: '👥' },
    { value: '98%', label: 'Satisfaction Rate', icon: '⭐' },
    { value: '50+', label: 'Hiring Companies', icon: '🏢' },
    { value: '30+', label: 'Successful Matches', icon: '✨' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const statVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      style={{ y, opacity }}
      className="py-32 relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-cyan-500/10 dark:from-primary-600/20 dark:via-purple-600/20 dark:to-cyan-600/20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: EASE_LINEAR
        }}
        style={{
          backgroundSize: '200% 100%',
        }}
      />
      
      <div className="container relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              whileHover={{ 
                scale: 1.1,
                rotateY: 10,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 border border-white/20 dark:border-gray-700/50 shadow-2xl"
            >
              {/* Animated Icon */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity }
                }}
                className="text-5xl mb-6 inline-block"
              >
                {stat.icon}
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: index * 0.1
                }}
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 dark:from-primary-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3"
              >
                {stat.value}
              </motion.div>
              
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
              
              {/* Animated Progress Bar */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full mt-4 mx-auto"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

function TeamSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const team = [
    {
      name: 'Yonas Getaw',
      role: 'Lead Architect',
      description: 'Backend systems specialist with expertise in Spring Boot and microservices.',
      initials: 'YG',
      social: { linkedin: '#', github: '#' },
      image: '/yonas.png'
    },
    {
      name: 'Altaseb Chernet',
      role: 'Full-Stack Developer',
      description: 'Expert in React, Node.js, and modern web development.',
      initials: 'AC',
      social: { linkedin: '#', github: '#' },
      image: '/altaseb.png'
    },
    {
      name: 'Yohannes Birhane',
      role: 'Backend Engineer',
      description: 'Java specialist focused on secure, scalable backend solutions.',
      initials: 'YB',
      social: { linkedin: '#', github: '#' },
      image: '/yohannes.png'
    },
    {
      name: 'Mulukon Kasahun',
      role: 'Frontend Developer',
      description: 'UI/UX expert creating responsive and intuitive interfaces.',
      initials: 'MK',
      social: { linkedin: '#', github: '#' },
      image: 'mulukon.png'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const memberVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      rotateY: -30 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative">
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: EASE_LINEAR }}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={containerVariants}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 dark:bg-primary-900/30 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 mb-6">
              <Users className="h-4 w-4" />
              Our Team
            </div>
          </motion.div>
          
          <motion.h2 variants={containerVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">Meet the</span>
            <motion.span
              initial={{ backgroundPosition: "200% center" }}
              animate={{ backgroundPosition: "-200% center" }}
              transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
              className="bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Developers
            </motion.span>
          </motion.h2>
          
          <motion.p variants={containerVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Passionate software engineers dedicated to transforming hiring through technology.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {team.map((member) => (
            <motion.div
              key={member.name}
              variants={memberVariants}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 shadow-lg hover:shadow-2xl">
                {/* Animated Avatar Container with Image */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="relative w-24 h-24 mx-auto mb-6"
                >
                  <motion.div 
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: EASE_LINEAR },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-primary-400 to-cyan-400 rounded-full blur opacity-20 group-hover:opacity-30"
                  />
                  
                  {/* Profile Image with Fallback */}
                  <div className="relative w-full h-full overflow-hidden rounded-full border-4 border-white dark:border-gray-800">
                    <img 
                      src={member.image} 
                      alt={`${member.name}, ${member.role}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // If image fails to load, show initials
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold';
                          fallback.textContent = member.initials;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                </motion.div>
                
                {/* Name with Typing Effect */}
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                >
                  {member.name}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-3"
                >
                  {member.role}
                </motion.p>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 dark:text-gray-400 text-sm mb-4"
                >
                  {member.description}
                </motion.p>
                
                {/* Animated Social Links */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center space-x-3"
                >
                  {[
                    { icon: Linkedin, href: member.social.linkedin, label: 'LinkedIn' },
                    { icon: Github, href: member.social.github, label: 'GitHub' }
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      aria-label={`${member.name} ${social.label}`}
                    >
                      <social.icon className="h-4 w-4" />
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: 'Starter',
      price: '1000',
      period: '/month',
      description: 'For individuals and small teams',
      features: [
        'Up to 10 job posts',
        'Basic candidate matching',
        'Email support',
        'Standard analytics',
        '5 team members'
      ],
      cta: 'Get Started',
      popular: false,
      color: 'border-gray-200 dark:border-gray-700'
    },
    {
      name: 'Professional',
      price: '2500',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Up to 50 job posts',
        'Advanced AI matching',
        'Priority support',
        'Advanced analytics',
        '20 team members',
        'Custom branding',
        'API access'
      ],
      cta: 'Start Free Trial',
      popular: true,
      color: 'border-primary-500'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited job posts',
        'Enterprise AI matching',
        '24/7 phone support',
        'Custom analytics',
        'Unlimited team members',
        'White-label solution',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-gray-200 dark:border-gray-700'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative">
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={containerVariants}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 dark:bg-primary-900/30 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 mb-6">
              <Briefcase className="h-4 w-4" />
              Pricing
            </div>
          </motion.div>
          
          <motion.h2 variants={containerVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">Simple, Transparent</span>
            <motion.span
              initial={{ backgroundPosition: "200% center" }}
              animate={{ backgroundPosition: "-200% center" }}
              transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
              className="bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Pricing
            </motion.span>
          </motion.h2>
          
          <motion.p variants={containerVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no surprises.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="relative"
            >
              {plan.popular && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-gradient-to-r from-primary-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </motion.div>
              )}
              
              <div className={`h-full bg-white dark:bg-gray-800 rounded-2xl p-8 border ${plan.color} shadow-lg hover:shadow-2xl transition-all duration-300`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <motion.li 
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={
                      plan.name === 'Enterprise'
                        ? '/contact'
                        : plan.name === 'Starter'
                          ? '/register?plan=MONTHLY'
                          : '/register?plan=QUARTERLY'
                    }
                    className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary-600 to-cyan-600 text-white hover:shadow-lg' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RoleCardsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const roles = [
    {
      title: 'Professionals',
      description: 'Advanced tools for career growth',
      icon: '👨‍💼',
      features: [
        'Smart CV Builder',
        'Job Recommendations',
        'Application Tracking',
        'Interview Prep',
        'Salary Insights'
      ],
      color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Employers',
      description: 'Complete hiring management',
      icon: '🏢',
      features: [
        'Candidate Screening',
        'Collaborative Hiring',
        'Career Pages',
        'Analytics Dashboard',
        'HR Integrations'
      ],
      color: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
    },
    {
      title: 'Administrators',
      description: 'Full platform control',
      icon: '⚙️',
      features: [
        'User Management',
        'Platform Analytics',
        'Content Moderation',
        'Billing Management',
        'Workflow Config'
      ],
      color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: EASE_LINEAR
        }}
      />
      
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 variants={containerVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">Designed for</span>
            <motion.span
              initial={{ backgroundPosition: "200% center" }}
              animate={{ backgroundPosition: "-200% center" }}
              transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
              className="bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Every Role
            </motion.span>
          </motion.h2>
          
          <motion.p variants={containerVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tailored experiences for each user in the hiring ecosystem
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid lg:grid-cols-3 gap-8"
        >
          {roles.map((role) => (
            <motion.div
              key={role.title}
              variants={cardVariants}
              whileHover={{ 
                y: -15,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group"
            >
              <div className={`h-full rounded-2xl p-8 border ${role.color} hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                {/* Animated Background Pattern */}
                <motion.div 
                  className="absolute inset-0 opacity-5"
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: EASE_LINEAR
                  }}
                  style={{
                    background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)`,
                    backgroundSize: '200% 200%',
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex flex-col justify-between mb-8">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        scale: { duration: 2, repeat: Infinity },
                        rotate: { duration: 3, repeat: Infinity }
                      }}
                      className="text-5xl"
                    >
                      {role.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {role.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                      {role.description}
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      {role.features.map((feature, index) => (
                        <motion.li 
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                        >
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 w-2 rounded-full bg-primary-500 mr-3"
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/register"
                        className="inline-flex items-center justify-center w-full py-3 px-4 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium border border-gray-200 dark:border-gray-700 transition-colors group/btn"
                      >
                        Get Started as {role.title}
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    
    setIsSubmitting(false);
    setSubmitStatus('success');
    
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      setSubmitStatus('idle');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'contact@jobportal.com', 
      link: 'mailto:contact@jobportal.com'
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: '+1 (234) 567-8900', 
      link: 'tel:+12345678900'
    },
    { 
      icon: MapPin, 
      label: 'Office', 
      value: '123 Tech Street, San Francisco, CA', 
      link: '#'
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)',
            'linear-gradient(45deg, #e2e8f0 0%, #cbd5e1 100%)',
            'linear-gradient(45deg, #cbd5e1 0%, #f8fafc 100%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90" />
      
      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-50 dark:bg-primary-900/30 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 mb-6"
            >
              <Mail className="h-4 w-4" />
              Get in Touch
            </motion.div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              <span className="block">Ready to Transform</span>
              <motion.span
                initial={{ backgroundPosition: "200% center" }}
                animate={{ backgroundPosition: "-200% center" }}
                transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
                className="bg-gradient-to-r from-primary-500 via-cyan-500 to-primary-500 bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                Your Hiring?
              </motion.span>
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions? Our team is here to help you succeed.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Animated Contact Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Reach out for partnership opportunities, support, or custom solutions.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.label}
                      href={info.link}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-start gap-4 group"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="flex-shrink-0"
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <info.icon className="h-5 w-5" />
                        </div>
                      </motion.div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {info.label}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          {info.value}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>

                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Response Time
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We typically respond within 2 hours during business days.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Animated Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="john@company.com"
                        required
                      />
                    </motion.div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="Your Company"
                      />
                    </motion.div>
                    
                    <motion.div 
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="enterprise">Enterprise Solution</option>
                        <option value="partnership">Partnership</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your needs..."
                      required
                    />
                  </motion.div>

                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-4"
                      >
                        <p className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Thank you! Your message has been sent.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-6 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.svg
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: EASE_LINEAR }}
                            className="h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </motion.svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(45deg, #764ba2 0%, #f093fb 100%)',
            'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(45deg, #f5576c 0%, #667eea 100%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container relative z-10">
        <motion.div 
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Animated Background Pattern */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: EASE_LINEAR
            }}
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
          
          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
              >
                Choose Your Perfect
                <br />
                <motion.span
                  initial={{ backgroundPosition: "200% center" }}
                  animate={{ backgroundPosition: "-200% center" }}
                  transition={{ duration: 3, repeat: Infinity, ease: EASE_LINEAR }}
                  className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  Pricing Plan
                </motion.span>
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-200 mb-10"
              >
                Join thousands of companies and professionals already using our platform.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="absolute -inset-1 bg-gradient-to-r from-white to-gray-200 rounded-2xl blur opacity-0 transition-opacity"
                  />
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-primary-700 font-semibold px-10 py-5 shadow-2xl hover:shadow-3xl transition-all duration-300"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: EASE_LINEAR }}
                    >
                      <Rocket className="h-5 w-5" />
                    </motion.div>
                    Start Free Trial
                  </Link>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 px-10 py-5"
                  >
                    Schedule a Demo
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="grid sm:grid-cols-3 gap-6"
              >
                {[
                  { value: '14-day', label: 'Free trial', icon: '⏱️' },
                  { value: '24/7', label: 'Priority support', icon: '🛡️' },
                  { value: 'No credit card', label: 'Required to start', icon: '💳' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-2xl mb-2"
                    >
                      {item.icon}
                    </motion.div>
                    <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-gray-300">{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}