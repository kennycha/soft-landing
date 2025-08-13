# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`soft-landing` is a web-based tool that generates landing pages from TOML configuration files. It's a React + TypeScript + Vite application that provides:

**Free Features:**

- Single-page landing page generation from TOML configuration
- Real-time preview (updates only when TOML is valid)
- JSON import functionality with automatic TOML conversion
- Landing page generation with downloadable HTML/CSS/JS bundles

**Premium Features (Future):**

- Multi-page website generation (About, Pricing, Blog pages)
- Advanced navigation and routing
- Payment integration for premium features

The project follows a client-side-only architecture - all TOML parsing, validation, and rendering happens in the browser without backend services.

## Development Commands

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Lint code (TypeScript ESLint with React hooks/refresh plugins)
pnpm lint

# Preview production build locally
pnpm preview
```

## Architecture

### Core Structure

- **Package manager**: pnpm (note: uses pnpm-lock.yaml, not npm/yarn)
- **Build tool**: Vite with React SWC plugin
- **Framework**: React 19 with TypeScript
- **Styling**: CSS (will be migrated to Tailwind CSS + shadcn/ui per spec)

### Key Implementation Areas (per spec.md)

1. **TOML Editor Integration**: Will use Monaco Editor or CodeMirror 6 with TOML syntax highlighting
2. **Client-side Parsing**: Uses `@iarna/toml` library for browser-based TOML parsing
3. **Real-time Preview**: Editor onChange → TOML validation → parsing → React state update → render
4. **Component Structure**: Hero, Features, CTA, Footer components built with shadcn/ui
5. **JSON Import**: File API + `json2toml` conversion workflow
6. **Download Generation**: JSZip for creating downloadable HTML/CSS/JS bundles
7. **Theme System**: Supports customizable primary and secondary colors through TOML configuration

### Configuration Schema

The application supports theme customization through TOML configuration:

```toml
[theme]
primary_color = "#3b82f6"      # Main brand color (buttons, links, highlights)
secondary_color = "#64748b"    # Supporting color (backgrounds, cards, secondary elements)
```

These colors are applied as CSS custom properties and integrated with Tailwind CSS for consistent theming across all components.

### TypeScript Configuration

- Uses composite TypeScript setup with separate configs for app and build tools
- App config: `tsconfig.app.json`
- Node/build tools config: `tsconfig.node.json`

## Key Technical Constraints

- **No backend services**: Everything runs client-side for GitHub Pages deployment
- **Validation-first rendering**: UI updates only trigger after successful TOML parsing
- **Bundle generation**: Must create self-contained HTML/CSS/JS packages for download
- **Performance target**: <200ms parsing/rendering time for large TOML files (hundreds of lines)

## Business Model

The project follows a freemium model:

- **Free Tier**: Single-page landing pages with core features
- **Premium Tier**: Multi-page websites with advanced features and payment integration

## Current Status

The project has basic functionality implemented with TOML parsing, real-time preview, and component rendering. Current focus is on completing the MVP for single-page landing pages before implementing premium multi-page features.
