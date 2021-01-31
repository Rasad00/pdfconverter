export interface IFile {
    id: number|string;
    name: string,
    size: number,
    file: string | ArrayBuffer | null | undefined
}


export interface IHasZIP {
    has: boolean;
    zip_name: string;
}