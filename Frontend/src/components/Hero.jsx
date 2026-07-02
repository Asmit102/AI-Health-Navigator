import {Link} from "react-router-dom";

function Hero (){
    return (
         <section className="min-h-screen">
            <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-between px-6">
            {/* Left Side */}  
            <div className="flex-1 bg-red-200 pr-6"> 
                <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">✨ AI-powered healthcare companion</div>
            </div>
            
            {/* Right Side */}
            <div className="flex-1 bg-blue-200 pl-6">Right Side</div>
         </div>
         </section>
    )
}

export default Hero;