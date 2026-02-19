import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICS_URL = 'https://calendar.google.com/calendar/ical/ko.south_korea%23holiday%40group.v.calendar.google.com/public/basic.ics';
const OUTPUT_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'holidays.ics');

// Ensure public directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Fetching holidays from: ${ICS_URL}`);

https.get(ICS_URL, (res) => {
    if (res.statusCode !== 200) {
        console.error(`Failed to fetch ICS: ${res.statusCode}`);
        process.exit(1);
    }

    const file = fs.createWriteStream(OUTPUT_FILE);
    res.pipe(file);

    file.on('finish', () => {
        file.close();
        console.log(`Successfully saved holidays to ${OUTPUT_FILE}`);
    });
}).on('error', (err) => {
    console.error(`Error fetching ICS: ${err.message}`);
    process.exit(1);
});
