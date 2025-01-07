import logo from "./logo.svg";
import "./App.css";
import MaxHeap from "./Data Structures/Heap/MaxHeap";
import MinHeap from "./Data Structures/Heap/MinHeap";
import HeaderSettings from "./Components/HeaderSettings";
import { useState } from "react";

function App() {
  const [stepByStepMode, setStepByStepMode] = useState(false);
  return (
    <div className="App">
      <HeaderSettings
        stepByStepMode={stepByStepMode}
        setStepByStepMode={setStepByStepMode}
      />
      <MaxHeap
        stepByStepMode={stepByStepMode}
        setStepByStepMode={setStepByStepMode}
      />
      <MinHeap
        stepByStepMode={stepByStepMode}
        setStepByStepMode={setStepByStepMode}
      />
    </div>
  );
}

export default App;
