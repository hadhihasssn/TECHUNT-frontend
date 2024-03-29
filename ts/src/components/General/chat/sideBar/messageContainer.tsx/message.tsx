import { useSelector } from "react-redux";
import { ROOTSTORE } from "../../../../../redux/store";
import { forwardRef } from "react";
import { MessageDoc } from '../../../../../interface/interfaces';
import { IMG_URL } from "../../../../../constant/columns";
import DoneIcon from '@mui/icons-material/Done';
import { DoneAll } from "@mui/icons-material";

const Message = forwardRef(({ message, index }: { message: MessageDoc, index: number },) => {
    const id: string = useSelector((state: ROOTSTORE) => state.signup.id) || "";
    const conversation = useSelector((state: ROOTSTORE) => state.conversation);
    const messageFromMe: boolean = id === message?.senderId as string;
    const firstParticipantProfileDp = conversation?.selectedConversations?.participants[0]?.Profile?.profile_Dp;
    return (
        <div
            className={` ${messageFromMe ? "col-start-6 col-end-13" : "col-start-1 col-end-8"} p-3 rounded-lg`}
            key={index}
        >

            <div className={`flex  ${messageFromMe ? "items-center justify-start flex-row-reverse" : "flex-row items-center"}`}>
                {
                    !messageFromMe &&
                    <img src={`${IMG_URL}${firstParticipantProfileDp}`} alt="" className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-red-500" />
                }
                <div
                    className={`relative ${messageFromMe ? "mr-3 text-sm bg-indigo-100" : "ml-3 text-sm bg-white"} py-2 px-4 shadow rounded-xl `}
                >
                    <div className="chat-bubble chat chat-start">{message.message}</div>
                    {
                        message?.senderId === id && (
                            message.read ? <DoneAll color='primary' fontSize="inherit" /> : <DoneIcon fontSize="inherit" color='primary' />
                        )
                    }
                    {/* <label className=' text-end text-xs font-sans text-gray-400'>{formatRelativeTime(message.updatedAt)}</label> */}
                </div>
            </div>
        </div>
    );
});

export default Message;