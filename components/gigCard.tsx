import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../lib/const";
import { ABI } from "../lib/abi";
import { useEffect, useState } from "react";
import { Order } from "../lib/types";
type GigCardProps = {
    title: string,
    description: string,
    price: number,
    flag: boolean
    id: number
    sellerId?: number
}

export default function GigCard(props: GigCardProps) {

    const createOrderModal = useDisclosure();
    const acceptOrderModal = useDisclosure();
    const [instruction, setInstruction] = useState("")
    const [amount, setAmount] = useState(0)
    const [orders, setOrders] = useState<Order[]>([])
    const [submissionDetails, setSubmissionDetails] = useState("")

    const createOrder = async () => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const order = await contract.connect(signer).createOrder(props.id, instruction, amount, props.sellerId)
        console.log({ order })

    }

    const getOrdersByGigId = async () => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const orders = await contract.connect(signer).getOrdersByGigId(props.id)
        setOrders(orders)
    }

    const acceptOrder = async (id: number) => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const accept = await contract.connect(signer).acceptOrder(id)
    }

    const submitOrder = async (id: number) => {
        //@ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
        console.log({ contract })

        //@ts-ignore
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Get the signer from the provider
        const signer = provider.getSigner();
        // Create a transaction object for the mint function
        const submit = await contract.connect(signer).submitOrder(id, submissionDetails)
    }

    useEffect(() => {
        if (!props.flag) {
            getOrdersByGigId()
        }
    }, [])

    return (
        <Card >
            <CardBody>
                <h1 className="text-xl font-semibold">
                    {props.title}
                </h1>
                <p className="text-sm">
                    {props.description}
                </p>
                <p className="text-right text-lg">
                    {props.price} ETH
                </p>
                {
                    props.flag ?
                        <div className="flex justify-end gap-2">
                            <Button variant="bordered" color="primary">
                                Message
                            </Button>
                            <Button color="primary" onPress={createOrderModal.onOpen}>
                                Order
                            </Button>
                        </div>
                        :
                        <div className="flex justify-end items-center gap-4" >
                            Orders  <Button onPress={acceptOrderModal.onOpen}>{orders.length}</Button>
                        </div>
                }

                <Modal isOpen={acceptOrderModal.isOpen} onOpenChange={acceptOrderModal.onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Orders</ModalHeader>
                                <ModalBody>
                                    {
                                        orders.map((order, index) => (
                                            <Card className="shadow-none border">
                                                <CardBody>
                                                    <p className="text-lg font-semibold">ETH {order.price.toNumber()}</p>
                                                    <p>{order.instruction}</p>
                                                    {
                                                        order.isAccepted ?
                                                            <div className="flex flex-col items-end gap-2 mt-6">
                                                                <Textarea label="Submission Details" onChange={(e) => setSubmissionDetails(e.target.value)} />
                                                                <Button className="w-fit" color="primary" variant="light" onClick={() => submitOrder(order.id.toNumber())}>Submit</Button>
                                                            </div>
                                                            :
                                                            <div className="flex justify-end gap-2">
                                                                <Button color="primary" variant="light" onClick={() => acceptOrder(order.id.toNumber())}>Accept</Button>
                                                                <Button color="danger" variant="light">Reject</Button>
                                                            </div>
                                                    }
                                                </CardBody>
                                            </Card>
                                        ))
                                    }
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onClick={onClose}>
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal isOpen={createOrderModal.isOpen} onOpenChange={createOrderModal.onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Create Order</ModalHeader>
                                <ModalBody>
                                    <Textarea
                                        label="Instruction"
                                        labelPlacement="outside"
                                        placeholder="Enter Details"
                                        onChange={(e) => setInstruction(e.target.value)}
                                    />
                                    <Input label="Amount" type="number" placeholder=" 25 ETH" onChange={(e) => setAmount(Number(e.target.value))} />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={createOrder}>
                                        Create
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </CardBody>
        </Card>
    )
}