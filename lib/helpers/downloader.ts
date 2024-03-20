export const downloadFile = async ({
    source,
    name = "file",
}: {
    source: Blob,
    name?: string,
}): Promise<void> => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(source);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}