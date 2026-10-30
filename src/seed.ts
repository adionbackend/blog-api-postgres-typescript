import dotenv from 'dotenv';
dotenv.config();

import { pool, initDB } from './config/db';

interface SeedPost {
  title: string;
  content: string;
  author: string;
}

const samplePosts: SeedPost[] = [
  {
    title: 'Why We Chose Raw PostgreSQL over an ORM',
    content:
      'While ORMs provide convenience, using raw SQL gives unmatched visibility, performance, and fine-grained control over execution plans and indexes.',
    author: 'Alice Johnson',
  },
  {
    title: 'Building Scalable APIs with Express and TypeScript',
    content:
      'TypeScript brings compile-time safety and self-documenting interfaces to Express apps, minimizing runtime errors significantly.',
    author: 'Bob Smith',
  },
  {
    title: 'Understanding Connection Pooling in Node.js',
    content:
      'A connection pool avoids the overhead of establishing a new TCP connection on every incoming HTTP request by maintaining an active pool of client connections.',
    author: 'Charlie Brown',
  },
  {
    title: 'PostgreSQL Indexing Best Practices',
    content:
      'Indexes speed up read queries, but too many can degrade write performance. Here is how to pick between B-tree, Hash, and GIN indexes.',
    author: 'Alice Johnson',
  },
  {
    title: 'Securing SQL Queries Against Injection',
    content:
      'Never concatenate raw user input into SQL queries. Always rely on parameterized queries ($1, $2, ...) provided by the driver.',
    author: 'Diana Prince',
  },
];

const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Ensure the table exists
    await initDB();

    // 2. Clear existing records & reset auto-increment ID counter
    console.log('🧹 Clearing existing posts...');
    await pool.query('TRUNCATE TABLE posts RESTART IDENTITY CASCADE;');

    // 3. Construct a multi-row parameterized INSERT query
    // e.g., INSERT INTO posts (title, content, author) VALUES ($1, $2, $3), ($4, $5, $6)...
    const values: any[] = [];
    const valuePlaceholders: string[] = [];

    samplePosts.forEach((post, index) => {
      const offset = index * 3;
      valuePlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
      values.push(post.title, post.content, post.author);
    });

    const insertQuery = `
      INSERT INTO posts (title, content, author)
      VALUES ${valuePlaceholders.join(', ')}
      RETURNING id, title;
    `;

    const result = await pool.query(insertQuery, values);

    console.log(`✅ Successfully seeded ${result.rowCount} posts:`);
    result.rows.forEach((row) => {
      console.log(`   - [ID: ${row.id}] ${row.title}`);
    });
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // 4. Disconnect the pool so the Node CLI script terminates
    await pool.end();
    console.log('🔌 Database connection pool closed.');
  }
};

// Execute seeding
seedDatabase();