-- ACTING INSTITUTE - CREATE PUBLIC SCHEMA TABLES
-- This creates the tables in the public schema for easier Supabase access

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.acting_institute_payments CASCADE;
DROP TABLE IF EXISTS public.acting_institute_contacts CASCADE;

-- Create contacts table in public schema
CREATE TABLE public.acting_institute_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    status VARCHAR(50),
    payment_status VARCHAR(50),
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create payments table in public schema
CREATE TABLE public.acting_institute_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID REFERENCES public.acting_institute_contacts(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) NOT NULL,
    payment_date DATE,
    due_date DATE,
    payment_method VARCHAR(50),
    reference VARCHAR(100),
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ai_contacts_email ON public.acting_institute_contacts(email);
CREATE INDEX idx_ai_contacts_phone ON public.acting_institute_contacts(phone);
CREATE INDEX idx_ai_contacts_payment_status ON public.acting_institute_contacts(payment_status);
CREATE INDEX idx_ai_payments_contact_id ON public.acting_institute_payments(contact_id);
CREATE INDEX idx_ai_payments_status ON public.acting_institute_payments(status);

-- Grant permissions
GRANT ALL ON public.acting_institute_contacts TO anon, authenticated;
GRANT ALL ON public.acting_institute_payments TO anon, authenticated;

-- Copy data from acting_institute schema if it exists
DO $$
BEGIN
    -- Check if acting_institute schema exists
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'acting_institute') THEN
        -- Copy contacts data
        INSERT INTO public.acting_institute_contacts
        SELECT * FROM acting_institute.contacts;
        
        -- Copy payments data
        INSERT INTO public.acting_institute_payments
        SELECT * FROM acting_institute.payments;
        
        RAISE NOTICE 'Data copied from acting_institute schema to public tables';
    ELSE
        RAISE NOTICE 'No acting_institute schema found - tables created empty';
    END IF;
END $$;

-- Verify the data
SELECT 
    'Setup complete!' as status,
    (SELECT COUNT(*) FROM public.acting_institute_contacts) as total_contacts,
    (SELECT COUNT(*) FROM public.acting_institute_payments) as total_payments,
    (SELECT COUNT(*) FROM public.acting_institute_contacts WHERE phone IS NOT NULL) as contacts_with_phone,
    (SELECT SUM(amount) FROM public.acting_institute_payments WHERE status = 'pending') as pending_amount;