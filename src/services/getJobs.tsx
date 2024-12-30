import JobCard from "@/components/job-card/jobCard";


const getAllJobs = async (pageNumber: number) => {

    try {
        var URL = "http://127.0.0.1:8080/jobs?page=" + String(pageNumber);
        var res = await fetch(URL);
        var json = await res.json();
        return json;
    }
    catch (error) {
        console.error("Error while fetching data", error);
    }

}
export default getAllJobs;