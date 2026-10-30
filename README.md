# Initial Steps

- Run these commands

```bash
npm init -y
npm install express pg dotenv
npm install -D @types/express @types/node @types/pg typescript
```

- Scripts for package.json

```json
"scripts": {
    "dev": "npm run build && node dist/index.js",
    "build": "tsc -b",
    "start": "node dist/index.js",
    "seed": "npm run build && node dist/seed.js"
}
```

- Initialize Typescript
```bash
npx tsc --init
```

- tsconfig.json file
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

- Environment Variables
```env
PORT=5000
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=blog_db
PG_PASSWORD=your_password
PG_PORT=5432
```