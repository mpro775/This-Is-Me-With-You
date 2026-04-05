import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function Climax() {
  const [answered, setAnswered] = useState(false);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.15);

  const [heartPositions] = useState(() =>
    [...Array(18)].map((_, i) => {
      const angle = (i * 20 * Math.PI) / 180;
      const radius = 70 + Math.random() * 80;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius - 30,
        emoji: ["\uD83D\uDC9B", "\uD83E\uDD0D", "\u2728", "\uD83D\uDCAB"][
          i % 4
        ],
        scale: 0.8 + Math.random() * 0.8,
        delay: i * 0.04,
      };
    }),
  );

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      id="climax"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#1a0a14] to-[#0a0a0f]" />

      {/* Multi-layer glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,165,116,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-[15%] bg-[radial-gradient(circle,rgba(201,123,139,0.04)_0%,transparent_60%)]" />
      </div>

      <motion.div
        ref={titleRef}
        className="relative z-10 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={titleVisible ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
      >
        {/* Closing message - cinematic reveal */}
        <motion.p
          className="text-text-muted text-sm md:text-base tracking-wider mb-10 font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          وصلنا لهنا... بعد كل شيء
        </motion.p>

        <motion.h2
          className="text-3xl md:text-5xl lg:text-7xl font-bold leading-relaxed mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <span className="text-text-primary/90">بعد كل اللي مرّينا فيه</span>
        </motion.h2>

        <motion.h2
          className="text-3xl md:text-5xl lg:text-7xl font-bold leading-relaxed mb-8"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={
            titleVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 1.2, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-shimmer">أنا ما زلت أختارك</span>
        </motion.h2>

        <motion.p
          className="text-text-secondary/70 text-sm md:text-lg leading-[2] max-w-xl mx-auto mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={titleVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.8 }}
        >
          "مررنا بلحظات جميلة… وأيام صعبة\n" + "ضحكنا… وتعبنا… وبعدنا أحيانًا\n"
          + "لكن الشيء الوحيد اللي ما تغيّر؟\n" + "إني في كل مرة… أرجع وأختارك"
        </motion.p>

        {/* Divider */}
        <motion.div
          className="flex items-center gap-3 justify-center mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={titleVisible ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-rose/30" />
          <div className="w-1 h-1 rounded-full bg-rose/40" />
          <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-rose/30" />
        </motion.div>

        {/* Interactive question/answer */}
        <AnimatePresence mode="wait">
          {!answered ? (
            <motion.div
              key="question"
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={titleVisible ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 2.5 }}
            >
              <p className="text-rose-light/80 text-xl md:text-2xl font-medium glow-rose">
              فهل… تختارينني أنا أيضًا؟
              </p>

              <motion.button
                className="group relative px-14 py-4 rounded-full text-gold text-lg md:text-xl font-bold
                         overflow-hidden cursor-pointer"
                onClick={() => setAnswered(true)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 rounded-full gradient-border" />
                <span className="absolute inset-[1px] rounded-full bg-bg-primary/90 group-hover:bg-gold/10 transition-colors duration-500" />
                <motion.span
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(212, 165, 116, 0.08)",
                      "0 0 40px rgba(212, 165, 116, 0.2)",
                      "0 0 20px rgba(212, 165, 116, 0.08)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10">نعم… أختارك</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              className="flex flex-col items-center gap-6 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Hearts explosion */}
              <div className="relative w-1 h-1">
                {heartPositions.map((pos, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xl md:text-2xl"
                    style={{ originX: 0.5, originY: 0.5 }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      opacity: [0, 1, 1, 0],
                      scale: [0, pos.scale, pos.scale, 0],
                    }}
                    transition={{
                      duration: 2,
                      delay: pos.delay,
                      ease: "easeOut",
                    }}
                  >
                    {pos.emoji}
                  </motion.span>
                ))}
              </div>

              {/* Main love text */}
              <motion.p
                className="text-4xl md:text-7xl font-black text-shimmer leading-tight"
                initial={{ scale: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, filter: "blur(0px)" }}
                transition={{
                  delay: 0.4,
                  duration: 1,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
              >
               يا بنت قلبي… أحبك
              </motion.p>

              <motion.p
                className="text-text-secondary/60 text-base md:text-lg font-light mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
              >
                مو بس اليوم… بل كل يوم جاي
              </motion.p>

              {/* Subtle expanding glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: 600, height: 600, opacity: 1 }}
                transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-[radial-gradient(circle,rgba(212,165,116,0.06)_0%,transparent_60%)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer credit */}
      <motion.p
        className="absolute bottom-6 text-text-muted/25 text-[10px] tracking-[0.2em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        صُنع بكل الحب
      </motion.p>
    </section>
  );
}
