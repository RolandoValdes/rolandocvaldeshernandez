# Project X v4.0 Release 0.4.2 — Year Group Filtering

## Purpose

Release 0.4.2 makes Year Group a first-class navigation dimension inside the Curriculum Centre. The goal is to allow the teacher to move quickly between Year 5, Year 6, Year 7, Year 8, Year 9, Year 10, Year 11, Year 12 and Year 13 content without duplicating curriculum data.

## Implemented Features

- Dynamic Year Group dropdown generated from the unified curriculum repository.
- Persistent filter state using `projectx.curriculum.filters.v1`.
- Combined search and Year Group filtering.
- Filtered dashboard KPIs.
- Filtered Units Library.
- Filtered Lessons Library.
- Filtered Planner view.
- Clear Filters action.

## Architectural Rule

Filter the view, not the data.

The repository remains the single source of truth. Year Group filtering changes what the teacher sees, but it does not create copied lesson objects or separate per-year databases.

## Related Architecture Decision

ADR-0006 — Year Group as a Curriculum Navigation Dimension.
