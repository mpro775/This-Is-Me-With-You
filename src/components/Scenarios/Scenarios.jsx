import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useJourney } from '../../hooks/useJourney'
import scenariosData from '../../data/scenarios.json'

function ScenarioCard({ scenario, isActive, onSelect, index }) {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        className={`w-full text-right rounded-2xl p-5 md:p-6 border transition-all duration-500 cursor-pointer overflow-hidden relative group
                   ${isActive
                     ? 'border-gold/40 bg-gold/[0.06]'
                     : 'border-white/[0.04] bg-white/[0.015] hover:border-gold/15 hover:bg-gold/[0.03]'
                   }`}
        onClick={() => onSelect(scenario.id)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Active glow */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,165,116,0.06)_0%,transparent_60%)] pointer-events-none"
            layoutId="scenarioGlow"
          />
        )}

        <div className="relative z-10 flex items-center gap-4">
          <span className="text-3xl md:text-4xl shrink-0">{scenario.emoji}</span>
          <div>
            <h3 className={`text-lg md:text-xl font-bold transition-colors duration-300 ${isActive ? 'text-gold' : 'text-text-primary group-hover:text-gold'}`}>
              {scenario.title}
            </h3>
            <p className="text-text-muted text-sm mt-1 font-light">{scenario.description}</p>
          </div>
        </div>
      </motion.button>
    </motion.div>
  )
}

function ScenarioView({ scenario }) {
  const { state, dispatch } = useJourney()
  const choice = state.scenarioChoices[scenario.id]
  const selectedChoice = scenario.choices.find((c) => c.id === choice)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8"
    >
      {/* Scenario intro */}
      <motion.div
        className="bg-gradient-card rounded-2xl p-6 md:p-8 mb-6"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-text-secondary leading-[1.9] text-base md:text-lg font-light">{scenario.intro}</p>
      </motion.div>

      {/* Choices */}
      {!choice ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenario.choices.map((c, index) => (
            <motion.button
              key={c.id}
              className="text-right rounded-xl p-5 border border-rose/15 bg-rose/[0.03]
                       hover:border-rose/40 hover:bg-rose/[0.06]
                       transition-all duration-500 cursor-pointer group relative overflow-hidden"
              onClick={() =>
                dispatch({
                  type: 'MAKE_CHOICE',
                  payload: { scenarioId: scenario.id, choiceId: c.id },
                })
              }
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.15 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                            bg-[radial-gradient(circle_at_50%_100%,rgba(201,123,139,0.08)_0%,transparent_60%)]" />
              <p className="relative z-10 text-rose-light/90 font-medium text-[15px] leading-relaxed">{c.text}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          className="bg-gradient-card rounded-2xl p-6 md:p-8 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Choice header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose/50" />
            <span className="text-xs text-rose/70 tracking-wider">اخترتِ</span>
            <span className="text-xs text-rose-light/80">{selectedChoice?.text}</span>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-rose/15 via-rose/8 to-transparent mb-5" />

          <p className="text-text-secondary/90 leading-[2] text-[15px] md:text-base font-light">
            {selectedChoice?.response}
          </p>

          {/* Emotion tag */}
          <motion.div
            className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/[0.06] border border-gold/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60" />
            <span className="text-gold/80 text-xs font-medium">{selectedChoice?.emotion}</span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function Scenarios() {
  const [activeScenario, setActiveScenario] = useState(null)
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()

  const selectedScenario = scenariosData.find((s) => s.id === activeScenario)

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden" id="scenarios">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f0a14] to-[#0a0a0f]" />

      {/* Section title */}
      <motion.div
        ref={titleRef}
        className="relative z-10 text-center mb-16 md:mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="text-text-muted text-xs tracking-[0.3em] uppercase block mb-4">
          عيشي اللحظة
        </span>
        <h2 className="text-4xl md:text-6xl font-bold text-shimmer mb-4">
          تخيلي معي...
        </h2>
        <p className="text-text-secondary/70 text-base md:text-lg font-light">اختاري سيناريو واصنعي اللحظة</p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold/30" />
          <div className="w-1 h-1 rounded-full bg-gold/40" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold/30" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scenariosData.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isActive={activeScenario === scenario.id}
              onSelect={setActiveScenario}
              index={index}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedScenario && (
            <ScenarioView key={selectedScenario.id} scenario={selectedScenario} />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
