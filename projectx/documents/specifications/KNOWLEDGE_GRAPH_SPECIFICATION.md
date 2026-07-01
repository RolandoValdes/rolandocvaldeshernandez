# Knowledge Graph Specification

The Knowledge Graph connects Project X curriculum objects using typed relationships.

## Core Relationships
- Scheme contains Unit
- Unit contains Lesson
- Lesson belongs to Unit
- Lesson precedes Lesson
- Lesson follows Lesson
- Lesson teaches Concept
- Concept is taught in Lesson
- Lesson has CTO

## Generated Artefacts
- `data/intelligence/concept-registry.json`
- `data/intelligence/relationships.json`
- `data/intelligence/progression-maps.json`
- `data/intelligence/graph-validator.json`
