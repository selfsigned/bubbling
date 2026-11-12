Use the Svelte MCP server for Svelte work in this project.

- Start Svelte questions with `list-sections`, then fetch every relevant section with `get-documentation`.
- Run `svelte-autofixer` on each changed Svelte component and resolve its suggestions before finishing.
- Do not generate playground links for components already written into this project.

## Design system

- Keep shared visual tokens in `src/styles/global.css`.
- Add repeatable UI patterns as shared components under `src/lib/components/ui/`.
- Document each reusable component and its approved variants on `/design-system`.
- Check the shared component before creating a one-off duplicate; keep genuinely unique layouts local to their page.

## GitHub Pages

- `.github/workflows/deploy.yml` publishes pushes to `master` or `main`, and supports manual runs. It installs the lockfile with `npm ci`, builds on Node 24, and deploys the static `dist` artifact.
- Before the first deployment, connect this checkout to the intended GitHub repository and set repository Settings → Pages → Source to **GitHub Actions**. The workflow does not create a repository or enable Pages.
- `actions/configure-pages` supplies `PAGES_SITE` (origin) and `PAGES_BASE` (repository path, or empty for root/custom-domain sites) to the build. Do not hardcode an owner or repository into Astro config.
- Internal navigation must use `import.meta.env.BASE_URL`; imported assets receive the build base automatically. Local development remains at `/` when the Pages variables are unset.
- Verify project-path publishing with `PAGES_SITE=https://example.github.io PAGES_BASE=/bubbling-demo npm run build`, then `PAGES_SITE=https://example.github.io PAGES_BASE=/bubbling-demo npm run preview -- --host 127.0.0.1 --port 4445`. Open `/bubbling-demo/` and `/bubbling-demo/design-system/`; check hydration, portraits, chat timing, report controls and the home link.
