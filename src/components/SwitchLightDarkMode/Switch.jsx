import { useState } from "react";
import { useColorScheme } from "@mui/material/styles";

import "./Switch.css";

function Switch() {
  const { mode, setMode } = useColorScheme();

  const handleSwitchMode = (modeValue) => {
    setMode(modeValue);
  };

  const [isLight, setIsLight] = useState(mode === "dark" ? true : false);

  const onToggle = () => {
    setIsLight(!isLight);
    handleSwitchMode(!isLight ? "dark" : "light");
  };

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isLight} onChange={onToggle} />
      <span className="switch" />
    </label>
  );
}
export default Switch;
