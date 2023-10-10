import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { CONTRACT_ADDRESS } from "../lib/const"
import { ABI } from "../lib/abi"
import { Button } from "@nextui-org/button"
import { Freelancer, Gig } from "../lib/types"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { Input } from "@nextui-org/input"
import GigCard from "../components/gigCard"


export default function FreelancerPage() {

    const account = useAccount()
    const [freelancer, setFreelancer] = useState<Freelancer>({} as Freelancer)
    const [gigTitle, setGigTitle] = useState("")
    const [gigDesc, setGigDesc] = useState("")
    const [gigPrice, setGigPrice] = useState(0)
    const [gigs, setGigs] = useState<Gig[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        const fl = await contract.connect(signer).getFreelancerByWallet(account.address)
        console.log({ freelancer })
        setFreelancer(fl)
        let gig = await getGigsByFreelancer(fl.id)
        setGigs(gig)
    }

    const createGig = async () => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const gig = await contract.connect(signer).createGig(
            freelancer.id,
            gigPrice,
            gigTitle,
            gigDesc
        )
        console.log(gig)
    }

    const getGigsByFreelancer = async (id: number) => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const gig = await contract.connect(signer).getGigsByFreelancer(id)
        console.log({ gig })
        return gig
    }



    useEffect(() => {
        getFreelancerData()
    }, [])

    return (
        <div>
            <div className="bg" />
            <div className="max-w-screen-xl mx-auto px-3" >
                <h1 className="mt-8  text-4xl font-bold">
                    Welcome {freelancer.name}
                </h1>

                <div className="flex justify-end mt-4">
                    <Button color="primary" onPress={onOpen}>
                        Create Gig
                    </Button>

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Create Gig</ModalHeader>
                                    <ModalBody>
                                        <Input label="Title" type="text" onChange={(e) => setGigTitle(e.target.value)} />
                                        <Input label="Description" type="text" onChange={(e) => setGigDesc(e.target.value)} />
                                        <Input label="Price" type="number" onChange={(e) => setGigPrice(Number(e.target.value))} />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onClick={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" onPress={createGig}>
                                            Create
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>

                <h1 className="mt-4  text-2xl my-4 font-semibold">
                    Your Gigs
                </h1>

                <div className="grid grid-cols-4 gap-2.5">
                    {
                        gigs.map((item: Gig, index: number) => (
                            <GigCard
                                description={item.description}
                                price={item.price.toNumber()}
                                title={item.title}
                                id={item.id.toNumber()}
                                flag={false}
                                key={index}
                            />
                        ))
                    }
                </div>

            </div>
        </div>
    )
}