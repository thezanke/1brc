import { createReadStream } from 'fs';

const file = process.argv[2] ?? 'measurements-example.txt';

const locations = new Map();

function createNewLocation(name, loc, temp) {
    locations.set(name, {
        count: 1,
        min: temp,
        max: temp,
        total: temp,
    });
}

function updateLocation(name, loc, temp) {
    loc.count += 1;
    loc.total += temp;

    if (loc.min > temp) {
        loc.min = temp;
    } else if (loc.max < temp) {
        loc.max = temp;
    }
}

export function handleLine(l) {
    const i = l.indexOf(';');
    const name = l.substring(0, i);
    const loc = locations.get(name);
    const temp = parseFloat(l.substring(i + 1));
    
    if (!loc) {
        createNewLocation(name, loc, temp);
        return;
    }

    updateLocation(name, loc, temp);
}

const rs = createReadStream(file, { encoding: 'ascii' });

let buffer = '';

rs.on('data', (c) => {
    buffer += c;

    let i;

    while (true) {
        i = buffer.indexOf('\n');

        if (i === -1) break;

        handleLine(buffer.substring(0, i));

        buffer = buffer.substring(i + 1);
    }
});

rs.on('close', () => {
    console.log('Done.');
});
