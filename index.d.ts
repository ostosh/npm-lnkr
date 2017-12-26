export interface LnkrOptions {
    cwd?: string;
    packages?: string[];
    scopeRename?: string;
    recursive?: boolean;
    cache?: Partial<Link>;
}
export interface Link {
    to: string;
    from: string;
    name: string;
    target: string;
    realized: string;
}
export declare const link: (dirPath: string, options: LnkrOptions) => Promise<Link[]>;
export declare const unlink: (dirPath: string, options: LnkrOptions) => Promise<Link[]>;
export declare const list: (dirPath: string, options: LnkrOptions) => Promise<Link[]>;
