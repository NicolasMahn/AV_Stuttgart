# Playwright Test Suite for AV Stuttgart Website

This directory contains comprehensive end-to-end tests for the AV Stuttgart website using Playwright.

## Test Files Overview

### 1. `navigation.spec.ts`
Tests for page navigation and routing functionality:
- Homepage loading
- Navigation to special pages (Datenschutz, Impressum, Spenden, Kontakt)
- Unknown route redirection
- Section navigation via menu tabs
- Hash preservation during navigation

### 2. `language.spec.ts`
Tests for multi-language support:
- Language detection based on browser settings
- Language switching (German ↔ English)
- Language persistence across page reloads
- Hash preservation during language switches
- LocalStorage integration

### 3. `menu.spec.ts`
Tests for menu functionality:
- Menu display and tab rendering
- Active tab highlighting
- Section scrolling on tab click
- Gradient indicators for overflow scrolling
- Responsive logo display
- Scroll buttons on desktop
- Menu visibility on special pages
- Language toggle icon updates

### 4. `responsive.spec.ts`
Tests for responsive design across different devices:
- Mobile (portrait) layout
- Tablet layout
- Desktop layout
- Logo visibility based on screen width
- Logo switching between versions
- Viewport resize handling
- Horizontal scrolling on mobile
- Functionality across different screen sizes

### 5. `accessibility.spec.ts`
Tests for web accessibility:
- ARIA labels on interactive elements
- Alt text on images
- Keyboard navigation
- Semantic HTML structure
- Focus visibility
- Color contrast checks
- Reduced motion support
- Focus indicators

### 6. `content-loading.spec.ts`
Tests for dynamic content loading:
- Loading state display
- YAML content loading (German and English)
- Error handling for failed content loads
- Section rendering
- Content updates on language change
- YAML parsing validation
- State maintenance during reloads

## Running the Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in a specific file
```bash
npx playwright test tests/navigation.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run tests in UI mode (interactive)
```bash
npx playwright test --ui
```

### Run tests for a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Debug a specific test
```bash
npx playwright test tests/navigation.spec.ts --debug
```

## Test Configuration

The test configuration is defined in `playwright.config.ts`:
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Automatically starts the React dev server before tests
- **Timeout**: 120 seconds for server startup
- **Parallel execution**: Enabled for faster test runs
- **Retries**: 2 retries on CI, 0 locally

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## Best Practices

1. **Clean State**: Tests clear localStorage before each run to ensure consistency
2. **Wait for Loading**: Tests wait for the "Loading..." message to disappear
3. **Timeouts**: Reasonable timeouts are set for async operations
4. **Isolation**: Each test is independent and doesn't rely on others
5. **Descriptive Names**: Test names clearly describe what is being tested

## Adding New Tests

When adding new tests:
1. Create a new `.spec.ts` file in the `tests` directory
2. Use descriptive test names that explain what is being tested
3. Include `test.beforeEach()` for common setup
4. Clean up any state changes after tests
5. Use appropriate locators (prefer role-based or test-id locators)
6. Add assertions to verify expected behavior

## Troubleshooting

### Tests fail to start
- Ensure the dev server can start: `npm run start`
- Check if port 3000 is available
- Verify all dependencies are installed: `npm install`

### Flaky tests
- Increase timeout values if needed
- Add explicit waits for dynamic content
- Check for race conditions in the application

### Browser-specific failures
- Run failing browser in headed mode to debug
- Check browser console for errors
- Verify browser-specific CSS/JS compatibility

## CI/CD Integration

These tests are configured to run in CI environments:
- GitHub Actions workflow is set up in `.github/workflows/playwright.yml`
- Tests run with 2 retries on CI
- Sequential execution on CI to avoid resource conflicts
- HTML report is generated for debugging failures

## Coverage

The test suite covers:
- ✅ Core navigation flows
- ✅ Multi-language support
- ✅ Responsive design
- ✅ Accessibility standards
- ✅ Dynamic content loading
- ✅ Menu interactions
- ✅ Error handling
- ✅ State persistence

## Future Improvements

Consider adding tests for:
- Visual regression testing
- Performance metrics
- Network request monitoring
- Browser console error detection
- Screenshot comparisons
- Link validation
- Form submissions (if applicable)

