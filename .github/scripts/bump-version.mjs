import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { argv, stdout } from 'node:process';
import { versioner } from 'react-native-cli-bump-version/lib/index.js';

const root = path.resolve(import.meta.dirname, '../..');
const packageJsonPath = path.join(root, 'package.json');
const bumpTypes = ['major', 'minor', 'patch'];

const requestedType = argv[argv.indexOf('--type') + 1];
const type = bumpTypes.find((candidate) => candidate === requestedType);

if (!type) {
  throw new Error(`--type must be one of: ${bumpTypes.join(', ')}`);
}

const manager = versioner(
  {
    project: {
      android: { appName: 'app', sourceDir: 'android' },
      ios: { sourceDir: 'ios', xcodeProject: { name: 'SaraMobile.xcodeproj' } },
    },
    root,
  },
  { skipCodeFor: '', skipSemVerFor: '', type },
);

if (!manager) {
  throw new Error('Version manager could not be created');
}

manager.run();

const rawPackageJson = readFileSync(packageJsonPath, 'utf8');
writeFileSync(packageJsonPath, `${rawPackageJson.trimEnd()}\n`);

stdout.write(`bumped version to ${type}\n`);
