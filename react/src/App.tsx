import { useState } from "react";
import { Mode } from "./constants/mode";
import { Navigator } from "./components/Navigator/Navigator";

import './App.css';

export function App() {
  const [showNaviagtion, setNavigation] = useState(1);
  const [mode, setMode] = useState(Mode.ANIMATION_FULL);
  const [step, setStep] = useState(0);
  const [iteration, setIteration] = useState(0);

  return (
    <div className="wrapper">
      <h1>Simplex Demonstrator</h1>
      {
        showNaviagtion &&
        <Navigator></Navigator>
      }
      {
        !showNaviagtion &&
        <>
        
        </>
      }
    </div>
  )
}