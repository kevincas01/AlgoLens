import React, { useEffect, useRef } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
const HeaderSettings = ({ stepByStepMode, setStepByStepMode }) => {
  const settingsContainerRef = useRef(null);
  const radioGroupsContainerRef = useRef(null);

  useEffect(() => {
    const settingsContainer = settingsContainerRef.current;
    const radioGroupsContainer = radioGroupsContainerRef.current;

    const handleMouseEnter = () => {
      radioGroupsContainer.style.width = "fit-content";
      radioGroupsContainer.style.height = "fit-content";
    };

    const handleMouseLeave = () => {
      radioGroupsContainer.style.width = "0";
      radioGroupsContainer.style.height = "0";
    };

    // Add event listeners
    settingsContainer.addEventListener("mouseenter", handleMouseEnter);
    settingsContainer.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup to avoid memory leaks
    return () => {
      settingsContainer.removeEventListener("mouseenter", handleMouseEnter);
      settingsContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleModeChange = (event) => {
    setStepByStepMode((prevMode) => !prevMode);
  };

  return (
    <div className="settings-container" ref={settingsContainerRef}>
      <SettingsIcon />
      <div
        className="settings-radio-groups-container"
        ref={radioGroupsContainerRef}
      >
        <div className="settings-radio-group">
          <span
            className={`switch-mode-container ${
              stepByStepMode ? "active" : "inactive"
            }`}
          >
            <input
              type="checkbox"
              name="stepByStepMode"
              checked={stepByStepMode}
              onChange={handleModeChange}
              className="settings-checkbox"
            />
          </span>

          <label htmlFor="stepByStepMode" className="settings-label">
            Step By Step Mode
          </label>
        </div>{" "}
      </div>
    </div>
  );
};

export default HeaderSettings;
