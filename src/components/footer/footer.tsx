import { Link } from "react-router-dom";

export default function CustomFooter() {
    return (
        <footer className="bg-gray-700 shadow-lg">
            <div className="w-full max-w-screen-xl mx-auto px-4 py-6 md:py-10">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to={"/"} className="flex items-center mb-4 sm:mb-0">
                        <span className="self-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 hover:from-blue-200 hover:to-white transition-colors duration-300">
                            jobFind
                        </span>
                    </Link>

                    <ul className="flex flex-wrap items-center text-sm font-medium text-gray-300 space-x-4">
                        {['About', 'Privacy Policy', 'Licensing', 'Contact'].map((item) => (
                            <li key={item}>
                                <div className="hover:text-white hover:underline underline-offset-4 transition-all duration-200 cursor-pointer">
                                    {item}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <hr className="my-6 border-gray-600 sm:mx-auto lg:my-8" />

                <div className="text-center text-gray-400 text-sm">
                    <span>© 2024
                        <span className="mx-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 font-semibold">
                            jobFind™
                        </span>
                        All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}