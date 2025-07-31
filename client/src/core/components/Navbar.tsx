import logo from "../../assets/logo.png"
import { Link, useLocation } from "react-router-dom";
import AuthButtons from "./AuthButtons.tsx";

function Navbar() {
    const location = useLocation();

    return (
        <>
            <div className="fixed h-15 z-10 top-0 right-0 left-0 bg-white/90 border-b border-gray-200/80 shadow-xl px-4 flex">
                <div className="flex flex-2/12 items-center">
                    <img src={logo} alt="Logo" className="h-15 w-15 rounded-full"/>
                    <h1 className="text-2xl text-sky-700 font-bold">MySites</h1>
                </div>
                <div className="flex gap-8 items-center text-xl text-sky-700 font-semibold">
                    <Link to="/" className={`hover:text-sky-500 transition-colors ${location.pathname === '/' ? 'text-sky-500' : ''}`}>
                        Home
                    </Link>
                    <Link to="/chatAI" className={`hover:text-sky-500 transition-colors ${location.pathname === '/chatAI' ? 'text-sky-500' : ''}`}>
                        Agent
                    </Link>
                </div>
                <div className="flex flex-row-reverse flex-8/12 gap-4  items-center text-xl text-sky-700 font-semibold">
                    {/*<button className="hover:text-sky-500 transition-colors">Login</button>*/}
                    {/*<button className="hover:text-sky-500 transition-colors">Signing</button>*/}
                    <AuthButtons className="header-auth-buttons" />
                </div>
            </div>
        </>
    );
}

export default Navbar;