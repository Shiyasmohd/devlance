import { BigNumber } from "ethers";
import { type } from "os";

export type Freelancer = {
    id: BigNumber;
    name: string;
    skills: string[];
    wallet: string;
}

export type Seller = {
    id: BigNumber;
    name: string;
    wallet: string;
}

export type Gig = {
    id: BigNumber
    title: string
    description: string
    price: BigNumber
    freelancer: string
}

export type Order = {
    id: BigNumber
    gigId: BigNumber
    sellerId: BigNumber
    instruction: string
    price: BigNumber
    isAccepted: boolean
    isCompleted: boolean
    submission: string
    isPaid: boolean
}