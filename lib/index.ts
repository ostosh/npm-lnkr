import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';
import * as os from 'os';
import * as mkdirp from 'mkdirp';
import * as rimraf from 'rimraf';
import * as map from 'promise-map-limit';
import * as isString from 'lodash/isString';
import * as isObject from 'lodash/isObject';
import * as isArray from 'lodash/isArray';
import * as sortBy from 'lodash/sortBy';
import * as uniqBy from 'lodash/uniqBy';
import * as keyBy from 'lodash/keyBy';
import * as filter from 'lodash/filter';

/*
|--------------------------------------------------------------------------
| Public Lnkr Definitions
|--------------------------------------------------------------------------
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

/*
|--------------------------------------------------------------------------
| Public Lnkr Methods
|--------------------------------------------------------------------------
*/

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

export const link = (dirPath: string, options: LnkrOptions): Promise<Link[]> => {
  assert.equal(isString(dirPath), true, 'dirPath should be a string');
  const getLinksFn = options.recursive ? listLinksRecursive : listLinks;
  return readPackage(dirPath)
    .then((pkg: Package) => getLinksFn(pkg, options))
    .then(filterAllPathsToRemove)
    .then(unlinkLinks)
    .then(() => readPackage(dirPath))
    .then((pkg: Package) => getLinksFn(pkg, options))
    .then(linkLinks);
};

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

export const unlink = (dirPath: string, options: LnkrOptions): Promise<Link[]> => {
  assert.equal(isString(dirPath), true, 'dirPath should be a string');
  const getLinksFn = options.recursive ? listLinksRecursive : listLinks;
  return readPackage(dirPath)
    .then((pkg: Package) => getLinksFn(pkg, options))
    .then(filterLinksToUnlink)
    .then(unlinkLinks);
};

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

export const list = (dirPath: string, options: LnkrOptions): Promise<Link[]> => {
  assert.equal(isString(dirPath), true, 'dirPath should be a string');
  const getLinksFn = options.recursive ? listLinksRecursive : listLinks;
  return readPackage(dirPath)
    .then((pkg: Package) => getLinksFn(pkg, options))
    .then(filterLinksToUnlink);
};

/*
|--------------------------------------------------------------------------
| Private Type Definitions
|--------------------------------------------------------------------------
*/

interface PackageDependencyMap {
  [name: string]: string;
}

interface Package {
  name: string;
  version: string;
  dirPath: string;
  dependencies: PackageDependencyMap;
  devDependencies: PackageDependencyMap;
}

/*
|--------------------------------------------------------------------------
| Private Utilities
|--------------------------------------------------------------------------
*/

const linkLinks = (links: Link[]): Promise<Link[]> => {
  assert.ok(isArray(links), 'links should be an array');
  return map(links, 500, makeLink);
};

const unlinkLinks = (links: Link[]): Promise<Link[]> => {
  assert.ok(isArray(links), 'links should be an array');
  return map(links, 500, (lnk: Link) => {
    return isSymbolicLink(lnk.from)
      .then((isLink: boolean) => {
        if (isLink) {
          return removeLink(lnk);
        } else {
          return removePath(lnk);
        }
      });
  });
};

const listLinksRecursive = (pkg: Package, options: LnkrOptions): Promise<Link[]> => {
  const packageLinks = {};
  options = options || ({} as LnkrOptions);
  options.cache = new Map<string, Link>();

  const _listLinksRecursive = (nextPkg: Package): Promise<Link[]> => {
    if (packageLinks.hasOwnProperty(nextPkg.dirPath)) {
      Promise.resolve(packageLinks[nextPkg.dirPath]);
    } else {
      return listLinks(nextPkg, options)
        .then((links: Link[]) => {
          packageLinks[nextPkg.dirPath] = packageLinks[nextPkg.dirPath] || [];
          packageLinks[nextPkg.dirPath] = packageLinks[nextPkg.dirPath].concat(links);
          options.cache = Object.assign({}, options.cache, keyBy(links, 'name'));
          const linksToRecurse = links.map((lnk: Link) => lnk.to);
          return map(linksToRecurse, 500, readPackage);
        })
        .then((pkgs: Package[]) => map(pkgs, 500, _listLinksRecursive));
    }
  };

  return _listLinksRecursive(pkg)
    .then(() => {
      const flattened = Object.keys(packageLinks)
        .reduce((result, value) => (result || []).concat(packageLinks[value]), []);
      return uniqBy(flattened, (lnk: Link) => lnk.from + lnk.to);
    });
};

const listLinks = (pkg: Package, options: LnkrOptions): Promise<Link[]> => {
  const localDependencies = getPackageDependencies(pkg, options);
  return map(localDependencies, 500, realPath)
    .then((paths: string[]) => sortBy(uniqBy(paths || [])), (pth: string) => path)
    .then((sortedPaths: string[]) => map(sortedPaths, 500, readPackage))
    .then((pkgs: Package[]) => map(pkgs, 500, getDependencyLink.bind(null, pkg)));
};

const filterLinksToUnlink = (links: Link[]): Promise<Link[]> => {
  const uniqueLinks: Link[] = uniqBy(links, (lnk: Link) => lnk.from);
  const linkPromises: Array<Promise<boolean>> = uniqueLinks.map((lnk: Link) => isSymbolicLinkToPath(lnk.from, lnk.to));
  return Promise.all(linkPromises)
    .then((isLinkResults: boolean[]) => {
      return filter(uniqueLinks, (lnk: Link, index: number) => isLinkResults[index] === true);
    });
};

const filterAllPathsToRemove = (links: Link[]): Promise<Link[]> => {
  const uniqueLinks: Link[] = uniqBy(links, (lnk: Link) => lnk.from);
  const linkPromises: Array<Promise<boolean>> = uniqueLinks.map((lnk: Link) => isPath(lnk.from));
  return Promise.all(linkPromises).then((isLinkResults: boolean[]) => {
    return filter(uniqueLinks, (lnk, index) => isLinkResults[index] === true);
  });
};

const getPackageDependencies = (pkg: Package, options: LnkrOptions): string[] => {
  assert.equal(isObject(pkg), true, 'pkg should be an object');
  const deps = getDependencyMap(pkg);
  return Object.keys(deps)
    .filter((name: string): boolean => isLocalDependency(deps[name], name, options))
    .map((name) => getLocalDependency(name, pkg, deps, options));
};

const getDependencyMap = (pkg: Package): PackageDependencyMap => {
  return Object.assign({}, pkg.dependencies, pkg.devDependencies);
};

const getDependencyLink = (
  linkingPkg: Package,
  targetPkg: Package,
): Link => {
  const linkingDependencyMap = getDependencyMap(linkingPkg);

  const linkFrom = path.join(linkingPkg.dirPath, 'node_modules');
  return {
    name: targetPkg.name,
    from: path.resolve(linkFrom, targetPkg.name),
    to: targetPkg.dirPath,
    target: `${targetPkg.name}@${linkingDependencyMap[targetPkg.name]}`,
    realized: `${targetPkg.name}@${targetPkg.version}`,
  };
};

const getLocalDependency = (
  name: string,
  pkg: Package,
  deps: PackageDependencyMap,
  options: LnkrOptions,
): string => {
  if (options && options.cache && options.cache.hasOwnProperty(name)) {
    return options.cache[name].to;
  }
  let pkgPath = deps[name];
  pkgPath = pkgPath.replace(/^file:\/\//g, '');

  if (options && options.scopeRename) {
    return path.resolve(options.cwd, options.scopeRename);
  }

  if (options && options.packages && options.packages.length > 0) {
    return path.resolve(options.cwd, name);
  }

  return path.resolve(pkg.dirPath, pkgPath);
};

const isLocalDependency = (
  locator: string,
  name: string,
  options: LnkrOptions,
): boolean => {
  const ignoreExt = '.tgz';

  if (options && options.cache && options.cache.hasOwnProperty(name)) {
    return true;
  }

  if (options && options.scopeRename && options.packages) {
    return isScopedDependency(name, options);
  }

  if (options && options.packages) {
    return options.packages.indexOf(name) !== -1;
  }

  return (
    (locator.indexOf('.') === 0
      || locator.indexOf('/') === 0
    || locator.indexOf('file:') === 0)
    && locator.lastIndexOf(ignoreExt) !== locator.length - ignoreExt.length
  );
};

const isScopedDependency = (
  name: string,
  options: LnkrOptions,
): boolean => {
  return name.indexOf('@') !== -1
    && options.packages
    && options.packages.indexOf(name) !== -1;
};

/*
|--------------------------------------------------------------------------
| File System Wrapper Utilities
|--------------------------------------------------------------------------
*/

const getSymlinkType = (): string  => {
  if (os.platform() === 'win32') {
    return 'junction';
  } else {
    return 'dir';
  }
};

const makeLink = (lnk: Link): Promise<Link> => {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(lnk.from), (mkdirpErr: NodeJS.ErrnoException) => {
      if (mkdirpErr && mkdirpErr.code !== 'EEXISTS') {
        return reject(mkdirpErr);
      }

      let linkPath = lnk.to;
      // Junction points can't be relative
      if (getSymlinkType() !== 'junction') {
        linkPath = path.relative(path.dirname(lnk.from), lnk.to);
      }

      fs.symlink(linkPath, lnk.from, getSymlinkType(), (symlinkErr: NodeJS.ErrnoException) => {
        if (symlinkErr) {
          reject(symlinkErr);
        } else {
          resolve(lnk);
        }
      });
    });
  });
};

const removeLink = (lnk: Link): Promise<Link> => {
  return new Promise((resolve, reject) => {
    fs.unlink(lnk.from, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(lnk);
      }
    });
  });
};

const removePath = (lnk: Link): Promise<Link> => {
  return new Promise((resolve, reject) => {
    rimraf(lnk.from, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(lnk);
      }
    });
  });
};

const realPath = (inputPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.realpath(path.dirname(inputPath), (err: NodeJS.ErrnoException, outputPath: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(path.join(outputPath, path.basename(inputPath)));
      }
    });
  });
};

const readPackage = (dirPath: string): Promise<Package> => {
  assert.equal(isString(dirPath), true, 'dirPath should be a string');
  return new Promise ((resolve, reject) => {
    const pkgpath = path.join(dirPath, 'package.json');
    fs.readFile(pkgpath, (readErr: NodeJS.ErrnoException, data: any) => {
      if (readErr) {
        reject(readErr);
      }
      try {
        const pkg = JSON.parse(data);
        pkg.dirPath = dirPath;
        resolve(pkg);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

const isSymbolicLinkToPath = (linkPath: string, target: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.lstat(linkPath, (statErr: NodeJS.ErrnoException, stat: fs.Stats) => {
      if (statErr) {
        if (statErr.code === 'ENOENT') {
          return resolve(false);
        } else {
          return reject(statErr);
        }
      } else if (stat.isSymbolicLink()) {
        fs.readlink(linkPath, (linkErr: NodeJS.ErrnoException, linkStat: string) => {
          if (linkErr) {
            return reject (linkErr);
          }
          const resolvedLink = path.resolve(path.dirname(linkPath), linkStat);
          return resolve(resolvedLink === target);
        });
      } else {
        return resolve(false);
      }
    });
  });
};

const isSymbolicLink = (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.lstat(filePath, (err: NodeJS.ErrnoException, stat: fs.Stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false);
        } else {
          return reject(err);
        }
      } else if (stat.isSymbolicLink()) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    });
  });
};

const isPath = (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.lstat(filePath, (err: NodeJS.ErrnoException, stat: fs.Stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false);
        } else {
          return reject(err);
        }
      } else {
        return resolve(!!stat);
      }
    });
  });
};
