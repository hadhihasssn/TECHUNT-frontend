import { string } from "yup";

export interface ContractDetailsType {
    _id?: string
    terms: string;
    work: string | {
        WorkType:string,
        Title:string
    }; 
    duration: Date | null[];
    amount: number;
    notes: string;
    paymentTerms: string;
    talent: string | { _id: string },
    client: string,
    approval?: boolean,
    status?: string
    completed?: "Pending" | "Progress" | "Completed",
    milestones: MilestoneType[]
    createdAt?: string | Date
}
export interface MilestoneType {
    payed?: boolean;
    work: string;
    _id?: string,
    approval?: boolean;
    completed?: string;
    no: number;
    description: string;
    startingDate: string;
    dueDate: string;
    name: string,
    amount: number
}
export interface ProposalInteface {
    title: string;
    coverLetter: string;
    rate: number;
    availability: Date;
    attachments?: string;
    additionalInfo?: string;
    isAccept?: boolean;
    talentId: string;
    jobId?: {
        WorkType: string,
        Amount: number,
    };
    clientId?: string;
    paymentStatus: 'Pending' | 'Failed' | 'Completed';
    createdAt: Date;
    updatedAt: Date;
}
