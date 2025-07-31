import './App.css'
import ChatPage from "./pages/chat/ChatPage.tsx";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from "./pages/home/HomePage.tsx";
import Navbar from "./core/components/Navbar.tsx";
import {PrivateRoute} from "./routes/PrivateRoute.tsx";
import LoginPage from "./pages/login/LoginPage.tsx";

function App() {

    return (
        <BrowserRouter>
            <Navbar />
            <div className="pt-15 h-screen">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/chatAI" element={
                        <PrivateRoute>
                            <ChatPage />
                        </PrivateRoute>
                    } />
                    <Route path="*" element={<Navigate to="home" /> } />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App