import DiffMatchPatch from 'diff-match-patch'
import lev from 'fast-levenshtein'

const dmp = new DiffMatchPatch();

export default function diff(original, correction) {
  function _diff(original, correction) {
    const d = dmp.diff_main(original, correction);
    dmp.diff_cleanupSemantic(d);
    return dmp.diff_prettyHtml(d);
  }

  const length = (original.length + correction.length) / 2;
  const score = 1 - lev.get(original, correction) / length;

  return score > 0.35 ? _diff(original, correction) : null;
}