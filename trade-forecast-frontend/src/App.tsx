import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import Simulator from './pages/Simulator';
import Explainability from './pages/Explainability';
import Explorer from './pages/Explorer';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/explainability" element={<Explainability />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
