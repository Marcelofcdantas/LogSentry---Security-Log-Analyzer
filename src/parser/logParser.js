function resolveLogPath(inputPath) {
  const defaultPath = "sample-logs/access.log";
  const targetPath = path.resolve(inputPath || defaultPath);

  if (!fs.existsSync(targetPath)) {
    throw new Error(`Path not found: ${targetPath}`);
  }

  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    return targetPath;
  }

  if (stats.isDirectory()) {
    const files = fs
      .readdirSync(targetPath)
      .map((fileName) => path.join(targetPath, fileName))
      .filter((file) => fs.statSync(file).isFile())
      .filter((file) => file.endsWith(".log"));

    if (files.length === 0) {
      throw new Error(`No .log files found in directory: ${targetPath}`);
    }

    files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    return files[0];
  }

  throw new Error(`Invalid path: ${targetPath}`);
}