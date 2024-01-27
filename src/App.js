import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlayerPage from "./pages/PlayerPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/player" element={<PlayerPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
