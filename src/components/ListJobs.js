import { useEffect, useState } from "react"
import { BASE_URI } from './http';

export default function ListJob() {

    const [jobs, setJobs] = useState({});
    const [users, setUsers] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(0);
    const [selectedJob, setSelectedJob] = useState(null);
    useEffect(() => {

        fetch(BASE_URI + '/jobs')
            .then(response => response.json())
            .then((data) => {
                setJobs(data);
            }).catch((error) => { console.log(error) });

        fetch(BASE_URI + '/users')
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
            }).catch((error) => { console.log(error) })
    }, []);

    function getJobDetails(id) {
        fetch(BASE_URI + '/jobs/' + id)
            .then(response => response.json())
            .then((data) => {
                // setJobs(data);
                setSelectedJob(data);
                console.log(data);
            }).catch((error) => { console.log(error) })
    }

    return (
        <div className="jobs-list">
            <div className="flex gap-2 p-4 flex-col items-center">
                Select Users to apply for job as login is not implemented
                <h1 className="text-xl text-red-300">Users List</h1>
                <select className="w-[200px] h-8 border border-black" onChange={(e) => setSelectedUserId(e.target.value)}>
                    <option></option>
                    {
                        users && users?.rows?.map((user) => (<option key={user.id} value={user.id}>{user.name}: {user.role}</option>))
                    }
                </select>
            </div>
            <h1 className="text-center font-bold text-4xl text-fuchsia-400 p-4">Available Jobs</h1>
            {
                jobs?.rows?.length > 0 ?
                    <div className="grid md:grid-cols-4 grid-cols-1 p-4 gap-2">
                        {
                            jobs.rows.map((job) => (<JobCard {...{
                                title: job.title, description: job.description,
                                onClick: () => getJobDetails(job.id)
                            }} key={job.id} />))
                        }
                    </div> : <div>Loading ...</div>
            }
            {selectedJob && <JobDetails jobMeta={selectedJob} setSelectedJob={setSelectedJob} selectedUserId={selectedUserId} />}
        </div>
    )
}


function JobCard({ title, description, onClick }) {
    return (
        <div className="shadow-lg gap-2 w-max-content border p-2 pr-4 pl-4 rounded-md flex flex-col bg-zinc-800 text-white hover:shadow-2xl cursor-pointer">
            <span className="text-red-200 text-xl">{title}</span>
            <span className="w-[100px] truncate text-sm">{description}</span>
            <div className="flex-1 flex justify-end">
                <button className="border p-2 rounded-md" onClick={onClick}>View Details</button>
            </div>
        </div>
    )
}

function JobDetails({ jobMeta, setSelectedJob, selectedUserId }) {
    function applyJob() {
        if (selectedUserId == 0) { return alert("Please select a user") }
        fetch(BASE_URI + '/jobs/apply', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                job_id: jobMeta.id,
                user_id: Number(selectedUserId)
            })
        })
            .then(response => response.json())
            .then((data) => {
                // setJobs(data);
                console.log(data);
                alert("Applied Successfully");
            }).catch((error) => { console.log(error) })
    }

    return (
        <div className="bg-[rgba(0,0,0,0.8)] absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center z-10">
            <div className="bg-white p-2 pt-2 rounded-lg z-10 w-[400px] h-[200px] overflow-auto">

                <span className="text-white bg-black p-1 pr-2 pl-2 rounded-md float-right cursor-pointer hover:shadow-lg" onClick={() => setSelectedJob(null)}>x</span>
                <h1 className="text-2xl  flex justify-between">
                    <span>Job Details</span>
                </h1>
                <hr className="mt-2" />
                <br />
                <span className="text-2xl text-red-300">{jobMeta.title}</span>
                <div className="p-1">{jobMeta.description}</div>
                <button className="border text-black p-2 rounded-md bg-yellow-500 float-right" onClick={() => {
                    applyJob();
                }}>Apply Now</button>
            </div>
        </div>
    )
}