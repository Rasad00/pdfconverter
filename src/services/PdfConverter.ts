import axios from "axios"
import { IFile } from "interfaces";

interface IToPDF {
    process: "success"| "error";
    zip_name: string;
}

export default class PDFConverterServices {
    static toPDF = async (data: IFile[]) => {
        return await axios.post<IToPDF>("api/topdf" , data, {
            baseURL: "http://localhost:5000/",
            headers: {
                "Content-Type": "application/json",
                
            }
        });
    }
}