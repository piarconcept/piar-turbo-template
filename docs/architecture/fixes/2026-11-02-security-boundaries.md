# Security Boundaries Must Be Executable

## Problem

Several controls existed only as documentation or disconnected helpers: Swagger described an
admin-only role route without guards, DTOs described shapes without runtime validation, header
functions were not wired into Next.js, and example secrets supplied an unsafe fallback.

## Root Cause

Security intent and runtime enforcement had different owners. Static descriptions were accepted as
evidence even when no executable path consumed them.

## Fix

- Bound authorization, validation, headers, CORS and throttling at framework entry points.
- Added negative-path tests for anonymous, regular-user and administrator behavior.
- Added a security baseline check to the isolated verification workflow.
- Recorded residual controls that require product/runtime ownership instead of inventing defaults.

## Prevention Rule

A security control is not complete until its runtime binding and a negative assertion are visible.
Documentation and Swagger metadata are supporting evidence, not enforcement.

## Last Updated

2 November 2026 - Recorded executable-boundary remediation
