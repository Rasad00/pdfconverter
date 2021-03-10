import React, { useContext, useEffect, useState } from "react";

import { SharedFileContext } from "contexts/SharedFiles";
import { Modal } from "components";
import { IconContext } from "react-icons/lib";
import { AiOutlineCloseCircle, AiOutlineCloudDownload } from "react-icons/ai";
import { io } from "socket.io-client";
import { IHasZIP } from "interfaces";

interface IFileConvertProgressModal {
    open: boolean,
    onClose: () => void,
    zip: IHasZIP
}


const socket = io("http://localhost:5000/");

const FileConvertProgressModal: React.FC<IFileConvertProgressModal> = ({ open, onClose, zip: { has, zip_name } }) => {
    const [converted, setConverted] = useState<number>(0);
    const { files, dispatch } = useContext(SharedFileContext);

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("connected");
        });

        socket.on("FileConverted", () => {
            setConverted(prev => prev + 1);
        });

    }, []);

    const handleDownloadPdfFiles = () => {
        setTimeout(() => {
            setConverted(() => 0);
            dispatch({ type: "REMOVE_ALL_FILES" });
            onClose();
        }, 800);
    }

    return (
        <Modal open={open} className="convertmodal">
            <div className="inner">
                {
                    !(has)
                        ? (
                            <>
                                <div className="convert-message">
                                    <h2>
                                        {converted} / {files.length} converted
                                    </h2>
                                    <div className="wrapper">
                                        <div className="loader">
                                            <span>↓</span>
                                            <span>↓</span>
                                            <span>↓</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="progress">
                                    <div className="progress-done" style={{
                                        width: `${Math.ceil((converted / files.length) * 100)}%`,
                                        opacity: converted === 0 ? 0 : 1
                                    }}>
                                        {Math.ceil((converted / files.length) * 100)}%
                                </div>
                                </div>

                                <div className="close" onClick={onClose}>

                                    <svg width="25" height="25">
                                        <defs>
                                            <linearGradient id="closeModalGradient" gradientTransform="rotate(90)">
                                                <stop offset="5%" stopColor="#65dfc9" />
                                                <stop offset="95%" stopColor="#6cdbeb" />
                                            </linearGradient>
                                        </defs>
                                        <IconContext.Provider value={{ attr: { fill: "url('#closeModalGradient')" } }}>
                                            <AiOutlineCloseCircle />
                                        </IconContext.Provider>
                                    </svg>

                                </div>
                            </>
                        )
                        : (
                            <a className="download_button" href={`http://localhost:5000/api/download/${zip_name}`} onClick={handleDownloadPdfFiles}>
                                <span className="download_button_wrapper">
                                    <span className="download_button_wrapper--text">Download .zip</span>
                                    <span className="download_button_wrapper--icon" aria-hidden="true">
                                        <AiOutlineCloudDownload  aria-hidden="true"/>
                                    </span>
                                </span>
                            </a>
                        )
                }
            </div>
        </Modal>
    );
};


export default FileConvertProgressModal;