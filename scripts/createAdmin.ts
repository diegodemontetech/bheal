import { createAdminUser } from '../src/lib/createAdminUser';

async function main() {
  const result = await createAdminUser();
  if (result.success) {
    console.log('Admin user created successfully');
  } else {
    console.error('Failed to create admin user:', result.error);
  }
}

main();