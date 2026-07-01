# ADR-0016 — Assessment Intelligence Centre

## Status
Accepted

## Decision
Project X Platform 1.2 Alpha introduces Assessment Intelligence as a kernel-aligned application. Assessment data is mapped to Canonical Teaching Objects and Canonical Concept Objects using aggregate, privacy-safe records only.

## Rationale
Assessment should not be isolated from curriculum. Questions assess concepts, concepts are taught through CTOs, and assessment outcomes inform revision and improvement.

## Privacy Boundary
The assessment intelligence layer must not store student names, emails, SEND data, safeguarding records, medical data, behaviour notes or individual marks.

## Consequences
The platform can identify assessment gaps, concept coverage, misconception signals and revision priorities without creating safeguarding risk.
