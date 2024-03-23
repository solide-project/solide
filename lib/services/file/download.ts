import JSZip from 'jszip';

export const download = async (sources: Sources): Promise<Blob> => {
    const zip = new JSZip();

    Object.entries(sources).forEach(([key, val]) => {
        zip.file(key, val.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    
    // console.log(blob.size, blob.type);
    return blob;
}


interface Sources {
    [key: string]: { content: string }
}