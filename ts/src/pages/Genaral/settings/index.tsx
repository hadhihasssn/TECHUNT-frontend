import React, { useState } from "react";
import AfterLoginHeader from "../../../components/General/Home/Header/afterLoginHeader";
import Footer from "../../../components/General/Home/footer/footer";
import { ArrowBack, NumbersSharp } from "@mui/icons-material";
import NumberVerifcation from "../../../components/General/settings/numberVerifiactions/numberVerifcation";
import CheckoutForm from "../../../components/General/settings/numberVerifiactions/bankDetailsForm";
import { useSelector } from "react-redux";
import { ROOTSTORE } from "../../../redux/store";


const Settings: React.FC = () => {
    const [tab, setTab] = useState<number>(2)
    const tabElements = [<NumberVerifcation />, <CheckoutForm onUpdate={() => { }} />, <div></div>]
    const userData = useSelector((state: ROOTSTORE) => state.signup)
    return (
        <div>
            <AfterLoginHeader />
            <div className="w-full h-auto flex mb-20">
                <div className="flex flex-col justify-between flex-1 m-16 border-r-2 w-auto">
                    <nav className="-mx-3 space-y-6 w-auto">
                        <div className="space-y-4 "
                            onClick={() => history.back()}>
                            <ArrowBack />
                            <label className=" text-md font-sans font-semibold">Back</label>
                        </div>
                        <div className="space-y-3 ">
                            {
                                !userData.numberVerify && <>
                                    <a className="flex items-center px-3 py-2 text-black dark:text-gray-400 transition-colors duration-300 transform rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                                        <NumbersSharp />
                                        <span
                                            onClick={() => setTab(0)}
                                            className="mx-2 text-sm font-medium">Phone Verified</span>
                                    </a>
                                </>
                            }
                        </div>
                    </nav>
                </div>
                <div className="w-[75%] h-auto mb-3">
                    <div className="mt-20 mb-5">
                        {
                            tabElements[tab]
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Settings








































































