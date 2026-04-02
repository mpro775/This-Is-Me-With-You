import { createContext, useReducer, useEffect } from 'react'

export const JourneyContext = createContext(null)

const STORAGE_KEY = 'our-story-journey'

const initialState = {
  currentSection: 'hook',
  hookCompleted: false,
  scenarioChoices: {},
  messagesOpened: [],
  hasStartedJourney: false,
  climaxReached: false,
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...initialState, ...JSON.parse(saved) }
    }
  } catch {
    // ignore parse errors
  }
  return initialState
}

function journeyReducer(state, action) {
  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, currentSection: action.payload }
    case 'COMPLETE_HOOK':
      return { ...state, hookCompleted: true, currentSection: 'hero' }
    case 'START_JOURNEY':
      return { ...state, hasStartedJourney: true, currentSection: 'timeline' }
    case 'MAKE_CHOICE':
      return {
        ...state,
        scenarioChoices: {
          ...state.scenarioChoices,
          [action.payload.scenarioId]: action.payload.choiceId,
        },
      }
    case 'OPEN_MESSAGE':
      return {
        ...state,
        messagesOpened: state.messagesOpened.includes(action.payload)
          ? state.messagesOpened
          : [...state.messagesOpened, action.payload],
      }
    case 'REACH_CLIMAX':
      return { ...state, climaxReached: true }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function JourneyProvider({ children }) {
  const [state, dispatch] = useReducer(journeyReducer, null, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return (
    <JourneyContext.Provider value={{ state, dispatch }}>
      {children}
    </JourneyContext.Provider>
  )
}
