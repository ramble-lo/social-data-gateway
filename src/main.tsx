import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ReactGA from "react-ga4";

ReactGA.initialize("G-9QYF7YEC7J");

createRoot(document.getElementById("root")!).render(<App />);
