// Single source of truth for personal details shown across the site.
export const site = {
  name: 'Anthony Thomas',
  url: 'https://anthonythomas.dev',
  role: 'Full-stack developer',
  tagline: 'Full-stack developer with a B.S. in Computer Science from the University of Houston. I build TypeScript apps, including ones that put AI to real use.',
  status: 'Open to entry-level SWE roles',
  email: 'anthonyethomas03@gmail.com',
  github: 'https://github.com/anth0n7',
  linkedin: 'https://linkedin.com/in/anthony-thomas-dev',
  resume: '/Anthony_Thomas_Resume.pdf',
  about: [
    'I’m a full-stack developer who recently finished a B.S. in Computer Science at the University of Houston. I work mostly in TypeScript, React, Node and PostgreSQL, and I like projects that go past basic CRUD.',
    'I’m at my best debugging across the stack and explaining why I made a decision. When I use AI in a product, I build guardrails around what the model returns, like stopping it from inventing skills on a résumé.',
  ],
  education: {
    school: 'University of Houston',
    degree: 'B.S. in Computer Science',
    when: 'May 2026',
    gpa: '3.83',
    coursework: ['Software Engineering', 'Database Systems', 'Artificial Intelligence', 'Operating Systems', 'Computer Networks', 'Cybersecurity'],
  },
} as const;
