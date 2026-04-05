import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, ChevronLeft, Trophy, Sparkles } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useJourney } from '../../hooks/useJourney'
import quizData from '../../data/quiz.json'

const { questions, results } = quizData

function getResult(score, total) {
  const percentage = (score / total) * 100
  if (percentage === 100) return results.perfect
  if (percentage >= 70) return results.great
  if (percentage >= 50) return results.good
  return results.low
}

function ProgressBar({ current, total }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-text-muted text-xs mb-2">
        <span>السؤال {current + 1} من {total}</span>
        <span>{Math.round(((current) / total) * 100)}%</span>
      </div>
      <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold/70 via-rose/60 to-purple-soft/60 rounded-full"
          animate={{ width: `${((current) / total) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function QuestionView({ question, onAnswer, answered, selectedChoice }) {
  const isCorrect = selectedChoice === question.correct

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      {/* Question */}
      <motion.div
        className="bg-gradient-card rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-gold/60 text-lg font-bold shrink-0 mt-1">
            {String(question.id).padStart(2, '0')}
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-text-primary leading-relaxed">
            {question.question}
          </h3>
        </div>
      </motion.div>

      {/* Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.choices.map((choice, index) => {
          let choiceStyle = 'border-white/[0.06] bg-white/[0.02] hover:border-gold/20 hover:bg-gold/[0.03]'
          
          if (answered) {
            if (index === question.correct) {
              choiceStyle = 'border-green-500/40 bg-green-500/[0.08]'
            } else if (index === selectedChoice && !isCorrect) {
              choiceStyle = 'border-red-400/30 bg-red-400/[0.06]'
            } else {
              choiceStyle = 'border-white/[0.03] bg-white/[0.01] opacity-50'
            }
          }

          return (
            <motion.button
              key={index}
              className={`text-right rounded-xl p-4 md:p-5 border transition-all duration-300
                         ${answered ? 'cursor-default' : 'cursor-pointer'} ${choiceStyle}
                         relative overflow-hidden group`}
              onClick={() => !answered && onAnswer(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
              whileHover={!answered ? { y: -2, scale: 1.01 } : {}}
              whileTap={!answered ? { scale: 0.97 } : {}}
            >
              {!answered && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                              bg-[radial-gradient(circle_at_50%_100%,rgba(212,165,116,0.05)_0%,transparent_60%)]" />
              )}
              
              <div className="relative z-10 flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border
                               ${answered && index === question.correct
                                 ? 'border-green-500/50 text-green-400 bg-green-500/10'
                                 : answered && index === selectedChoice && !isCorrect
                                   ? 'border-red-400/50 text-red-400 bg-red-400/10'
                                   : 'border-white/10 text-text-muted bg-white/[0.03]'
                               }`}>
                  {answered && index === question.correct ? '✓' : 
                   answered && index === selectedChoice && !isCorrect ? '✗' :
                   String.fromCharCode(1571 + index)}
                </span>
                <span className={`text-sm md:text-base font-medium leading-relaxed
                               ${answered && index === question.correct ? 'text-green-400' :
                                 answered && index === selectedChoice && !isCorrect ? 'text-red-400/80' :
                                 'text-text-secondary/90'}`}>
                  {choice}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* After answer feedback */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`rounded-xl p-4 border ${isCorrect
              ? 'border-green-500/20 bg-green-500/[0.04]'
              : 'border-rose/15 bg-rose/[0.03]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{isCorrect ? '🎉' : '💡'}</span>
              <span className={`text-sm font-bold ${isCorrect ? 'text-green-400' : 'text-rose-light'}`}>
                {isCorrect ? 'إجابة صحيحة!' : 'ليست الإجابة المتوقعة'}
              </span>
            </div>
            <p className="text-text-muted text-xs">{question.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ResultView({ score, total, onRestart }) {
  const result = getResult(score, total)
  const percentage = Math.round((score / total) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      {/* Result card */}
      <motion.div
        className="bg-gradient-card rounded-2xl p-8 md:p-12 relative overflow-hidden"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,165,116,0.08)_0%,transparent_60%)]" />

        <div className="relative z-10">
          {/* Emoji */}
          <motion.div
            className="text-6xl md:text-7xl mb-6"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            {result.emoji}
          </motion.div>

          {/* Score circle */}
          <motion.div
            className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full border-2 border-gold/30 flex items-center justify-center mb-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="absolute inset-0 rounded-full bg-gold/[0.05]" />
            <div className="relative z-10 text-center">
              <span className="text-3xl md:text-4xl font-bold text-gold tabular-nums">{score}</span>
              <span className="text-gold/50 text-sm">/{total}</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-shimmer mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {result.title}
          </motion.h3>

          {/* Message */}
          <motion.p
            className="text-text-secondary/80 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {result.message}
          </motion.p>

          {/* Percentage */}
          <motion.p
            className="text-text-muted text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            نسبة الإجابات الصحيحة: <span className="text-gold font-bold">{percentage}%</span>
          </motion.p>

          {/* Restart button */}
          <motion.button
            className="mt-8 px-6 py-3 rounded-full border border-gold/20 bg-gold/[0.05]
                       hover:border-gold/40 hover:bg-gold/[0.1] transition-all duration-300
                       text-gold text-sm font-medium flex items-center gap-2 mx-auto cursor-pointer"
            onClick={onRestart}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={16} />
            جربي مرة ثانية
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Quiz() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation()
  const { state, dispatch } = useJourney()

  const savedScore = state.quizScore
  const savedCompleted = state.quizCompleted

  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(savedScore || 0)
  const [answered, setAnswered] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [showResult, setShowResult] = useState(savedCompleted || false)
  const [started, setStarted] = useState(savedCompleted || false)

  const handleAnswer = useCallback((choiceIndex) => {
    setSelectedChoice(choiceIndex)
    setAnswered(true)
    const isCorrect = choiceIndex === questions[currentQ].correct
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
  }, [currentQ])

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1)
      setAnswered(false)
      setSelectedChoice(null)
    } else {
      // Quiz complete
      const finalScore = score + (selectedChoice === questions[currentQ].correct ? 0 : 0)
      setShowResult(true)
      dispatch({ type: 'COMPLETE_QUIZ', payload: { score: score } })
    }
  }, [currentQ, score, selectedChoice, dispatch])

  const handleRestart = useCallback(() => {
    setCurrentQ(0)
    setScore(0)
    setAnswered(false)
    setSelectedChoice(null)
    setShowResult(false)
    dispatch({ type: 'RESET_QUIZ' })
  }, [dispatch])

  const handleStart = useCallback(() => {
    setStarted(true)
    setShowResult(false)
    setCurrentQ(0)
    setScore(0)
    setAnswered(false)
    setSelectedChoice(null)
  }, [])

  return (
    <section className="relative py-24 md:py-36 px-6 overflow-hidden" id="quiz">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#100a14] to-[#0a0a0f]" />

      {/* Section title */}
      <motion.div
        ref={titleRef}
        className="relative z-10 text-center mb-16 md:mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={titleVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <span className="text-text-muted text-xs tracking-[0.3em] uppercase block mb-4">
          اختبري نفسك
        </span>
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-purple-soft" style={{ textShadow: '0 0 10px rgba(139,122,173,0.4), 0 0 30px rgba(139,122,173,0.2)' }}>
            قد إيش تعرفيني؟
          </span>
        </h2>
        <p className="text-text-secondary/70 text-base md:text-lg font-light">
          {questions.length} أسئلة... كل إجابة تقربك أكثر
        </p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-purple-soft/30" />
          <div className="w-1 h-1 rounded-full bg-purple-soft/40" />
          <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-purple-soft/30" />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!started ? (
            /* Start screen */
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                className="bg-gradient-card rounded-2xl p-8 md:p-12"
                whileHover={{ y: -3 }}
              >
                <div className="text-5xl mb-6">🧠</div>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                  هل تعرفيني فعلاً؟
                </h3>
                <p className="text-text-secondary/70 text-sm md:text-base font-light mb-8 max-w-sm mx-auto leading-relaxed">
                  {questions.length} أسئلة عن تفاصيلنا... بعضها سهل وبعضها يحتاج تركيز.
                  جاهزة؟
                </p>
                <motion.button
                  className="px-8 py-3 rounded-full bg-purple-soft/15 border border-purple-soft/30
                           hover:bg-purple-soft/25 hover:border-purple-soft/50
                           text-purple-soft font-semibold text-base transition-all duration-300 cursor-pointer
                           flex items-center gap-2 mx-auto"
                  onClick={handleStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={18} />
                  يلا نبدأ!
                </motion.button>
              </motion.div>
            </motion.div>
          ) : showResult ? (
            <ResultView
              key="result"
              score={score}
              total={questions.length}
              onRestart={handleRestart}
            />
          ) : (
            <motion.div key={`q-${currentQ}`}>
              <ProgressBar current={currentQ} total={questions.length} />
              <QuestionView
                question={questions[currentQ]}
                onAnswer={handleAnswer}
                answered={answered}
                selectedChoice={selectedChoice}
              />

              {/* Next button */}
              <AnimatePresence>
                {answered && (
                  <motion.div
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      className="px-8 py-3 rounded-full bg-gold/10 border border-gold/25
                               hover:bg-gold/20 hover:border-gold/40
                               text-gold font-semibold text-sm transition-all duration-300 cursor-pointer
                               flex items-center gap-2"
                      onClick={handleNext}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentQ < questions.length - 1 ? (
                        <>
                          السؤال التالي
                          <ChevronLeft size={18} />
                        </>
                      ) : (
                        <>
                          شوفي النتيجة
                          <Trophy size={18} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
