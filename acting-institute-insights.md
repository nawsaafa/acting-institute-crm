# Acting Institute Data Structure Analysis

## Key Findings

### 1. Main Data Sources

#### Student Management
- **LISTE ACTING INSTITUTE** - Central student database with 93 sheets (!!)
  - Contains multiple programs: Enfants (Kids), Junior, Adult classes
  - Events: Comedy Club, Standup classes, Master classes
  - Separate sheets for different years and programs

#### Financial Tracking
- **COMPTABILITÉ 2023** - 2023 accounting records
  - Contains "ETUDIANTS COMPTABILITE" sheet with payment tracking
  - Links students to payment statuses
  - Has "RECOUVREMENT" (collection) sheets for pending payments

- **Acting Institute Financial Tracker** - Comprehensive financial system
  - Student Tracking: Enrollment data
  - Revenue: Invoice tracking with VAT
  - Expenses & Costs: Full expense management
  - Clients Tracker: Payment status tracking
  - Potential Clients: Lead management with follow-up tracking

#### Registration & Forms
- **INSCRIPTIONS 2024-2025** - Current year registrations
  - Multiple intake forms (Google Forms, Meta forms)
  - Casting calls tracking
  - Trial class registrations
  - JPO (Journée Portes Ouvertes - Open House) registrations

### 2. Identified Entities & Relationships

#### Core Entities
1. **Students/Clients**
   - Personal info: Name, Phone, Email, Address, Age
   - Enrollment: Course, Date, Status
   - Financial: Payment status, amounts owed

2. **Courses/Programs**
   - Regular classes (Acting, Standup, Improv)
   - Special events (Master classes, Comedy Club)
   - Age groups (Enfants, Junior, Adult)
   - Schedules and instructors

3. **Payments**
   - Invoices with amounts and VAT
   - Payment methods (ESP/Cash, CHQ/Check, VIRMT/Transfer)
   - Payment status and dates
   - Collection tracking

4. **Events**
   - Master classes with guest instructors
   - Comedy Club performances
   - Casting calls
   - Open houses (JPO)

5. **Instructors/Staff**
   - Course assignments
   - Event hosting

6. **Leads/Prospects**
   - Contact information
   - Interest level
   - Follow-up tracking (1st, 2nd, 3rd)
   - Source tracking

### 3. Key Business Metrics Found

- Student enrollment by program
- Revenue tracking with VAT
- Payment collection rates
- Lead conversion tracking
- Event attendance
- Course capacity utilization

### 4. Data Quality Observations

- Multiple sheets for similar data (needs consolidation)
- Mixed languages (French/English)
- Inconsistent naming conventions
- Manual tracking in many areas
- Rich historical data across multiple years