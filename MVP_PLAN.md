# AI Résumé Builder MVP Plan

## 1. Product goal

Build a focused AI résumé product that helps a user move from a blank or incomplete résumé to a targeted, downloadable résumé for a specific job.

The core workflow is:

1. Build résumé
2. Paste a job description
3. See problems and missing keywords
4. Improve wording with AI
5. Download a clean PDF
6. Upgrade when a usage limit is reached

The first release should feel calm, focused, and easy to understand. Every feature should support this workflow.

## 2. MVP scope

### Included

- One résumé editor
- Contact details
- Professional summary
- Work experience
- Education
- Skills
- Add, edit, delete, and reorder résumé sections
- One ATS-friendly résumé template
- Live résumé preview
- AI-generated professional summary
- AI-generated and improved experience bullets
- AI actions:
  - Rewrite
  - Make shorter
  - Make more professional
- Job-description keyword matching
- Missing-keyword suggestions based on user-provided experience
- Résumé checker with a score from 0 to 100
- PDF download with selectable text
- Free and Pro usage limits
- Pro upgrade flow
- Neon Postgres persistence
- Neon-backed authentication and user-owned data
- Neon storage for résumé-related files when needed

### Explicitly excluded from the first release

- Job board
- Mobile application
- Browser extension
- Interview coach
- Cover-letter builder
- Application tracker
- LinkedIn importer
- Multiple résumé templates
- DOCX export
- Human résumé reviews
- Advanced visual customization
- Team workspaces
- Public résumé profiles
- Social sharing

## 3. Product principles

### Keep the editor focused

The editor should ask for the information needed to create a useful résumé without making the user configure typography, colors, spacing, or templates.

### Keep AI grounded in user input

AI suggestions must be based on information the user has provided. The interface should remind users to review suggestions and should never encourage inventing achievements, employers, metrics, or skills.

### Make progress visible

The user should always be able to see:

- How complete the résumé is
- The current résumé score
- How many AI generations remain
- How many job matches remain
- How many PDF downloads remain

### Make output trustworthy

The résumé preview and PDF should use real selectable text, preserve a consistent layout, and remain readable by applicant tracking systems.

## 4. Recommended technical architecture

### Application

- Framework: Next.js App Router
- Language: TypeScript
- UI: React client components where interaction is required
- Styling: the existing global CSS system, with shared UI primitives added as the product grows
- Deployment: keep the existing cloud deployment target

### Backend

- Database: Neon Postgres
- Authentication: use the selected Neon-compatible authentication provider and keep all user-owned records linked to the authenticated user
- Storage: use Neon-supported storage for generated files or add a small storage adapter if PDF files are stored outside Postgres
- API boundary: Next.js Route Handlers or Server Actions for mutations and AI requests
- Background work: defer queues and long-running jobs until usage requires them

### External services

- AI provider: use a server-side provider adapter with the API key stored only in server environment variables
- Payments: Stripe Checkout and Stripe Billing
- PDF generation: start with browser print to produce selectable text; move to a server-rendered PDF service only if consistent server-side output becomes necessary

### Separation of concerns

Use these boundaries:

- UI components: collect input, display state, and show loading or error states
- Domain helpers: calculate résumé score, extract keywords, validate content, and calculate entitlements
- Server actions or route handlers: authenticate, validate, call AI, write to Neon, and return safe results
- Database layer: typed queries and transactions
- Provider adapters: AI, payments, storage, and PDF generation

## 5. Data model

All tables must include ownership checks. A user must only be able to read or modify their own records.

### `users`

Use the authentication provider’s user table when it supplies one. If an application table is needed, keep only the application-specific fields.

Suggested fields:

- `id`
- `email`
- `display_name`
- `created_at`
- `updated_at`

### `subscriptions`

Suggested fields:

- `id`
- `user_id`
- `provider_customer_id`
- `provider_subscription_id`
- `status`
- `plan` (`free` or `pro`)
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `created_at`
- `updated_at`

### `usage_counters`

Store usage by billing period rather than deriving it from UI state.

Suggested fields:

- `id`
- `user_id`
- `period_key`
- `ai_generations_used`
- `job_matches_used`
- `pdf_downloads_used`
- `created_at`
- `updated_at`

Use a unique constraint on `user_id` and `period_key`.

### `resumes`

Suggested fields:

- `id`
- `user_id`
- `title`
- `template_key`
- `status`
- `created_at`
- `updated_at`

The free plan allows one active résumé. Pro users can create multiple résumé records.

### `resume_sections`

Suggested fields:

- `id`
- `resume_id`
- `section_type`
- `sort_order`
- `is_visible`
- `created_at`
- `updated_at`

Supported first-version section types:

- `summary`
- `experience`
- `education`
- `skills`

### `resume_contact`

Suggested fields:

- `resume_id`
- `full_name`
- `professional_title`
- `email`
- `phone`
- `location`
- `website`

### `resume_summaries`

Suggested fields:

- `id`
- `resume_id`
- `content`
- `created_at`
- `updated_at`

### `resume_experience`

Suggested fields:

- `id`
- `resume_id`
- `sort_order`
- `role`
- `company`
- `location`
- `start_date`
- `end_date`
- `is_current`
- `created_at`
- `updated_at`

### `resume_bullets`

Suggested fields:

- `id`
- `experience_id`
- `sort_order`
- `content`
- `created_at`
- `updated_at`

### `resume_education`

Suggested fields:

- `id`
- `resume_id`
- `sort_order`
- `school`
- `degree`
- `start_date`
- `end_date`
- `created_at`
- `updated_at`

### `resume_skills`

Suggested fields:

- `id`
- `resume_id`
- `sort_order`
- `name`
- `created_at`
- `updated_at`

### `job_matches`

Store a job description and the result so the user can return to it.

Suggested fields:

- `id`
- `user_id`
- `resume_id`
- `job_title`
- `job_description`
- `included_keywords` as JSON
- `missing_keywords` as JSON
- `suggestions` as JSON
- `match_score`
- `created_at`

Do not store provider secrets or unnecessary model request metadata.

### `ai_generations`

Suggested fields:

- `id`
- `user_id`
- `resume_id`
- `generation_type`
- `input_reference`
- `output_text`
- `created_at`

Use this table for auditability and support. Usage limits should be enforced transactionally through `usage_counters`.

### `file_exports`

If generated PDFs are persisted, store:

- `id`
- `user_id`
- `resume_id`
- `storage_key`
- `file_type`
- `created_at`
- `expires_at`

The first version can generate a PDF directly in the browser and avoid storing files.

## 6. Entitlements and pricing

### Free plan

- One résumé
- Five AI generations per billing period
- One job match per billing period
- Three PDF downloads per billing period

### Pro plan

- Multiple résumé versions
- One hundred AI generations per billing period
- Thirty job matches per billing period
- Unlimited PDF downloads
- Monthly price: `$12.99`

### Entitlement rules

1. Read the authenticated user’s current subscription.
2. Resolve the active plan.
3. Read the current usage counter for the billing period.
4. Check the limit on the server.
5. Increment usage atomically only after the operation succeeds.
6. Return the updated usage to the client.

Never rely on a disabled button or client-side counter as the only limit. Client state is for display; the server is authoritative.

### Limit behavior

When a free user reaches a limit:

- Keep their existing résumé accessible.
- Show what limit was reached.
- Explain the Pro allowance that replaces it.
- Provide an upgrade button.
- Preserve unsaved form data before opening the upgrade flow.

## 7. Authentication and authorization

### Authentication flow

Support:

- Sign up
- Sign in
- Sign out
- Session persistence
- Password reset or the selected provider’s equivalent

The product should support an unauthenticated landing state and require authentication before saving résumés or consuming AI, matching, or export usage.

### Authorization requirements

- Every résumé query filters by `user_id`.
- Every update checks ownership before writing.
- Every delete checks ownership before deleting.
- Route handlers reject missing or invalid sessions.
- AI provider keys and payment secrets never reach the browser.
- Webhook handlers verify payment provider signatures.

## 8. Résumé builder experience

### Main editor layout

Use the current two-column concept:

- Left column: editable form sections
- Right column: live ATS-friendly résumé preview

On smaller screens, stack the editor above the preview.

### Contact details

Fields:

- Full name
- Professional title
- Email
- Phone
- Location
- Website

Validate email format and trim all values before saving.

### Professional summary

Provide a multiline text editor with a reasonable character limit. Include an AI action to generate a professional summary from the user’s résumé content.

### Experience

Each experience record supports:

- Job title
- Company
- Location
- Dates
- Current-role state
- Multiple bullets

Actions:

- Add experience
- Edit experience
- Delete experience
- Add bullet
- Edit bullet
- Delete bullet
- Improve bullet with AI

### Education

Each education record supports:

- School
- Degree
- Dates

Actions:

- Add education
- Edit education
- Delete education

### Skills

Use simple skill chips with:

- Add skill
- Remove skill
- Reorder skills if needed for the final template

### Section controls

Users can:

- Reorder supported sections
- Hide or show a section if the section is optional
- Expand and collapse editing cards
- Add a supported section that is missing

The first version should keep the section set limited to the four supported types.

### Autosave

Autosave after a short debounce when the user is authenticated. Show:

- Saving
- Saved
- Save error

Use explicit save responses from the server and avoid silently dropping failed writes.

## 9. Single résumé template

The template must be:

- Single-column
- Text-based
- Easy to scan
- High contrast
- Free of decorative graphics
- Stable across page sizes
- Suitable for ATS parsing

Recommended hierarchy:

1. Name and professional title
2. Contact details
3. Profile or summary
4. Experience
5. Education
6. Skills

Avoid:

- Text embedded in images
- Multi-column layout
- Skill rating bars
- Icons that replace text
- Decorative backgrounds
- Tiny type
- Excessive color

The preview and PDF must use the same template renderer so that the user sees the output they will download.

## 10. AI writing assistant

### Server-side request flow

1. Authenticate the user.
2. Check the AI entitlement.
3. Validate the requested operation and input length.
4. Build a constrained prompt using only user-provided résumé content.
5. Call the AI provider from the server.
6. Validate and normalize the response.
7. Increment the usage counter after success.
8. Return the suggestion and updated usage.

### Supported operations

#### Generate summary

Input:

- Contact title
- Existing résumé content
- Optional target role

Output:

- One concise professional summary
- No invented facts
- No unsupported metrics

#### Rewrite bullet

Preserve the original claim and facts while improving clarity, structure, and specificity.

#### Make shorter

Reduce length while retaining the main action and outcome.

#### Make more professional

Use clear, confident language without adding unsupported claims.

### AI interface

Show the original text and the suggested version when useful. Allow:

- Apply suggestion
- Dismiss suggestion
- Retry

Display a reminder that the user should verify every suggestion.

### Failure handling

Handle:

- Rate limits
- Provider timeouts
- Empty responses
- Invalid output
- Network failures
- Usage limit reached

Return a friendly, actionable error and keep the original résumé content unchanged.

## 11. Job-description matching

### Input

The user pastes a job description into a text area. Optional job title input can improve context but is not required.

### Keyword extraction

Start with a deterministic keyword pipeline:

1. Normalize case and punctuation.
2. Extract common skills, tools, methods, and role terms.
3. Remove stop words.
4. Compare terms against normalized résumé text.
5. Preserve the original phrase for display.

The keyword vocabulary can begin with a curated dictionary and grow later from usage data. AI can help summarize context, but deterministic matching should remain available for predictable results.

### Results

Show:

- Match score or coverage percentage
- Important keywords already included
- Important keywords missing
- A truthful improvement suggestion

Suggestions must reference content already present in the user’s résumé. They should say where a relevant term could be added and invite the user to confirm that the term is accurate.

### Usage

Creating or re-running a match consumes one job match. The server should enforce the limit and store the result in `job_matches`.

## 12. Résumé checker

### Score

Return a score from 0 to 100 based on weighted checks. Keep the scoring transparent enough for users to understand why the number changed.

Suggested weighting:

- Required sections: 20 points
- Contact completeness: 10 points
- Active wording: 15 points
- Bullet length: 15 points
- Measurable outcomes: 15 points
- Spelling and obvious text issues: 10 points
- Job keyword coverage: 15 points

### Checks

Check:

- Missing contact information
- Missing summary
- Missing experience
- Missing education
- Missing skills
- Weak wording such as “helped,” “worked on,” or “responsible for”
- Bullets that are too long
- Bullets with no outcome or evidence
- Obvious spelling issues
- Keyword coverage against the latest job match

### Results UI

Show:

- Overall score
- Passed checks
- Needs-work checks
- Short, specific fixes
- A direct action that takes the user to the relevant editor section

The checker should be helpful rather than punitive. It should never claim that a résumé guarantees an interview.

## 13. PDF export

### First implementation

Use the same résumé preview DOM and a print stylesheet:

- Hide the editor and application chrome
- Render only the résumé paper
- Preserve selectable text
- Use print-friendly margins
- Avoid page backgrounds and UI controls

The download button should open the browser print dialog with PDF as the destination.

### Export limits

Count a successful export action against the user’s PDF allowance. Make the server the source of truth if exports move to a server route.

### Future server export

If browser print output becomes inconsistent across browsers, add a server PDF route with a headless browser or a dedicated PDF service. Keep the template renderer shared so the visual output remains aligned.

## 14. Payments

### Checkout flow

1. User clicks Upgrade to Pro.
2. Server verifies the user session.
3. Server creates or reuses the payment customer.
4. Server creates a monthly checkout session for `$12.99`.
5. User completes payment on the provider checkout page.
6. Provider sends a signed webhook.
7. Webhook updates `subscriptions`.
8. The app refreshes entitlements.

### Webhooks

Handle at least:

- Subscription created
- Subscription updated
- Subscription canceled
- Payment failed
- Checkout completed

Make webhook processing idempotent. Store provider event IDs if needed to prevent duplicate application.

### Billing states

Support:

- Free
- Pro active
- Pro canceled but active until period end
- Payment past due
- Subscription ended

Show the user what happens to existing résumés if they downgrade. Do not delete paid-created data immediately.

## 15. Suggested route structure

Use the App Router with routes similar to:

- `/` — product landing or authenticated workspace entry
- `/app` — résumé workspace
- `/app/resumes/[resumeId]` — résumé editor
- `/app/match` — job-description matcher
- `/app/checker` — résumé checker
- `/app/ai` — AI writing workspace
- `/app/billing` — plan and billing
- `/api/ai/summary` — summary generation
- `/api/ai/bullet` — bullet rewrite actions
- `/api/job-matches` — create and read job matches
- `/api/checker` — calculate or persist checker results if needed
- `/api/resumes` — résumé CRUD
- `/api/resumes/[resumeId]` — résumé updates and deletion
- `/api/billing/checkout` — create checkout session
- `/api/billing/portal` — open billing portal
- `/api/billing/webhook` — payment provider webhook

Keep server-only modules out of client components.

## 16. Suggested project organization

```text
app/
  (marketing)/
    page.tsx
  app/
    page.tsx
    resumes/[resumeId]/page.tsx
    match/page.tsx
    checker/page.tsx
    ai/page.tsx
    billing/page.tsx
  api/
    ai/
    billing/
    job-matches/
    resumes/
components/
  resume/
  editor/
  preview/
  ai/
  matcher/
  checker/
  billing/
lib/
  auth/
  db/
  ai/
  billing/
  entitlements/
  resume/
  validation/
  pdf/
db/
  migrations/
```

Use shared schemas and domain types so the client, server, and database mapping agree on field names and validation rules.

## 17. Validation and security

Validate on both client and server:

- Required contact fields
- Maximum text lengths
- Bullet lengths
- Job-description length
- Number of experiences and education records
- Skill name length

Protect the system by:

- Keeping AI and payment secrets server-side
- Checking authentication on every private route
- Checking ownership in every database operation
- Rate limiting AI and matching endpoints
- Limiting request body size
- Sanitizing rich text if rich text is added later
- Verifying payment webhook signatures
- Avoiding logging full résumé content or job descriptions in production logs

## 18. Loading, empty, and error states

Every main workflow should include:

- Loading state
- Empty state
- Success state
- Recoverable error state
- Usage-limit state

Examples:

- Empty résumé: explain the first three fields to complete
- Empty job match: explain what a useful job description looks like
- AI loading: show the action being processed and keep the current text visible
- AI failure: preserve the original content and offer retry
- PDF limit: explain the remaining allowance and show Pro pricing
- Payment pending: show that access will update after confirmation

## 19. Analytics

Track product events without storing unnecessary content:

- Account created
- First résumé started
- Résumé completed
- AI generation used
- Job match created
- Checker viewed
- PDF export attempted
- PDF export completed
- Upgrade clicked
- Checkout completed
- Subscription canceled

Use these events to identify where users stop in the workflow.

## 20. Implementation phases

### Phase 1: foundation

- Confirm Next.js App Router structure
- Add database client and environment variable handling
- Add authentication
- Add typed database migrations
- Add shared validation schemas
- Add authenticated workspace shell

Done when a signed-in user can create and load an empty résumé.

### Phase 2: résumé editor

- Implement contact details
- Implement summary
- Implement experience and bullets
- Implement education
- Implement skills
- Implement section ordering
- Add autosave
- Add delete confirmation where needed

Done when all résumé fields persist after refresh and only the owner can access them.

### Phase 3: template and preview

- Implement one ATS-friendly template
- Render data in the live preview
- Add responsive layout
- Add print stylesheet
- Confirm selectable text in a generated PDF

Done when the preview and exported PDF use the same content and order.

### Phase 4: AI writing

- Add server-side AI adapter
- Add summary generation
- Add bullet rewrite
- Add shorter action
- Add professional action
- Add usage counting
- Add loading, error, and apply states

Done when each AI action is authenticated, usage-limited, and grounded in user input.

### Phase 5: job matching

- Add job-description editor
- Add keyword extraction
- Add included and missing keyword views
- Add truthful suggestions
- Add match usage counting
- Persist match results

Done when a user can paste a job description and receive an explainable result.

### Phase 6: résumé checker

- Add score calculation
- Add section checks
- Add wording checks
- Add bullet length checks
- Add measurable-results checks
- Add spelling checks
- Add keyword coverage check
- Add links back to editor sections

Done when the user can understand the score and act on each failed check.

### Phase 7: billing and limits

- Add plan resolver
- Add usage counters
- Add Stripe checkout
- Add webhook processing
- Add billing page
- Add upgrade prompts at limits

Done when Free and Pro entitlements are enforced on the server.

### Phase 8: production hardening

- Add rate limits
- Add structured error handling
- Add monitoring
- Add privacy and terms links
- Test payment webhooks
- Test export in supported browsers
- Test mobile and desktop layouts
- Verify deployment environment variables

Done when the complete workflow succeeds in the deployed environment.

## 21. Environment variables

Use the deployment platform’s secret manager. Do not commit real values.

Suggested variables:

```text
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
AI_API_KEY=
AI_MODEL=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=
PAYMENT_PRICE_ID=
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
NEXT_PUBLIC_APP_URL=
```

Use separate development and production values. Add a startup check that clearly reports missing required variables without printing their values.

## 22. Testing plan

### Unit tests

Test:

- Résumé score calculation
- Keyword extraction
- Keyword coverage
- Usage-limit checks
- Plan resolution
- Section ordering
- Input validation

### Integration tests

Test:

- Create résumé
- Update résumé
- Delete résumé
- Unauthorized access rejection
- AI usage increment
- Job-match usage increment
- PDF usage increment
- Payment webhook updates

### End-to-end tests

Test the full workflow:

1. Sign up
2. Create résumé
3. Edit summary and experience
4. Reorder sections
5. Run AI improvement
6. Paste a job description
7. Review missing keywords
8. Open checker
9. Export PDF
10. Hit a free limit
11. Open upgrade flow

### Manual checks

- Keyboard navigation
- Mobile layout
- Print preview
- Selectable PDF text
- Screen-reader labels for buttons and fields
- Error recovery after a failed AI call
- Refresh after autosave
- Subscription state after webhook delivery

## 23. Acceptance criteria

The MVP is ready when:

- A new user can create one résumé.
- Contact details, summary, experience, education, and skills can be edited.
- Sections can be added, removed, and reordered.
- The live preview updates as the user edits.
- The résumé uses one clean ATS-friendly template.
- AI can generate a summary.
- AI can rewrite, shorten, and professionalize an experience bullet.
- AI usage is limited to five generations on Free.
- A job description produces included and missing keywords.
- The app gives truthful improvement suggestions.
- The checker returns a score from 0 to 100.
- The checker identifies missing sections, weak wording, bullet length, measurable results, spelling, and job-keyword coverage.
- A clean PDF with selectable text can be exported.
- Free users receive one résumé, one job match, and three downloads.
- Pro users receive multiple résumés, 100 AI generations, 30 job matches, and unlimited downloads.
- The server enforces limits even if the browser is modified.
- Payment webhooks update the user’s plan correctly.
- Users can only access their own data.
- The deployed app passes TypeScript, linting, integration checks, and the full workflow test.

## 24. Product copy and UX reminders

Use clear language:

- “Build your résumé”
- “Improve with AI”
- “Paste a job description”
- “See what’s missing”
- “Download PDF”
- “Upgrade to Pro”

Avoid claims such as:

- “Guaranteed interview”
- “Beat every ATS”
- “AI knows what recruiters want”

The product should present AI as an assistant for clarity and editing. The user remains responsible for the accuracy of the final résumé.

## 25. Future backlog after MVP

Consider these only after the first version has usage data:

- Multiple templates
- Resume version comparison
- Server-side PDF rendering
- DOCX export
- More detailed keyword categories
- Saved job descriptions
- More granular analytics
- Team or coach collaboration
- Cover letters
- Application tracking
- LinkedIn import
- Interview preparation

Each addition should be evaluated against the core workflow and the cost of increased complexity.
