import TopNav from "../../components/navbar/navbar";
import './../../index.css'
import './../../style.css'
import '../../components/job-card/jobCard'
import CustomFooter from "../../components/footer/footer";
import JobCard from "../../components/job-card/jobCard";
import { useEffect, useState } from "react";
import getAllJobs from "@/services/getJobs";

const HomePage = () => {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobData = await getAllJobs(1);
                setJobs(jobData);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };

        fetchJobs();
    }, [])



    return (
        <>
            <div className="w-full h-full">
                <TopNav />
                <div className="h-11"></div>
                <div className="flex items-center justify-center">
                    <div className="text-4xl w-[270px] font-bold text-cyan-400">Find Millions of job at one place.</div>
                    <form className="gap-4 flex justify-center">
                        <div className="border-[1px] rounded-xl py-1 flex items-center border-gray-500">
                            <div className="flex items-center ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                                    <circle cx="11" cy="11" r="7" fill="none" stroke="#6b7280" strokeWidth="2" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#6b7280" strokeWidth="2" />
                                </svg>

                                <input type="text" placeholder="Search by Job title, skills" className="px-2 py-2 w-[350px] focus:outline-none rounded-md placeholder:text-gray-600" />
                            </div>
                            <div className="h-9 w-[1px] bg-gray-500 mx-2"></div>
                            <div className="flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                                    <path
                                        d="M12 2C8.13 2 5 5.13 5 9c0 3.87 7 13 7 13s7-9.13 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                        fill="none"
                                        stroke="#6b7280"
                                        strokeWidth="2"
                                    />
                                </svg>
                                <input type="text" placeholder="location" className="px-2 py-2 focus:outline-none rounded-md placeholder:text-gray-600" />
                            </div>
                        </div>
                        <button className="bg-cyan-400 px-8 py-2 cursor-pointer rounded-xl text-white font-medium">Search</button>
                    </form>
                </div >
                <div className="h-[50px]"></div>
                <div className="bg-cyan-400 h-fit w-full px-12 py-5 font-semibold	font-sans">
                    <div className="text-3xl text-white">Recommended Job</div>
                    <div className="my-3 flex">
                        <div className="w-[240px] h-fit bg-white rounded-xl p-3 shadow-md">
                            <div>
                                <div className="flex justify-between text-base">
                                    <div>Job Type</div>
                                    <div className="text-red-600 cursor-pointer">Clear All</div>
                                </div>
                                <div className="px-3 pt-2 items-center">
                                    <input type="checkbox" name="fulltime" className="input-checkbox" />
                                    <label htmlFor="fulltime"> Full time</label>
                                </div>
                                <div className="px-3 items-center">
                                    <input type="checkbox" name="parttime" className="input-checkbox" />
                                    <label htmlFor="parttime"> Part Time</label>
                                </div>
                                <div className="px-3 items-center">
                                    <input type="checkbox" name="intership" className="input-checkbox" />
                                    <label htmlFor="internship"> Internship</label>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between text-base">
                                    <div>Experience level</div>
                                </div>
                                <div className="px-3 pt-2 items-center">
                                    <input type="checkbox" name="entrylevel" className="input-checkbox" />
                                    <label htmlFor="entrylevel"> Entry-level</label>
                                </div>
                                <div className="px-3 items-center">
                                    <input type="checkbox" name="midlevel" className="input-checkbox" />
                                    <label htmlFor="midlevel"> Mid-level</label>
                                </div>
                                <div className="px-3 items-center">
                                    <input type="checkbox" name="senior" className="input-checkbox" />
                                    <label htmlFor="senior"> Senior</label>
                                </div>
                                <div className="px-3 items-center">
                                    <input type="checkbox" name="lead" className="input-checkbox" />
                                    <label htmlFor="lead"> Lead</label>
                                </div>
                                <div className="px-3 items-center">
                                    <input type="checkbox" name="expert" className="input-checkbox" />
                                    <label htmlFor="expert"> Expert</label>
                                </div>
                            </div>

                        </div>
                        <div className="mx-7 w-full flex flex-wrap gap-2">
                            {jobs.map((job: any) => (
                                <JobCard key={job.id} companyName={job.company} description={job.description} role={job.role} level={job.level} posted_time={job.posted_date} id={job.id} />
                            ))}
                        </div>
                    </div>

                    <div>

                    </div>
                    <div className="h-6">


                    </div>

                </div>



                <CustomFooter />

            </div >
        </>
    );
}

export default HomePage;