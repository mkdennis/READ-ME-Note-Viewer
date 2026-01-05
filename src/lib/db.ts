import { openDB } from 'idb'

export interface Readme {
  id: string
  title: string
  content: string
  uploadedAt: number
  lastModified: number
}

interface ReadmeDB {
  readmes: {
    key: string
    value: Readme
    indexes: { 'by-uploaded': number; 'by-title': string }
  }
}

const DB_NAME = 'readme-learning-db'
const DB_VERSION = 1
const STORE_NAME = 'readmes'

let dbPromise: ReturnType<typeof openDB<ReadmeDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ReadmeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
        })
        store.createIndex('by-uploaded', 'uploadedAt')
        store.createIndex('by-title', 'title')
      },
    })
  }
  return dbPromise
}

export async function addReadme(title: string, content: string): Promise<string> {
  const db = await getDB()
  const id = crypto.randomUUID()
  const now = Date.now()
  
  const readme: Readme = {
    id,
    title,
    content,
    uploadedAt: now,
    lastModified: now,
  }
  
  await db.put(STORE_NAME, readme)
  return id
}

export async function getAllReadmes(): Promise<Readme[]> {
  const db = await getDB()
  const index = db.transaction(STORE_NAME).store.index('by-uploaded')
  return index.getAll().then(readmes => readmes.reverse()) // Most recent first
}

export async function getReadme(id: string): Promise<Readme | undefined> {
  const db = await getDB()
  return db.get(STORE_NAME, id)
}

export async function deleteReadme(id: string): Promise<void> {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}

export async function updateReadme(id: string, title: string, content: string): Promise<void> {
  const db = await getDB()
  const existing = await db.get(STORE_NAME, id)
  
  if (!existing) {
    throw new Error(`Readme with id ${id} not found`)
  }
  
  const updated: Readme = {
    ...existing,
    title,
    content,
    lastModified: Date.now(),
  }
  
  await db.put(STORE_NAME, updated)
}

export async function searchReadmes(query: string): Promise<Readme[]> {
  if (!query.trim()) {
    return getAllReadmes()
  }
  
  const db = await getDB()
  const allReadmes = await db.getAll(STORE_NAME)
  const lowerQuery = query.toLowerCase()
  
  return allReadmes.filter(readme => {
    const titleMatch = readme.title.toLowerCase().includes(lowerQuery)
    const contentMatch = readme.content.toLowerCase().includes(lowerQuery)
    return titleMatch || contentMatch
  })
}

export async function clearAllReadmes(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await tx.store.clear()
  await tx.done
  console.log('Cleared all READMEs from database')
}

