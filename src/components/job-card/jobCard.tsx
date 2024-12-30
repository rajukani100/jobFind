import { formatDistanceToNow } from "date-fns";
import { NavLink } from "react-router-dom";

type JobCardProps = {
    companyName: string;
    description?: string; // Optional, has a default value
    ctc?: string;         // Optional, has a default value
    role?: string;        // Optional, has a default value
    level?: string;
    posted_time?: string;
    id?: string;
};

const JobCard = ({
    companyName,
    id,
    description = "",
    level = "",
    role = "",
    posted_time = "",

}: JobCardProps) => {

    const relativeTime = formatDistanceToNow(new Date(posted_time), { addSuffix: true });


    return (
        <div className="w-[380px] h-fit bg-white rounded-xl p-4">
            <div className="flex gap-3 items-center">
                <div>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/6033/6033716.png"
                        className="h-10 w-10 rounded-md"
                        alt={`${companyName} logo`}
                    />
                </div>
                <div>
                    <div className="text-lg leading-tight">{role || "Product Manager"}</div>
                    <div className="text-base leading-tight">{companyName || "Meta"}</div>
                </div>
            </div>
            <div className="h-2"></div>
            <div className="text-xs bg-gray-300 inline p-1 rounded-md">{level || "Full Time"}</div>
            <div className="text-sm font-medium text-gray-600 line-clamp-2 overflow-hidden mt-3">
                {description ||
                    "Detailed description goes here. This will be truncated after two lines with an ellipsis if it's too long. You can add multiple sentences, and it will show only the first two lines."}
            </div>
            <div className="h-3"></div>
            <div className="flex justify-between items-center pt-2 px-3 rounded-lg">
                {/* "View More" Button */}
                <NavLink to={`http://localhost:5173/job/${id}`}>
                    <div
                        className="text-base font-medium cursor-pointer text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                        View More
                    </div>
                </NavLink>

                <div className="text-xs text-gray-500 italic flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mr-1"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h6" />
                        <circle cx="12" cy="12" r="9" />
                    </svg>
                    Posted {relativeTime}
                </div>
            </div>
        </div>
    );
}
export default JobCard;