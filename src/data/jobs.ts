// Seed data for job listings

export interface Job {
  id: string
  title: string
  slug: string
  company: {
    name: string
    logo: string
    website: string
    description: string
    size: string
    industry: string
  }
  location: {
    city: string
    state: string
    country: string
    remote: boolean
    hybrid: boolean
  }
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  salary: {
    min: number
    max: number
    currency: string
    period: 'hourly' | 'yearly'
  }
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  skills: string[]
  category: 'technology' | 'healthcare' | 'education' | 'business' | 'finance' | 'nonprofit' | 'government' | 'media'
  posted_at: string
  expires_at: string
  is_featured: boolean
  is_active: boolean
  applicants_count: number
}

export const jobs: Job[] = [
  {
    id: 'job-senior-software-engineer',
    title: 'Senior Software Engineer',
    slug: 'senior-software-engineer-amazon',
    company: {
      name: 'Amazon',
      logo: '/images/companies/amazon.png',
      website: 'https://amazon.com/jobs',
      description: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.',
      size: '1,000,000+',
      industry: 'Technology'
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'senior',
    salary: {
      min: 150000,
      max: 220000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `We are looking for a Senior Software Engineer to join our AWS team in Seattle. You will work on distributed systems that power millions of customers worldwide. This is an opportunity to work on challenging problems at massive scale while mentoring junior engineers and driving technical decisions.

As a Senior Software Engineer, you will design and implement scalable solutions, participate in code reviews, and collaborate with cross-functional teams to deliver high-impact features.`,
    responsibilities: [
      'Design and implement scalable, reliable, and secure systems',
      'Lead technical design discussions and code reviews',
      'Mentor junior engineers and foster a culture of technical excellence',
      'Collaborate with product managers to define technical requirements',
      'Participate in on-call rotation and incident response',
      'Write clean, maintainable code with comprehensive test coverage',
      'Contribute to architectural decisions and technical roadmap'
    ],
    requirements: [
      '5+ years of software development experience',
      'Strong proficiency in Java, Python, or similar languages',
      'Experience with distributed systems and microservices architecture',
      'Experience with AWS services (EC2, S3, DynamoDB, Lambda)',
      'Strong problem-solving skills and attention to detail',
      'Excellent communication and collaboration abilities',
      'BS/MS in Computer Science or equivalent experience'
    ],
    benefits: [
      'Competitive salary and equity',
      'Comprehensive health, dental, and vision insurance',
      '401(k) with company match',
      'Flexible work arrangements',
      'Relocation assistance',
      'Professional development budget',
      'Employee discount program'
    ],
    skills: ['Java', 'Python', 'AWS', 'Distributed Systems', 'Microservices', 'SQL', 'NoSQL'],
    category: 'technology',
    posted_at: '2024-10-15T00:00:00Z',
    expires_at: '2025-01-15T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 89
  },
  {
    id: 'job-registered-nurse',
    title: 'Registered Nurse - ICU',
    slug: 'registered-nurse-icu-hennepin',
    company: {
      name: 'Hennepin Healthcare',
      logo: '/images/companies/hennepin.png',
      website: 'https://hennepinhealthcare.org/careers',
      description: 'Hennepin Healthcare is an integrated system of care that includes HCMC, a nationally recognized Level I Adult and Pediatric Trauma Center, and a network of primary and specialty care clinics.',
      size: '7,000+',
      industry: 'Healthcare'
    },
    location: {
      city: 'Minneapolis',
      state: 'MN',
      country: 'USA',
      remote: false,
      hybrid: false
    },
    type: 'full-time',
    experience_level: 'mid',
    salary: {
      min: 75000,
      max: 95000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Join our ICU team at Hennepin Healthcare, one of Minnesota's leading healthcare systems. We're seeking a compassionate and skilled Registered Nurse to provide exceptional care to critically ill patients.

Our ICU is a 24-bed unit serving a diverse patient population. We value nurses who bring both clinical excellence and cultural competency to our team.`,
    responsibilities: [
      'Provide direct patient care to critically ill patients',
      'Monitor and assess patient conditions, including vital signs and lab values',
      'Administer medications and treatments as prescribed',
      'Collaborate with physicians and multidisciplinary teams',
      'Document patient care accurately and thoroughly',
      'Educate patients and families about conditions and treatments',
      'Participate in quality improvement initiatives',
      'Mentor and precept new nurses'
    ],
    requirements: [
      'Current RN license in Minnesota',
      'BSN required, MSN preferred',
      '2+ years of ICU or critical care experience',
      'BLS and ACLS certification required',
      'CCRN certification preferred',
      'Strong assessment and critical thinking skills',
      'Excellent communication and interpersonal skills',
      'Ability to work 12-hour shifts including nights and weekends'
    ],
    benefits: [
      'Competitive salary with night/weekend differentials',
      'Comprehensive health and dental insurance',
      'Generous PTO and sick leave',
      'Tuition reimbursement program',
      'Public pension plan (PERA)',
      'On-site childcare',
      'Free parking',
      'Continuing education opportunities'
    ],
    skills: ['Critical Care', 'Patient Assessment', 'IV Therapy', 'Ventilator Management', 'EMR/EHR', 'Team Collaboration'],
    category: 'healthcare',
    posted_at: '2024-10-20T00:00:00Z',
    expires_at: '2025-01-20T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 45
  },
  {
    id: 'job-data-scientist',
    title: 'Data Scientist',
    slug: 'data-scientist-microsoft',
    company: {
      name: 'Microsoft',
      logo: '/images/companies/microsoft.png',
      website: 'https://careers.microsoft.com',
      description: 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.',
      size: '200,000+',
      industry: 'Technology'
    },
    location: {
      city: 'Washington',
      state: 'DC',
      country: 'USA',
      remote: true,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'mid',
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Microsoft is seeking a Data Scientist to join our AI & Research division. You will work on cutting-edge machine learning projects that impact millions of users worldwide.

This role offers the opportunity to work with world-class researchers and engineers on challenging problems in natural language processing, computer vision, and predictive analytics.`,
    responsibilities: [
      'Develop and deploy machine learning models at scale',
      'Analyze large datasets to extract insights and patterns',
      'Collaborate with product teams to integrate ML solutions',
      'Design experiments and A/B tests to validate hypotheses',
      'Present findings to technical and non-technical stakeholders',
      'Stay current with latest research and techniques',
      'Contribute to open-source projects and publications'
    ],
    requirements: [
      'MS/PhD in Computer Science, Statistics, or related field',
      '3+ years of experience in data science or machine learning',
      'Strong proficiency in Python and ML frameworks (PyTorch, TensorFlow)',
      'Experience with cloud platforms (Azure preferred)',
      'Solid understanding of statistics and experimental design',
      'Experience with big data technologies (Spark, Hadoop)',
      'Excellent problem-solving and communication skills'
    ],
    benefits: [
      'Competitive base salary plus bonus',
      'Stock awards',
      'Comprehensive healthcare',
      '401(k) with matching',
      'Generous parental leave',
      'Wellness programs',
      'Learning and development budget',
      'Employee Resource Groups'
    ],
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Azure', 'Statistics', 'NLP'],
    category: 'technology',
    posted_at: '2024-10-18T00:00:00Z',
    expires_at: '2025-01-18T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 156
  },
  {
    id: 'job-high-school-teacher',
    title: 'High School Math Teacher',
    slug: 'high-school-math-teacher-mpls',
    company: {
      name: 'Minneapolis Public Schools',
      logo: '/images/companies/mpls-schools.png',
      website: 'https://mpls.k12.mn.us/careers',
      description: 'Minneapolis Public Schools is committed to providing all students with the tools needed to succeed in school and in life.',
      size: '5,000+',
      industry: 'Education'
    },
    location: {
      city: 'Minneapolis',
      state: 'MN',
      country: 'USA',
      remote: false,
      hybrid: false
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 52000,
      max: 78000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Minneapolis Public Schools is seeking passionate math teachers to join our high school faculty. We serve a diverse student population and value educators who bring cultural competency and innovative teaching methods to the classroom.

This position offers the opportunity to make a real difference in students' lives while working in a supportive, collaborative environment. We particularly welcome applicants who reflect the diversity of our student body.`,
    responsibilities: [
      'Teach Algebra, Geometry, and/or Pre-Calculus courses',
      'Develop engaging lesson plans aligned with state standards',
      'Assess student progress and provide timely feedback',
      'Differentiate instruction to meet diverse learning needs',
      'Build positive relationships with students and families',
      'Participate in professional development activities',
      'Collaborate with colleagues on curriculum development',
      'Maintain a safe and inclusive classroom environment'
    ],
    requirements: [
      'Bachelor\'s degree in Mathematics or Mathematics Education',
      'Minnesota teaching license (or eligibility)',
      'Experience working with diverse student populations',
      'Strong content knowledge in secondary mathematics',
      'Commitment to equity and culturally responsive teaching',
      'Excellent communication and classroom management skills',
      'Ability to use technology to enhance instruction'
    ],
    benefits: [
      'Competitive salary based on experience',
      'Excellent health and dental insurance',
      'Minnesota Teachers Retirement Association pension',
      'Paid professional development',
      'Tuition reimbursement for advanced degrees',
      'Union representation',
      'Summer break',
      'Student loan forgiveness eligible'
    ],
    skills: ['Mathematics', 'Curriculum Development', 'Classroom Management', 'Differentiated Instruction', 'Educational Technology'],
    category: 'education',
    posted_at: '2024-10-10T00:00:00Z',
    expires_at: '2025-02-10T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 34
  },
  {
    id: 'job-financial-analyst',
    title: 'Financial Analyst',
    slug: 'financial-analyst-wells-fargo',
    company: {
      name: 'Wells Fargo',
      logo: '/images/companies/wells-fargo.png',
      website: 'https://www.wellsfargojobs.com',
      description: 'Wells Fargo is a leading financial services company with operations in banking, investments, mortgage, and consumer and commercial finance.',
      size: '200,000+',
      industry: 'Finance'
    },
    location: {
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 65000,
      max: 85000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Wells Fargo is seeking a Financial Analyst to join our Corporate Finance team in Atlanta. This role offers excellent exposure to senior leadership and opportunities for career growth in the financial services industry.

As a Financial Analyst, you will support strategic financial planning, budgeting, and analysis for key business units.`,
    responsibilities: [
      'Prepare monthly and quarterly financial reports',
      'Analyze financial data and identify trends',
      'Support annual budgeting and forecasting processes',
      'Create financial models to support decision-making',
      'Prepare presentations for senior management',
      'Assist with variance analysis and KPI tracking',
      'Collaborate with business partners across departments',
      'Support ad-hoc financial analysis projects'
    ],
    requirements: [
      'Bachelor\'s degree in Finance, Accounting, or related field',
      '1-3 years of financial analysis experience',
      'Advanced Excel skills (pivot tables, VLOOKUP, macros)',
      'Experience with financial planning software (Hyperion, Anaplan)',
      'Strong analytical and problem-solving skills',
      'Excellent attention to detail',
      'Strong communication and presentation skills',
      'CFA or MBA progress a plus'
    ],
    benefits: [
      'Competitive base salary',
      'Annual bonus potential',
      '401(k) with company match',
      'Comprehensive health coverage',
      'Tuition reimbursement',
      'Banking discounts',
      'Paid volunteer time',
      'Career development programs'
    ],
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Budgeting', 'Forecasting', 'SQL', 'PowerPoint'],
    category: 'finance',
    posted_at: '2024-10-22T00:00:00Z',
    expires_at: '2025-01-22T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 78
  },
  {
    id: 'job-product-manager',
    title: 'Product Manager',
    slug: 'product-manager-google',
    company: {
      name: 'Google',
      logo: '/images/companies/google.png',
      website: 'https://careers.google.com',
      description: 'Google\'s mission is to organize the world\'s information and make it universally accessible and useful.',
      size: '150,000+',
      industry: 'Technology'
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'senior',
    salary: {
      min: 180000,
      max: 260000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Google is looking for an experienced Product Manager to lead product development for Google Cloud Platform. You will work with engineering teams to define product vision, strategy, and roadmap.

This role requires a blend of business acumen, technical understanding, and user empathy to build products that delight customers and drive business growth.`,
    responsibilities: [
      'Define product vision, strategy, and roadmap',
      'Gather and prioritize product requirements',
      'Work closely with engineering to deliver features',
      'Analyze market trends and competitive landscape',
      'Define success metrics and track product performance',
      'Collaborate with design on user experience',
      'Communicate product plans to stakeholders',
      'Lead cross-functional product launches'
    ],
    requirements: [
      'BA/BS degree, MBA preferred',
      '7+ years of product management experience',
      'Experience with cloud or enterprise software products',
      'Strong technical background (CS degree or equivalent)',
      'Excellent analytical and strategic thinking',
      'Outstanding communication and leadership skills',
      'Experience with agile development methodologies',
      'Track record of successful product launches'
    ],
    benefits: [
      'Competitive salary and bonus',
      'Equity grants',
      'Comprehensive healthcare',
      'Generous parental leave (18-24 weeks)',
      'On-site amenities (food, fitness, etc.)',
      '401(k) matching',
      'Learning and development stipend',
      'Sabbatical program'
    ],
    skills: ['Product Management', 'Cloud Computing', 'Strategy', 'Agile', 'Data Analysis', 'User Research', 'Leadership'],
    category: 'technology',
    posted_at: '2024-10-25T00:00:00Z',
    expires_at: '2025-01-25T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 234
  },
  {
    id: 'job-medical-assistant',
    title: 'Medical Assistant',
    slug: 'medical-assistant-kaiser',
    company: {
      name: 'Kaiser Permanente',
      logo: '/images/companies/kaiser.png',
      website: 'https://jobs.kaiserpermanente.org',
      description: 'Kaiser Permanente is one of America\'s leading health care providers and not-for-profit health plans.',
      size: '200,000+',
      industry: 'Healthcare'
    },
    location: {
      city: 'Washington',
      state: 'DC',
      country: 'USA',
      remote: false,
      hybrid: false
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 40000,
      max: 52000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Kaiser Permanente is seeking a Medical Assistant to join our outpatient clinic team in the DC Metro area. This is an excellent opportunity for someone starting their healthcare career.

We value team members who are compassionate, detail-oriented, and committed to providing excellent patient care.`,
    responsibilities: [
      'Prepare patients for examinations',
      'Take and record vital signs',
      'Assist physicians during procedures',
      'Administer medications and immunizations',
      'Schedule appointments and referrals',
      'Maintain patient records in EMR',
      'Perform basic lab tests',
      'Ensure exam rooms are stocked and clean'
    ],
    requirements: [
      'High school diploma or GED',
      'Medical Assistant certification (CMA, RMA, or CCMA)',
      'BLS certification',
      'Experience with electronic medical records',
      'Strong customer service orientation',
      'Excellent communication skills',
      'Ability to work in fast-paced environment',
      'Bilingual skills a plus'
    ],
    benefits: [
      'Competitive hourly wage',
      'Kaiser health insurance',
      'Dental and vision coverage',
      'Retirement savings plan',
      'Paid time off',
      'Tuition reimbursement',
      'Career advancement opportunities',
      'Employee assistance program'
    ],
    skills: ['Patient Care', 'Vital Signs', 'EMR', 'Phlebotomy', 'Medical Terminology', 'Customer Service'],
    category: 'healthcare',
    posted_at: '2024-10-28T00:00:00Z',
    expires_at: '2025-01-28T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 56
  },
  {
    id: 'job-nonprofit-program-director',
    title: 'Program Director',
    slug: 'program-director-refugee-services',
    company: {
      name: 'Immigrant and Refugee Services of America',
      logo: '/images/companies/irsa.png',
      website: 'https://irsa.org/careers',
      description: 'IRSA provides comprehensive services to immigrants, refugees, and asylees to help them achieve self-sufficiency and integration in their new communities.',
      size: '500+',
      industry: 'Nonprofit'
    },
    location: {
      city: 'Minneapolis',
      state: 'MN',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'senior',
    salary: {
      min: 70000,
      max: 90000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `We are seeking an experienced Program Director to lead our refugee resettlement and integration programs in Minneapolis. This role is ideal for someone passionate about serving immigrant communities and with experience in program management.

The Program Director will oversee a team of case managers and specialists who provide direct services to newly arrived refugees.`,
    responsibilities: [
      'Oversee all refugee resettlement programs',
      'Manage and mentor a team of 10+ staff members',
      'Ensure compliance with federal and state grant requirements',
      'Develop and maintain community partnerships',
      'Monitor program outcomes and prepare reports',
      'Manage program budgets',
      'Represent organization at community events',
      'Participate in strategic planning efforts'
    ],
    requirements: [
      'Bachelor\'s degree in Social Work, Public Administration, or related field',
      '5+ years of experience in refugee services or related field',
      '3+ years of supervisory experience',
      'Knowledge of refugee resettlement processes',
      'Experience with federal grant management',
      'Strong leadership and communication skills',
      'Cultural competency and sensitivity',
      'Fluency in Oromo, Somali, or other relevant language a plus'
    ],
    benefits: [
      'Competitive salary',
      'Health and dental insurance',
      'Generous PTO (4 weeks starting)',
      '403(b) retirement plan with match',
      'Flexible work schedule',
      'Professional development funds',
      'Mission-driven work environment',
      'Sabbatical after 5 years'
    ],
    skills: ['Program Management', 'Team Leadership', 'Grant Management', 'Community Outreach', 'Budget Management', 'Case Management'],
    category: 'nonprofit',
    posted_at: '2024-10-12T00:00:00Z',
    expires_at: '2025-01-12T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 28
  },
  {
    id: 'job-marketing-manager',
    title: 'Digital Marketing Manager',
    slug: 'digital-marketing-manager-target',
    company: {
      name: 'Target Corporation',
      logo: '/images/companies/target.png',
      website: 'https://corporate.target.com/careers',
      description: 'Target is a general merchandise retailer with stores in all 50 U.S. states, and is a Fortune 50 company.',
      size: '400,000+',
      industry: 'Retail'
    },
    location: {
      city: 'Minneapolis',
      state: 'MN',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'mid',
    salary: {
      min: 85000,
      max: 115000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Target is seeking a Digital Marketing Manager to join our team at headquarters in Minneapolis. You will develop and execute digital marketing strategies that drive customer engagement and sales across our digital platforms.

This role offers the opportunity to work on high-impact campaigns for one of America's favorite retailers.`,
    responsibilities: [
      'Develop digital marketing strategies and campaigns',
      'Manage paid media campaigns (search, social, display)',
      'Analyze campaign performance and optimize ROI',
      'Collaborate with creative teams on content development',
      'Manage email marketing programs',
      'Oversee social media strategy',
      'Work with agency partners',
      'Present results to senior leadership'
    ],
    requirements: [
      'Bachelor\'s degree in Marketing or related field',
      '4-6 years of digital marketing experience',
      'Experience with Google Ads, Meta Ads, and analytics tools',
      'Strong analytical and data-driven mindset',
      'Experience with marketing automation platforms',
      'Excellent project management skills',
      'Strong communication and presentation skills',
      'Retail experience a plus'
    ],
    benefits: [
      'Competitive salary and bonus',
      'Employee discount (15%)',
      'Comprehensive health benefits',
      '401(k) with matching',
      'Paid time off',
      'Parental leave',
      'Volunteer time off',
      'Career development programs'
    ],
    skills: ['Digital Marketing', 'Google Ads', 'Social Media Marketing', 'Analytics', 'Email Marketing', 'SEO', 'Campaign Management'],
    category: 'business',
    posted_at: '2024-10-30T00:00:00Z',
    expires_at: '2025-01-30T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 92
  },
  {
    id: 'job-software-engineer-entry',
    title: 'Software Engineer - New Grad',
    slug: 'software-engineer-new-grad-meta',
    company: {
      name: 'Meta',
      logo: '/images/companies/meta.png',
      website: 'https://www.metacareers.com',
      description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
      size: '60,000+',
      industry: 'Technology'
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 120000,
      max: 150000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Meta is hiring new graduate Software Engineers to join our team. This is an excellent opportunity to start your career at one of the world's leading technology companies.

You'll work on products that billions of people use every day, with access to world-class mentorship and learning opportunities.`,
    responsibilities: [
      'Write clean, efficient code across the stack',
      'Participate in code reviews and technical discussions',
      'Learn and grow through our bootcamp program',
      'Collaborate with cross-functional teams',
      'Debug and resolve technical issues',
      'Contribute to team projects and initiatives',
      'Participate in on-call rotations after ramp-up'
    ],
    requirements: [
      'Bachelor\'s or Master\'s in Computer Science or related field',
      'Graduating in 2024 or 2025',
      'Strong programming skills in at least one language',
      'Understanding of data structures and algorithms',
      'Experience with software development (internships, projects)',
      'Strong problem-solving abilities',
      'Excellent communication skills',
      'Enthusiasm for learning'
    ],
    benefits: [
      'Competitive salary and signing bonus',
      'Restricted Stock Units (RSUs)',
      'Comprehensive health insurance',
      '401(k) matching',
      'Free meals on campus',
      'Generous PTO',
      'Wellness benefits',
      'New grad bootcamp program'
    ],
    skills: ['Python', 'Java', 'C++', 'Data Structures', 'Algorithms', 'Problem Solving'],
    category: 'technology',
    posted_at: '2024-10-05T00:00:00Z',
    expires_at: '2025-03-05T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 567
  },
  {
    id: 'job-physician-assistant',
    title: 'Physician Assistant - Primary Care',
    slug: 'physician-assistant-providence',
    company: {
      name: 'Providence Health',
      logo: '/images/companies/providence.png',
      website: 'https://providencehealth.com/careers',
      description: 'Providence is a not-for-profit health system operating multiple hospitals, clinics, and a comprehensive range of health and social services.',
      size: '120,000+',
      industry: 'Healthcare'
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      remote: false,
      hybrid: false
    },
    type: 'full-time',
    experience_level: 'mid',
    salary: {
      min: 115000,
      max: 140000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Providence Health is seeking a Physician Assistant to join our primary care team in the Seattle area. We serve a diverse patient population and value providers who practice patient-centered care.

This position offers a great work-life balance with a supportive team environment.`,
    responsibilities: [
      'Provide comprehensive primary care services',
      'Conduct patient examinations and assessments',
      'Diagnose and treat acute and chronic conditions',
      'Order and interpret diagnostic tests',
      'Prescribe medications and treatments',
      'Provide patient education and counseling',
      'Collaborate with physicians and care team',
      'Maintain accurate medical records'
    ],
    requirements: [
      'Graduate of accredited PA program',
      'Current NCCPA certification',
      'Washington state PA license',
      '2+ years of primary care experience',
      'DEA license',
      'BLS and ACLS certification',
      'Experience with Epic EMR preferred',
      'Excellent interpersonal skills'
    ],
    benefits: [
      'Competitive salary',
      'Production bonus potential',
      'Medical, dental, and vision insurance',
      'Malpractice insurance provided',
      'CME allowance and time off',
      'Retirement plan with employer match',
      'Paid time off',
      'Relocation assistance available'
    ],
    skills: ['Primary Care', 'Patient Assessment', 'Chronic Disease Management', 'EMR/Epic', 'Patient Education'],
    category: 'healthcare',
    posted_at: '2024-10-08T00:00:00Z',
    expires_at: '2025-01-08T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 41
  },
  {
    id: 'job-business-analyst',
    title: 'Business Analyst',
    slug: 'business-analyst-deloitte',
    company: {
      name: 'Deloitte',
      logo: '/images/companies/deloitte.png',
      website: 'https://www2.deloitte.com/careers',
      description: 'Deloitte provides industry-leading audit, consulting, tax, and advisory services to many of the world\'s most admired brands.',
      size: '300,000+',
      industry: 'Consulting'
    },
    location: {
      city: 'Washington',
      state: 'DC',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 75000,
      max: 95000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Deloitte is seeking Business Analysts to join our consulting practice in Washington, DC. You will work with diverse clients across industries to solve complex business problems and drive digital transformation.

This role offers excellent exposure to various industries and the opportunity to build a strong consulting foundation.`,
    responsibilities: [
      'Gather and analyze business requirements',
      'Document current and future state processes',
      'Support solution design and implementation',
      'Create presentations and deliverables for clients',
      'Conduct stakeholder interviews and workshops',
      'Analyze data to derive insights',
      'Support project management activities',
      'Collaborate with team members and clients'
    ],
    requirements: [
      'Bachelor\'s degree in Business, IT, or related field',
      '0-2 years of relevant experience',
      'Strong analytical and problem-solving skills',
      'Excellent communication and presentation skills',
      'Proficiency in MS Office (Excel, PowerPoint)',
      'Ability to work in teams and independently',
      'Willingness to travel up to 50%',
      'Authorization to work in the US'
    ],
    benefits: [
      'Competitive salary and bonus',
      'Comprehensive health insurance',
      '401(k) with company match',
      'Professional development programs',
      'CPA/MBA sponsorship available',
      'Generous PTO',
      'Wellness programs',
      'Global mobility opportunities'
    ],
    skills: ['Business Analysis', 'Requirements Gathering', 'Process Mapping', 'Excel', 'PowerPoint', 'SQL', 'Data Analysis'],
    category: 'business',
    posted_at: '2024-10-14T00:00:00Z',
    expires_at: '2025-02-14T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 189
  },
  {
    id: 'job-community-health-worker',
    title: 'Community Health Worker',
    slug: 'community-health-worker-oromia-health',
    company: {
      name: 'Oromia Health Initiative',
      logo: '/images/companies/oromia-health.png',
      website: 'https://oromiahealthinitiative.org/careers',
      description: 'Oromia Health Initiative is a nonprofit organization dedicated to improving health outcomes in the Oromo community through culturally appropriate services and health education.',
      size: '50+',
      industry: 'Healthcare/Nonprofit'
    },
    location: {
      city: 'Minneapolis',
      state: 'MN',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 42000,
      max: 52000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Oromia Health Initiative is seeking a Community Health Worker to serve the Oromo community in the Twin Cities area. This role is ideal for someone passionate about community health who speaks Afaan Oromo.

You will provide health education, navigation services, and support to community members in accessing healthcare services.`,
    responsibilities: [
      'Conduct health education workshops in Oromo',
      'Help community members navigate the healthcare system',
      'Provide interpretation and translation services',
      'Connect clients with healthcare providers and social services',
      'Conduct home visits and follow-ups',
      'Maintain accurate client records',
      'Participate in community outreach events',
      'Collaborate with healthcare providers'
    ],
    requirements: [
      'High school diploma or equivalent',
      'Fluency in Afaan Oromo required',
      'CHW certification or willingness to obtain',
      'Knowledge of Oromo culture and community',
      'Understanding of healthcare systems',
      'Strong interpersonal and communication skills',
      'Valid driver\'s license and reliable transportation',
      'Experience in community health preferred'
    ],
    benefits: [
      'Competitive salary',
      'Health and dental insurance',
      'Paid time off',
      'Retirement plan',
      'Training and professional development',
      'Mileage reimbursement',
      'Flexible schedule',
      'Mission-driven work environment'
    ],
    skills: ['Afaan Oromo', 'Community Outreach', 'Health Education', 'Care Coordination', 'Cultural Competency', 'Patient Navigation'],
    category: 'healthcare',
    posted_at: '2024-10-20T00:00:00Z',
    expires_at: '2025-01-20T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 23
  },
  {
    id: 'job-accountant',
    title: 'Staff Accountant',
    slug: 'staff-accountant-kpmg',
    company: {
      name: 'KPMG',
      logo: '/images/companies/kpmg.png',
      website: 'https://www.kpmguscareers.com',
      description: 'KPMG is a global organization of independent professional services firms providing Audit, Tax, and Advisory services.',
      size: '200,000+',
      industry: 'Professional Services'
    },
    location: {
      city: 'Atlanta',
      state: 'GA',
      country: 'USA',
      remote: false,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'entry',
    salary: {
      min: 60000,
      max: 72000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `KPMG is seeking Staff Accountants to join our Audit practice in Atlanta. This is an excellent opportunity to launch your career in public accounting with one of the Big Four firms.

You will work with diverse clients across industries while developing technical expertise and professional skills.`,
    responsibilities: [
      'Execute audit procedures under supervision',
      'Prepare audit workpapers and documentation',
      'Analyze financial statements and transactions',
      'Test internal controls',
      'Communicate with clients professionally',
      'Meet project deadlines and budgets',
      'Participate in team meetings and trainings',
      'Support senior team members on engagements'
    ],
    requirements: [
      'Bachelor\'s degree in Accounting',
      'CPA eligible (150 credit hours)',
      'Strong academic record (3.0+ GPA preferred)',
      'Understanding of GAAP and auditing standards',
      'Proficiency in Excel and accounting software',
      'Strong analytical skills',
      'Excellent communication skills',
      'Ability to travel locally as needed'
    ],
    benefits: [
      'Competitive salary',
      'CPA exam support and bonus',
      'Comprehensive health insurance',
      '401(k) with company match',
      'Generous PTO',
      'Professional development programs',
      'Mentorship program',
      'Busy season perks'
    ],
    skills: ['GAAP', 'Auditing', 'Excel', 'Financial Analysis', 'Accounting Software', 'Attention to Detail'],
    category: 'finance',
    posted_at: '2024-10-16T00:00:00Z',
    expires_at: '2025-01-16T00:00:00Z',
    is_featured: false,
    is_active: true,
    applicants_count: 145
  },
  {
    id: 'job-ux-designer',
    title: 'UX Designer',
    slug: 'ux-designer-adobe',
    company: {
      name: 'Adobe',
      logo: '/images/companies/adobe.png',
      website: 'https://adobe.com/careers',
      description: 'Adobe is changing the world through digital experiences. We help our customers create, deliver, and optimize content and applications.',
      size: '25,000+',
      industry: 'Technology'
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      remote: true,
      hybrid: true
    },
    type: 'full-time',
    experience_level: 'mid',
    salary: {
      min: 110000,
      max: 150000,
      currency: 'USD',
      period: 'yearly'
    },
    description: `Adobe is seeking a UX Designer to join our Creative Cloud team. You will design intuitive, beautiful experiences that help millions of creatives around the world do their best work.

This role offers the opportunity to work on products used by creative professionals globally, with access to cutting-edge design tools and methodologies.`,
    responsibilities: [
      'Design user interfaces and interactions for Creative Cloud products',
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and design specifications',
      'Collaborate with product managers and engineers',
      'Present designs to stakeholders and incorporate feedback',
      'Maintain design systems and component libraries',
      'Advocate for users throughout the product development process',
      'Stay current with design trends and best practices'
    ],
    requirements: [
      'Bachelor\'s degree in Design, HCI, or related field',
      '3-5 years of UX design experience',
      'Strong portfolio demonstrating design process and outcomes',
      'Proficiency in Figma, Adobe XD, and prototyping tools',
      'Experience with user research methodologies',
      'Understanding of accessibility standards',
      'Excellent communication and collaboration skills',
      'Experience with design systems a plus'
    ],
    benefits: [
      'Competitive salary and annual bonus',
      'Stock awards',
      'Comprehensive health insurance',
      '401(k) matching',
      'Adobe product access',
      'Learning and development funds',
      'Wellness programs',
      'Sabbatical program'
    ],
    skills: ['UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'Adobe Creative Suite'],
    category: 'technology',
    posted_at: '2024-10-24T00:00:00Z',
    expires_at: '2025-01-24T00:00:00Z',
    is_featured: true,
    is_active: true,
    applicants_count: 178
  }
]

// Helper functions
export const getJobBySlug = (slug: string): Job | undefined => {
  return jobs.find(j => j.slug === slug)
}

export const getJobById = (id: string): Job | undefined => {
  return jobs.find(j => j.id === id)
}

export const getJobsByCategory = (category: Job['category']): Job[] => {
  return jobs.filter(j => j.category === category)
}

export const getJobsByLocation = (city: string): Job[] => {
  return jobs.filter(j => j.location.city.toLowerCase() === city.toLowerCase())
}

export const getJobsByType = (type: Job['type']): Job[] => {
  return jobs.filter(j => j.type === type)
}

export const getRemoteJobs = (): Job[] => {
  return jobs.filter(j => j.location.remote)
}

export const getFeaturedJobs = (): Job[] => {
  return jobs.filter(j => j.is_featured)
}

export const getActiveJobs = (): Job[] => {
  return jobs.filter(j => j.is_active)
}

export const searchJobs = (query: string): Job[] => {
  const lowerQuery = query.toLowerCase()
  return jobs.filter(j =>
    j.title.toLowerCase().includes(lowerQuery) ||
    j.company.name.toLowerCase().includes(lowerQuery) ||
    j.description.toLowerCase().includes(lowerQuery) ||
    j.skills.some(s => s.toLowerCase().includes(lowerQuery))
  )
}

export const getJobsByExperience = (level: Job['experience_level']): Job[] => {
  return jobs.filter(j => j.experience_level === level)
}
