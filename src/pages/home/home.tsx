import TopNav from "../../components/navbar/navbar";
import './../../index.css'
import './../../style.css'
import '../../components/job-card/jobCard'
import CustomFooter from "../../components/footer/footer";
import JobCard from "../../components/job-card/jobCard";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import getAllJobs from "@/services/getJobs";

interface Filters {
    jobType: {
        fullTime: boolean;
        partTime: boolean;
        internship: boolean;
    };
    experienceLevel: {
        entryLevel: boolean;
        midLevel: boolean;
        senior: boolean;
        lead: boolean;
        expert: boolean;
    };
}

const experienceLevels = [
    { id: 'entryLevel', label: 'Entry-level' },
    { id: 'midLevel', label: 'Mid-level' },
    { id: 'senior', label: 'Senior' },
    { id: 'lead', label: 'Lead' },
    { id: 'expert', label: 'Expert' }
];

const jobTypes = [
    { id: 'fullTime', label: 'Full time' },
    { id: 'partTime', label: 'Part Time' },
    { id: 'internship', label: 'Internship' }
];

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [filters, setFilters] = useState<Filters>({
        jobType: {
            fullTime: false,
            partTime: false,
            internship: false
        },
        experienceLevel: {
            entryLevel: false,
            midLevel: false,
            senior: false,
            lead: false,
            expert: false
        }
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobData = await getAllJobs(currentPage, query, city);
                // Apply filters to the fetched data
                const filteredJobs = jobData.filter((job: any) => {
                    const jobTypeMatch = !Object.values(filters.jobType).some(value => value) ||
                        (filters.jobType.fullTime && job.type === 'Full-time') ||
                        (filters.jobType.partTime && job.type === 'Part-time') ||
                        (filters.jobType.internship && job.type === 'Internship');

                    const experienceLevelMatch = !Object.values(filters.experienceLevel).some(value => value) ||
                        (filters.experienceLevel.entryLevel && job.level === 'Entry-Level') ||
                        (filters.experienceLevel.midLevel && job.level === 'Mid-Level') ||
                        (filters.experienceLevel.senior && job.level === 'Senior') ||
                        (filters.experienceLevel.lead && job.level === 'Lead') ||
                        (filters.experienceLevel.expert && job.level === 'Expert');

                    return jobTypeMatch && experienceLevelMatch;
                });
                setJobs(filteredJobs);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, [currentPage, searchQuery, filters, city, query]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value)
    }

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setSearchQuery(`${query} ${city}`);
    }

    const handleFilterChange = (filterType: 'jobType' | 'experienceLevel', key: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: {
                ...prev[filterType],
                [key]: !prev[filterType][key as keyof typeof prev[typeof filterType]]
            }
        }));
    }

    const clearFilters = (filterType: 'jobType' | 'experienceLevel') => {
        setFilters(prev => ({
            ...prev,
            [filterType]: Object.keys(prev[filterType]).reduce((acc, key) => ({
                ...acc,
                [key]: false
            }), {})
        }));
    }

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <>
            <div className="w-full h-full">
                <TopNav />
                <div className="h-11"></div>
                <div className="flex items-center justify-center">
                    <div className="text-4xl w-[270px] font-bold text-cyan-400">
                        Find Millions of job at one place.
                    </div>
                    <form className="gap-4 flex justify-center">
                        <div className="border-[1px] rounded-xl py-1 flex items-center border-gray-500">
                            <div className="flex items-center ml-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                                    <circle cx="11" cy="11" r="7" fill="none" stroke="#6b7280" strokeWidth="2" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#6b7280" strokeWidth="2" />
                                </svg>
                                <input
                                    type="text"
                                    onChange={handleSearchChange}
                                    placeholder="Search by Job title, skills"
                                    className="px-2 py-2 w-[350px] focus:outline-none rounded-md placeholder:text-gray-600"
                                />
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
                                <input
                                    type="text"
                                    onChange={handleCityChange}
                                    placeholder="location"
                                    className="px-2 py-2 focus:outline-none rounded-md placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                        <button
                            className="bg-cyan-400 px-8 py-2 cursor-pointer rounded-xl text-white font-medium"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </form>
                </div>
                <div className="h-[50px]"></div>
                <div className="bg-cyan-400 h-fit w-full px-12 py-5 font-semibold font-sans">
                    <div className="text-3xl text-white">Recommended Job</div>
                    <div className="my-3 flex">
                        <div className="w-[250px] h-fit bg-white rounded-xl p-3 shadow-md">
                            <div>
                                <div className="flex justify-between text-base">
                                    <div>Job Type</div>
                                    <div
                                        className="text-red-600 cursor-pointer"
                                        onClick={() => clearFilters('jobType')}
                                    >
                                        Clear All
                                    </div>
                                </div>
                                {jobTypes.map(({ id, label }) => (
                                    <div key={id} className="px-3 pt-2 items-center">
                                        <input
                                            type="checkbox"
                                            id={id}
                                            checked={filters.jobType[id as keyof typeof filters.jobType]}
                                            onChange={() => handleFilterChange('jobType', id)}
                                            className="input-checkbox"
                                        />
                                        <label htmlFor={id}> {label}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <div className="flex justify-between text-base">
                                    <div>Experience level</div>
                                    <div
                                        className="text-red-600 cursor-pointer"
                                        onClick={() => clearFilters('experienceLevel')}
                                    >
                                        Clear All
                                    </div>
                                </div>
                                {experienceLevels.map(({ id, label }) => (
                                    <div key={id} className="px-3 pt-2 items-center">
                                        <input
                                            type="checkbox"
                                            id={id}
                                            checked={filters.experienceLevel[id as keyof typeof filters.experienceLevel]}
                                            onChange={() => handleFilterChange('experienceLevel', id)}
                                            className="input-checkbox"
                                        />
                                        <label htmlFor={id}> {label}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mx-7 w-full flex flex-wrap gap-2">
                            {jobs.length === 0 ? (
                                <div className="w-full text-center text-gray-500 text-xl font-semibold">
                                    404 Not Found: No jobs match your search criteria.
                                </div>
                            ) : (
                                jobs.map((job: any) => (
                                    <JobCard
                                        key={job.id}
                                        companyName={job.company}
                                        description={job.description}
                                        role={job.role}
                                        level={job.level}
                                        posted_time={job.posted_date}
                                        id={job.id}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg text-white ${currentPage === 1
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            Previous
                        </button>
                        <span className="flex items-center text-white">
                            Page {currentPage}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={jobs.length === 0}
                            className={`px-4 py-2 rounded-lg text-white ${jobs.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
                <CustomFooter />
            </div>
        </>
    );
}

export default HomePage;