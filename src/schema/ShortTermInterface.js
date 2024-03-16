export default class ShortTermInterface {
  static async create(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS ShortTermTable (
        shortTermId INTEGER PRIMARY KEY AUTOINCREMENT,
        summaryText TEXT,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.executeSql(query);
  }

  static async get(db, shortTermId) {
    // Implementation to fetch a short term summary by shortTermId
  }

  static async insert(db, summaryText) {
    // Implementation to insert a new short term summary
  }
}
