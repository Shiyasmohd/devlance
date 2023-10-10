import { Button } from "@nextui-org/button"
import Layout from "../components/layout"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useContractRead } from "wagmi"
import { use, useEffect, useState } from "react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS } from "../lib/const"
import { ABI } from "../lib/abi"
import { CircularProgress } from "@nextui-org/progress";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation"

export default function IndexPage() {

  const account = useAccount()
  const router = useRouter()
  const [condition, setCondition] = useState<"loading" | "select" | "register">("loading")
  const [userType, setUserType] = useState<"freelancer" | "seller" | "">("")
  const [skills, setSkills] = useState<string[]>([])
  const [name, setName] = useState<string>("")

  const checkUserExists = async () => {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
    console.log({ contract })

    //@ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the signer from the provider
    const signer = provider.getSigner();
    // Create a transaction object for the mint function
    const freelancer = await contract.connect(signer).getFreelancerByWallet(account.address)
    const seller = await contract.connect(signer).getSellerByWallet(account.address)
    console.log({ freelancer })
    console.log({ seller })
    if (seller.name != "") {
      router.push('/seller')
      return
    }
    if (freelancer.name != "") {
      router.push('/freelancer')
      return
    }
    if (freelancer.name == "" && seller.name == "") {
      setCondition("select")
    }

  }


  const registerFreelancer = async () => {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
    console.log({ contract })

    //@ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the signer from the provider
    const signer = provider.getSigner();
    console.log({ signer })
    console.log({ contract })
    // Create a transaction object for the mint function
    const freelancer = await contract.connect(signer).registerFreelancer(name, skills)
    router.push('/freelancer')
  }

  const registerSeller = async () => {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider)

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
    console.log({ contract })

    //@ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Get the signer from the provider
    const signer = provider.getSigner();
    console.log({ signer })
    console.log({ contract })
    // Create a transaction object for the mint function
    const seller = await contract.connect(signer).registerSeller(name)
    console.log({ seller })
    router.push('/seller')
  }

  useEffect(() => {
    checkUserExists()
  }, [])


  // Wallet Not Connected
  if (!account.address) {
    return (
      <div className=" flex flex-col gap-6 justify-center items-center h-screen">
        <div className="bg"></div>
        <h1 className="text-3xl text-center font-extrabold">
          Please connect your <br /> wallet to continue
        </h1>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className=" flex flex-col gap-6 justify-center items-center h-screen">
      <div className="bg"></div>

      {
        condition == "loading" ?
          <CircularProgress />
          : condition == "select" ?
            <div className="flex flex-col gap-6 justify-center items-center">
              <h1 className="text-3xl font-extrabold">
                Continue as
              </h1>
              <div className="flex gap-6">
                <Card className="w-[200px] cursor-pointer" isPressable={true} isBlurred onClick={() => { setUserType("freelancer"); setCondition("register") }}>
                  <CardBody>
                    <p className="text-center">Freelancer</p>
                  </CardBody>
                </Card>
                <Card className="w-[200px] cursor-pointer" isPressable={true} isBlurred onClick={() => { setUserType("seller"); setCondition("register") }}>
                  <CardBody>
                    <p className="text-center">Seller</p>
                  </CardBody>
                </Card>
              </div>
            </div>
            : condition == "register" ?
              <div className="flex flex-col gap-6 justify-center items-center">
                {
                  userType == "freelancer" ?
                    <div className="flex flex-col gap-6 justify-center items-center">
                      <h1 className="text-3xl font-extrabold">
                        Continue as Freelancer
                      </h1>
                      <Input type="text" label="Name" onChange={(e) => setName(e.target.value)} />
                      {
                        skills.map((skill, index) => (
                          <Input type="text" label={`Skill ${index + 1}`}
                            onChange={(e) => {
                              let temp = skills
                              temp[index] = e.target.value
                              setSkills([...temp])
                            }}
                          />
                        ))
                      }
                      <div className="w-full">
                        <Button color="primary" onClick={() => { setSkills([...skills, ""]) }}>Add Skill</Button>
                      </div>
                      <div className="w-full flex justify-end">
                        <Button color="primary" className="px-10" onClick={registerFreelancer}>Submit</Button>
                      </div>

                    </div>
                    : userType == "seller" ?
                      <div className="flex flex-col gap-6 justify-center items-center">
                        <h1 className="text-3xl font-extrabold">
                          Continue as Seller
                        </h1>
                        <Input type="text" label="Name" onChange={(e) => setName(e.target.value)} />

                        <div className="w-full flex justify-end">
                          <Button color="primary" className="px-10" onClick={registerSeller}>Submit</Button>
                        </div>
                      </div>
                      : ""
                }
              </div>
              : ""
      }
    </div>
  )
}
