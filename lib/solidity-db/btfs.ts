export const BTFSGateway = "https://gateway.btfs.io/btfs"

export class BTFSService {
  private endpoint: string

  constructor(endpoint: string = "https://nft-backend.btfs.io/api/upload") {
    this.endpoint = endpoint
  }

  async upload({
    data,
    address = "TGNwdiUL8joKM4zcU774qyCvepyDBEo2Zt",
    name = "metadata.json",
  }: {
    data: Blob
    address?: string
    name?: string
  }): Promise<Response> {
    const buffer: ArrayBuffer = await data.arrayBuffer()
    const content = new Uint8Array(buffer)
    const thumbnail = await this.blobToDataURL(data)
    return fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        content: Array.from(content),
        size: data.size,
        name,
        signature: process.env.BTFS_SIGNATURE,
        type: data.type,
        thumbnail,
      }),
    })
  }

  async blobToDataURL(blob: Blob): Promise<string> {
    try {
      // Read the blob contents
      const buffer = await blob.arrayBuffer()
      const data = Buffer.from(buffer)

      // Convert buffer to Base64
      const base64Data = data.toString("base64")

      // Build Data URL
      const mimeType = blob.type
      const dataURL = `data:${mimeType};base64,${base64Data}`

      return dataURL
    } catch (error) {
      throw new Error(`Error converting blob to Data URL: ${error}`)
    }
  }
}
