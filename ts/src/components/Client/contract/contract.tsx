/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { LeftCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Space, message } from 'antd';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendContract } from '../../../services/clientApiService';
import type { ContractDetailsType, MilestoneType, ProposalInteface } from './contractInterface'
const { RangePicker } = DatePicker;
const { TextArea } = Input;


const ContractForm: React.FC = () => {
    const [proposal, setProposal] = useState<ProposalInteface>()
    const [contractDetails, setContractDetails] = useState<ContractDetailsType>({
        terms: "",
        work: "",
        duration: [null, null],
        amount: 0,
        notes: "",
        paymentTerms: "",
        client: "",
        talent: "",
    });
    const [milestones, setMilestones] = useState<MilestoneType[]>([]);
    useEffect(() => {
        const proposal = JSON.parse(localStorage.getItem("proposal") || "");
        setProposal(proposal)
        setContractDetails(prevState => ({
            ...prevState,
            client: proposal?.Client_id,
            talent: proposal?.talentId?._id,
            work: proposal?.jobId?._id,
        }));
    }, [])
    const handleChange = (fieldName: string, value: string, index: number) => {
        const updatedMilestones: any[] = [...milestones];
        if (!updatedMilestones[index]) {
            updatedMilestones[index] = {
                no: index,
                name: "",
                description: "",
                startingDate: "",
                dueDate: "",
                amount: 0
            }
        }
        if (updatedMilestones[index]) {
            updatedMilestones[index][fieldName] = value;
            setMilestones(updatedMilestones);
        }
    };
    const handleFormChange = (changedValues: ContractDetailsType) => {
        setContractDetails(prevState => ({
            ...prevState,
            ...changedValues
        }));
    };
    const validateText = (_: any, value: string) => {
        const trimmedValue = value.trim(); 
        if (!trimmedValue) {
            return Promise.reject('This field is required! Please enter ');
        }
        return Promise.resolve();
    };
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form
            .validateFields()
            .then(() => {
                sendContract({ contract: contractDetails, milestone: milestones, isMilestone: true })
                    .then(() => {
                        message.success("Successfully contract submitted.")
                        setTimeout(() => {
                            history.back()
                        }, 2000)
                    }).catch(() => message.error("While sending contract got an error.!"));
            })
            .catch(() => {
                message.error('Form submission failed. Please check the form for errors.');
            });
    };

    return (
        <>
            <div className='container m-auto flex flex-col justify-center rounded-lg items-center font-sans text-gray-700 font-semibold  '>
                <div className='m-8 shadow-2xl border  w-[75%] h-auto rounded-xl  '>
                    <Button
                        className='border flex justify-center items-center rounded-xl m-5'
                        onClick={() => {
                            history.back()
                        }}>
                        <LeftCircleOutlined />
                        Back
                    </Button>
                    <label className='ml-[40%] font-bold underline'>Send Contract</label>
                    <Form
                        onValuesChange={handleFormChange}
                        className='m-5 items-center'
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 20 }}
                        layout="horizontal"
                        style={{ maxWidth: "100%" }}
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Terms"
                            name={"terms"}
                            rules={[
                                { required: true, message: 'Terms is required' },
                                { validator: validateText },
                                { type: 'string' },
                                { min: 200, message: 'Terms minimum more than 200 letters!' },
                                { max: 500, message: 'Terms minimum less than 500 letters!' }
                            ]}
                        >
                            <ReactQuill
                                theme="snow"
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ size: [] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' },
                                        { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link', 'image', 'video'],
                                        ['clean']
                                    ],
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            validateFirst='parallel'
                            label="Duration"
                            name={"duration"}
                            rules={[
                                { required: true, message: 'Please select duration.' },
                                () => ({
                                    validator(_, value) {
                                        if (!value || value.length !== 2) {
                                            return Promise.reject(new Error('Please select a valid date range.'));
                                        }

                                        const [startDate, endDate] = value;
                                        const currentDate = moment();

                                        if (startDate.isBefore(currentDate)) {
                                            return Promise.reject(new Error('Start date should be after current date.'));
                                        }

                                        if (startDate.isSame(endDate)) {
                                            return Promise.reject(new Error('Start and end dates cannot be the same.'));
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <RangePicker
                                className='border border-gray-500' />
                        </Form.Item>
                        <Form.Item
                            label="Amount"
                            name={"amount"}
                            rules={[
                                { required: true, message: 'Please enter amount!' },
                                { type: 'number', min: 0, message: 'Please enter a valid positive amount!' },
                            ]}

                        >
                            <InputNumber
                                defaultValue={contractDetails?.amount}
                                className='border border-gray-500' />
                        </Form.Item>
                        <Form.Item
                            label="Notes"
                            name={"notes"}
                            rules={[{ required: true, message: '' },
                            { validator: validateText },
                            { type: 'string' },
                            { max: 500, message: 'Notes minimum less than 500 letters!' }
                            ]}
                        >
                            <TextArea
                                rows={4}
                                value={contractDetails.notes}
                                className='border border-gray-500' />
                        </Form.Item>
                        <Form.Item
                            name={"paymentTerms"}
                            label="Payment terms"
                            rules={[{ required: true, message: '' },
                            { validator: validateText },
                            { type: 'string' },
                            { max: 500, message: 'Payment terms  minimum less than 500 letters!' }

                            ]}
                        >
                            <TextArea defaultValue={contractDetails.paymentTerms} rows={4} className='border border-gray-500' />
                        </Form.Item>
                        {
                            proposal?.jobId?.WorkType === "Fixed " ? <>
                                <Space style={{ display: 'flex', marginBottom: 8, marginLeft: 110 }} align="baseline" className='ml-10'>
                                    <Form.Item
                                        className='w-[100%]'
                                        rules={[{ required: true, message: 'Missing name' }, { validator: validateText }, { min: 5 }]}
                                        style={{ marginRight: 1, marginBottom: 0 }}

                                    >
                                        <Input placeholder="name" onChange={(e) => handleChange('name', e.target.value, 0)} />
                                    </Form.Item>
                                    <Form.Item
                                        className='w-[100%]'
                                        rules={[{ required: true, message: 'Missing Description' }, { validator: validateText }, { min: 50 }]}
                                        style={{ marginRight: 1, marginBottom: 0 }}
                                    >
                                        <Input placeholder="Description" onChange={(e) => handleChange('description', e.target.value, 0)} />
                                    </Form.Item>
                                    <Form.Item
                                        className='w-[100%]'
                                        rules={[
                                            { required: true, message: 'Missing starting date' },
                                            {
                                                validator: (_, value) => {
                                                    const startingDate = moment(value);
                                                    if (!value.isBefore(startingDate)) {
                                                        return Promise.reject('Invalid date');
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                        style={{ marginRight: 1, marginBottom: 0 }}
                                    >
                                        <DatePicker placeholder="Starting Date" onChange={(_date, dateString) => handleChange('startingDate', dateString as string, 0)} />
                                    </Form.Item>
                                    <Form.Item
                                        className='w-[100%]'
                                        rules={[
                                            { required: true, message: 'Missing due date' },
                                            () => ({
                                                validator(_, value) {
                                                    const dueDate = moment(value);
                                                    if (!dueDate.isValid()) {
                                                        return Promise.reject('Invalid date');
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                        style={{ marginRight: 1, marginBottom: 0 }}
                                    >
                                        <DatePicker placeholder="Due Date" onChange={(_date, dateString) => handleChange('dueDate', dateString as string, 0)} />
                                    </Form.Item>
                                    <Form.Item
                                        className='w-[100%]'
                                        rules={[
                                            { required: true, message: 'Please enter amount!' },
                                            { type: 'number', min: 0, message: 'Please enter a valid positive amount!' },
                                        ]}
                                        style={{ marginRight: 1, marginBottom: 0 }}
                                    >
                                        <Input placeholder="Amount" defaultValue={proposal?.jobId?.Amount} onChange={(e) => handleChange('amount', e.target.value, 0)} />
                                    </Form.Item>
                                    <MinusCircleOutlined />
                                </Space>
                            </> : <>
                                <Form.List name={"milestones"}>
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }, index) => (
                                                <Space key={key} style={{ display: 'flex', marginBottom: 8, marginLeft: 110 }} align="baseline" className='ml-10'>
                                                    <Form.Item
                                                        className='w-[100%]'
                                                        {...restField}
                                                        name={[name, 'name']}
                                                        rules={[{ required: true, message: 'Missing name' }, { validator: validateText }, { type: "string" }, { min: 5, message: "Name must be more than 5 letters" }, { max: 20, message: "Name must be less than 20 letters" }]}
                                                        style={{ marginRight: 1, marginBottom: 0 }}
                                                    >
                                                        <Input placeholder="name" onChange={(e) => handleChange('name', e.target.value, index)} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        className='w-[100%]'
                                                        {...restField}
                                                        name={[name, 'description']}
                                                        rules={[{ required: true, message: 'Please enter description' }, { validator: validateText }, { type: "string" }, { min: 5, message: "Description must be more than 5 letters" }, { max: 100, message: "Descipriot must be less than 100 letters" }]}
                                                        style={{ marginRight: 1, marginBottom: 0 }}
                                                    >
                                                        <Input placeholder="Description" onChange={(e) => handleChange('description', e.target.value, index)} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        className='w-[100%]'
                                                        {...restField}
                                                        name={[name, 'startingDate']}
                                                        rules={[
                                                            { required: true, message: 'Missing starting date' },
                                                            {
                                                                validator: (_, value) => {

                                                                    const startingDate = moment(contractDetails.duration[0]);
                                                                    if (value.isBefore(startingDate)) {
                                                                        return Promise.reject('Starting date must be valid !');
                                                                    }
                                                                    return Promise.resolve();
                                                                },
                                                            },
                                                        ]}
                                                        style={{ marginRight: 1, marginBottom: 0 }}
                                                    >
                                                        <DatePicker placeholder="Starting Date" onChange={(_date, dateString) => handleChange('startingDate', dateString as string, index)} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        className='w-[100%]'
                                                        {...restField}
                                                        name={[name, 'dueDate']}
                                                        rules={[
                                                            { required: true, message: 'Missing due date' },
                                                            ({ getFieldValue }) => ({
                                                                validator: (_, value) => {
                                                                    const EndingDate = moment(contractDetails.duration[1]);
                                                                    const startingDate = getFieldValue([name, 'startingDate'])
                                                                    const startingMoment = moment(startingDate);
                                                                    if (value.isBefore(EndingDate)) {
                                                                        return Promise.reject('Due Date must be before the duration of due date!');
                                                                    }
                                                                    if (value.isBefore(startingMoment)) {
                                                                        return Promise.reject('Due date must be after the starting date!');
                                                                    }
                                                                    return Promise.resolve();
                                                                },
                                                            }),
                                                        ]}
                                                        style={{ marginRight: 1, marginBottom: 0 }}
                                                    >
                                                        <DatePicker placeholder="Due Date" onChange={(_date, dateString) => handleChange('dueDate', dateString as string, index)} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        className='w-[100%]'
                                                        {...restField}
                                                        name={[name, 'amount']}
                                                        rules={[
                                                            { required: true, message: 'Please enter amount!' },
                                                            { type: 'string', message: 'Please enter a valid number for the amount!' },
                                                            { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Please enter a valid positive amount!') }
                                                        ]}
                                                        
                                                        style={{ marginRight: 1, marginBottom: 0 }}
                                                    >
                                                        <Input placeholder="Amount" onChange={(e) => handleChange('amount', e.target.value, index)} />
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Form.Item className='ml-28'>
                                                <Button type="dashed" onClick={() => add()} block danger icon={<PlusOutlined />}>
                                                    Add milestone
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </>
                        }
                        <Form.Item className='flex items-center justify-center '>
                            <Button htmlType="submit" className='font-sans font-semibold border px-10' >Submit</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div >
        </>
    );
}
export default ContractForm