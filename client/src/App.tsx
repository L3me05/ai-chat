import './App.css'
import ChatPage from "./pages/chat/ChatPage.tsx";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/home/HomePage.tsx";
import Navbar from "./core/components/Navbar.tsx";

function App() {

  return (
      <BrowserRouter>
          <Navbar />
          <div className="pt-15 h-screen">
              <Routes>
                  <Route path="home" element={<HomePage /> } />
                  <Route path="chatAI" element={<ChatPage /> } />

                  <Route path="*" element={<Navigate to="home" /> } />
              </Routes>
          </div>
      </BrowserRouter>
  )
}

export default App
