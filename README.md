# lnkr

## About

## Installation

```
npm install -g lnkr
```
## Usage

TODO

#### API

TODO

#### CLI

TODO

```
lnkr --help

  Usage: lnkr [options] <dir>

  Options:

  -f=[format], --format=[format]    Set output format
  -l, --link                        Link local dependencies
  -u, --unlink                      Unlink local dependencies
  -i, --list                        List local dependencies
  -r, --recursive                   Execute command recursively
  -n, --named  pkg-0 ... pkg-n     Execute command on listed packages only

  Examples:

    lnkr                                                 # link local deps in current dir
    lnkr link                                            # link local deps in current dir
    lnkr -r                                              # link local deps recursively
    lnkr unlink                                          # unlink only in current dir
    lnkr unlink -r                                       # unlink recursively

    lnkr list                                            # list all local deps, ignores link status
    lnkr list -r                                         # list all local deps recursively, ignoring link status

    lnkr -- mydir                                        # link local deps in mydir
    lnkr unlink -- mydir                                 # unlink local deps in mydir
    lnkr --named pkgname ../to/pkg                       # link local dep by name/path
    lnkr --named pkgname1 pkgname2 ../to/pkg             # link local deps by name/path
    lnkr unlink --named pkgname ../to/pkg                # unlink local dep by name/
    lnkr --named -r pkgname ../to/pkg                    # link local deps recursively by name/
    lnkr --named -r @scope/pkgname pkgname ../to/pkg     # link local deps recursively by name/ with npm @scope

  Formats:

    %s: relative path to symlink
    %S: absolute path to symlink
    %h: relative real path to symlink target
    %H: absolute real path to symlink target

    relative paths are relative to cwd
```

## Common Issues

`lnkr` symlinks both dependencies and devDependencies, and ignores peerDependencies and modules packed by NPM (`.tgz`).

`lnkr` does not install non-linked dependencies. To have dependencies installed, use [timoxley/bulk](https://github.com/timoxley/bulk) or `xargs` in a script like:
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

# License

MIT
