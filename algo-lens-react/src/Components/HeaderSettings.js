import React from "react";

const HeaderSettings = ({ stepByStepMode, setStepByStepMode }) => {
  const handleModeChange = (event) => {
    setStepByStepMode((prevMode) => !prevMode);
  };

  return (
    <div className="settings-container">
      <h2 className="settings-header">Settings</h2>
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
      </div>
    </div>
  );
};

export default HeaderSettings;
