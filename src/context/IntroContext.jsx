import { createContext, useContext, useState } from "react";

const IntroContext = createContext();

export const useIntro = () => {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error("useIntro must be used within an IntroProvider");
  }
  return context;
};

export const IntroProvider = ({ children }) => {
  // Always show intro on app load / refresh
  const [showIntro, setShowIntro] = useState(true);

  const completeIntro = () => {
    setShowIntro(false);
  };

  const resetIntro = () => {
    setShowIntro(true);
  };

  return (
    <IntroContext.Provider
      value={{
        showIntro,
        completeIntro,
        resetIntro,
      }}
    >
      {children}
    </IntroContext.Provider>
  );
};