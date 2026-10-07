/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const {
  APPROVAL_LABEL,
  differenceFingerprint,
  gateDecision,
} = require('../visual/approval');
const {compareCapture, compareImages, policyFor} = require('../visual/compare');
const {buildManifest, environmentKey, sha256} = require('../visual/manifest');
const {readPngDimensions} = require('../visual/png');
const {renderCheckOutput} = require('../visual/report');
const {
  approvalKey,
  baselinePrefix,
  publicUrl,
  reportPrefix,
} = require('../visual/storage');
const {validateCapture} = require('../visual/validate');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {PNG} = require('pngjs');

const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);

const ANDROID_ENVIRONMENT = {
  apiLevel: 35,
  abi: 'x86_64',
  nativeBridge: 'libndk_translation.so',
  systemImage:
    'google/sdk_gphone64_x86_64/emu64xa:15/AE3A/1:userdebug/dev-keys',
  screenSize: '1080x2400',
  density: 420,
  fontScale: '1.0',
  locale: 'en-US',
  animatorDurationScale: '0.0',
};

function makePng(width, height, paint = () => [255, 255, 255, 255]) {
  const png = new PNG({width, height});
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const [r, g, b, a] = paint(x, y);
      png.data[offset] = r;
      png.data[offset + 1] = g;
      png.data[offset + 2] = b;
      png.data[offset + 3] = a;
    }
  }
  return PNG.sync.write(png);
}

function writeCapture(directory, images, overrides = {}) {
  for (const [id, buffer] of Object.entries(images)) {
    const filePath = path.join(directory, `${id}.png`);
    fs.mkdirSync(path.dirname(filePath), {recursive: true});
    fs.writeFileSync(filePath, buffer);
  }
  const manifest = buildManifest({
    captureDir: directory,
    platform: 'android',
    environment: ANDROID_ENVIRONMENT,
    git: {testedSha: SHA_A, baseSha: SHA_B, headSha: SHA_A},
  });
  const finalManifest = {...manifest, ...overrides};
  fs.writeFileSync(
    path.join(directory, 'manifest.json'),
    JSON.stringify(finalManifest),
  );
  return finalManifest;
}

describe('visual regression', () => {
  let directory;

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'visual-test-'));
  });

  afterEach(() => {
    fs.rmSync(directory, {recursive: true, force: true});
  });

  describe('readPngDimensions', () => {
    test('reads the IHDR dimensions', () => {
      expect(readPngDimensions(makePng(3, 2))).toEqual({width: 3, height: 2});
    });

    test.each([
      [Buffer.from('not a png at all, but long enough')],
      [Buffer.alloc(0)],
    ])('rejects non-PNG data', buffer => {
      expect(readPngDimensions(buffer)).toBeNull();
    });
  });

  describe('environmentKey', () => {
    test('is readable and stable', () => {
      expect(environmentKey('android', ANDROID_ENVIRONMENT)).toMatch(
        /^android-api35-x86-64-1080x2400-420dpi-[0-9a-f]{8}$/,
      );
      expect(environmentKey('android', {...ANDROID_ENVIRONMENT})).toBe(
        environmentKey('android', ANDROID_ENVIRONMENT),
      );
    });

    test('changes when any keyed property drifts', () => {
      expect(
        environmentKey('android', {...ANDROID_ENVIRONMENT, fontScale: '1.15'}),
      ).not.toBe(environmentKey('android', ANDROID_ENVIRONMENT));
    });

    test('ignores properties that are only recorded', () => {
      expect(
        environmentKey('ios', {
          runtime: 'iOS-26-2',
          deviceType: 'iPhone-17-Pro',
          appearance: 'light',
          contentSizeCategory: 'large',
          locale: 'en_US',
          xcode: 'Xcode 26.2',
        }),
      ).toBe(
        environmentKey('ios', {
          runtime: 'iOS-26-2',
          deviceType: 'iPhone-17-Pro',
          appearance: 'light',
          contentSizeCategory: 'large',
          locale: 'en_US',
          xcode: 'Xcode 26.3',
        }),
      );
    });
  });

  describe('validateCapture', () => {
    test('accepts a well-formed capture', () => {
      const manifest = writeCapture(directory, {
        'text/width-mode/default': makePng(4, 4),
      });
      expect(validateCapture(directory)).toEqual(manifest);
    });

    test.each([
      ['../escape/a/b'],
      ['/absolute/a/b'],
      ['Text/Upper/case'],
      ['too/few'],
      ['a/b/c/d'],
    ])('rejects test ID %s', id => {
      writeCapture(directory, {'text/width-mode/default': makePng(4, 4)});
      const manifest = JSON.parse(
        fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'),
      );
      manifest.images[0] = {...manifest.images[0], id, path: `${id}.png`};
      fs.writeFileSync(
        path.join(directory, 'manifest.json'),
        JSON.stringify(manifest),
      );
      expect(() => validateCapture(directory)).toThrow('Invalid test ID');
    });

    test('rejects a path that does not match the ID', () => {
      const manifest = writeCapture(directory, {
        'text/width-mode/default': makePng(4, 4),
      });
      manifest.images[0].path = '../../etc/passwd';
      fs.writeFileSync(
        path.join(directory, 'manifest.json'),
        JSON.stringify(manifest),
      );
      expect(() => validateCapture(directory)).toThrow('path must be');
    });

    test('rejects duplicates, mismatched hashes and unlisted files', () => {
      const manifest = writeCapture(directory, {
        'text/width-mode/default': makePng(4, 4),
      });
      manifest.images.push({...manifest.images[0]});
      manifest.images[0] = {...manifest.images[0], sha256: '0'.repeat(64)};
      fs.writeFileSync(
        path.join(directory, 'manifest.json'),
        JSON.stringify(manifest),
      );
      fs.writeFileSync(path.join(directory, 'extra.sh'), 'echo hi');
      let message = '';
      try {
        validateCapture(directory);
      } catch (error) {
        message = error.message;
      }
      expect(message).toContain('Duplicate test ID');
      expect(message).toContain('does not match its manifest entry');
      expect(message).toContain('Files not in the manifest: extra.sh');
    });

    test('rejects non-PNG content and oversized images', () => {
      writeCapture(directory, {
        'text/width-mode/default': makePng(4, 4),
        'text/width-mode/large': makePng(20, 4),
      });
      fs.writeFileSync(
        path.join(directory, 'text/width-mode/default.png'),
        'not a png',
      );
      expect(() =>
        validateCapture(directory, {
          maxImages: 10,
          maxImageBytes: 1024 * 1024,
          maxTotalBytes: 1024 * 1024,
          maxDimension: 10,
          maxManifestBytes: 1024 * 1024,
        }),
      ).toThrow(/default: not a PNG[\s\S]*large: 20x4 is outside/);
    });

    test('rejects symlinks', () => {
      writeCapture(directory, {'text/width-mode/default': makePng(4, 4)});
      fs.rmSync(path.join(directory, 'text/width-mode/default.png'));
      fs.symlinkSync(
        '/etc/hosts',
        path.join(directory, 'text/width-mode/default.png'),
      );
      expect(() => validateCapture(directory)).toThrow(
        'file is missing or not a regular file',
      );
    });

    test('rejects invalid SHAs and environment keys', () => {
      writeCapture(
        directory,
        {'text/width-mode/default': makePng(4, 4)},
        {
          environmentKey: 'ios-../../x',
          git: {testedSha: 'HEAD', baseSha: SHA_B, headSha: SHA_A},
        },
      );
      expect(() => validateCapture(directory)).toThrow(
        /Invalid environment key[\s\S]*Invalid git.testedSha/,
      );
    });
  });

  describe('compareImages', () => {
    const strict = policyFor('a/b/c', null);

    test('identical images are unchanged', () => {
      expect(compareImages(makePng(8, 8), makePng(8, 8), strict)).toMatchObject(
        {status: 'unchanged', diffPixels: 0, diff: null},
      );
    });

    test('a single changed pixel fails the strict policy', () => {
      const changed = makePng(8, 8, (x, y) =>
        x === 3 && y === 3 ? [254, 255, 255, 255] : [255, 255, 255, 255],
      );
      const result = compareImages(makePng(8, 8), changed, strict);
      expect(result).toMatchObject({status: 'changed', diffPixels: 1});
      expect(readPngDimensions(result.diff)).toEqual({width: 8, height: 8});
    });

    test('a per-test tolerance can absorb a known amount of noise', () => {
      const changed = makePng(8, 8, (x, y) =>
        x === 3 && y === 3 ? [0, 0, 0, 255] : [255, 255, 255, 255],
      );
      const policy = policyFor('a/b/c', {tests: {'a/b/c': {maxDiffPixels: 1}}});
      expect(compareImages(makePng(8, 8), changed, policy).status).toBe(
        'unchanged',
      );
      expect(
        policyFor('a/b/d', {tests: {'a/b/c': {maxDiffPixels: 1}}}),
      ).toEqual(strict);
    });

    test('different dimensions are reported, not compared', () => {
      expect(compareImages(makePng(8, 8), makePng(8, 9), strict)).toMatchObject(
        {
          status: 'dimension-mismatch',
          expectedSize: {width: 8, height: 8},
          capturedSize: {width: 8, height: 9},
        },
      );
    });
  });

  describe('compareCapture', () => {
    test('classifies unchanged, changed, added and removed tests', async () => {
      const white = makePng(4, 4);
      const black = makePng(4, 4, () => [0, 0, 0, 255]);
      const image = (id, buffer) => ({id, sha256: sha256(buffer)});
      const results = await compareCapture({
        manifest: {
          images: [
            image('a/a/same', white),
            image('a/a/changed', black),
            image('a/a/added', white),
          ],
        },
        baselineManifest: {
          images: [
            image('a/a/same', white),
            image('a/a/changed', white),
            image('a/a/removed', white),
          ],
        },
        readExpected: async () => white,
        readCaptured: async () => black,
        config: null,
      });
      expect(results.map(result => [result.id, result.status])).toEqual([
        ['a/a/added', 'added'],
        ['a/a/changed', 'changed'],
        ['a/a/removed', 'removed'],
        ['a/a/same', 'unchanged'],
      ]);
    });
  });

  describe('storage keys', () => {
    test('builds write-once keys', () => {
      expect(baselinePrefix('ios-x-0123abcd', SHA_A)).toBe(
        `baselines/ios-x-0123abcd/${SHA_A}`,
      );
      expect(
        reportPrefix({prNumber: 12, headSha: SHA_A, runId: 34, runAttempt: 2}),
      ).toBe(`reports/pull/12/${SHA_A}/34-2`);
      expect(
        reportPrefix({
          prNumber: null,
          headSha: SHA_A,
          runId: 34,
          runAttempt: 1,
        }),
      ).toBe(`reports/main/${SHA_A}/34-1`);
      expect(approvalKey(12, '0123456789abcdef')).toBe(
        'approvals/pull/12/0123456789abcdef.json',
      );
    });

    test.each([
      [() => baselinePrefix('k', 'main')],
      [
        () =>
          reportPrefix({prNumber: -1, headSha: SHA_A, runId: 1, runAttempt: 1}),
      ],
      [
        () =>
          reportPrefix({
            prNumber: 1,
            headSha: SHA_A,
            runId: 1.5,
            runAttempt: 1,
          }),
      ],
      [() => approvalKey(1, '../x')],
    ])('rejects invalid input', build => {
      expect(build).toThrow('Invalid');
    });

    test('encodes each path segment of public URLs', () => {
      expect(publicUrl('https://cdn.example/bucket/', 'a b/c#d.png')).toBe(
        'https://cdn.example/bucket/a%20b/c%23d.png',
      );
    });
  });

  describe('approval', () => {
    const platform = results => ({
      platform: 'ios',
      environmentKey: 'ios-x-0123abcd',
      baselineSha: SHA_B,
      results,
    });
    const changed = sha => ({
      id: 'a/b/c',
      status: 'changed',
      expected: {sha256: 'e'},
      captured: {sha256: sha},
    });

    test('has no fingerprint without differences', () => {
      expect(
        differenceFingerprint([platform([{id: 'a/b/c', status: 'unchanged'}])]),
      ).toBeNull();
    });

    test('fingerprints the exact captured images', () => {
      const first = differenceFingerprint([platform([changed('1')])]);
      expect(first).toMatch(/^[0-9a-f]{16}$/);
      expect(differenceFingerprint([platform([changed('1')])])).toBe(first);
      expect(differenceFingerprint([platform([changed('2')])])).not.toBe(first);
    });

    test.each([
      [null, false, null, 'success', false],
      ['f', false, null, 'failure', false],
      ['f', true, {fingerprint: 'f', approver: 'x'}, 'success', false],
      ['f', true, {fingerprint: 'g', approver: 'x'}, 'failure', true],
      ['f', true, null, 'failure', true],
    ])(
      'gate for fingerprint %s, label %s, approval %j',
      (fingerprint, labelPresent, approval, conclusion, staleLabel) => {
        const decision = gateDecision({fingerprint, labelPresent, approval});
        expect(decision.conclusion).toBe(conclusion);
        expect(decision.staleLabel ?? false).toBe(staleLabel);
        if (conclusion === 'failure' && !staleLabel) {
          expect(decision.summary).toContain(APPROVAL_LABEL);
        }
      },
    );
  });

  describe('renderCheckOutput', () => {
    test('links expected, captured and diff images for each difference', () => {
      const output = renderCheckOutput({
        platform: 'android',
        environmentKey: 'android-x-0123abcd',
        baseline: {sha: SHA_B, distance: 2},
        results: [
          {id: 'a/b/same', status: 'unchanged'},
          {
            id: 'a/b/changed',
            status: 'changed',
            diffPixels: 3,
            diffRatio: 0.03,
            expected: {},
            captured: {},
            diffImage: Buffer.from(''),
          },
        ],
        imageUrl: (kind, id) => `https://cdn.example/${kind}/${id}.png`,
        error: null,
      });
      expect(output.title).toBe('android: 1 visual difference(s)');
      expect(output.summary).toContain('2 commit(s) earlier');
      expect(output.text).toContain(
        'https://cdn.example/expected/a/b/changed.png',
      );
      expect(output.text).toContain(
        'https://cdn.example/captured/a/b/changed.png',
      );
      expect(output.text).toContain('3 px (3.000%)');
      expect(output.images).toEqual([
        expect.objectContaining({
          image_url: 'https://cdn.example/diff/a/b/changed.png',
        }),
      ]);
    });
  });
});
