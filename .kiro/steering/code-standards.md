---
inclusion: always
---

# PunchRevive Code Standards

## File Organization
- Components: `src/components/[ComponentName]/[ComponentName].tsx`
- Services: `src/services/[service-name].service.ts`
- Utils: `src/utils/[util-name].ts`
- Types: `src/types/[domain].types.ts`

## Naming Conventions
- Components: PascalCase (e.g., `VirtualPuncher`)
- Files: kebab-case (e.g., `virtual-puncher.tsx`)
- Functions: camelCase (e.g., `detectHoles`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `IBM029_MAP`)

## TypeScript
- ALWAYS use explicit types, no `any`
- Prefer interfaces over types for objects
- Use strict mode
- Document complex types with JSDoc

## Testing
- Co-locate tests: `[component].test.tsx`
- Property tests: Tag with `// **Feature: punch-revive, Property N: ...**`
- Minimum 100 iterations for property tests

## Comments
- Use spooky terminology in user-facing strings
- Technical comments should be clear and professional
- Document WHY, not WHAT
