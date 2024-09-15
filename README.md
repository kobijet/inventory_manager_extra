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
- Add visualizations for KPIs

### Inventory:
**Permissions:** Admin and Editor can edit and remove inventory items

- Add cost field to inventory items
- Add feature for customers to order items and update inventory
- Add feature to receive shipments
- - JSON input? Excel input? Upload photo and parse table?
- Fix deleting items; pop-up modal to confirm deletion, jwt authorize deletion
- Create page to update item quantities en masse

### Profile:
**Permissions:** Admin can create, edit, delete users; Editor can edit users

- Show profile page of logged in user, instead of link to /users/0
- Admin can edit, create, delete other profiles
- Editor can edit other profiles

### Pre-Production:
- Re-structure into one app
