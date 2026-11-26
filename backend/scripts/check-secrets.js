const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "../..");

const secretPatterns = [
  {
    name: "database URI with embedded credentials",
    pattern: /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis):\/\/[^:\s/@]+:[^@\s]+@/i,
  },
  {
    name: "secret assignment",
    pattern: /\b(?:password|passwd|secret|session[_-]?secret|token|api[_-]?key|private[_-]?key)\b\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{8,}/i,
  },
  {
    name: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    name: "GitHub token",
    pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/,
  },
  {
    name: "AWS access key",
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  },
];

const placeholders = [
  "replace_with",
  "change_me",
  "your_",
  "example",
  "dummy",
  "not_a_real",
  "${",
  "process.env",
  ":password@",
];

const skippedDirectories = new Set([
  "node_modules",
  "dist",
  "coverage",
  ".git",
]);

const isPlaceholder = (value) =>
  placeholders.some((placeholder) =>
    value.toLowerCase().includes(placeholder)
  );

const findSecretLookingValues = (content) => {
  const matches = [];

  for (const { name, pattern } of secretPatterns) {
    const match = content.match(pattern);
    if (match && !isPlaceholder(match[0])) {
      matches.push({ name, value: match[0] });
    }
  }

  return matches;
};

const trackedFilesOutput = execFileSync(
  "git",
  ["ls-files", "-z"],
  { cwd: repositoryRoot }
);

const trackedFiles = trackedFilesOutput
  .toString("utf8")
  .split("\0")
  .filter(Boolean);

const findings = [];

for (const relativePath of trackedFiles) {
  const pathParts = relativePath.split("/");
  if (pathParts.some((part) => skippedDirectories.has(part))) {
    continue;
  }

  const absolutePath = path.join(repositoryRoot, relativePath);

  let content;
  try {
    content = fs.readFileSync(absolutePath, "utf8");
  } catch {
    continue;
  }

  for (const finding of findSecretLookingValues(content)) {
    findings.push({ file: relativePath, ...finding });
  }
}

if (findings.length > 0) {
  console.error("Secret-looking values found in tracked files:");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.name}`);
  }
  process.exit(1);
}

console.log("Secret check passed: no known secret-looking values found.");
