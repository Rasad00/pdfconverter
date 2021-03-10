import React, { useContext } from "react";
import { IFile } from "interfaces";
import { RiDeleteBinLine } from "react-icons/ri";
import { IconContext } from "react-icons/lib";

import DoxcImage from "images/docx.png";
import { SharedFileContext, remove_file } from "contexts/SharedFiles";
import FileSizeConvert from "util/FileSizeConverter";

const DocxFile: React.FC<{ file: IFile }> = ({ file }) => {
    const { dispatch } = useContext(SharedFileContext);

    const handleDeleteFile = () => 
        dispatch(remove_file(file.id))
    
    return (
        <div className="docxfile">
            <div className="docxfile-data">
                <img src={ DoxcImage } alt="Word Format file"/>
                <span className="docxfile-data--size">
                    { FileSizeConvert(file.size.toString()) }
                </span>
                <span className="docxfile-data--delete" onClick={ handleDeleteFile }>
                    <svg width="20" height="20">
                        <defs>
                            <linearGradient id="deleteFileGradient" gradientTransform="rotate(90)">
                                <stop offset="5%" stopColor="#FC510D" />
                                <stop offset="95%" stopColor="#D9280B" />
                            </linearGradient>
                        </defs>
                        <IconContext.Provider value={{ attr: { fill: "url('#deleteFileGradient')" } }}>
                            <RiDeleteBinLine />
                        </IconContext.Provider>
                    </svg>
                </span>
            </div>
            <p className="docxfile--name" title={ file.name }>
                { file.name }
            </p>
        </div>
    )
}


export default DocxFile;
