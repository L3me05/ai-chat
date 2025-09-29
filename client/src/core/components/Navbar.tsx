import logo from "../../assets/logo.png"
import { Link, useLocation } from "react-router-dom";
import AuthButtons from "./AuthButtons.tsx";

function Navbar() {
    const location = useLocation();

    return (
        <>
            <div className="fixed h-15 z-10 top-0 right-0 left-0 bg-white/90 border-b border-gray-200/80 shadow-xl px-4 flex justify-between ">
                <div className="flex flex-1/6 items-center ">
                    <img src={logo} alt="Logo" className="h-15 w-15 rounded-full"/>
                    <h1 className="hidden sm:block text-2xl text-sky-700 font-bold">MySites</h1>
                </div>
                <div className="flex flex-5/6 gap-8 items-center text-xl text-sky-700 font-semibold md:justify-center justify-end">
                    <div className="">
                        <Link to="/" className={`hover:text-sky-500 transition-colors ${location.pathname === '/' ? 'text-sky-500' : ''}`}>
                            Home
                        </Link>
                    </div>
                    <div className="">
                        <Link to="/chatAI" className={`hover:text-sky-500 transition-colors ${location.pathname === '/chatAI' ? 'text-sky-500' : ''}`}>
                            Agent
                        </Link>
                    </div>
                    <div className="md:flex-4/6 flex justify-end">
                        <AuthButtons className="header-auth-buttons" />
                    </div>



                </div>

            </div>
        </>
    );
}

export default Navbar;