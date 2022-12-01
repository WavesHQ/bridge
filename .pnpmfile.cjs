/**
 * Hook into pnpm's resolution process and modify packages as needed.
 * @see https://pnpm.io/pnpmfile
 * @see https://pnpm.io/faq#solution-2
 */
function readPackage(pkg, context) {
  // See https://github.com/cec-org/codex/issues/434
  if (pkg.name.startsWith("@nestjs/")) {
    context.log(
      `[codex] ${pkg.name}: making all peer dependencies non-optional`
    );
    pkg.peerDependenciesMeta = {};
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
