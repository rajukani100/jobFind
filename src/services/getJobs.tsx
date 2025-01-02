import JobCard from "@/components/job-card/jobCard";


const getAllJobs = async (pageNumber: number, query?: string, city?: string) => {

    try {
        var URL = "http://127.0.0.1:8080/jobs?page=" + String(pageNumber)
        if (query != "") {
            URL += `&search=${query}`
        }
        if (city != "") {
            URL += `&city=${city}`
        }
        var res = await fetch(URL);
        var json = await res.json();
        return json;
    }
    catch (error) {
        console.error("Error while fetching data", error);
    }

}
export default getAllJobs;