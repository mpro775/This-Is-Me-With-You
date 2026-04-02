import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Sparkles,
  MessageCircle,
  Heart,
  Flame,
  Star,
  Infinity as InfinityIcon,
} from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import timelineData from "../../data/timeline.json";

const icons = {
  sparkles: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
  message: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
  heart: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />,
  fire: <Flame className="w-5 h-5 sm:w-6 sm:h-6" />,
  star: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
  infinity: <InfinityIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
};

function TimelineCard({ item }) {
  return (
    <motion.div
      className="relative w-full max-w-[520px] rounded-3xl p-6 sm:p-8 md:p-10 bg-white/[0.02] border border-white/5 backdrop-blur-xl overflow-hidden
                 transition-all duration-500 group shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.04] hover:border-gold/20
                 text-start"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-gold/10 via-rose/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative z-10 flex w-full flex-col items-end gap-3 sm:gap-4 text-right">
        <div className="flex w-full items-center justify-end gap-3">
          <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs sm:text-sm font-medium tracking-widest backdrop-blur-md">
            {item.date}
          </span>
        </div>

        <h3 className="w-full text-right text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-gold transition-colors duration-300 drop-shadow-md">
          {item.title}
        </h3>

        <p className="w-full text-right text-white/70 leading-relaxed text-sm sm:text-base md:text-lg font-light">
          {item.description}
        </p>

        <div className="mt-2 flex w-full items-center justify-end gap-3">
          <span className="text-rose/80 text-xs sm:text-sm italic font-medium tracking-wide">
            {item.emotion}
          </span>
          <div className="h-[1px] w-8 sm:w-12 bg-rose/40" />
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItem({ item, index }) {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col md:flex-row items-start mb-16 sm:mb-24 md:mb-28 w-full"
      initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
      animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Right side */}
      <div
        className={`hidden md:flex w-1/2 ${isEven ? "justify-start pl-8 lg:pl-16" : ""}`}
      >
        {isEven && <TimelineCard item={item} />}
      </div>

      {/* Center Icon */}
      <div className="relative md:absolute md:left-1/2 md:top-8 md:-translate-x-1/2 z-20 flex items-center justify-center mb-6 md:mb-0">
        <div className="absolute top-[-80px] bottom-[-40px] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-gold/50 to-gold/20 md:hidden" />
        <motion.div
          className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#050508] border-2 border-gold/30 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,165,116,0.15)] z-10"
          whileHover={{
            scale: 1.15,
            borderColor: "rgba(212, 165, 116, 0.8)",
            boxShadow: "0 0 40px rgba(212,165,116,0.4)",
          }}
          animate={isVisible ? { scale: [0.8, 1.1, 1], opacity: [0, 1] } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-2 rounded-full bg-gold/5 blur-md" />
          <span className="relative z-10 drop-shadow-[0_0_8px_rgba(212,165,116,0.6)]">
            {icons[item.icon] || icons.heart}
          </span>
        </motion.div>
      </div>

      {/* Left side */}
      <div
        className={`hidden md:flex w-1/2 ${!isEven ? "justify-end pr-8 lg:pr-16" : ""}`}
      >
        {!isEven && <TimelineCard item={item} />}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full px-4 relative z-10">
        <TimelineCard item={item} />
      </div>
    </motion.div>
  );
}

function AnimatedLine() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const glowTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 top-40 bottom-20 w-[2px] hidden md:block -translate-x-1/2"
    >
      {/* Background track */}
      <div className="absolute inset-0 bg-white/[0.03] rounded-full" />

      {/* Animated glowing fill line */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gold/80 via-rose/60 to-gold/80 origin-top rounded-full shadow-[0_0_15px_rgba(212,165,116,0.5)]"
        style={{ scaleY }}
      />

      {/* Leading Glow Particle */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8),0_0_40px_rgba(212,165,116,0.6)]"
        style={{ top: glowTop }}
      >
        <div className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75" />
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section
      className="relative py-24 sm:py-32 md:py-48 px-4 sm:px-6 overflow-hidden bg-[#050508]"
      id="timeline"
    >
      {/* Ambient Backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,165,116,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,123,139,0.03),transparent_50%)] pointer-events-none" />

      {/* Section Header */}
      <motion.div
        ref={titleRef}
        className="relative z-20 mx-auto mb-16 md:mb-24 flex w-full max-w-2xl flex-col items-center text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="mx-auto mb-4 flex w-fit items-center justify-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={titleVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-gold/50" />
          <span className="text-gold/80 text-sm md:text-base font-semibold leading-none">
            فصول حكايتنا
          </span>
          <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-gold/50" />
        </motion.div>
        
        <h2 className="mb-4 w-full text-center bg-gradient-to-r from-white via-gold-light to-white bg-clip-text text-4xl sm:text-5xl md:text-6xl font-black text-transparent drop-shadow-lg">
          رحلة القلوب
        </h2>
        
        <p className="w-full px-2 text-center text-white/60 text-base md:text-lg font-light leading-relaxed">
          كل لحظة كانت تبني ما نحن عليه اليوم، محفورة في الذاكرة ومكتوبة بالذهب.
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <AnimatedLine />

        <div className="relative flex flex-col pt-10">
          {timelineData.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
