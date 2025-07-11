# 🚨 IMPORTANT: Database Setup Instructions

## The Issue
Supabase's JavaScript client has limitations accessing custom schemas (like `acting_institute`). The dashboard expects tables in the public schema with the prefix `acting_institute_`.

## Quick Fix (Recommended)

1. **Go to Supabase SQL Editor**: https://supabase.com/dashboard/project/cqcgnlwvncblxfyztvtp/sql

2. **Run this SQL script**: Copy and paste the entire contents of `setup-public-tables.sql`

3. **Verify the setup** by running:
```sql
SELECT 
    (SELECT COUNT(*) FROM public.acting_institute_contacts) as contacts,
    (SELECT COUNT(*) FROM public.acting_institute_payments) as payments;
```

You should see:
- contacts: 94
- payments: 17 (or more)

## What This Does

- Creates `acting_institute_contacts` table in the public schema
- Creates `acting_institute_payments` table in the public schema
- Copies all data from the existing schema (if it exists)
- Sets up proper indexes and permissions

## Alternative Solutions

### Option 1: Use Database Functions
Create RPC functions to access the schema tables:
```sql
CREATE OR REPLACE FUNCTION get_acting_institute_contacts()
RETURNS SETOF acting_institute.contacts
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM acting_institute.contacts;
$$;
```

### Option 2: Create Views
Create views in the public schema:
```sql
CREATE VIEW public.acting_institute_contacts AS
SELECT * FROM acting_institute.contacts;
```

### Option 3: Use PostgREST Schema
Configure Supabase to expose the acting_institute schema through PostgREST (requires Supabase support).

## Testing the Connection

After running the setup script, test the connection:
1. Visit your deployed dashboard
2. Enter your Supabase Anon Key
3. You should see the student data load immediately

## Troubleshooting

If you still see "relation does not exist" errors:
1. Make sure you ran the SQL script in the correct project
2. Check that the tables exist: `SELECT * FROM public.acting_institute_contacts LIMIT 1;`
3. Verify permissions: The anon role needs SELECT access
4. Try refreshing the Supabase connection pool

## Long-term Solution

For production, consider:
1. Using Supabase's Row Level Security (RLS)
2. Creating proper database roles for multi-tenancy
3. Using connection pooling for better performance
4. Implementing proper backup strategies