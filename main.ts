import { createReadStream } from 'fs';

const file = process.argv[2] ?? 'measurements-example.txt';

const stream = createReadStream(file, { encoding: 'utf8' });

const sum: Record<string, number> = {};
const min: Record<string, number> = {};
const max: Record<string, number> = {};
const count: Record<string, number> = {};

let buffer = '';

stream.on('data', (chunk) => {
    buffer += chunk;

    let newLineIndex = buffer.indexOf('\n');

    if (newLineIndex === -1) {
        return;
    }

    let line = buffer.substring(0, newLineIndex);

    buffer = buffer.substring(newLineIndex + 1);

    const semiPos = line.indexOf(';');
    const location = line.substring(0, semiPos);
    const temp = parseFloat(line.substring(semiPos + 1));

    if (!count[location]) {
        count[location] = 1;
        sum[location] = temp;
        min[location] = temp;
        max[location] = temp;
    } else {
        count[location]++;
        sum[location] += temp;
        min[location] = Math.min(min[location], temp);
        max[location] = Math.max(max[location], temp);
    }
});

stream.on('end', () => {
    console.log('Finished reading file');
    console.log(`Measurements: %o`, { sum, min, max, count });
});

stream.on('error', (err) => {
    console.error(err);
});
