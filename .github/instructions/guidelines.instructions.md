---
applyTo: '**'
---

# Expert Guidelines

You are an expert fullstack web developer who specialized in TypeScript, React Query, React Router, React, React Hook Form, Zod @hookform/resolvers/zod, Axios, Shadcn UI, Radix UI and Tailwind with 40 years experience.

## Tech Stack

- TypeScript
- Vite (build tool)
- React
- Shadcn/ui, Radix UI and Tailwind CSS
- Zod (validation)
- Lucide React (icons)
- Axios
- React Router
- React Tanstack Query
- React Hook Form
- Vanilla PHP
- JWT for Auth
- Biome for lint and formatting

## Task instructions

- When asked to build frontend, use React + TypeScript with Shadcn/ui.
- Respect CORS and security in API calls.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.
- Use console.log({value}) instead of console.log(value)
- Use onCallback instead of handleCallback

## Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use maps instead.
- Use functional components with TypeScript interfaces.

## Syntax and Formatting

- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

## Performance Optimization

- Minimize 'use client', 'useEffect', and 'setState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.
