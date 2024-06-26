import { Card } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { JobInterface } from '../../../interface/interfaces'
import { Button, notification, Space } from 'antd';
import ProposalForm from "../../Talent/propsalForm";
import { useSelector } from "react-redux";
import { ROOTSTORE } from "../../../redux/store";
import { useParams } from "react-router-dom";
import { fetchAllJobPostForTalent } from "../../../services/talentApiService";

type RouteParams = {
    id :string
}

const InvitationJobView = () => {
    const { id } = useParams<RouteParams>()
    const basicData = useSelector((state: ROOTSTORE) => state.signup)
    const close = () => {
        localStorage.removeItem("deatildView")
    };
    const [post, setPost] = useState<JobInterface | null>(null)
    const [term, setTerm] = useState<boolean>(false)
    useEffect(() => {
        fetchAllJobPostForTalent()
        .then((res)=>{
            setPost(res?.data?.data?.filter((value:JobInterface) => value?._id === id)[0])
        })
    }, [])
    const [api, contextHolder] = notification.useNotification();
    const openNotification = () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Space>
                <Button type="link" size="small" onClick={() => {
                    setTerm(true)
                    api.destroy()
                }}>
                    Accept the terms and conditions
                </Button>
            </Space>
        );
        api.open({
            message: 'Payment Required',
            description:
                'Please note that if the client accepts this proposal, a fee of 5000 rupees will be charged.Otherwise, no charge will apply.',
            btn,
            key,
            onClose: close,
        });
    };
    const handleclearLocal = () => {
        localStorage.removeItem("deatildView")
    }
    return (
        <>
            <div className=" flex justify-center  mt-8">
                <Card color="white" shadow={false} placeholder={undefined} className="border shadow-xl rounded-xl w-[70%] h-auto" >
                    <div
                        onClick={() => {
                            handleclearLocal()
                            history.back()
                        }} className="container w-full   h-[40px] flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mt-1 ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="mt-1">Back</p>
                    </div>
                    <div className=" w-[100%] flex  h-full border-t">
                        {/* left side  */}
                        <div className="w-[75%]  h-full border">
                            <div className="flex justify-between m-5">
                                <div>
                                    <p className=" font-bold">{post?.Title}</p>
                                    <p className="mt-2 text-sm text-gray-600">{post?.createdAt as string || ""}Posted 3 hours ago</p>
                                </div>
                                <div>
                                    <p> <b>${post?.Amount} USD</b>    <span className="text-red-500 font-semibold">{post?.WorkType}</span></p>
                                </div>
                            </div>
                            <div className="m-5 font-semibold text-sm">
                                <p className='font-sans text-gray-700 mt-2 text-sm font-normal' dangerouslySetInnerHTML={{ __html: post?.Description as string }}></p>
                            </div>
                            <div className="border-b-2"></div>
                            <div>
                                <p className="font-semibold m-5">Skills</p>
                                <div className="flex mb-5 m-1">
                                    {post &&
                                        post.Skills.map((value, key) => (<>
                                            <div key={key} className="flex">
                                                <span
                                                    className={`bg-red-500 text-white rounded-xl text-center text-sm border  ${value?.length > 10 ? 'w-[10rem]' : 'w-[10rem]'
                                                        }`}
                                                >
                                                    {value}
                                                </span>
                                            </div>
                                            {key === 3 && <><br /> </>}
                                        </>
                                        ))}
                                </div>
                            </div>
                            <div className='border-b-2'></div>
                            <div className="flex justify-between font-sans">
                                <div className="w-[33%] h-[20vh] border-r-2 ">
                                    <p className="m-5 text-center font-semibold">Estimated timeline </p>
                                    <p className="m-5 text-center text-sm font-semibold">{post?.TimeLine}</p>
                                </div>
                                <div className="w-[33%] h-[20vh] border-r-2 ">
                                    <p className="m-5 text-center font-semibold">Expertise level</p>
                                    <p className="m-5 text-center text-sm font-semibold">{post?.Expertiselevel}</p>
                                </div>
                                <div className="w-[33%] h-[20vh]">
                                    <p className="m-5 text-center font-semibold">Work type</p>
                                    <p className="m-5 text-center text-sm font-semibold">{post?.WorkType}</p>
                                </div>
                            </div>
                            <div className='border-b-2'></div>
                        </div>
                        {/* right side */}
                        <div className="sm:w-[25%]">
                            {
                                basicData.role == "TALENT" && <>
                                    <div className="w-full  font-sans flex flex-col p-5">
                                        <button onClick={openNotification} className="bg-red-500 border mt-5 rounded-full py-1 text-white font-semibold">Submit propsoal</button>
                                        <button className="border border-black mt-2 text-black py-1 font-semibold   rounded-full">Save</button>
                                        {contextHolder}
                                    </div>
                                </>
                            }
                            <div className="font-sans  mt-5  border-b-2 w-full">
                                <p className="ml-5 text-xl font-semibold">About the client</p>
                                <p className="ml-5 mb-1 text-xs">{typeof post?.Client_id === "object" ? post?.Client_id?.City as string || "" : ""  } <span className="ml-1 text-xs">{typeof post?.Client_id === "object" ? post?.Client_id?.Country as string || "" : ""  }</span> </p>
                                <p className="ml-5 mb-1 text-xs">2 jobs posted</p>
                                <p className="ml-5 mb-1 text-xs">It's currently 4:45 PM here</p>
                                <p className="ml-5 mb-5 text-xs">Joined {typeof post?.Client_id === 'object' ? post.Client_id.createdAt as string || "" : ""}</p>
                            </div>
                        </div>
                    </div>
                </Card>
                <ProposalForm
                    isOpen={term}
                    forClose={setTerm}
                />
            </div>
        </>
    );
}
export default InvitationJobView;