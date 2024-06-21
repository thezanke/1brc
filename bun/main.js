import { createReadStream } from 'fs';
import { Writable } from 'stream';

const file = process.argv[2] ?? 'measurements-example.txt';

const data = new Map();

export function handleLine(line) {
    const semiPos = line.indexOf(';');
    const locationName = line.substring(0, semiPos);
    const temp = parseFloat(line.substring(semiPos + 1));

    const locationData = data.get(locationName);

    if (!locationData) {
        data.set(locationName, {
            count: 1,
            min: temp,
            max: temp,
            total: temp,
        });

        return;
    }
    
    locationData.count += 1;
    locationData.total += temp;

    if (locationData.min > temp) {
        locationData.min = temp;
    } else if (locationData.max < temp) {
        locationData.max = temp;
    }
}

export function dumpData() {
    console.log(`Data: %o`, data);
}

let lineBuffer = '';

function handleChunk(chunk) {
    lineBuffer += chunk;

    let newLineIndex;

    while ((newLineIndex = lineBuffer.indexOf('\n')) !== -1) {
        let line = lineBuffer.substring(0, newLineIndex);
        lineBuffer = lineBuffer.substring(newLineIndex + 1);

        handleLine(line);
    }
}

function handleEnd() {
    console.log('Data: %o', data);
}

const stream = createReadStream(file, { encoding: 'ascii' });

stream.on('data', handleChunk)
// stream.on('end', handleEnd);
