/**
 * Options for link, unlink and list routines.
 *
 * @interface LnkrOptions
 */
export interface LnkrOptions {
    /**
     * Run routine recursively throughout. Defaults to false.
     * @name LnkrOptions#recursive
     * @type {boolean}
     */
    recursive?: boolean;
    /**
     * Specify packages to link, unlink and list outside of root package.json.
     * @name LnkrOptions#cache
     * @type {Map<String, Link>}
     */
    cache?: Map<string, Link>;
    /**
     * Deprecated
     * @name LnkrOptions#cwd
     * @type {string}
     */
    cwd?: string;
    /**
     * Deprecated
     * @name LnkrOptions#packages
     * @type {string[]}
     */
    packages?: string[];
    /**
     * Deprecated
     * @name LnkrOptions#scopeRename
     * @type {string}
     */
    scopeRename?: string;
}
/**
 * Object defines a link to create.
 *
 * @interface Link
 */
export interface Link {
    /**
     * Path to link target using absolute or relative path (e.g. file://../path/to/linked/package).
     * @name Link#to
     * @type {string}
     */
    to: string;
    /**
     * Path to link from using absolute or relative path (e.g. file://../path/to/linking/package).
     * @name Link#from
     * @type {string}
     */
    from: string;
    /**
     * Name of target package (e.g. mypackage).
     * @name Link#name
     * @type {string}
     */
    name: string;
    /**
     * Name of target package with pointer suffix (e.g. mypackage@<version pointer to package>).
     * @name Link#target
     * @type {string}
     */
    target: string;
    /**
     * Name of realized with pointer suffix (e.g. mypackage@<local pointer to package>).
     * @name Link#realized
     * @type {string}
     */
    realized: string;
}
/**
 *
 * Create symlinks for all npm packages starting at dirPath using link options provided.
 * Any existing symlinks or paths that duplicate a provided symlink will be overridden.
 *
 *  This routine assumes:
 *     1. package.json is provided at dirPath
 *     2. modules have been installed at dirPath (e.g. cd dirPath && npm install)
 *     3. all packages to be linked must be provided by options.cache or defined as local dependencies
 *        or devDependencies in the root package.json file. Local dependencies are those which point to
 *        absolute or relative paths (e.g. file://../path/to/linked/package)
 *
 * @param dirPath {string} - root directory to begin linking from
 * @param options {LnkrOptions} - link options
 */
export declare const link: (dirPath: string, options: LnkrOptions) => Promise<Link[]>;
/**
 *
 * Remove symlinks for all npm packages starting at dirPath using link options provided.
 *
 *  This routine assumes:
 *     1. package.json is provided at dirPath
 *     2. modules have been installed at dirPath (e.g. cd dirPath && npm install)
 *     3. all packages to be unlinked must be provided by options.cache or defined as local dependencies
 *        or devDependencies in the root package.json file. Local dependencies are those which point to
 *        absolute or relative paths (e.g. file://../path/to/linked/package)
 *
 *
 * @param dirPath {string} - root directory to begin linking from
 * @param options {LnkrOptions} - link options
 */
export declare const unlink: (dirPath: string, options: LnkrOptions) => Promise<Link[]>;
/**
 *
 * List symlinks for all npm packages starting at dirPath using link options provided.
 *
 *  This routine assumes:
 *     1. package.json is provided at dirPath
 *     2. modules have been installed at dirPath (e.g. cd dirPath && npm install)
 *     3. all packages to be listed must be provided by options.cache or defined as local dependencies
 *        or devDependencies in the root package.json file. Local dependencies are those which point to
 *        absolute or relative paths (e.g. file://../path/to/linked/package)
 *
 * @param dirPath {string} - root directory to begin linking from
 * @param options {LnkrOptions} - link options
 */
export declare const list: (dirPath: string, options: LnkrOptions) => Promise<Link[]>;
