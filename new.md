# Tasker — Product Requirements Document (PRD)

## 1. Product Overview

**Tasker** is a **single-user personal productivity web application** designed to function as a personal operating system for intentional action.  
It helps one individual capture, organize, execute, and reflect on real-life responsibilities, ideas, routines, and personal knowledge in a single trusted space.

Tasker is built for **daily personal use**, prioritizing clarity, speed, and long-term maintainability over automation, collaboration, or social features.

The application is built entirely with **Next.js (App Router)** and follows a modular, domain-driven architecture.

---

## 2. Vision & Principles

### Vision

Enable one person to externalize their intentions, reduce cognitive load, and act deliberately—without noise, social pressure, or unnecessary abstraction.

### Core Principles

- **Single-user by design**  
  One account, one workflow, one perspective.

- **Action-oriented information**  
  Every stored entity must support a real-world action, decision, or reflection.

- **Explicit over automated**  
  The system assists planning and execution but never decides on behalf of the user.

- **Modular but cohesive**  
  Multiple focused domains with clear boundaries, unified by a consistent UX.

- **Minimal yet durable**  
  Features are intentionally constrained but architected for long-term evolution.

---

## 3. Target User & Use Cases

### Target User

An individual professional or creator who:

- Uses the app multiple times per day
- Thinks visually and sequentially
- Prefers keyboard-first interaction
- Values clarity over customization
- Wants one reliable system for personal planning

### Core Use Cases

- Capture ideas instantly
- Plan and execute tasks visually
- Track recurring responsibilities and habits
- Organize shopping intent by context
- Keep a personal watchlist
- Store and reuse cooking recipes
- Reflect daily through journaling

---

## 4. In-Scope vs Out-of-Scope

### In Scope

- Task management with projects, lists, collections, and views
- Kanban-style planning
- Calendar-based task review
- Routines and recurring responsibilities
- Shopping lists
- Watchlists (movies and series)
- Personal recipes
- Notes and journaling
- Authentication for a single user

### Out of Scope

- Multi-user or team collaboration
- Sharing or permissions
- Social features
- Real-time sync assumptions
- Public content discovery
- Automation engines or integrations

---

## 5. Core Concepts & Terminology

### Project

A high-level area of focus or initiative (e.g., Work, Personal).

### Task List

A logical grouping within a project that provides context.

### Task

A single, actionable unit of work intended to be completed once.

### Collection

A user-defined workflow state visualized as a board column.

### Routine

A rule-based definition of a repeated responsibility.

### Occurrence

A record of a routine’s execution on a specific date.

### Domain

A first-class module representing a distinct category of personal data.

---

## 6. Functional Requirements

### 6.1 Tasks (Core Execution Domain)

Tasks are the primary unit of execution in Tasker.

#### 6.1.1 Structural Hierarchy

Tasks are organized using four distinct layers:

##### Projects

- Represent high-level areas of focus
- A user may have multiple projects
- Projects are organizational only
- No workflow or status semantics

##### Task Lists

- Belong to exactly one Project
- Group related tasks within a project
- Provide context, not status
- A Task belongs to exactly one Task List

##### Tasks

- Represent a single unit of work
- Have a required title and optional description
- Belong to:
  - One Project (via Task List)
  - One Task List
  - One Collection
- Optional due date
- Manually ordered within their Collection

Tasks are never duplicated across collections.

---

#### 6.1.2 Collections (Workflow State)

Collections replace traditional task status fields and represent workflow state.

##### Default Collections

When a user account is created, the following collections are automatically provisioned:

- Ideas
- Planned
- In Progress
- Completed
- Cancelled

##### Collection Rules

- Collections are user-owned
- Each collection has:
  - A unique name per user
  - A display order for board positioning
- A Task belongs to exactly one Collection
- Users may:
  - Rename collections
  - Reorder collections
  - Add new collections
  - Remove collections (with safeguards for active tasks)

There is no hard-coded status enum on the Task model.

---

#### 6.1.3 Workflow & Kanban Behavior

Collections are visualized as columns in a Kanban-style board.

- Tasks can be moved between collections via:
  - Drag-and-drop
  - Keyboard shortcuts
- Movement is explicit and immediately persisted
- No automatic transitions or rules are applied

##### Completion Semantics

- A task is considered completed when moved to the “Completed” collection
- A task is considered cancelled when moved to the “Cancelled” collection
- Completed and cancelled tasks:
  - Are retained for history
  - Are excluded from active views by default
  - Can be accessed via filters

---

#### 6.1.4 Task Views & Planning Interfaces

All task views operate on the same underlying Task entities.

##### Kanban Board View

- Dedicated Kanban Board page
- Operates on **one Task List at a time**
- Tasks belonging to the selected Task List are fetched
- Collections are displayed as columns
- Tasks are displayed as cards within columns
- Supports:
  - Drag-and-drop between columns
  - Manual reordering within a column

The Kanban Board answers:

> “What stage is my work currently in?”

---

##### List View

- Tasks grouped by Project → Task List
- Collection shown as metadata
- Optimized for structured browsing and editing

---

##### Calendar Page

Tasker provides a dedicated **Calendar page** for time-based planning and review.

###### Supported Views

- Month
- Week
- Day

###### Calendar Behavior

- Only tasks with a due date appear
- Tasks appear on their due date
- Overdue tasks are visually distinguished
- Completed and cancelled tasks are visually muted
- Calendar views are read-only by default

###### Calendar Scope

- Aggregates tasks across all projects and lists
- Supports filtering by:
  - Project
  - Task List
  - Collection

The Calendar answers:

> “What do I need to do, and when?”

---

#### 6.1.5 Filtering & Ordering

Tasks can be filtered by:

- Project
- Task List
- Collection
- Due date (today, upcoming, overdue)
- Completion state

Ordering:

- Tasks have a manual order within a collection
- Ordering is stable and predictable
- Reordering does not affect other collections

---

### 6.2 Routines & Recurring Items

Routines model repeated responsibilities and habits.

#### Core Concepts

- A Routine defines _what repeats and how often_
- A Routine is never marked as done
- Each execution creates a Routine Occurrence

#### Scheduling

- Daily
- Weekly (specific days)
- Custom intervals
- Optional start and end dates

#### Task Generation

- Routines may optionally generate Tasks
- Generated Tasks link back to the originating Routine
- Relationship is one-directional

---

### 6.3 Shopping Lists

A dedicated domain for purchase intent and recall.

#### Shopping Lists

- Represent a shopping context
- Optional location or store reference

#### Shopping Items

- Title
- Description or notes
- Necessity level (must buy / should buy / optional)
- Quantity (human-readable)
- Purchased state

---

### 6.4 Watchlist (Movies & Series)

Tracks intent to watch and viewing progress.

- Title
- Type (movie / series / show)
- Status (planned / watching / completed / dropped)
- Platform or link
- Optional notes
- Optional basic metadata

No discovery, recommendations, or social features.

---

### 6.5 Recipes

Personal recipes for reuse.

- Title
- Ingredients
- Steps
- Notes
- Optional links
- Optional images (post-MVP)

Personal and private only.

---

### 6.6 Notes

Low-friction unstructured capture.

- Optional title
- Content-first editing
- Minimal organization

---

### 6.7 Journal

Daily reflection of what actually happened.

- Day-based entries
- One or more entries per day
- No future entries

---

## 7. Non-Functional Requirements

- High performance for daily use
- Immediate persistence of changes
- Predictable behavior
- Minimal configuration
- Keyboard-first interaction
- Secure authentication and sessions
- No dependency on external APIs

---

## 8. MVP Scope

### Included

- Projects, task lists, tasks, and collections
- Kanban board per task list
- Calendar page (month / week / day)
- Routines with occurrences
- Shopping lists
- Notes
- Journal
- Authentication and sessions

### Deferred

- Notifications and reminders
- Search across domains
- Attachments and uploads
- Analytics and insights
- Mobile applications

---

## 9. Post-MVP / Future Enhancements

- Streaks and routine analytics
- Cross-domain linking (e.g., Recipe → Shopping)
- Advanced search and filters
- Lightweight insights (non-gamified)
- Offline-first support
- Export and backups

---

## 10. Constraints & Assumptions

- The application is strictly single-user
- All data is owned by the user
- No real-time collaboration
- No external API dependencies
- Product evolution prioritizes coherence over feature count

---

**Tasker is intentionally opinionated.**  
Its value comes from clarity, structure, and trust—not completeness.
