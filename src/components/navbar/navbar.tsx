import { Link } from "react-router-dom";

const TopNav = () => {
    return (

        <div>
            <div className="h-[68px] w-full"></div>
            <div className="fixed top-0 w-full border-b bg-white">
                <div className="container mx-auto px-10 h-[68px] flex justify-between items-center">
                    {/* Logo */}
                    <div className=" text-3xl font-extrabold tracking-wide flex justify-between items-center">
                        {/* <img src="assets/logo.png" className="h-16" /> */}
                        <a href="#" className="ml-4 text-cyan-400">jobFind</a>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex space-x-12 text-lg font-medium">
                        <li>
                            <a href="#home" className="">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="#about" className="">
                                Opportunity
                            </a>
                        </li>
                        <li>
                            <a href="#services" className="">
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="#contact" className="">
                                About
                            </a>
                        </li>
                    </ul>

                    {/* Call-to-Action Button */}
                    <div className="flex">
                        <Link to={"/login"}>
                            <div className=" bg-cyan-400 text-white px-6 border-2 border-cyan-400 py-2 rounded-sm font-bold hover:shadow-lg transition cursor-pointer"
                            >
                                Login
                            </div>
                        </Link>
                        <Link to={"/register"}>
                            <div className=" text-cyan-400 border-2 ml-4 border-cyan-400 px-6 py-2 rounded-sm font-bold hover:shadow-lg transition cursor-pointer"
                            >
                                Register
                            </div>
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default TopNav;
