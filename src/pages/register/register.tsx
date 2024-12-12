import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Register = () => {
    return (
        <div className= "w-full h-screen flex items-center justify-center" >
        <div className="w-1/3 h-fit p-6 flex flex-col items-center justify-center bg-white shadow-md rounded-lg" >
            <div className="text-3xl mb-4" > Register </div>

                < Input type = "text" placeholder = "Name" className = "mb-4 focus-visible:ring-transparent" />
                    <Input type="email" placeholder = "Email" className = "mb-4 focus-visible:ring-transparent" />
                        <Input type="text" placeholder = "Age" className = "mb-4 focus-visible:ring-transparent" />
                            <Input type="password" placeholder = "Password" className = "mb-4 focus-visible:ring-transparent" />
                                <Link className={ buttonVariants({ variant: "outline", className: "bg-cyan-400 hover:bg-cyan-300 font-bold text-white hover:text-white w-full" }) } to = { "/"} > Submit </Link>


                                    </div>
                                    </div>
    );
};

export default Register;
