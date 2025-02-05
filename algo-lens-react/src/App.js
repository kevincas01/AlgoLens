import logo from "./logo.svg";
import "./App.css";
import MaxHeap from "./Data Structures/Heap/MaxHeap";
import MinHeap from "./Data Structures/Heap/MinHeap";
import HeaderSettings from "./Components/HeaderSettings";
import { useState } from "react";
import Stack from "./Data Structures/Stack/Stack";
import Queue from "./Data Structures/Queue/Queue";
import LinkedList from "./Data Structures/LinkedList/LinkedList";
import Sorting from "./Algorithms/Sorting";
import PathFinding from "./Algorithms/PathFinding";

function App() {
  const [stepByStepMode, setStepByStepMode] = useState(false);
  return (
    <div className="App">
      <HeaderSettings
        stepByStepMode={stepByStepMode}
        setStepByStepMode={setStepByStepMode}
      />
      <PathFinding stepByStepMode={stepByStepMode} />
      <Sorting stepByStepMode={stepByStepMode} />
      <LinkedList stepByStepMode={stepByStepMode} />
      <MaxHeap stepByStepMode={stepByStepMode} />
      <MinHeap stepByStepMode={stepByStepMode} />
      <Stack stepByStepMode={stepByStepMode} />
      <Queue stepByStepMode={stepByStepMode} />
    </div>
  );
}

export default App;
