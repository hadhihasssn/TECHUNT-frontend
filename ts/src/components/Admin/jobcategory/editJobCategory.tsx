/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useState, useEffect } from "react"
import { IMG_URL } from "../../../constant/columns";
import { editJobCategory } from "../../../services/adminApiService";
import { descriptionRegex, nameRegex, maxLength, minLength } from '../../../constant/validation'

interface JobCategoryFormProps {
    formData: {
        _id?: string;
        name: string,
        description: string,
        image: File | null
    };
    success: (message: string) => void,
    error: (message: string) => void,
    reCall: () => void
}
interface ValidattionInterface {
    nameError: string,
    descriptionError: string,
    imageError: string,
}
const JobCategoryForm: React.FC<JobCategoryFormProps> = ({ formData, success, error, reCall }) => {
    const [image, setimg] = useState<File | null>(null)
    const [inputData, setData] = useState<{ name: string, description: string, image: File | null }>({
        name: formData?.name,
        description: formData?.description,
        image: formData?.image
    })
    const [errors, setErrors] = useState<ValidattionInterface>({
        nameError: "",
        descriptionError: "",
        imageError: "",
    });
    const changeData = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value }: { name: string, value: string } = e.target;
        if (e.target instanceof HTMLInputElement) {
            if (e.target.name === 'image' && e.target.files && e.target.files.length > 0) {
                const selectedImage = e.target.files[0];
                const allowedTypes = ['image/jpeg', 'image/png'];
                const maxSize = 5 * 1024 * 1024;
                if (!allowedTypes.includes(selectedImage.type)) {
                    setErrors({ ...errors, imageError: 'Only JPEG and PNG images are allowed' });
                    return;
                }
                if (selectedImage.size > maxSize) {
                    setErrors({ ...errors, imageError: 'Image size exceeds 5MB' });
                    return;
                }
                setErrors({ ...errors, imageError: "" });
                setimg(e.target.files[0])
                setData({
                    ...inputData,
                    image: selectedImage,
                });
            } else {
                let error = ""
                switch (name) {
                    case 'name':
                        if (!value.match(nameRegex)) {
                            error = 'Name must contain only letters';
                        } else if (value.trim().length < minLength.name || value.trim().length > maxLength.name) {
                            error = `Name must be between ${minLength.name} and ${maxLength.name} characters`;
                        }
                        setErrors({ ...errors, nameError: error });
                        break;
                    case 'description':
                        if (!value.match(descriptionRegex)) {
                            error = 'Description must contain only letters';
                        } else if (value.trim().length < minLength.description || value.trim().length > maxLength.description) {
                            error = `Description must be between ${minLength.description} and ${maxLength.description} characters`;
                        }
                        setErrors({ ...errors, descriptionError: error });
                        break;
                    default:
                        break;
                }
                setData({
                    ...inputData,
                    [e.target.name]: e.target.value,
                });
            }
        }
    }

    useEffect(() => {
        setimg(formData.image)
    }, [])
    const chandleEditJobCategory = () => {
        const formDataToUpload = new FormData();
        formDataToUpload.append('name', inputData.name);
        formDataToUpload.append('description', inputData.description);
        if (formData.image) {
            formDataToUpload.append('image', inputData.image || "");
            console.log(formDataToUpload)
        }
        formDataToUpload.append("id", formData._id || "")
        editJobCategory(formDataToUpload)
            .then((res:any) => {
                if (res?.data?.data.status === 200) {
                    success(res?.data?.data?.message || "");
                    reCall();
                } else if (res?.error?.response?.data.message || "") {
                    error(res?.error?.response?.data?.message || "");
                } else {
                    error(res?.error?.response?.data?.message || "");
                }
            })
            .catch((err) => {
                error(err?.error?.response?.data?.message || "");
            });
    };
    const validate = () => {
        if (!inputData.description && inputData.description === "") {
            setErrors({ ...errors, descriptionError: "Description is required" });
        } else if (!inputData.image && inputData.image === "") {
            setErrors({ ...errors, imageError: "Image is required" });
        } else if (!inputData.name && inputData.name === "") {
            setErrors({ ...errors, nameError: "Name is required" });
        } else {
            if (errors.descriptionError === "" && errors.nameError === "" && errors.imageError === "") {
                chandleEditJobCategory()
            }
        }
    }
    return (
        <>
            <div className="w-full  ">
                <div className="mb-1">
                    <p className="m-4 font-sans font-semibold text-center">Edit job category</p>
                    <hr />
                </div>
                <div className="flex flex-wrap -mx-3 mb-1 mt-2">
                    <div className="w-full px-3">
                        <label className="block tracking-wide text-gray-900 text-xs font-bold mb-2">
                            Name
                        </label>
                        <input
                            name="name"
                            value={inputData?.name}
                            onChange={changeData}
                            className="appearance-none block w-full text-gray-900 border border-gray-200 rounded py-2 px-2 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-password"
                        />
                        <label className="block tracking-wide text-red-500 text-sm font-normal mb-2">
                        </label>
                        <div className="font-sans text-xs text-red-500 fonse">{errors.nameError}</div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-1 mt-2">
                    <div className="w-full px-3">
                        <label className="block tracking-wide text-gray-900 text-xs font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            value={inputData?.description}
                            rows={2}
                            onChange={changeData}
                            name="description"
                            className="appearance-none block w-full  text-gray-900 border border-gray-200 rounded py-2 px-2 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" />
                        <label className="block tracking-wide text-red-500 text-sm font-normal mb-2">
                        </label>
                        <div className="font-sans text-xs text-red-500 fonse">{errors.descriptionError}</div>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-1 mt-2">
                    {image && (
                        <div className="flex flex-wrap -mx-3 mb-1 mt-2">
                            <div className="w-full px-3">
                                <img
                                    className="rounded-full h-20 w-20"
                                    src={image instanceof File ? URL.createObjectURL(image) : `${IMG_URL}${image}`}
                                    alt="Selected"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap -mx-3 mb-1 mt-2">
                    <div className="w-full px-3">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="imageUpload">
                            Image/Icon
                        </label>
                        <div className="relative">
                            <input
                                onChange={changeData}
                                type="file"
                                name="image"
                                className="appearance-none block w-full border border-gray-300 py-2 px-3 mb-1 leading-tight focus:outline-none focus:shadow-outline rounded-md"
                                id="imageUpload"
                                accept="image/*"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 4v16m8-8H4"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="font-sans text-xs text-red-500 font-semibold text-center">{errors?.imageError}</div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        onClick={validate}
                        type="submit" className="block w-full rounded-md text-center px-3.5 py-2.5  text-sm font-semibold text-white shadow-sm bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
                </div>
            </div>
        </>
    )
}
export default JobCategoryForm;