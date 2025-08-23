# Overview

This is a Limbus Company-inspired turn-based tactical RPG built with React and Three.js. The game features 3D character models and bosses in combat scenarios with a sophisticated skill system based on "sins" (different damage types) and a clash-based combat system where skills compete against each other for dominance. Players select teams of characters, each with unique skills, resistances, and abilities, then engage in strategic turn-based battles against multi-phase bosses.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React + TypeScript**: Main UI framework with strict typing
- **Three.js with React Three Fiber**: 3D rendering engine for game scenes, characters, and bosses
- **Tailwind CSS + Radix UI**: Styling with a comprehensive component library
- **Zustand**: Lightweight state management for game logic, audio, characters, and combat
- **TanStack Query**: Server state management and API communication

## Backend Architecture
- **Express.js**: RESTful API server with TypeScript
- **In-Memory Storage**: Simple storage interface with user management (currently using MemStorage)
- **Modular Route System**: Centralized route registration with middleware support
- **Development Hot Reload**: Vite integration for seamless development experience

## Data Storage Solutions
- **Drizzle ORM**: Database abstraction layer configured for PostgreSQL
- **Schema Definition**: Shared types between client and server using Zod validation
- **Migration Support**: Built-in database schema versioning

## Authentication and Authorization
- **Express Sessions**: Session-based authentication with PostgreSQL session store
- **User Management**: Basic user creation and authentication flow
- **Protected Routes**: API route protection middleware

## Game Systems Architecture
- **Modular Combat System**: Separate modules for skills, clashing mechanics, and boss behaviors
- **Character Management**: Complex character system with skills, resistances, and positioning
- **Audio Management**: Centralized audio control with mute/unmute functionality
- **3D Scene Management**: Organized 3D components with environment, characters, and bosses

## Design Patterns
- **Component Composition**: Reusable UI components with consistent styling
- **Store Pattern**: Separated concerns with dedicated stores for different game aspects
- **Service Layer**: Abstract storage interface allowing different implementations
- **Type Safety**: End-to-end TypeScript with shared schemas

# External Dependencies

## Core Dependencies
- **Vite**: Build tool and development server
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Three.js utilities and helpers
- **@tanstack/react-query**: Server state management
- **Drizzle Kit**: Database migration and schema management

## Database
- **@neondatabase/serverless**: PostgreSQL database connection (Neon)
- **connect-pg-simple**: PostgreSQL session store

## UI Framework
- **Radix UI**: Comprehensive component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **Lucide React**: Icon library

## Development Tools
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production
- **PostCSS**: CSS processing and optimization