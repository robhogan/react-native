/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const {summarize} = require('./compare');

// GitHub limits check run output text to 65535 characters and 50 images.
const MAX_TEXT_LENGTH = 60000;
const MAX_IMAGES = 50;

const STATUS_LABELS = {
  changed: 'Changed',
  'dimension-mismatch': 'Size changed',
  added: 'New',
  removed: 'Removed',
  unchanged: 'Unchanged',
};

function formatPercent(ratio) {
  return ratio == null ? '' : `${(ratio * 100).toFixed(3)}%`;
}

/**
 * Renders one platform's comparison as GitHub check run output. `imageUrl`
 * maps (kind, test ID) to the public URL of an uploaded expected, captured
 * or diff image.
 */
function renderCheckOutput({
  platform,
  environmentKey,
  baseline,
  results,
  imageUrl,
  error,
}) {
  if (error != null) {
    return {
      title: `${platform}: ${error.title}`,
      summary: error.summary,
      text: '',
      images: [],
    };
  }

  const {counts, hasDifferences} = summarize(results);
  const differing = results.filter(result => result.status !== 'unchanged');
  const baselineLine =
    baseline.distance === 0
      ? `Compared with the baseline for base commit \`${baseline.sha.slice(0, 12)}\`.`
      : `No baseline was published for the base commit, so this compares with the nearest ancestor that has one, \`${baseline.sha.slice(0, 12)}\` (${baseline.distance} commit(s) earlier). Differences can come from commits in between.`;

  const summary = [
    hasDifferences
      ? `${differing.length} of ${results.length} visual test(s) differ.`
      : `All ${results.length} visual test(s) match.`,
    '',
    baselineLine,
    '',
    `Environment: \`${environmentKey}\``,
    '',
    Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => `${STATUS_LABELS[status]}: ${count}`)
      .join(' · '),
  ].join('\n');

  const sections = [];
  const images = [];
  for (const result of differing) {
    const row = [];
    const cell = kind => `<img src="${imageUrl(kind, result.id)}" width="300">`;
    if (result.expected != null) {
      row.push(['Expected', cell('expected')]);
    }
    if (result.captured != null) {
      row.push(['Captured', cell('captured')]);
    }
    if (result.diffImage != null) {
      row.push(['Diff', cell('diff')]);
    }
    const details =
      result.status === 'dimension-mismatch'
        ? `${result.expectedSize.width}×${result.expectedSize.height} → ${result.capturedSize.width}×${result.capturedSize.height}`
        : result.diffPixels != null
          ? `${result.diffPixels} px (${formatPercent(result.diffRatio)})`
          : '';
    sections.push(
      [
        `### \`${result.id}\`: ${STATUS_LABELS[result.status]}${details ? `, ${details}` : ''}`,
        '',
        `| ${row.map(([label]) => label).join(' | ')} |`,
        `|${row.map(() => '---').join('|')}|`,
        `| ${row.map(([, html]) => html).join(' | ')} |`,
      ].join('\n'),
    );
    if (result.diffImage != null && images.length < MAX_IMAGES) {
      images.push({
        alt: `${result.id} diff`,
        image_url: imageUrl('diff', result.id),
        caption: `${result.id}: ${details}`,
      });
    }
  }

  let text = sections.join('\n\n');
  if (text.length > MAX_TEXT_LENGTH) {
    text = `${text.slice(0, MAX_TEXT_LENGTH)}\n\n…truncated. See results.json for the full list.`;
  }

  return {
    title: hasDifferences
      ? `${platform}: ${differing.length} visual difference(s)`
      : `${platform}: no visual differences`,
    summary,
    text,
    images,
  };
}

module.exports = {renderCheckOutput};
