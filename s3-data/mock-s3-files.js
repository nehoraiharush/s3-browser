const files = [
  { Key: 'welcome.txt', Body: 'Welcome to your Local S3!' },
  {
    Key: 'configs/app-config.json',
    Body: JSON.stringify({ version: '1.0.0', theme: 'dark' }),
  },
  {
    Key: 'logs/error.log',
    Body: 'Error: Something went wrong at ' + new Date().toISOString(),
  },
  {
    Key: 'logs/access.log',
    Body: 'User logged in at ' + new Date().toISOString(),
  },
  { Key: 'images/profile.jpg', Body: '(fake image binary data)' },
  { Key: 'images/banner.png', Body: '(fake image binary data request)' },
  {
    Key: 'data/users.csv',
    Body: 'id,name,email\n1,John,john@example.com\n2,Jane,jane@example.com',
  },
  {
    Key: 'notes/todo.md',
    Body: '# Todo List\n- [x] Setup S3\n- [ ] Build App',
  },
  {
    Key: 'backup/db-dump.sql',
    Body: 'INSERT INTO users VALUES (1, "John");',
  },
  {
    Key: 'README.md',
    Body: '# Demo Bucket\nThis bucket is seeded with test data.',
  },
];

export default files;
