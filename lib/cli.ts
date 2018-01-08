import * as path from 'path';
import * as program from 'commander';
import * as isString from 'lodash/isString';
import {
  Link,
  LnkrOptions,
  link,
  unlink,
  list,
} from '../lib';

const formats = {
  '%S': (result: Link) => result.from,
  '%H': (result: Link) => result.to,
  '%s': (result: Link) => path.relative(process.cwd(), result.from),
  '%h': (result: Link) => path.relative(process.cwd(), result.to),
  '%t': (result: Link) => result.target,
  '%r': (result: Link) => result.realized,
};

const getFormattedResult = (result: Link, formatTemplate: string): string => {
  let output = isString(formatTemplate) ? formatTemplate : '%s -> %H';
  for (const key of Object.keys(formats)) {
    output = output.replace(new RegExp(key, 'gm'), formats[key](result));
  }
  return output;
};

const getFormattedWarn = (result: Link): string => {
  const template = `[warn]: target package %t overridden by linked package %r`;
  return getFormattedResult(result, template);
};

const successSummary = (commandName: string, results: Link[]): void => {
  const parsedCommandName = command[0].toUpperCase() + command.slice(1);
  results.forEach((result: Link) => {
    console.info(getFormattedResult(result, format));
    if (result.target !== result.realized) {
      console.warn(getFormattedWarn(result));
    }
  });
  const summary = '\n%sed %d dependenc' + (results.length === 1 ? 'y' : 'ies');
  console.info(summary, parsedCommandName, results.length);
};

const errorSummary = (commandName: string, err: Error): void => {
  const parsedCommandName = command[0].toUpperCase() + command.slice(1);
  console.info(parsedCommandName, 'failed: \n', err);
};

const help = (): void => {
  console.info('  Examples:');
  console.info('');
  console.info('    lnkr                                                    # link local deps in current dir');
  console.info('    lnkr --link                                             # link local deps in current dir');
  console.info('    lnkr --unlink                                           # unlink only in current dir');
  console.info('    lnkr --unlink -r                                        # unlink recursively');
  console.info('');
  // tslint:disable-next-line max-line-length
  console.info('    lnkr --list                                             # list all local deps, ignores link status');
  // tslint:disable-next-line max-line-length
  console.info('    lnkr --list -r                                          # list all local deps recursively, ignoring link status');
  console.info('');
  console.info('    lnkr -- mydir                                           # link local deps in mydir');
  console.info('    lnkr --unlink -- mydir                                  # unlink local deps in mydir');
  console.info('    lnkr --override pkgname ../to/pkg                       # link local dep by pkgname to ../to/pkg');
  // tslint:disable-next-line max-line-length
  console.info('    lnkr --override pkgname1 ../to/pkg1 pkgname2 ../to/pkg2 # link local deps pkgname1 to ../to/pkg1 and pkgname2 to ../to/pkg2');
  console.info('    lnkr --unlink --override pkgname ../to/pkg              # unlink local dep by pkgname');
  // tslint:disable-next-line max-line-length
  console.info('    lnkr --override -r pkgname ../to/pkg                    # link local deps recursively by by pkgname to ../to/pkg');
  // tslint:disable-next-line max-line-length
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

let command = 'link';
if (program.unlink) {
  command = 'unlink';
} else if (program.list) {
  command = 'list';
}

let fn = link;
if (program.unlink) {
  fn = unlink;
} else if (program.list) {
  fn = list;
}

const override = !!program.override;
const recursive = !!program.recursive;

program.args[0] = program.args[0] || '';
let dir = path.resolve(process.cwd(), program.args[0]) || process.cwd();
if (override) {
  dir = process.cwd();
}

const format = program.format;

const options: LnkrOptions = {
  recursive,
};

if (override) {
  const namedArgs = program.args.join(' ').split(' ');
  options.overrideLinks = new Map<string, Link>();
  for (let i = 0; i <= namedArgs.length - 2; i += 2) {
    const overrideLink = {
      to: namedArgs[i + 1],
      from: '',
      name: namedArgs[i],
      target: `${namedArgs[i]}@${namedArgs[i + 1]}`,
      realized: `${namedArgs[i]}@${namedArgs[i + 1]}`,
    };
    options.overrideLinks.set(overrideLink.name, overrideLink);
  }
}

fn(dir, options)
  .then((results: Link[]) => {
    successSummary(command, results);
  }).catch((err: Error) => {
    errorSummary(command, err);
  });
