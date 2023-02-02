import React, { useState, useEffect } from "react"
import lighthouse from "@lighthouse-web3/sdk"
import { ethers } from "ethers"
import { useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"

function Hash() {
    const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "3141"
    const [fileURL, setFileURL] = React.useState(null)
    const [selectedFile, setSelectedFile] = useState()
    const [cidd, setcidd] = useState()

    const changeHandler = (event) => {
        setSelectedFile(event)
    }

    const encryptionSignature = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const address = await signer.getAddress()

        const messageRequested = (await lighthouse.getAuthMessage(address)).data.message
        const signedMessage = await signer.signMessage(messageRequested)
        return {
            signedMessage: signedMessage,
            publicKey: address,
        }
    }

    const applyAccessConditions = async (cid) => {
        // Conditions to add
        const conditions = [
            {
                id: 1,
                chain: "Hyperspace",
                method: "balanceOf",
                standardContractType: "ERC721",
                contractAddress: "0xC4E9ACEC063E6081c2DC2A09AB6a2a2c61d47452",
                returnValueTest: { comparator: ">=", value: "1" },
                parameters: [":userAddress"],
            },
        ]

        const aggregator = "([1])"
        const { publicKey, signedMessage } = await encryptionSignature()
        setcidd(cid)
        /*
      accessCondition(publicKey, cid, signedMessage, conditions, aggregator)
        Parameters:
          publicKey: owners public key
          CID: CID of file to decrypt
          signedMessage: message signed by owner of publicKey
          conditions: should be in format like above
          aggregator: aggregator to apply on conditions
    */
        const response = await lighthouse.accessCondition(
            publicKey,
            cid,
            signedMessage,
            conditions,
            aggregator
        )
        console.log("appiled")
        console.log(response)
    }

    const handleUpload = async () => {
        // Push file to lighthouse node
        const sig = await encryptionSignature()

        const response = await lighthouse.uploadEncrypted(
            selectedFile,
            sig.publicKey,
            lighthouseApiKey,
            sig.signedMessage
        )
        console.log(response)
        console.log("Applying access control")
        await applyAccessConditions(response.data.Hash)
    }

    const handleDerypt = async () => {
        // Fetch file encryption key
        console.log("decrytping")
        const cid = "Qmc8GB7detvh83fjq6bKFLSwgZ1i3huBs3hyH2kKjsmwqT" //replace with your IPFS CID
        const { publicKey, signedMessage } = await encryptionSignature()
        // console.log(signedMessage)
        /*
          fetchEncryptionKey(cid, publicKey, signedMessage)
            Parameters:
              CID: CID of the file to decrypt
              publicKey: public key of the user who has access to file or owner
              signedMessage: message signed by the owner of publicKey
        */
        const keyObject = await lighthouse.fetchEncryptionKey(cid, publicKey, signedMessage)

        // Decrypt file
        /*
          decryptFile(cid, key, mimeType)
            Parameters:
              CID: CID of the file to decrypt
              key: the key to decrypt the file
              mimeType: default null, mime type of file
        */

        const fileType = "image/jpeg"
        const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key, fileType)
        console.log(decrypted)
        /*
          Response: blob
        */

        // View File
        const url = URL.createObjectURL(decrypted)
        console.log(url)
        setFileURL(url)
    }
    useEffect(() => {}, [])
    return (
        <div>
            <button onClick={handleUpload}>Upload to Lighthouse</button>
            <input name="file" type="file" onChange={changeHandler} />
            <button onClick={handleDerypt}> Decrypted</button>
            {fileURL ? (
                <a href={fileURL} target="_blank">
                    viewFile
                </a>
            ) : null}
        </div>
    )
}

export default Hash
