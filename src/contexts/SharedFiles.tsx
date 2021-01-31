import React, { useReducer } from "react";
import { IFile } from "interfaces";

interface ISharedFileContext {
    files: IFile[],
    dispatch: React.Dispatch<Action>
}

export type ADD_FILES = "ADD_FILES";
export type REMOVE_FILE = "REMOVE_FILE";


type Action = 
    | { type: ADD_FILES,  payload : { files: IFile[] }}
    | { type: REMOVE_FILE, payload : { id: number|string } } 
    | { type: "REMOVE_ALL_FILES" };



export const SharedFileContext = React.createContext<ISharedFileContext>({} as ISharedFileContext);

const sharedFilesReducer = (state: IFile[], action: Action) => {
    switch(action.type){
        case "ADD_FILES":
            return [ ...state, ...action.payload.files ];
        case "REMOVE_FILE":
            return state.filter((file) => file.id !== action.payload.id);
        case "REMOVE_ALL_FILES":
            return [];
        default:
            return state;
    }
}

const SharedFileProvider: React.FC = ({ children }) => {
    const [ files, dispatch ] = useReducer(sharedFilesReducer, []);

    return (
        <SharedFileContext.Provider value={{ files, dispatch }}>
            { children }
        </SharedFileContext.Provider>
    );
}



export default SharedFileProvider;