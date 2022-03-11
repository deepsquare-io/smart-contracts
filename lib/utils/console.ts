export function title(name: string, skip = false) {
  skip || process.stdout.write('\n');
  console.log(name);
  console.log('========================================');
}
