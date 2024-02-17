import Avatar from "react-avatar";
import Header from "../../components/General/Home/Header/header";
import Footer from "../../components/General/Home/footer/footer";
import { ProgressBar } from "../../components/General/progressBar";
import { useSelector } from "react-redux";
import { ROOTSTORE } from "../../redux/store";
import Button from '@mui/material/Button';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientRoutes, talent_routes } from "../../routes/pathVariables";
import { storeWorkBasedDataBioData } from "../../api/talent.Api";
import Alert from '@mui/material/Alert';



const AddSkills: React.FC = () => {
    const data = useSelector((state: ROOTSTORE) => state.signup);
    const [text, setText] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const addSkill = () => {
        if (text.trim() !== "") {
            // Check if the skill already exists in the array
            if (!skills.includes(text.trim())) {
                setSkills(prevSkills => [...prevSkills, text.trim()]);
                setText("");
                setError("");
            } else {
                setError("Skill already exists");
                setTimeout(() => {
                    setError("");
                }, 3000);
            }
        }
    };

    const removeSkill = (index: number) => {
        setSkills(prevSkills => prevSkills.filter((_, idx) => idx !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        setError(""); // Clear error message when input changes
    };

    const handleClick = () => {
        let dataString: string | null = localStorage.getItem("talent_Data");
        let data: { skills?: string[] } = dataString ? JSON.parse(dataString) : {};
        if (skills.length >= 5) {
            setError("")
            data.skills = skills;
            localStorage.setItem("talent_Data", JSON.stringify(data));

            storeWorkBasedDataBioData(data)
                .then((res) => {
                    console.log(res.data)
                    navigate(clientRoutes.ADD_PROFILE_DESCRIPTION);
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                });
        }else{
            setError("Minimum 5 skill you want ")
            setTimeout(() => {
                setError("");
            }, 300);
        }
    };


    return (
        <div>
            <Header layout={true} />
            <div className="w-full flex justify-center items-center">
                <div className="w-[700px] flex justify-center items-center xl:[700px] md:w[1100px] sm:w-[650px] xs:w-[550px] flex-col h-[35rem] mt-16 mb-16 border shadow-2xl rounded-lg">
                    <Button />
                    <div className="w-[80%] h-[95%]">
                        <div className="flex w-full pt-9">
                            <div className="flex items-center justify-center">
                                <div>
                                    <Avatar name={data.email} size="33" round />
                                </div>
                                <div className="text-opacity-40 text-center text-stone-800 text-xs ml-1 font-medium font-sans underline">
                                    {data.email ? data.email : "hadhi@gmail.com"}
                                </div>
                            </div>
                            <div className="pl-[5rem] pt-1.5">
                                <p className="text-xl font-medium tracking-tight text-gray-900 ">Create profile</p>
                            </div>
                        </div>
                        <div className="mt-10">
                            <div className="flex justify-between">
                                <p onClick={() => history.back()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                </p>
                                <p>1/2</p>
                            </div>
                            <div className="pt-2 ">
                                {/* <ProgressBar value={40} /> */}
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="w-full">
                                <h1 className="text-2xl font-medium tracking-tight text-gray-900">Add your skills.</h1>
                                <p className="text-xs pt-4 font-normal">Add skills that increase your rating.</p>

                                <input
                                    value={text}
                                    onChange={handleChange}
                                    id="message"
                                    className="block mt-4 p-2.5 w-full text-sm bg-gray-50 rounded-lg border focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:text-neutral-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Example: node js | react js"
                                />
                                <label className="text-red-500 text-sm font-medium" onClick={addSkill}>+ Add skills</label>
                                {error && <Alert severity="warning">{error}</Alert>}
                                <div className="flex flex-wrap mt-2">
                                    {skills &&
                                        skills.map((value, key) => (
                                            <div key={key} className="flex items-center mt-2 mr-2">
                                                <p
                                                    className={`bg-red-500 text-white rounded-xl text-center text-sm border relative ${value.length > 10 ? 'w-[10rem]' : 'w-[10rem]'
                                                        }`}
                                                >
                                                    {value}
                                                    <label
                                                        className="mr-4 bg-red-500 text-white h-[8px] ml-2 rounded-xl absolute right-0 cursor-pointer"
                                                        onClick={() => removeSkill(key)}
                                                    >
                                                        X
                                                    </label>
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="flex justify-center items-center mt-8">
                                <button onClick={handleClick} className="w-[250px] mx-auto items-center text-white h-[35.31px] bg-red-500 rounded-[100px]">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddSkills;
