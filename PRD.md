# Tasker — Product Requirements Document (PRD)

## 1. Product Overview

**Tasker** is a **single-user personal productivity web application** designed to serve as a personal operating system for intentional action.  
It helps one individual capture, organize, execute, and reflect on real-life responsibilities, ideas, routines, and personal knowledge.

Tasker is built for **daily personal use**, prioritizing clarity, speed, and trust over scale, automation, or collaboration.

The application is built entirely with **Next.js (App Router)** and operates as a unified product composed of multiple focused domains.

---

## 2. Vision & Principles

### Vision

Enable one person to externalize their intentions, reduce cognitive load, and act deliberately—without noise, social pressure, or unnecessary abstraction.

### Core Principles

- **Single-user by design**  
  One account, one perspective, one workflow.

- **Action-oriented information**  
  Everything stored should support a real-world action, decision, or reflection.

- **Explicit over automated**  
  The system supports the user; it does not decide for them.

- **Modular, not bloated**  
  Distinct domains with clear boundaries, unified by UX and philosophy.

- **Minimal but durable**  
  Features are intentionally constrained but architected for long-term evolution.

---

## 3. Target User & Use Cases

### Target User

An individual professional or creator who:

- Uses the app multiple times per day
- Thinks visually and sequentially
- Values clarity over customization
- Prefers keyboard-first interaction
- Wants one trusted place for personal planning

### Core Use Cases

- Capture ideas instantly
- Plan and execute tasks
- Track recurring responsibilities and habits
- Prepare shopping lists and recall them by context
- Keep track of media to watch
- Store and reuse personal cooking recipes
- Reflect daily through journaling

---

## 4. In-Scope vs Out-of-Scope

### In Scope

- Task management with visual workflow
- Recurring routines and habits
- Personal shopping lists
- Watchlists for movies and series
- Personal recipe management
- Notes and journaling
- Authentication for a single user

### Out of Scope

- Multi-user or team collaboration
- Sharing, permissions, or roles
- Social features
- Notifications and real-time sync
- Public content discovery
- Plugin systems or automation engines

---

## 5. Core Concepts & Terminology

### Task

A single, actionable unit of work intended to be completed once.

### Collection (Board Column)

A workflow state representing mental or execution status:

- Idea
- Planned
- In Progress
- Completed
- Cancelled

### List

A logical grouping that provides context (e.g., Work, Personal).

### Routine

A rule-based definition of a repeated responsibility or habit.

### Occurrence

A record of a routine being completed, skipped, or missed on a given date.

### Domain

A first-class module in the application representing a distinct category of personal data (e.g., Tasks, Shopping, Recipes).

---

## 6. Functional Requirements

### 6.1 Tasks

Tasks are the primary execution unit in Tasker.

#### Capabilities

- Fast creation with minimal required input
- Belongs to exactly one List and one Collection
- Optional due date
- Manual ordering within collections
- Explicit movement between collections
- Completion and cancellation are distinct outcomes
- Retained history for completed and cancelled tasks

#### Views

- Board (Collections)
- List
- Calendar / Daily view

Tasks represent **intention**.

---

### 6.2 Task Collections / Boards

Collections represent **workflow state**, not priority or ownership.

#### Default Collections

- Ideas
- Planned
- In Progress
- Completed
- Cancelled

#### Rules

- Every task exists in exactly one collection
- Movement is explicit (drag or keyboard)
- No automatic transitions

---

### 6.3 Routines & Recurring Items

Routines model **repeated responsibilities over time**.

#### Purpose

- Daily habits (e.g., take medicine)
- Periodic actions (e.g., weekly meeting)
- Long-term recurring responsibilities

#### Core Concepts

**Routine**

- Defines _what_ repeats and _how often_
- Is never marked as “done”

**Routine Occurrence**

- Represents an execution on a specific date
- Can be completed, skipped, or missed

#### Scheduling

- Daily
- Weekly (specific days)
- Custom intervals
- Optional start and end dates

#### Task Generation

- Routines may optionally generate Task instances
- Generated tasks link back to the originating routine
- This is one-directional (Routine → Task)

---

### 6.4 Shopping Lists

Shopping is a dedicated domain for **purchase intent and recall**.

#### Shopping Lists

- Represent a shopping context (e.g., Groceries, Electronics)
- Optional location or store reference

#### Shopping Items

- Item name
- Description or notes
- Necessity level (must buy / should buy / optional)
- Quantity (simple, human-readable)
- Purchased state (checked / unchecked)

#### Design Principles

- Faster than notes
- Simpler than tasks
- Optimized for capture and recall
- No requirement for prices or products in MVP

---

### 6.5 Watchlist (Movies & Series)

The Watchlist domain tracks **intent to watch and viewing progress**.

#### Supported Data

- Title
- Type (movie, series, show)
- Status (planned, watching, completed, dropped)
- Platform or link
- Optional notes
- Optional basic metadata (year, genre)

#### Constraints

- No discovery or recommendations
- No social or rating systems
- Manual entry only

---

### 6.6 Recipes

Recipes are personal, reusable instructions for cooking.

#### Recipe Structure

- Title
- Ingredients (simple list or text)
- Preparation steps (ordered)
- Notes
- Optional links (video or source)
- Optional images (post-MVP)

#### Principles

- Personal use only
- No public browsing
- No content discovery
- Optimized for reuse and recall

---

### 6.7 Notes

Notes are for low-friction capture of unstructured thoughts.

#### Characteristics

- Title optional
- Content-first editing
- Minimal organization
- Fast access and browsing

Notes support thinking, not action tracking.

---

### 6.8 Journal

The Journal records **what actually happened**.

#### Rules

- Day-based entries
- One or multiple entries per day
- No future entries
- Simple day navigation

Journal represents **reality**, not plans.

---

## 7. Non-Functional Requirements

- High performance for daily use
- Immediate persistence of changes
- Predictable behavior
- Minimal configuration
- Keyboard-first interaction
- Secure authentication and sessions
- No reliance on third-party integrations

---

## 8. MVP Scope

### Included

- Tasks with boards, lists, and calendar views
- Task collections lifecycle
- Routines with occurrences
- Shopping lists and items
- Notes
- Journal
- Authentication and sessions

### Excluded (Deferred)

- Notifications and reminders
- Search across domains
- Attachments and media uploads
- Analytics and insights
- Mobile applications

---

## 9. Post-MVP / Future Enhancements

- Streaks and routine analytics
- Cross-domain linking (e.g., Recipe → Shopping)
- Advanced filtering and search
- Lightweight insights (not gamification)
- Offline-first support
- Export and backups

---

## 10. Constraints & Assumptions

- The application is strictly single-user
- All data is owned by the user
- No real-time collaboration
- No dependency on external APIs
- Product evolution prioritizes clarity over feature count

---

**Tasker is intentionally opinionated.**  
Its value comes from coherence, not completeness.
