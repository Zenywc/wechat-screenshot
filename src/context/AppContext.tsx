import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { AppState, AppAction, Message, BubbleType } from '../types';

// ---- Helpers ----

function createDefaultMessage(bubbleType: BubbleType = 'received'): Message {
  return {
    id: crypto.randomUUID(),
    avatar: null,
    username: '',
    time: '',
    text: '',
    bubbleType,
    revokeId: '你',
    showRevoke: false,
    quote: '',
  };
}

// ---- Reducer ----

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return { ...state, messages: [...state.messages, action.payload] };
    }

    case 'UPDATE_MESSAGE': {
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        ),
      };
    }

    case 'DELETE_MESSAGE': {
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== action.payload.id),
      };
    }

    case 'MOVE_MESSAGE': {
      const idx = state.messages.findIndex((m) => m.id === action.payload.id);
      if (idx === -1) return state;
      const target = action.payload.direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= state.messages.length) return state;
      const messages = [...state.messages];
      [messages[idx], messages[target]] = [messages[target], messages[idx]];
      return { ...state, messages };
    }

    case 'DUPLICATE_MESSAGE': {
      const original = state.messages.find((m) => m.id === action.payload.id);
      if (!original) return state;
      const idx = state.messages.indexOf(original);
      const copy: Message = { ...original, id: crypto.randomUUID() };
      const messages = [...state.messages];
      messages.splice(idx + 1, 0, copy);
      return { ...state, messages };
    }

    case 'CLEAR_ALL': {
      return { messages: [] };
    }

    default:
      return state;
  }
}

// ---- Context ----

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  defaultMessage: () => Message;
}

const AppContext = createContext<AppContextValue | null>(null);

// ---- Initial state ----

const initialState: AppState = {
  messages: [
    {
      id: crypto.randomUUID(),
      avatar: null,
      username: '',
      time: '',
      text: '',
      bubbleType: 'received',
      revokeId: '你',
      showRevoke: false,
      quote: '',
    },
  ],
};

// ---- Provider ----

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value: AppContextValue = {
    state,
    dispatch,
    defaultMessage: createDefaultMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ---- Hook ----

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}
