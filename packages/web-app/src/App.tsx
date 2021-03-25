import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import './App.css';
import { connectSSE } from './connectSSE';

export const emitter = new Subject<{type: string, data:any}>()

function App() {
  const [tick, setTick] = useState<number>(0);
  const [tock, setTock] = useState<number>(0);
  useEffect(() => {
    connectSSE();
    emitter.subscribe((e) => {
      if(e.type === "tick"){
        setTick(parseInt(e.data));
      } else if(e.type === "tock"){
        setTock(parseInt(e.data));
      }
    });
  }, []);
    
  return (
    <div className="App">
      <header className="App-header">
        <div>Tick : {tick}</div>
        <div>Tock : {tock}</div>
        <p></p>
        <button onClick={() => {
          fetch("http://localhost:3002/tock", {method: "PUT", body: JSON.stringify({tock: tock+1})})
        }}> Tock </button>
      </header>
    </div>
  );
}

export default App;
