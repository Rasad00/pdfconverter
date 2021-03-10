import React, { useReducer } from "react";
import { IFile } from "interfaces";

interface ISharedFileContext {
    files: IFile[],
    dispatch: React.Dispatch<Action>
}

const ADD_FILES = "ADD_FILES";
const REMOVE_FILE = "REMOVE_FILE";

export const add_files = (files: IFile[]): Action => ({
    type: ADD_FILES,
    payload: { files }
});

export const remove_file = (id: number|string): Action  => ({
    type: REMOVE_FILE,
    payload: { id }
})

type Action = 
    | { type: typeof ADD_FILES,  payload : { files: IFile[] }}
    | { type: typeof REMOVE_FILE, payload : { id: number|string } } 
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