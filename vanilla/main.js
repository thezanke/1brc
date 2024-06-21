import { createReadStream } from 'fs';

const file = process.argv[2] ?? 'measurements-example.txt';

const data = new Map();

export function handleLine(line) {
    const semiPos = line.indexOf(';');
    const locationName = line.substring(0, semiPos);
    const temp = +line.substring(semiPos + 1);

    const locationData = data.get(locationName);

    if (!locationData) {
        data.set(locationName, {
            count: 1,
            min: temp,
            max: temp,
            total: temp,
        });
    } else {
        ++locationData.count;
        locationData.total += temp;
        locationData.min = Math.min(locationData.min, temp);
        locationData.max = Math.max(locationData.max, temp);
    }
}

export function dumpData() {
    console.log(`Data: %o`, data);
}

let lineBuffer = '';

function handleDataEvent(chunk) {
    lineBuffer += chunk;

    let newLineIndex;

    while ((newLineIndex = lineBuffer.indexOf('\n')) !== -1) {
        let line = lineBuffer.substring(0, newLineIndex);
        lineBuffer = lineBuffer.substring(newLineIndex + 1);

        handleLine(line);
    }
}

function handleEndEvent() {
    console.log('end');
}

function handleErrorEvent(err) {
    console.error('Error: %o', err);
}

const stream = createReadStream(file, { encoding: 'ascii' });

stream.on('data', handleDataEvent);
stream.on('end', handleEndEvent);
stream.on('error', handleErrorEvent);