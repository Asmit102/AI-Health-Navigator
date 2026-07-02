import {Link} from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

function Navbar (){
    return (
        <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-8  ">

        {/* Left Section */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
            <FaHeartbeat className="text-white text-xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Health Navigator
          </h1>
        </Link>

        {/* Center Section */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-gray-600 hover:text-teal-600 transition">
            Features
          </a>

          <a href="#how-it-works" className="text-gray-600 hover:text-teal-600 transition">
            How it works
          </a>

          <a href="#trust" className="text-gray-600 hover:text-teal-600 transition">
            Trust & Safety
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="text-gray-700 font-medium hover:text-teal-600 transition"
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition whitespace-nowrap"
            >
             Get Started
            </Link>
        </div>
      </div>
    </nav>

    )
}
export default Navbar;