const fs = require('fs');

let content = fs.readFileSync('src/components/Timeline/Timeline.jsx', 'utf8');

// The script above already ran, replacing physical with logical padding.
// Let's rewrite TimelineCard completely to be perfectly adapted for RTL and LTR without mirrored weirdness.

const newCard = `function TimelineCard({ item, isEven }) {
  return (
    <motion.div
      className="relative rounded-3xl p-6 sm:p-8 md:p-10 bg-white/[0.02] border border-white/5 backdrop-blur-xl overflow-hidden
                 transition-all duration-500 group shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.04] hover:border-gold/20 w-full 
                 text-start"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-gold/10 via-rose/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3 sm:gap-4 items-start">
        <div className="flex items-center gap-3 justify-start">
          <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs sm:text-sm font-medium tracking-widest backdrop-blur-md">
            {item.date}
          </span>
        </div>
        
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-gold transition-colors duration-300 drop-shadow-md">
          {item.title}
        </h3>
        
        <p className="text-white/70 leading-relaxed text-sm sm:text-base md:text-lg font-light text-start">
          {item.description}
        </p>
        
        <div className="flex items-center gap-3 mt-2 justify-start">
          <div className="w-8 sm:w-12 h-[1px] bg-rose/40" />
          <span className="text-rose/80 text-xs sm:text-sm italic font-medium tracking-wide">
            {item.emotion}
          </span>
        </div>
      </div>
    </motion.div>
  )
}`;

content = content.replace(/function TimelineCard\(\{\s*item,\s*isEven\s*\}\) \{[\s\S]*?return \([\s\S]*?\}\s*\)/, newCard);

fs.writeFileSync('src/components/Timeline/Timeline.jsx', content);
