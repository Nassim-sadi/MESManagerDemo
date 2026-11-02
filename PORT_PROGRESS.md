# WinForms to Web Port Progress

This checklist tracks implementation in the web demo. `[x]` means the listed web-port work is implemented; it does not claim production backend parity. Demo storage and permission checks run in the browser until APIs are available.

## Core modules

- [ ] Base Data — factories, departments, lines, sites, workstations, users, warehouses
- [x] Users and Access — user profile fields, role assignment, menu/action permissions, factory and warehouse scope in the demo
- [ ] Order Management — orders, serial/barcode tracking, rework, production reports
- [ ] OQC and Quality — inspection, sampling, OQC pallets/serials, defects
- [ ] Warehouse — inventory, allocation, delivery, QC, pallets and boxes
- [ ] Semi-Final, Injection and SFG — production flows for each line type
- [ ] Equipment and Instruments — leak, vacuum/gas scan, entropy, foaming and auto-repair data
- [ ] Security Machine and E-Kanban — data collection and dashboards
- [ ] Sales
- [ ] SAP integration
- [ ] Print and Barcode

## Order Production Report and Print/Barcode demo

- [x] Add a paginated Order Production Report with date, line, site, shift, order and model filters, totals and CSV export
- [x] Derive report rows from seeded work orders and production lines; unavailable repair quantities are shown as zero in demo data
- [x] Add serial lookup, Code 39 label preview, recent serial selection and browser print layout
- [ ] Connect report quantities and barcode print history to production APIs and physical printer/BarTender integration

## Users and Access port details

- [x] Add desktop-style user identity, department, contact, status, authority, photo URL, factory, role and warehouse fields
- [x] Load demo departments, roles and users from project JSON; persist edits in browser storage and migrate earlier demo records
- [x] Resolve sign-in role and scope from the active managed account; reject unknown, inactive, or non-employed accounts
- [x] Edit role access in a module/action permission tree and preserve administrator management access
- [x] Scope current mock screens to the demo factory and inventory records to assigned warehouses
- [ ] Run acceptance review against the WinForms behavior and refine demo edge cases

## Existing web demo coverage

Dashboard, production, work orders, traceability, quality, inventory, reports and line assignments already have demo screens. They remain partial ports until their desktop workflows, data fields, and business rules are reviewed and implemented.
