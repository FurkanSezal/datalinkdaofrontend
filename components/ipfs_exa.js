import Link from "next/link"
import { pack, packToBlob } from "ipfs-car/pack"
import { MemoryBlockStore } from "ipfs-car/blockstore/memory" // You can also use the `level-blockstore` module
import React, { useState, useEffect } from "react"
import { CID } from "multiformats/cid"
import * as json from "multiformats/codecs/json"
import { sha256 } from "multiformats/hashes/sha2"

export default function Hashh() {
    const [selectedFile, setSelectedFile] = useState()

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0])
        console.log(event.target.files[0])
    }
    useEffect(() => {}, [])

    async function handleClick() {
        const { root, out } = await pack({
            input: [selectedFile],
            blockstore: new MemoryBlockStore(),
            wrapWithDirectory: true, // Wraps input into a directory. Defaults to `true`
            maxChunkSize: 262144, // The maximum block size in bytes. Defaults to `262144`. Max safe value is < 1048576 (1MiB)
        })

        const carParts = []
        for await (const part of out) {
            carParts.push(part)
        }

        const bytes = json.encode(carParts)

        const hash = await sha256.digest(bytes)
        const cid = CID.create(1, json.code, hash)
        console.log(cid.toString())
    }
    return (
        <div>
            <button onClick={handleClick}>Pack</button>
            <input name="file" type="file" onChange={changeHandler} />
        </div>
    )
}
