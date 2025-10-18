/**
 * Simple in-memory database for storing researcher profiles
 * In production, replace this with a real database (Prisma, MongoDB, etc.)
 */

export interface StoredResearcher {
  id: string;
  name: string;
  affiliation: string;
  summary: string;
  topPapers: Array<{
    title: string;
    authors: string;
    abstract: string;
    url: string;
    year?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

class ResearcherDatabase {
  private researchers: Map<string, StoredResearcher> = new Map();

  /**
   * Generate a unique ID from name and affiliation
   */
  private generateId(name: string, affiliation: string): string {
    return `${name.toLowerCase().replace(/\s+/g, '-')}_${affiliation.toLowerCase().replace(/\s+/g, '-')}`;
  }

  /**
   * Add or update a researcher profile
   */
  upsert(researcher: {
    name: string;
    affiliation: string;
    summary: string;
    topPapers: Array<{
      title: string;
      authors: string;
      abstract: string;
      url: string;
      year?: string;
    }>;
  }): StoredResearcher {
    const id = this.generateId(researcher.name, researcher.affiliation);
    const now = new Date().toISOString();

    const existing = this.researchers.get(id);
    const stored: StoredResearcher = {
      id,
      ...researcher,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    this.researchers.set(id, stored);
    return stored;
  }

  /**
   * Get a specific researcher by name and affiliation
   */
  get(name: string, affiliation: string): StoredResearcher | null {
    const id = this.generateId(name, affiliation);
    return this.researchers.get(id) || null;
  }

  /**
   * Get all researchers
   */
  getAll(): StoredResearcher[] {
    return Array.from(this.researchers.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  /**
   * Delete a researcher
   */
  delete(name: string, affiliation: string): boolean {
    const id = this.generateId(name, affiliation);
    return this.researchers.delete(id);
  }

  /**
   * Get count of researchers
   */
  count(): number {
    return this.researchers.size;
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.researchers.clear();
  }
}

// Export singleton instance with persistence across hot reloads
// Use global to persist across Next.js hot module reloads in development
const globalForDB = globalThis as unknown as {
  researcherDB: ResearcherDatabase | undefined;
};

export function getDB(): ResearcherDatabase {
  if (!globalForDB.researcherDB) {
    globalForDB.researcherDB = new ResearcherDatabase();
    console.log('🔄 Initialized new ResearcherDatabase instance');
  }
  return globalForDB.researcherDB;
}
