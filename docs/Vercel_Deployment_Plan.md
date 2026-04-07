# Vercel Deployment Plan (WebsiteCV)

## Objective

Deploy this Next.js website to Vercel Hobby with the easiest setup and automatic Git-based redeploys.

## Current Preconditions

- Project: Next.js (App Router) with `build` and `start` scripts already present.
- Vercel CLI available via `npx vercel`.
- Git repo exists locally but no commit history yet.
- No remote configured yet.

## Phase 0 — Local Repository Readiness

### Steps

1. Confirm branch and working tree state.
2. Build locally (`pnpm build`) to catch deployment blockers early.
3. Create first commit with all required project files.

### Verification Gates

- `pnpm build` exits with code 0.
- `git log -1` returns a commit.
- `git status --porcelain` is empty after commit.

### Failure Handling

- If build fails, fix blocking compile/runtime/type issues before continuing.
- If commit fails due to config, set git user/email and retry.

## Phase 1 — Publish to GitHub

### Steps

1. Create GitHub repo (recommended: personal account, not org for easiest Hobby flow).
2. Add `origin` remote.
3. Push local branch to GitHub and set upstream.

### Verification Gates

- `git remote -v` shows `origin`.
- `git ls-remote origin` succeeds.
- Branch appears on GitHub.

### Failure Handling

- If auth fails, complete GitHub login (`gh auth login` or PAT flow).
- If repo exists, just connect remote and push.

## Phase 2 — Vercel Project Creation & First Production Deploy

### Steps

1. Import GitHub repo in Vercel dashboard or run `vercel link`.
2. Ensure framework auto-detected as Next.js.
3. Trigger production deployment (`main/master` push or `vercel --prod`).

### Verification Gates

- Deployment status: Ready.
- Production URL returns 200.
- Core routes load (`/`, `/immersive`, `/projects`, `/skills`, `/about`, `/experience`, `/contact`).

## Phase 3 — Environment & Branch Policy

### Steps

1. Add environment variables only if needed (Production/Preview/Development scope).
2. Confirm production branch setting.
3. Validate preview deployment from non-production branch.

### Verification Gates

- No missing env var errors in build/runtime logs.
- Preview and production deploy behavior matches expected branch rules.

## Phase 4 — Domain (Optional)

### Steps

1. Keep `.vercel.app` domain initially.
2. Add custom domain later in Project Settings > Domains.
3. Configure DNS (A/CNAME/TXT as prompted by Vercel).

### Verification Gates

- Domain status: Valid Configuration.
- HTTPS certificate active.
- Correct apex/www redirect behavior.

## Things To Avoid

- Avoid static export for this app unless intentionally reducing Next.js feature support.
- Avoid storing secrets in source files.
- Avoid `--prebuilt` in this basic flow unless CI requires it.
- Avoid skipping local build verification before first deploy.

## Operator Checklist (Quick)

- [ ] Phase 0 complete
- [ ] Phase 1 complete
- [ ] Phase 2 complete
- [ ] Post-deploy route checks pass
- [ ] Optional domain configured
