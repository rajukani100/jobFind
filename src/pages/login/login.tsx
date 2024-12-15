import TopNav from "@/components/navbar/navbar";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <div className="w-full h-screen flex items-center justify-center" >
                <div className="w-1/3 h-fit p-6 flex flex-col items-center justify-center bg-white shadow-md rounded-lg border-[1px]" >
                    <div className="text-3xl mb-4" > Login </div>

                    <Input type="email" placeholder="Email" className="mb-4 focus-visible:ring-transparent" />
                    <Input type="password" placeholder="Password" className="mb-2 focus-visible:ring-transparent" />
                    <div className="w-full text-sm mb-2 ml-3">
                        <div>Don't have account ?<Link to={"/register"}><span className="text-cyan-400 cursor-pointer ml-1"> Register</span></Link></div>
                    </div>
                    <Link className={buttonVariants({ variant: "outline", className: "bg-cyan-400 hover:bg-cyan-300 font-bold text-white hover:text-white w-full" })} to={"/"} > Submit </Link>


                </div>
            </div>
        </>
    );
};

export default Login;
