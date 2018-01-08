# npm-lnkr

## About

TODO

## Installation

```
npm install -g npm-lnkr
```
## Usage

#### API

```
/**
 * Options for link, unlink and list routines.
 *
 * @interface LnkrOptions
 */
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
   * Specify packages.json dependencies to override with links.
   * @name LnkrOptions#cache
   * @type {Map<String, Link>}
   */
  overrideLinks?: Map<string, Link>;
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

```

#### CLI

```
lnkr --help

  Usage: lnkr [options] <dir>

  Options:

  -l, --link                        Link local dependencies
  -u, --unlink                      Unlink local dependencies
  -i, --list                        List local dependencies
  -r, --recursive                   Execute command recursively
  -n, --override  pkg-name-0 pkg-path-0 ... pkg-name-n pkg-path-n  Override all package.json dependencies with mapping provided
  -f=[format], --format=[format]    Set output format

  Formats:

    %s: relative path to symlink
    %S: absolute path to symlink
    %h: relative real path to symlink target
    %H: absolute real path to symlink target

  Examples:

    lnkr                                                 # link local deps in package.json in current dir
    lnkr link                                            # link local deps in package.json in current dir
    lnkr -r                                              # link local deps recursively in package.json in current dir
    lnkr unlink                                          # unlink only in package.json in current dir
    lnkr unlink -r                                       # unlink recursively in package.json in current dir

    lnkr list                                               # list all local deps in package.json in current dir
    lnkr list -r                                            # list all local deps recursively in package.json in current dir

    lnkr -- mydir                                           # link local deps in package.json in mydir
    lnkr unlink -- mydir                                    # unlink local deps in package.json in mydir
    lnkr -- mydir                                           # link local deps in mydir
    lnkr --unlink -- mydir                                  # unlink local deps in mydir
    lnkr --override pkgname ../to/pkg                       # link local dep by pkgname to ../to/pkg
    lnkr --override pkgname1 ../to/pkg1 pkgname2 ../to/pkg2 # link local deps pkgname1 to ../to/pkg1 and pkgname2 to ../to/pkg2
    lnkr --unlink --override pkgname ../to/pkg              # unlink local dep by pkgname
    lnkr --override -r pkgname ../to/pkg                    # link local deps recursively by by pkgname to ../to/pkg
    lnkr --override -r @scope/pkgname pkgname ../to/pkg     # link local deps recursively by name/ with npm @scope

    relative paths are relative to cwd
```

## Common Issues

`npm-lnkr` symlinks both dependencies and devDependencies, and ignores peerDependencies and modules packed by NPM (`.tgz`).

`npm-lnkr` does not install non-linked dependencies. To have dependencies installed, use [timoxley/bulk](https://github.com/timoxley/bulk) or `xargs` in a script like:
```json
{
  "name": "my-app",
  "scripts": {
    "dev": "lnkr --link -r && lnkr --list -r | bulk -c 'npm install --production'",
    "prepublish": "if [ \"$NODE_ENV\" != \"production\" ]; then npm run dev; fi"
  }
}
```

## Prior Art

Inspired by: 

* [linklocal](https://github.com/timoxley/linklocal)
* [aperture](https://github.com/requireio/aperture)
* [district](https://github.com/hughsk/district)
* [symlink](https://github.com/clux/symlink)

## License

MIT
