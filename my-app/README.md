# my-app

Retained React starter, independent of the deployed AV Stuttgart site. The root
Dockerfile and CI deployment build the application in `../src`, not this directory.

Use Node.js 24 LTS. From this directory:

```sh
npm ci
npm start
npm test
npm run build
npm audit
```

Vite serves development on `http://localhost:3000` and writes production files to
`build/`. Vitest runs the existing React Testing Library component test. Stop the
root development server before starting this app, since both use port 3000.

The CRA toolchain was replaced on 2026-11-02 to remove vulnerable build/test
transitive dependencies. App content and public assets are retained.
