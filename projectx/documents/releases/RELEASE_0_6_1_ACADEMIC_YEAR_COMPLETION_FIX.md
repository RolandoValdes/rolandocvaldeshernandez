# Project X v4.0 — Release 0.6.1
## Academic Year Completion Fix

## Purpose
All lessons belonging to academic year 2025-2026 are now treated as completed curriculum delivery records.

## Changes
- Updated `data/curriculum/database-curriculum.json`.
- Set every 2025-2026 lesson status to `Completed`.
- Added Digital Lesson Twin delivery status metadata.
- Updated Curriculum Centre cache key from `projectx.curriculum.database.v06` to `projectx.curriculum.database.v061` so browsers load the corrected data instead of stale localStorage.
- Updated Curriculum Centre release badge to Release 0.6.1.

## Result
The Curriculum Centre now correctly represents the 2025-2026 academic year as completed teaching history, ready to be reused and improved for 2026-2027 planning.
