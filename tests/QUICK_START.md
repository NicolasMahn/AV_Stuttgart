# Quick Start Guide - Playwright Tests

## What Has Been Created

I've created a comprehensive Playwright test suite with **6 test files** containing **60+ tests** that cover:

1. **navigation.spec.ts** (9 tests) - Page routing and navigation
2. **language.spec.ts** (6 tests) - German/English language switching
3. **menu.spec.ts** (8 tests) - Menu functionality and interactions
4. **responsive.spec.ts** (9 tests) - Mobile, tablet, and desktop layouts
5. **accessibility.spec.ts** (8 tests) - Web accessibility standards
6. **content-loading.spec.ts** (9 tests) - Dynamic YAML content loading

## Running Tests (Quick Commands)

### First Time Setup
```bash
# Install Playwright browsers (only needed once)
npx playwright install
```

### Run All Tests
```bash
# Headless mode (no browser window)
npx playwright test

# With browser window visible
npx playwright test --headed

# Interactive UI mode (recommended for development)
npx playwright test --ui
```

### Run Specific Test File
```bash
npx playwright test tests/navigation.spec.ts
npx playwright test tests/language.spec.ts
npx playwright test tests/menu.spec.ts
```

### View Test Report
```bash
npx playwright show-report
```

## What Gets Tested

### ✅ Navigation
- Home page loads correctly
- Special pages (Datenschutz, Impressum, Spenden, Kontakt) work
- Unknown routes redirect to home
- Section scrolling via menu tabs
- URL hash handling

### ✅ Language Switching
- Auto-detection based on browser language
- Manual switching between German and English
- Persistence across page reloads
- Proper content loading for each language

### ✅ Menu Functionality
- All tabs display correctly
- Active tab highlighting
- Scroll buttons on desktop
- Gradient indicators for overflow
- Logo changes based on screen width
- Language toggle works properly

### ✅ Responsive Design
- Mobile (375px) - Logo visible, no scroll buttons
- Tablet (768px) - Proper layout
- Desktop (1920px) - Full logo, scroll buttons
- Very narrow (<150px) - Logo hidden
- Viewport resize handling

### ✅ Accessibility
- ARIA labels present
- Alt text on images
- Keyboard navigation works
- Semantic HTML structure
- Focus indicators visible
- Reduced motion support

### ✅ Content Loading
- YAML files load correctly
- Loading state displays properly
- Error handling for failed loads
- Content updates on language change
- Sections render correctly

## Configuration

The `playwright.config.ts` has been updated to:
- Set base URL to `http://localhost:3000`
- Auto-start the React dev server before tests
- Run tests across Chromium, Firefox, and WebKit
- Enable parallel test execution
- Configure CI-specific settings

## Typical Workflow

1. **During Development:**
   ```bash
   npx playwright test --ui
   ```
   This opens an interactive interface where you can:
   - See all tests
   - Run individual tests
   - Watch tests execute
   - Debug failures

2. **Before Committing:**
   ```bash
   npx playwright test
   ```
   Run all tests to ensure nothing is broken

3. **Debugging Failures:**
   ```bash
   npx playwright test tests/navigation.spec.ts --debug
   ```
   Opens Playwright Inspector for step-by-step debugging

## Expected Test Duration

- **Full suite**: ~2-3 minutes (all browsers)
- **Single browser**: ~1 minute
- **Single test file**: ~10-20 seconds

## CI/CD Integration

Tests are configured to run automatically via GitHub Actions:
- Workflow file: `.github/workflows/playwright.yml`
- Runs on: push and pull requests
- Browsers: Chromium, Firefox, WebKit
- Artifacts: Test reports uploaded on failure

## Tips

1. **First run might be slower** - Playwright needs to download browsers
2. **Tests clean localStorage** - Each test starts with a clean state
3. **Server auto-starts** - No need to manually start `npm run start`
4. **Parallel execution** - Tests run faster using multiple workers
5. **Retries on CI** - Flaky tests get 2 retries automatically

## Troubleshooting

### "Port 3000 already in use"
Stop any running development server or change the port in playwright.config.ts

### "Timeout waiting for page"
Increase timeout in playwright.config.ts or check if the app starts correctly

### Tests fail locally but pass in CI (or vice versa)
Check for environment-specific issues (e.g., localhost vs. 127.0.0.1)

## Next Steps

1. Install Playwright browsers: `npx playwright install`
2. Run tests in UI mode: `npx playwright test --ui`
3. Explore the test files in the `tests/` directory
4. Add new tests as you develop new features

---

For more detailed information, see `tests/README.md`

