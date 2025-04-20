import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from './db';
import { narrators } from '@shared/schema';

async function importNarrators() {
  try {
    const csvFilePath = path.join(__dirname, '../attached_assets/Lets see - narr (1).csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    console.log(`Found ${records.length} narrators in CSV file`);
    
    for (const record of records) {
      await db.insert(narrators).values({
        narratorId: record.ID,
        fullName: record['Full Name'] || '',
        kunya: record.Kunya || '',
        titles: record.Titles || '',
        adjectives: record.Adjectives || '',
        location: record.Location || '',
        deathDate: record['Death Date'] || '',
        grade: record.Grade || '',
        books: record.Books || '',
      }).onConflictDoNothing();
    }
    
    console.log('Narrators imported successfully');
  } catch (error) {
    console.error('Error importing narrators:', error);
  }
}

importNarrators().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});