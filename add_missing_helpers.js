const fs = require('fs');

let dbCode = fs.readFileSync('D:/PersonalOS/js/db.js', 'utf8');

const missingHelpers = `
    // --- TASKS ---
    async addTask(data) {
        if (!data.id) data.id = generateUUID();
        data.createdAt = data.createdAt || new Date().toISOString();
        data.updatedAt = new Date().toISOString();
        await db.tasks.put(data);
        return data;
    },
    async getTasks() {
        return await db.tasks.toArray();
    },
    async updateTask(id, data) {
        data.updatedAt = new Date().toISOString();
        return await db.tasks.update(id, data);
    },
    async deleteTask(id) {
        return await db.tasks.delete(id);
    },

    // --- NOTES ---
    async addNote(data) {
        if (!data.id) data.id = generateUUID();
        data.createdAt = data.createdAt || new Date().toISOString();
        data.updatedAt = new Date().toISOString();
        await db.notes.put(data);
        return data;
    },
    async getNotes() {
        return await db.notes.toArray();
    },
    async updateNote(id, data) {
        data.updatedAt = new Date().toISOString();
        return await db.notes.update(id, data);
    },
    async deleteNote(id) {
        return await db.notes.delete(id);
    },

    // --- FINANCES ---
    async addFinance(data) {
        if (!data.id) data.id = generateUUID();
        data.createdAt = data.createdAt || new Date().toISOString();
        await db.finances.put(data);
        return data;
    },
    async getFinances() {
        return await db.finances.toArray();
    },
    async deleteFinance(id) {
        return await db.finances.delete(id);
    },
`;

if (!dbCode.includes('getTasks')) {
    dbCode = dbCode.replace('// --- PROJECTS ---', missingHelpers + '\n    // --- PROJECTS ---');
    fs.writeFileSync('D:/PersonalOS/js/db.js', dbCode);
    console.log('Added missing helpers to db.js');
}
