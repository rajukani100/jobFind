import { Input } from "@/components/ui/input"

const Register = () => {
    return (
        <div className='w-full h-full '>
            <div className='w-1/2 h-fit items-center justify-center'>
                <div className='text-xl'>Register</div>

                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="Password" />
            </div>
        </div>
    )
}

export default Register