'use client'

import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../lib/const";
import { ABI } from "../lib/abi";
import { useEffect, useState } from "react";
import { Gig, Seller } from "../lib/types";
import { useAccount } from "wagmi";
import GigCard from "../components/gigCard";
import { useDisclosure } from "@nextui-org/modal";

export default function SellerPage() {

    const account = useAccount()
    const [seller, setSeller] = useState<Seller>({} as Seller)
    const [gigs, setGigs] = useState<Gig[]>([])

    const getFreelancerData = async () => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const sel = await contract.connect(signer).getSellerByWallet(account.address)
        setSeller(sel)
    }

    const getAllGigs = async () => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const allGigs = await contract.connect(signer).getAllGigs()
        console.log({ allGigs })
        setGigs(allGigs)
    }
    const getSubmittedOrders = async () => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const allGigs = await contract.connect(signer).getAllGigs()
        console.log({ allGigs })
        setGigs(allGigs)
    }





    useEffect(() => {
        getFreelancerData()
        getAllGigs()
    }, [])


    return (
        <div>
            <div className="bg" />
            <div className="max-w-screen-xl mx-auto px-3" >
                <div className="flex justify-between items-end">
                    <h1 className="mt-8  text-4xl font-bold">
                        Welcome {seller.name}
                    </h1>
                    <p>Orders</p>
                </div>


                <div className="grid grid-cols-4 gap-2.5 mt-8">
                    {
                        gigs.map((item: Gig, index: number) => (
                            <GigCard
                                description={item.description}
                                sellerId={item.id.toNumber()}
                                price={item.price.toNumber()}
                                title={item.title}
                                id={item.id.toNumber()}
                                flag={true}
                                key={index}
                            />
                        ))
                    }
                </div>

            </div>
        </div>
    )
}