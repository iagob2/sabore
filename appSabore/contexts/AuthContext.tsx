import React from 'react';

export interface AuthSessionData {
  email: string;
  nome?: string;
}

interface AuthContextValue {
  session: AuthSessionData | null;
  setSession: (s: AuthSessionData) => void;
  clearSession: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = React.useState<AuthSessionData | null>(null);

  const setSession = (s: AuthSessionData) => setSessionState(s);
  const clearSession = () => setSessionState(null);

  const value = React.useMemo(() => ({ session, setSession, clearSession }), [session]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthSession(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuthSession deve ser usado dentro de <AuthProvider>');
  return ctx;
}


