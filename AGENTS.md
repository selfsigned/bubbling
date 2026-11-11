Use the Svelte MCP server for Svelte work in this project.

- Start Svelte questions with `list-sections`, then fetch every relevant section with `get-documentation`.
- Run `svelte-autofixer` on each changed Svelte component and resolve its suggestions before finishing.
- Do not generate playground links for components already written into this project.

## Design system

- Keep shared visual tokens in `src/styles/global.css`.
- Add repeatable UI patterns as shared components under `src/lib/components/ui/`.
- Document each reusable component and its approved variants on `/design-system`.
- Check the shared component before creating a one-off duplicate; keep genuinely unique layouts local to their page.
