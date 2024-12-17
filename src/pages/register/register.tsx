import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IsAuthenticated } from '../../services/auth'

type FormData = {
    name: string;
    email: string;
    password: string;
};

const Register = () => {

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
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch("http://localhost:8080/register", {
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
        } catch (error: any) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="w-1/3 h-fit p-6 flex flex-col items-center justify-center bg-white shadow-md rounded-lg border-[1px]">
                <div className="text-3xl mb-4">Register</div>

                {/* Form for handling submission */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <Input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mb-4 focus-visible:ring-transparent"
                    />
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mb-4 focus-visible:ring-transparent"
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mb-2 focus-visible:ring-transparent"
                    />

                    {/* Success Message */}
                    {successMessage && (
                        <div className="text-green-500 text-sm mb-2">{successMessage}</div>
                    )}

                    {/* Error Message */}
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                    <div className="w-full text-sm mb-2 ml-3">
                        <div>
                            Already have an account?
                            <Link to={"/login"}>
                                <span className="text-cyan-400 cursor-pointer ml-1">Login</span>
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className={buttonVariants({
                            variant: "outline",
                            className: "bg-cyan-400 hover:bg-cyan-300 font-bold text-white hover:text-white w-full",
                        })}
                        type="submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
