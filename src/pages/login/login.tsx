import TopNav from "@/components/navbar/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IsAuthenticated } from "@/services/auth";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type FormData = {
    email: string;
    password: string;
};

const Login = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const verifyAuth = async () => {
            if (await IsAuthenticated()) {
                navigate("/");
            }
        }
        verifyAuth();
    }, [navigate]);

    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name);
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            // Handle successful response
            const successData = await response.json()
            setSuccessMessage(successData.message);
            navigate("/")
        } catch (error: any) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="w-full h-screen flex items-center justify-center" >
                    <div className="w-1/3 h-fit p-6 flex flex-col items-center justify-center bg-white shadow-md rounded-lg border-[1px]" >
                        <div className="text-3xl mb-4" > Login </div>

                        <Input type="email" name="email" placeholder="Email" className="mb-4 focus-visible:ring-transparent" onChange={handleChange} value={formData.email} />
                        <Input type="password" name="password" placeholder="Password" className="mb-2 focus-visible:ring-transparent" value={formData.password} onChange={handleChange} />

                        {/* Success Message */}
                        {successMessage && (
                            <div className="text-green-500 text-sm mb-2">{successMessage}</div>
                        )}

                        {/* Error Message */}
                        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                        <div className="w-full text-sm mb-2 ml-3">
                            <div>Don't have account ?<Link to={"/register"}><span className="text-cyan-400 cursor-pointer ml-1"> Register</span></Link></div>
                        </div>
                        <Button className={buttonVariants({ variant: "outline", className: "bg-cyan-400 hover:bg-cyan-300 font-bold text-white hover:text-white w-full" })} type="submit"> Submit </Button>


                    </div>
                </div>
            </form>
        </>
    );
};

export default Login;
