import { writeFile } from 'node:fs/promises';

const response = await fetch('https://github-contributions-api.jogruber.de/v4/mighelsterzkdev?y=last', { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`GitHub activity: HTTP ${response.status}`);
const data = await response.json();
if (!Array.isArray(data.contributions) || data.contributions.length < 7 || data.contributions.some(day => !/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4)) throw new Error('Invalid contribution data');
await writeFile(new URL('../dist/assets/github-activity.json', import.meta.url), JSON.stringify({ fetchedAt: new Date().toISOString(), contributions: data.contributions }) + '\n');
console.log(`Saved ${data.contributions.length} days, ${data.contributions.reduce((sum, day) => sum + day.count, 0)} contributions.`);
