(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash/isString"), require("path"), require("commander"), require("assert"), require("fs"), require("lodash/filter"), require("lodash/isArray"), require("lodash/isObject"), require("lodash/keyBy"), require("lodash/sortBy"), require("lodash/uniqBy"), require("mkdirp"), require("os"), require("promise-map-limit"), require("rimraf"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash/isString", "path", "commander", "assert", "fs", "lodash/filter", "lodash/isArray", "lodash/isObject", "lodash/keyBy", "lodash/sortBy", "lodash/uniqBy", "mkdirp", "os", "promise-map-limit", "rimraf"], factory);
	else if(typeof exports === 'object')
		exports["cli"] = factory(require("lodash/isString"), require("path"), require("commander"), require("assert"), require("fs"), require("lodash/filter"), require("lodash/isArray"), require("lodash/isObject"), require("lodash/keyBy"), require("lodash/sortBy"), require("lodash/uniqBy"), require("mkdirp"), require("os"), require("promise-map-limit"), require("rimraf"));
	else
		root["cli"] = factory(root["lodash/isString"], root["path"], root["commander"], root["assert"], root["fs"], root["lodash/filter"], root["lodash/isArray"], root["lodash/isObject"], root["lodash/keyBy"], root["lodash/sortBy"], root["lodash/uniqBy"], root["mkdirp"], root["os"], root["promise-map-limit"], root["rimraf"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_16__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash/isString");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = __webpack_require__(6);
var path = __webpack_require__(1);
var assert = __webpack_require__(5);
var os = __webpack_require__(14);
var mkdirp = __webpack_require__(13);
var rimraf = __webpack_require__(16);
var map = __webpack_require__(15);
var isString = __webpack_require__(0);
var isObject = __webpack_require__(9);
var isArray = __webpack_require__(8);
var sortBy = __webpack_require__(11);
var uniqBy = __webpack_require__(12);
var keyBy = __webpack_require__(10);
var filter = __webpack_require__(7);
exports.link = function (dirPath, options) {
    assert.equal(isString(dirPath), true, 'dirPath should be a string');
    var getLinksFn = options.recursive ? listLinksRecursive : listLinks;
    return readPackage(dirPath)
        .then(function (pkg) { return getLinksFn(pkg, options); })
        .then(filterAllPathsToRemove)
        .then(unlinkLinks)
        .then(function () { return readPackage(dirPath); })
        .then(function (pkg) { return getLinksFn(pkg, options); })
        .then(linkLinks);
};
exports.unlink = function (dirPath, options) {
    assert.equal(isString(dirPath), true, 'dirPath should be a string');
    var getLinksFn = options.recursive ? listLinksRecursive : listLinks;
    return readPackage(dirPath)
        .then(function (pkg) { return getLinksFn(pkg, options); })
        .then(filterLinksToUnlink)
        .then(unlinkLinks);
};
exports.list = function (dirPath, options) {
    assert.equal(isString(dirPath), true, 'dirPath should be a string');
    var getLinksFn = options.recursive ? listLinksRecursive : listLinks;
    return readPackage(dirPath)
        .then(function (pkg) { return getLinksFn(pkg, options); })
        .then(filterLinksToUnlink);
};
var linkLinks = function (links) {
    assert.ok(isArray(links), 'links should be an array');
    return map(links, 500, makeLink);
};
var unlinkLinks = function (links) {
    assert.ok(isArray(links), 'links should be an array');
    return map(links, 500, function (lnk) {
        return isSymbolicLink(lnk.from)
            .then(function (isLink) {
            if (isLink) {
                return removeLink(lnk);
            }
            else {
                return removePath(lnk);
            }
        });
    });
};
var listLinksRecursive = function (pkg, options) {
    var packageLinks = {};
    var _listLinksRecursive = function (nextPkg) {
        if (packageLinks.hasOwnProperty(nextPkg.dirPath)) {
            Promise.resolve(packageLinks[nextPkg.dirPath]);
        }
        else {
            return listLinks(nextPkg, options)
                .then(function (links) {
                packageLinks[nextPkg.dirPath] = packageLinks[nextPkg.dirPath] || [];
                packageLinks[nextPkg.dirPath] = packageLinks[nextPkg.dirPath].concat(links);
                options.overrideLinks = Object.assign({}, options.overrideLinks, keyBy(links, 'name'));
                var linksToRecurse = links.map(function (lnk) { return lnk.to; });
                return map(linksToRecurse, 500, readPackage);
            })
                .then(function (pkgs) { return map(pkgs, 500, _listLinksRecursive); });
        }
    };
    return _listLinksRecursive(pkg)
        .then(function () {
        var flattened = Object.keys(packageLinks)
            .reduce(function (result, value) { return (result || []).concat(packageLinks[value]); }, []);
        return uniqBy(flattened, function (lnk) { return lnk.from + lnk.to; });
    });
};
var listLinks = function (pkg, options) {
    var localDependencies = getPackageLinkedDependencies(pkg, options);
    return map(localDependencies, 500, realPath)
        .then(function (paths) { return sortBy(uniqBy(paths || [])); }, function (pth) { return path; })
        .then(function (sortedPaths) { return map(sortedPaths, 500, readPackage); })
        .then(function (pkgs) { return map(pkgs, 500, getDependencyLink.bind(null, pkg)); });
};
var filterLinksToUnlink = function (links) {
    var uniqueLinks = uniqBy(links, function (lnk) { return lnk.from; });
    var linkPromises = uniqueLinks.map(function (lnk) { return isSymbolicLinkToPath(lnk.from, lnk.to); });
    return Promise.all(linkPromises)
        .then(function (isLinkResults) {
        return filter(uniqueLinks, function (lnk, index) { return isLinkResults[index] === true; });
    });
};
var filterAllPathsToRemove = function (links) {
    var uniqueLinks = uniqBy(links, function (lnk) { return lnk.from; });
    var linkPromises = uniqueLinks.map(function (lnk) { return isPath(lnk.from); });
    return Promise.all(linkPromises).then(function (isLinkResults) {
        return filter(uniqueLinks, function (lnk, index) { return isLinkResults[index] === true; });
    });
};
var getPackageLinkedDependencies = function (pkg, options) {
    assert.equal(isObject(pkg), true, 'pkg should be an object');
    var deps = getDependencyMap(pkg);
    return Object.keys(deps)
        .filter(function (name) { return isLocalDependency(name, pkg, deps, options); })
        .map(function (name) { return getLocalDependency(name, pkg, deps, options); });
};
var getDependencyMap = function (pkg) {
    return Object.assign({}, pkg.dependencies, pkg.devDependencies);
};
var getDependencyLink = function (linkingPkg, targetPkg) {
    var linkingDependencyMap = getDependencyMap(linkingPkg);
    var linkFrom = path.join(linkingPkg.dirPath, 'node_modules');
    return {
        name: targetPkg.name,
        from: path.resolve(linkFrom, targetPkg.name),
        to: targetPkg.dirPath,
        target: targetPkg.name + "@" + linkingDependencyMap[targetPkg.name],
        realized: targetPkg.name + "@" + targetPkg.version,
    };
};
var getLocalDependency = function (name, pkg, deps, options) {
    if (options && options.overrideLinks && options.overrideLinks.hasOwnProperty(name)) {
        return options.overrideLinks[name].to;
    }
    var pkgPath = deps[name];
    pkgPath = pkgPath.replace(/^file:/g, '');
    return path.resolve(pkg.dirPath, pkgPath);
};
var isLocalDependency = function (name, pkg, deps, options) {
    var ignoreExt = '.tgz';
    if (options && options.overrideLinks && options.overrideLinks.hasOwnProperty(name)) {
        return true;
    }
    return ((deps[name].indexOf('.') === 0
        || deps[name].indexOf('/') === 0
        || deps[name].indexOf('file:') === 0)
        && deps[name].lastIndexOf(ignoreExt) !== deps[name].length - ignoreExt.length);
};
var getSymlinkType = function () {
    if (os.platform() === 'win32') {
        return 'junction';
    }
    else {
        return 'dir';
    }
};
var makeLink = function (lnk) {
    return new Promise(function (resolve, reject) {
        mkdirp(path.dirname(lnk.from), function (mkdirpErr) {
            if (mkdirpErr && mkdirpErr.code !== 'EEXISTS') {
                return reject(mkdirpErr);
            }
            var linkPath = lnk.to;
            if (getSymlinkType() !== 'junction') {
                linkPath = path.relative(path.dirname(lnk.from), lnk.to);
            }
            fs.symlink(linkPath, lnk.from, getSymlinkType(), function (symlinkErr) {
                if (symlinkErr) {
                    reject(symlinkErr);
                }
                else {
                    resolve(lnk);
                }
            });
        });
    });
};
var removeLink = function (lnk) {
    return new Promise(function (resolve, reject) {
        fs.unlink(lnk.from, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(lnk);
            }
        });
    });
};
var removePath = function (lnk) {
    return new Promise(function (resolve, reject) {
        rimraf(lnk.from, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(lnk);
            }
        });
    });
};
var realPath = function (inputPath) {
    return new Promise(function (resolve, reject) {
        fs.realpath(path.dirname(inputPath), function (err, outputPath) {
            if (err) {
                reject(err);
            }
            else {
                resolve(path.join(outputPath, path.basename(inputPath)));
            }
        });
    });
};
var readPackage = function (dirPath) {
    assert.equal(isString(dirPath), true, 'dirPath should be a string');
    return new Promise(function (resolve, reject) {
        var pkgpath = path.join(dirPath, 'package.json');
        fs.readFile(pkgpath, function (readErr, data) {
            if (readErr) {
                reject(readErr);
            }
            try {
                var pkg = JSON.parse(data);
                pkg.dirPath = dirPath;
                resolve(pkg);
            }
            catch (parseErr) {
                reject(parseErr);
            }
        });
    });
};
var isSymbolicLinkToPath = function (linkPath, target) {
    return new Promise(function (resolve, reject) {
        fs.lstat(linkPath, function (statErr, stat) {
            if (statErr) {
                if (statErr.code === 'ENOENT') {
                    return resolve(false);
                }
                else {
                    return reject(statErr);
                }
            }
            else if (stat.isSymbolicLink()) {
                fs.readlink(linkPath, function (linkErr, linkStat) {
                    if (linkErr) {
                        return reject(linkErr);
                    }
                    var resolvedLink = path.resolve(path.dirname(linkPath), linkStat);
                    return resolve(resolvedLink === target);
                });
            }
            else {
                return resolve(false);
            }
        });
    });
};
var isSymbolicLink = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.lstat(filePath, function (err, stat) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return resolve(false);
                }
                else {
                    return reject(err);
                }
            }
            else if (stat.isSymbolicLink()) {
                return resolve(true);
            }
            else {
                return resolve(false);
            }
        });
    });
};
var isPath = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.lstat(filePath, function (err, stat) {
            if (err) {
                if (err.code === 'ENOENT') {
                    return resolve(false);
                }
                else {
                    return reject(err);
                }
            }
            else {
                return resolve(!!stat);
            }
        });
    });
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var path = __webpack_require__(1);
var program = __webpack_require__(3);
var isString = __webpack_require__(0);
var lib_1 = __webpack_require__(2);
var formats = {
    '%S': function (result) { return result.from; },
    '%H': function (result) { return result.to; },
    '%s': function (result) { return path.relative(process.cwd(), result.from); },
    '%h': function (result) { return path.relative(process.cwd(), result.to); },
    '%t': function (result) { return result.target; },
    '%r': function (result) { return result.realized; },
};
var getFormattedResult = function (result, formatTemplate) {
    var output = isString(formatTemplate) ? formatTemplate : '%s -> %H';
    for (var _i = 0, _a = Object.keys(formats); _i < _a.length; _i++) {
        var key = _a[_i];
        output = output.replace(new RegExp(key, 'gm'), formats[key](result));
    }
    return output;
};
var getFormattedWarn = function (result) {
    var template = "[warn]: target package %t overridden by linked package %r";
    return getFormattedResult(result, template);
};
var successSummary = function (commandName, results) {
    var parsedCommandName = command[0].toUpperCase() + command.slice(1);
    results.forEach(function (result) {
        console.info(getFormattedResult(result, format));
        if (result.target !== result.realized) {
            console.warn(getFormattedWarn(result));
        }
    });
    var summary = '\n%sed %d dependenc' + (results.length === 1 ? 'y' : 'ies');
    console.info(summary, parsedCommandName, results.length);
};
var errorSummary = function (commandName, err) {
    var parsedCommandName = command[0].toUpperCase() + command.slice(1);
    console.info(parsedCommandName, 'failed: \n', err);
};
var help = function () {
    console.info('  Examples:');
    console.info('');
    console.info('    lnkr                                                    # link local deps in current dir');
    console.info('    lnkr --link                                             # link local deps in current dir');
    console.info('    lnkr --unlink                                           # unlink only in current dir');
    console.info('    lnkr --unlink -r                                        # unlink recursively');
    console.info('');
    console.info('    lnkr --list                                             # list all local deps, ignores link status');
    console.info('    lnkr --list -r                                          # list all local deps recursively, ignoring link status');
    console.info('');
    console.info('    lnkr -- mydir                                           # link local deps in mydir');
    console.info('    lnkr --unlink -- mydir                                  # unlink local deps in mydir');
    console.info('    lnkr --override pkgname ../to/pkg                       # link local dep by pkgname to ../to/pkg');
    console.info('    lnkr --override pkgname1 ../to/pkg1 pkgname2 ../to/pkg2 # link local deps pkgname1 to ../to/pkg1 and pkgname2 to ../to/pkg2');
    console.info('    lnkr --unlink --override pkgname ../to/pkg              # unlink local dep by pkgname');
    console.info('    lnkr --override -r pkgname ../to/pkg                    # link local deps recursively by by pkgname to ../to/pkg');
    console.info('    lnkr --override -r @scope/pkgname pkgname ../to/pkg     # link local deps recursively by name/ with npm @scope');
    console.info('');
    console.info('  Formats:');
    console.info('');
    console.info('    %s: relative path to symlink');
    console.info('    %S: absolute path to symlink');
    console.info('    %h: relative real path to symlink target');
    console.info('    %H: absolute real path to symlink target');
    console.info('');
    console.info('    relative paths are relative to cwd');
    console.info('');
};
program
    .usage('[options] <dir>')
    .option('--inspect')
    .option('-f, --format [format]', 'Specify output format string')
    .option('-l, --link', 'Link local dependencies')
    .option('-u, --unlink', 'Unlink local dependencies')
    .option('-i, --list', 'List linked dependencies')
    .option('-r, --recursive', 'Execute command recursively')
    .option('-o, --override', 'Override named package.json dependencies and devDependencies with specified links');
program.on('--help', help);
program.parse(process.argv);
var command = 'link';
if (program.unlink) {
    command = 'unlink';
}
else if (program.list) {
    command = 'list';
}
var fn = lib_1.link;
if (program.unlink) {
    fn = lib_1.unlink;
}
else if (program.list) {
    fn = lib_1.list;
}
var override = !!program.override;
var recursive = !!program.recursive;
program.args[0] = program.args[0] || '';
var dir = path.resolve(process.cwd(), program.args[0]) || process.cwd();
if (override) {
    dir = process.cwd();
}
var format = program.format;
var options = {
    recursive: recursive,
};
if (override) {
    var namedArgs = program.args.join(' ').split(' ');
    options.overrideLinks = new Map();
    for (var i = 0; i <= namedArgs.length - 2; i += 2) {
        var overrideLink = {
            to: namedArgs[i + 1],
            from: '',
            name: namedArgs[i],
            target: namedArgs[i] + "@" + namedArgs[i + 1],
            realized: namedArgs[i] + "@" + namedArgs[i + 1],
        };
        options.overrideLinks.set(overrideLink.name, overrideLink);
    }
}
fn(dir, options)
    .then(function (results) {
    successSummary(command, results);
}).catch(function (err) {
    errorSummary(command, err);
});


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("lodash/filter");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("lodash/isArray");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("lodash/isObject");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("lodash/keyBy");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash/sortBy");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lodash/uniqBy");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("mkdirp");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("promise-map-limit");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("rimraf");

/***/ })
/******/ ]);
});
//# sourceMappingURL=cli.js.map