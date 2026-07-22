const fs = require('fs');

let dbCode = fs.readFileSync('D:/PersonalOS/js/db.js', 'utf8');

if (!dbCode.includes('getEvents')) {
    const eventHelpers = `
    // --- EVENTS (Calendar) ---
    async addEvent(data) {
        if (!data.id) data.id = generateUUID();
        if (!data.createdAt) data.createdAt = new Date().toISOString();
        await db.events.put(data);
        return data;
    },
    async getEvents() {
        return await db.events.toArray();
    },
    async updateEvent(id, data) {
        await db.events.update(id, data);
    },
    async deleteEvent(id) {
        await db.events.delete(id);
    },
`;
    // Insert just before `// Migrasi data dari LocalStorage ke IndexedDB`
    dbCode = dbCode.replace('// Migrasi data dari LocalStorage ke IndexedDB', eventHelpers + '\n    // Migrasi data dari LocalStorage ke IndexedDB');
    fs.writeFileSync('D:/PersonalOS/js/db.js', dbCode);
    console.log('Successfully added event helpers to db.js!');
}
