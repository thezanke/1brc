import { createReadStream } from 'fs';

const file = process.argv[2] ?? 'measurements-example.txt';

const processor = {
    data: new Map(),
    addLine(line) {
        const semiPos = line.indexOf(';');
        const location = line.substring(0, semiPos);
        const temp = parseFloat(line.substring(semiPos + 1));

        const data = this.data.get(location);

        if (!data) {
            this.data.set(location, {
                count: 1,
                sum: temp,
                min: temp,
                max: temp,
            });
        } else {
            data.count++;
            data.sum += temp;
            data.min = Math.min(data.min, temp);
            data.max = Math.max(data.max, temp);
        }
    },
    dumpData() {
        console.log(`Data: %o`, this.data);
    }
}

const stream = createReadStream(file, { encoding: 'utf8' });

let streamBuffer = '';

stream.on('data', (chunk) => {
    streamBuffer += chunk;

    let newLineIndex;

    while ((newLineIndex = streamBuffer.indexOf('\n')) !== -1) {
        let line = streamBuffer.substring(0, newLineIndex);
        streamBuffer = streamBuffer.substring(newLineIndex + 1);
        processor.addLine(line);
    }
});

stream.on('end', () => {
    console.log('Finished reading file');
    processor.dumpData();
});

stream.on('error', (err) => {
    console.error(err);
});
