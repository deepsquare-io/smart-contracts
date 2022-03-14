import prompts from 'prompts';

export default async function proceed() {
  const go = await prompts([
    {
      type: 'confirm',
      name: 'correct',
      message: `Are the accounts correct?`,
    },
    {
      type: 'confirm',
      name: 'sure',
      message: `Start the migration?`,
    },
  ]);

  if (!go.correct || !go.sure) {
    process.stdout.write('Aborting\n');
    return false;
  }

  return true;
}
