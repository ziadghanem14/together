# Contributing to LiveShare

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/live-location-sharing/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment (OS, browser, Node version)

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and its use case
3. Explain why it would be valuable

### Pull Requests

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Make changes** with clear commits
4. **Test** your changes thoroughly
5. **Update documentation** if needed
6. **Submit PR** with description of changes

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/live-location-sharing.git
cd live-location-sharing

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Create feature branch
git checkout -b feature/my-feature
```

## Code Style

- **TypeScript**: Use strict mode
- **Formatting**: Prettier (run `npm run format`)
- **Linting**: ESLint (run `npm run lint`)
- **Naming**: camelCase for variables, PascalCase for components

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add dark mode toggle
fix: resolve WebSocket reconnection issue
docs: update deployment guide
refactor: improve location update logic
```

## Code Review Process

1. Maintainer reviews your PR
2. Address any feedback
3. Once approved, PR will be merged

## Questions?

Open a [Discussion](https://github.com/yourusername/live-location-sharing/discussions) or comment on the issue.

---

**Thank you for contributing!** 🙏

