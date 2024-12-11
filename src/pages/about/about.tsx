import './../../index.css'
import './../../style.css'
import '../../components/navbar/navbar'

export default function AboutPage() {
    return (
        <>

            <div className='pt-[68px]'></div>
            <div className='pt-[68px]'></div>
            <div className='w-full flex justify-center'>
                <div className='flex items-center justify-end'>
                    <img
                        src="assets/bg-home.jpg"
                        className="w-[650px] h-[500px] object-cover rounded-xl"
                    />
                    <div className='px-3'></div>
                    <div className='text-white font-bold text-7xl leading-tight'>
                        Every Skill. <br />Every Industry. <br />Your Ideal Job.
                    </div>
                </div>
            </div>
        </>
    );
}