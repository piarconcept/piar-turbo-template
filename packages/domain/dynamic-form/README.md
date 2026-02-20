# @piar/domain-dynamic-form

Domain-level contracts (ports + types) to support dynamic forms and tables.

This package intentionally contains **no infrastructure** and **no feature-specific logic**.
Feature packages should define their own concrete ports (e.g. `ClientDynamicFormPort`) that
extend the generic port types exported here.
