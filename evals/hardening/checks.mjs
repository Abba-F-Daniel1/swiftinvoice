import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function buildCheck(name, pass, details) {
  return { name, pass: Boolean(pass), details };
}

export function evaluateHardening() {
  const server = readFile('backend/server.js');
  const routes = readFile('backend/routes/index.js');
  const clerk = readFile('backend/config/clerk.js');
  const app = readFile('src/App.tsx');
  const axiosTs = readFile('src/lib/axios.ts');
  const apiJs = readFile('src/api.js');
  const ignore = readFile('.gitignore');

  const authIndex = server.indexOf("app.use(authenticateToken)");
  const routesIndex = server.indexOf("app.use('/', routes)");

  const checks = [
    buildCheck(
      'server_health_endpoint_exists',
      server.includes("app.get('/health'"),
      'backend/server.js must expose GET /health before protected routes.'
    ),
    buildCheck(
      'server_auth_before_routes',
      authIndex !== -1 && routesIndex !== -1 && authIndex < routesIndex,
      'backend/server.js must register authenticateToken before app.use(\'\/\', routes).'
    ),
    buildCheck(
      'server_legacy_requireauth_removed',
      !server.includes('requireAuth()'),
      'backend/server.js should not keep duplicate legacy requireAuth middleware.'
    ),
    buildCheck(
      'services_get_route_exists',
      routes.includes("router.get('/services'"),
      'backend/routes/index.js must expose GET /services.'
    ),
    buildCheck(
      'services_post_route_exists',
      routes.includes("router.post('/services'"),
      'backend/routes/index.js must expose POST /services.'
    ),
    buildCheck(
      'clerk_uses_secret_key',
      clerk.includes('process.env.CLERK_SECRET_KEY'),
      'backend/config/clerk.js must use CLERK_SECRET_KEY.'
    ),
    buildCheck(
      'frontend_token_sync_component_exists',
      app.includes('function ClerkTokenSync()') &&
        app.includes('localStorage.setItem("token", token)') &&
        app.includes('<ClerkTokenSync />'),
      'src/App.tsx must keep Clerk token synchronization in place.'
    ),
    buildCheck(
      'axios_interceptor_supports_token_keys',
      axiosTs.includes("localStorage.getItem('token') || localStorage.getItem('clerkToken')") &&
        apiJs.includes("localStorage.getItem('token') || localStorage.getItem('clerkToken')"),
      'src/lib/axios.ts and src/api.js must support token and clerkToken fallback.'
    ),
    buildCheck(
      'gitignore_protects_env_files',
      ignore.includes('.env') && ignore.includes('.env.*') && ignore.includes('backend/.env'),
      '.gitignore must ignore .env, .env.*, and backend/.env.'
    ),
  ];

  return checks;
}
