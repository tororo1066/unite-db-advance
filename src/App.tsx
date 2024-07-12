import './App.css'
import NavBar from "./navbar/NavBar.tsx";
import {CacheContextProvider} from "./CacheSystem.tsx";
import AttackSpeedCalc from "./components/AttackSpeedCalc.tsx";

function App() {

  return (
    <>
        <CacheContextProvider>
            <NavBar />
            <AttackSpeedCalc />
        </CacheContextProvider>
    </>
  )
}

export default App
