# Precision Health Research — Admin CMS config
# Stack adapted: Vite + React Router + Supabase (not Next/Prisma)

brand_prefix: brand
modules:
  core: true
  sales:
    orders: true
    customers: true
    inquiries: true
  cms:
    products: true
    categories: true
    coas: true
roles:
  - SUPER_ADMIN
  - ADMIN
  - EDITOR
  - SALES_MANAGER
  - READ_ONLY
auth: local_session_plus_optional_supabase
notes: |
  Login at /admin/login using VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD.
  Data layer uses VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY against live catalog tables.
