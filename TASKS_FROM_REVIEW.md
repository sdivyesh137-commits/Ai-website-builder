# Codebase review: prioritized fix tasks

## 1) Typo fix task
**Task:** Fix typos in `README.md` overview/features text.

**Issue found:**
- "DivStack AI intelligent writes" should be "DivStack AI intelligently writes".
- "Live Live Engine" should be "Live Engine".

**Source lines:** `README.md` lines 24 and 32.

**Acceptance criteria:**
- README wording is grammatically correct and no duplicated words remain in those sections.

## 2) Bug fix task
**Task:** Fix project deletion logic to enforce ownership correctly without invalid Prisma `where` usage.

**Issue found:**
- `deleteProject` uses `prisma.websiteProject.delete({ where: { id, userId: req.userId } })`.
- In Prisma schema, `WebsiteProject` has `id` as the only unique field; there is no composite unique key on `(id, userId)`.
- This can fail at runtime and does not robustly represent authorization intent.

**Source lines:** `server/controllers/projectController.ts` line 102 and `server/prisma/schema.prisma` lines 80-94.

**Acceptance criteria:**
- Deletion works only for the authenticated owner.
- Prisma query uses a valid shape (e.g., `deleteMany` with both fields, or `findFirst` + `delete`).
- Non-owner delete attempts return an authorization/404-style response instead of generic 500.

## 3) Code comment / documentation discrepancy task
**Task:** Align setup documentation with actual AI provider configuration.

**Issue found:**
- README claims the app accepts "OpenRouter API Key (or OpenAI API Key)".
- Backend client is hardcoded to OpenRouter base URL (`https://openrouter.ai/api/v1`) and sends OpenRouter headers.
- Current implementation does not actually support direct OpenAI endpoint usage.

**Source lines:** `README.md` line 62 and `server/configs/openai.ts` lines 7-12.

**Acceptance criteria:**
- Either documentation is updated to state OpenRouter-only support, **or** backend config is enhanced to support provider switching and docs reflect that behavior precisely.

## 4) Test improvement task
**Task:** Add automated backend tests (currently missing) for critical controller behaviors.

**Issue found:**
- `server/package.json` has no `test` script and no test framework dependencies.
- The codebase includes `server/test-api.ts`, which is a manual connectivity script rather than repeatable automated tests.

**Source lines:** `server/package.json` scripts section and `server/test-api.ts`.

**Acceptance criteria:**
- Add a test runner (e.g., Vitest/Jest) and a `test` script.
- Add tests for at least:
  1. `deleteProject` owner vs non-owner behavior.
  2. Credit-check paths in `generateAIWebsite` / `reviseWebsite`.
- Tests run in CI/local without requiring live OpenRouter network calls (mock OpenAI + Prisma).
