import TopNav from "@/components/navbar/navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface JobData {
    id: string;
    company: string;
    role: string;
    description: string;
    level: string;
    posted_date: string;
    location: string;
    ctc: number;
    type: string;
}

const Job = () => {
    let param = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState<JobData | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // Function to fetch job data by ID
        const fetchJobData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/job/${param.id}`);
                if (!response.ok) {
                    throw new Error("Job not found");
                }
                const data: JobData = await response.json();
                setJobData(data);
            } catch (err) {
                setError(true);
            }
        };
        fetchJobData();
    }, [param]);

    if (error) {
        return (
            <>
                <TopNav />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500 text-lg">404 - Not Found</p>
                </div>
            </>
        );
    }

    if (!jobData) {
        return (
            <>
                <TopNav />
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500 text-lg">Loading job details...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <TopNav />
            <div className="max-w-4xl mx-auto p-4">
                <button
                    className="text-cyan-400 mb-4"
                    onClick={() => navigate(-1)}
                >
                    &larr; Back
                </button>
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-cyan-400 mb-4">{jobData.role}</h1>
                    <p className="text-gray-700 mb-2"><strong>Company:</strong> {jobData.company}</p>
                    <p className="text-gray-700 mb-2"><strong>Location:</strong> {jobData.location}</p>
                    <p className="text-gray-700 mb-2"><strong>Type:</strong> {jobData.type}</p>
                    <p className="text-gray-700 mb-2"><strong>Level:</strong> {jobData.level}</p>
                    <p className="text-gray-700 mb-2"><strong>Posted on:</strong> {new Date(jobData.posted_date).toLocaleDateString()}</p>
                    <p className="text-gray-700 mb-4"><strong>CTC:</strong> ₹{jobData.ctc.toLocaleString()}</p>
                    <p className="text-gray-600">{jobData.description}</p>
                    <button className="mt-4 px-4 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500">
                        Apply Now
                    </button>
                </div>
            </div>
        </>
    );
};

export default Job;
