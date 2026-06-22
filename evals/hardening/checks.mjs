import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
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
  const hasFrontendEnvExample = fileExists('.env.example');
  const hasBackendEnvExample = fileExists('backend/.env.example');
  const hasVercelConfig = fileExists('vercel.json');
  const hasRenderConfig = fileExists('render.yaml');
  const deploymentDoc = readFile('docs/deployment.md');
  const backendPackage = JSON.parse(readFile('backend/package.json'));
  const vercelConfig = hasVercelConfig ? readFile('vercel.json') : '';
  const renderConfig = hasRenderConfig ? readFile('render.yaml') : '';

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
    buildCheck(
      'frontend_env_example_exists',
      hasFrontendEnvExample,
      '.env.example must exist at repository root for frontend deployment setup.'
    ),
    buildCheck(
      'backend_env_example_exists',
      hasBackendEnvExample,
      'backend/.env.example must exist for backend deployment setup.'
    ),
    buildCheck(
      'backend_package_has_build_script',
      typeof backendPackage?.scripts?.build === 'string' && backendPackage.scripts.build.length > 0,
      'backend/package.json should define a build script to avoid Render default build-command failures.'
    ),
    buildCheck(
      'vercel_config_has_spa_rewrite',
      hasVercelConfig && vercelConfig.includes('"destination": "/index.html"'),
      'vercel.json must include an SPA rewrite to /index.html.'
    ),
    buildCheck(
      'vercel_config_installs_dev_dependencies',
      hasVercelConfig &&
      vercelConfig.includes('"installCommand"') &&
      vercelConfig.includes('--include=dev') &&
      vercelConfig.includes('"buildCommand": "vite build"'),
      'vercel.json must install dev dependencies and build with vite build.'
    ),
    buildCheck(
      'render_config_has_health_check',
      hasRenderConfig && renderConfig.includes('healthCheckPath: /health') && renderConfig.includes('rootDir: backend'),
      'render.yaml must target backend root and configure /health check path.'
    ),
    buildCheck(
      'render_config_uses_autodeploytrigger',
      hasRenderConfig && renderConfig.includes('autoDeployTrigger: commit') && !renderConfig.includes('autoDeploy:'),
      'render.yaml should use autoDeployTrigger instead of deprecated autoDeploy.'
    ),
    buildCheck(
      'deployment_doc_exists_and_mentions_providers',
      deploymentDoc.includes('Vercel') && deploymentDoc.includes('Render') && deploymentDoc.includes('verify:hardening'),
      'docs/deployment.md must describe Vercel + Render deployment and verification.'
    ),
  ];

  return checks;
}
