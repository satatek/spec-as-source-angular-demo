# spec-as-source-angular-demo: Spec-as-Source Meets Angular

> Warning: This project is an experiment in asking a stricter question: can specification-first development still feel effective when the implementation target is Angular rather than a lighter vanilla stack?

```text
 ____________________________________________
/ Welcome to the Angular branch line of the  \
| Specification Express. Same idea, harder   |
| challenge: more structure, more ceremony,  |
\ and a bigger test for AI-driven delivery.  /
 --------------------------------------------
		\   ^__^
		 \  (oo)\_______
			(__)\       )\/\
				||----w |
				||     ||
```

## Mission

This repository exists to test the same core spec-as-source idea under different architectural pressure.

The original experiment proved that a human can stay focused on specifications while AI handles implementation details. This Angular demo asks a tougher follow-up question:

**Can that workflow still hold when the frontend is built with a more opinionated, enterprise-oriented framework?**

That is the challenge here.

## The Challenge

Angular is not the easiest frontend target for an AI-first workflow.

That is exactly why this repository matters.

Compared with a lightweight Vite + vanilla JavaScript setup, Angular introduces more structure and more places where implementation discipline matters:

- standalone components or module boundaries
- dependency injection
- routing conventions
- template syntax
- reactive forms and validation
- lifecycle behavior
- stronger TypeScript expectations
- testing patterns that are more framework-shaped

In other words, Angular is a better stress test.

If spec-as-source works well here, it is a stronger proof that the approach can scale beyond simple UI stacks.

## Core Philosophy

> Only the specification should be edited directly by the human; implementation should be generated, adjusted, and maintained by AI as much as possible.

This repository is not just about Angular. It is about whether a specification can remain the primary interface for software development even when the implementation framework is larger, stricter, and more architectural.

The goal is not to remove engineering judgment.

The goal is to move human effort upward:

- define behavior clearly
- state constraints precisely
- make architectural decisions deliberately
- let AI execute the repetitive implementation work

## Why Angular

Angular is a useful challenge case because it changes the shape of the problem.

With Angular, the question is no longer just "can AI write frontend code?" The real question becomes:

**Can AI reliably produce framework-conformant code inside a system where consistency, dependency boundaries, and long-term maintainability matter?**

Angular is worth testing when you care about:

- large application structure
- consistent project conventions
- strong TypeScript usage
- long-lived frontend codebases
- teams that need predictable patterns

If the spec-as-source model can work well with Angular, then it has a more credible path into larger and more demanding frontend environments.

## What This Demo Is Trying to Prove

This repository is an experiment around a few practical hypotheses:

1. A good specification can drive Angular implementation without forcing the human to hand-code every component.
2. AI can work effectively inside Angular constraints when the spec is explicit enough.
3. The added framework structure does not invalidate the spec-as-source workflow; it just raises the quality bar for the specification.
4. Specification quality becomes even more important when the implementation target is opinionated.

## Expected Shape of the Project

As this demo evolves, it is expected to include the kinds of artifacts that make an Angular implementation real rather than theoretical:

- feature specifications
- implementation plans
- generated tasks
- Angular application structure
- components, services, and routes
- tests for behavior and framework integration

The exact implementation can change. The governing idea should not.

## How This Differs From the Original spec-as-source Repo

The original repository leaned into a lightweight frontend stack with Vite and mostly vanilla HTML, CSS, and JavaScript.

This repository deliberately moves in the opposite direction.

It keeps the same development philosophy but applies it to a frontend environment with:

- more rules
- more patterns
- more framework semantics
- more architectural weight

That makes this repo less of a convenience demo and more of a capability test.

## Success Criteria

This experiment is successful if it shows that:

- the spec remains the main source of truth
- AI can generate Angular code that is coherent and maintainable
- framework complexity does not force the human back into manual implementation
- the resulting project still feels like engineering, not prompt chaos

## Project Mood

```text
 ____________________________________________
/ Angular is not here to make this easier.   \
| Angular is here to make the experiment     |
| more honest.                               |
\ If the method survives this, it scales.   /
 --------------------------------------------
   \
	\
		.--.
	   |o_o |
	   |:_/ |
	  //   \ \
	 (|     | )
	/'\_   _/`\\
	\___)=(___/
```

## Working Principle

This repository treats the human as the author of intent and the AI as the executor of implementation.

The human should spend time on:

- problem framing
- feature definition
- acceptance criteria
- constraints
- tradeoffs

The AI should spend time on:

- code generation
- refactoring
- project wiring
- repetitive implementation work
- keeping the code aligned with the spec

That division of labor is the whole point.

## Why This Matters

If specification-first development only works in simple stacks, then it is interesting but limited.

If it also works in Angular, then it becomes much more relevant for real teams building real systems with stronger architectural demands.

This repository is therefore not just a demo. It is a pressure test.

## Current Status

This Angular demo repository is currently at the beginning of the journey.

Right now, the README defines the challenge clearly:

- preserve the spec-as-source philosophy
- apply it to Angular
- measure whether the workflow still holds under a stricter frontend architecture

## Local Demo Flow

The first implemented feature in this repository is a local Angular 21 + Keycloak demo.

It provides:

- a public welcome page with a Keycloak login action
- a protected `/home` route
- a personalized post-login greeting
- Keycloak profile details rendered in Angular Material cards and lists

### Local Requirements

- Node.js 24+
- npm 11+
- a Keycloak server at `http://localhost:8080/`
- realm `local-demo`
- public client `angular-local-demo`

### Run Locally

```bash
npm install
npm start
```

Open `http://localhost:4200/` and use the welcome page to trigger the Keycloak flow.

### Validation

```bash
npm run build
npm test -- --watch=false
```

Optional browser smoke coverage:

```bash
npx playwright install
npm run test:e2e
```

If you want the smoke suite to exercise a real Keycloak login, provide:

- `KEYCLOAK_E2E_USERNAME`
- `KEYCLOAK_E2E_PASSWORD`

### Version Note

The target Keycloak server for this demo is `26.6.1`. The npm package `keycloak-js@26.6.1` is not published, so the application uses the latest published 26.x client release, `26.2.4`, which remains within the supported 26.x compatibility range for `keycloak-angular` 21.

## Closing Thought

```text
 ____________________________________________
/ The spec is still king. The difference is  \
| that the kingdom now has dependency        |
| injection, templates, and a stricter       |
\ definition of order.                       /
 --------------------------------------------
		\   ^__^
		 \  (oo)\_______
			(__)\       )\/\
				||----w |
				||     ||
```

If this works, it suggests something important:

specification-driven development is not tied to minimal stacks.

It can survive contact with structure.
