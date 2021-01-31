import React, { useCallback, useContext, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai"
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from 'react-dropzone';
import { IconContext } from "react-icons/lib";

import { IFile, IHasZIP } from "interfaces";
import { SharedFileContext } from "contexts/SharedFiles";
import DocxFile from "./DocxFile";
import { ConvertProgressModal } from "components";
import PDFConverterServices from "services/PdfConverter";




const Uploader: React.FC = () => {
    const [ openModal, setOpenModal ] = useState<boolean>(false);
    const [ hasZip, setHasZip ] = useState<IHasZIP>({ has: false, zip_name: ""} )
    const { files, dispatch } = useContext(SharedFileContext);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        let newFiles: IFile[] = [];

        acceptedFiles.forEach(file => {
            const reader = new FileReader();

            reader.onload = (e) => newFiles.push({
                id: uuidv4(),
                name: file.name,
                size: file.size,
                file: e.target?.result
            });

            reader.readAsDataURL(file);
        });

        setTimeout(() => {
            dispatch({ type: "ADD_FILES", payload: { files: newFiles } });
        }, 500);
    }, [])

    const {
        getRootProps, getInputProps, open, isDragActive,
    } = useDropzone({
        onDrop,
        noClick: Object.keys(files).length > 0,
        accept: ".docx"
    });

    const handleSendFiles = async () => {
        setOpenModal(() => true);
        await PDFConverterServices.toPDF(files).then((res) => {
            if(res.data.process === "success")
                setHasZip(() => ({ has: true, zip_name: res.data.zip_name }))
        });
    }

    return (
        <>
            <ConvertProgressModal 
                open={openModal} 
                zip={ hasZip }
                onClose={() => { 
                    setOpenModal(() => false);
                    setHasZip(() =>({
                        has: false, zip_name: ""
                    }));
                }} 
            />
            <div className="container">
                {
                    Object.keys(files).length > 0 && (
                        <div className="sender">
                            <div className="sender-info">
                                <p className="sender-info--info">
                                    You can add same word file by drag below or click
                            </p>
                                <button type="button" onClick={open}>
                                    add
                            </button>
                            </div>
                            <button type="button" onClick = { handleSendFiles }>
                                Convert
                        </button>
                        </div>
                    )
                }
                <div {...getRootProps({ className: !(Object.keys(files).length > 0) ? "dropzoneWaiting" : "dropzoneAccepted" })}>
                    <input {...getInputProps()} />
                    {
                        (!isDragActive && !(Object.keys(files).length > 0)) &&
                        (
                            <>
                                <svg width="70" height="70">
                                    <defs>
                                        <linearGradient id="uploadLinearGradient" gradientTransform="rotate(90)">
                                            <stop offset="5%" stopColor="#65dfc9" />
                                            <stop offset="95%" stopColor="#6cdbeb" />
                                        </linearGradient>
                                    </defs>
                                    <IconContext.Provider value={{ attr: { fill: "url('#uploadLinearGradient')" } }}>
                                        <AiOutlineCloudUpload />
                                    </IconContext.Provider>
                                </svg>
                                <p> Upload Doxc files <br /> or <br />  Drag it here  </p>
                            </>
                        )
                    }

                    {
                        Object.keys(files).length > 0 &&
                        files.map((file: IFile) => <DocxFile key={file.id} file={file} />)
                    }

                </div>

            </div>
        </>
    );
}


export default Uploader;
