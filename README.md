# Inventory Manager Extra
## Details
Author: Kobi Rogers
Project Started: 9-12-2024


## Test Profiles
### Viewer
**Username:** viewer
**Password:** supersecret1

### Editor
**Username:** editor
**Password:** supersecret1

### Admin
**Username:** kobijet
**Password:** supersecret1


## To-Do:
### General:
- Page styling
- Component styling
- Separate App.css into individual components

### Home:
- Display KPIs

KPIS:
- Total value: Summation of inventory items' qty x item price
- Reserved value: Summation of inventory items' reserved qty x item price
- Available inventory value: Summation of inventory items' (qty available - qty reserved) x item price
- Out-of-stock rate: # OOS items / Total items * 100
- Low stock items: # Items below reserved
- Reserved-to-Available: (Total qty reserved) / (Total qty available - Total qty reserved) * 100
- Stock coverage: Total qty available / Average reserved

### Inventory:
**Permissions:** Admin and Editor can edit and remove inventory items

- Delete item, confirm before deletion, authorize deletion
- Create page to update item quantities en masse

### Profile:
**Permissions:** Admin can create, edit, delete users; Editor can edit users

- Show profile page of logged in user, instead of link to /users/0
- Admin can edit, create, delete other profiles
- Editor can edit other profiles

### Pre-Production:
- Re-structure into one app
