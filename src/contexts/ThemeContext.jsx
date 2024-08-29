import { createContext, useEffect } from "react";
import { DateTime } from "luxon";

import { useColorScheme } from "@mui/material/styles";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // =================================================================
  const { mode, setMode } = useColorScheme();

  // =================================================================
  useEffect(() => {
    const updateTheme = () => {
      const bangkokTime = DateTime.now().setZone("Asia/Bangkok");
      const hour = bangkokTime.hour;
      const newTheme = hour >= 18 || hour < 6 ? "dark" : "light";

      setMode(newTheme);
    };

    updateTheme(); // Set theme on initial load
    const intervalId = setInterval(updateTheme, 3600000); // Update every hour

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
