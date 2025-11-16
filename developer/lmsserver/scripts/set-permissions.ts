export default async () => {
  const AUTH_ROLE_ID = 1;   // authenticated admin role
  const PUBLIC_ROLE_ID = 2; // public admin role

  console.log("Fetching admin permissions…");

  // Get all admin permissions
  const permissions = await strapi.db.query("admin::permission").findMany();
  console.log(`Found ${permissions.length} permissions`);

  // Update permissions for Authenticated role
  console.log(`Assigning permissions to role ${AUTH_ROLE_ID}`);

  await strapi.db.query("admin::permission").updateMany({
    where: {},
    data: {
      role: AUTH_ROLE_ID
    }
  });

  // Update permissions for Public role
  console.log(`Assigning permissions to role ${PUBLIC_ROLE_ID}`);

  await strapi.db.query("admin::permission").updateMany({
    where: {},
    data: {
      role: PUBLIC_ROLE_ID
    }
  });

  console.log("✔ Permissions updated successfully");
};
