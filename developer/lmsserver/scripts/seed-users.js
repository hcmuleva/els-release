#!/usr/bin/env node

/**
 * Seed Users Script for Strapi LMS
 * This script creates users for all roles with proper naming
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'harish@emeelan.com';
const ADMIN_PASSWORD = 'Welcome@123';

// Seed data for different roles with Indian names with Indian names
const seedUsers = [
    // Superadmin users
    {
        username: 'superadmin1',
        email: 'superadmin1@emeelan.com',
        password: 'welcome123',
        userRole: 'superadmin',
        firstName: 'Rajesh',
        lastName: 'Kumar',
    },
    {
        username: 'superadmin2',
        email: 'superadmin2@emeelan.com',
        password: 'welcome123',
        userRole: 'superadmin',
        firstName: 'Priya',
        lastName: 'Sharma',
    },

    // Admin users
    {
        username: 'admin1',
        email: 'admin1@emeelan.com',
        password: 'welcome123',
        userRole: 'admin',
        firstName: 'Amit',
        lastName: 'Patel',
    },
    {
        username: 'admin2',
        email: 'admin2@emeelan.com',
        password: 'welcome123',
        userRole: 'admin',
        firstName: 'Sneha',
        lastName: 'Reddy',
    },
    {
        username: 'admin3',
        email: 'admin3@emeelan.com',
        password: 'welcome123',
        userRole: 'admin',
        firstName: 'Vikram',
        lastName: 'Singh',
    },

    // Teacher users
    {
        username: 'teacher1',
        email: 'teacher1@emeelan.com',
        password: 'welcome123',
        userRole: 'teacher',
        firstName: 'Kavita',
        lastName: 'Deshmukh',
    },
    {
        username: 'teacher2',
        email: 'teacher2@emeelan.com',
        password: 'welcome123',
        userRole: 'teacher',
        firstName: 'Ramesh',
        lastName: 'Gupta',
    },
    {
        username: 'teacher3',
        email: 'teacher3@emeelan.com',
        password: 'welcome123',
        userRole: 'teacher',
        firstName: 'Anjali',
        lastName: 'Nair',
    },
    {
        username: 'teacher4',
        email: 'teacher4@emeelan.com',
        password: 'welcome123',
        userRole: 'teacher',
        firstName: 'Suresh',
        lastName: 'Menon',
    },
    {
        username: 'teacher5',
        email: 'teacher5@emeelan.com',
        password: 'welcome123',
        userRole: 'teacher',
        firstName: 'Deepa',
        lastName: 'Iyer',
    },

    // Student users
    {
        username: 'student1',
        email: 'student1@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Arjun',
        lastName: 'Mehta',
    },
    {
        username: 'student2',
        email: 'student2@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Ananya',
        lastName: 'Joshi',
    },
    {
        username: 'student3',
        email: 'student3@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Rohan',
        lastName: 'Kapoor',
    },
    {
        username: 'student4',
        email: 'student4@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Ishita',
        lastName: 'Verma',
    },
    {
        username: 'student5',
        email: 'student5@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Aditya',
        lastName: 'Chopra',
    },
    {
        username: 'student6',
        email: 'student6@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Riya',
        lastName: 'Pandey',
    },
    {
        username: 'student7',
        email: 'student7@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Karthik',
        lastName: 'Rao',
    },
    {
        username: 'student8',
        email: 'student8@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Pooja',
        lastName: 'Agarwal',
    },
    {
        username: 'student9',
        email: 'student9@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Varun',
        lastName: 'Malhotra',
    },
    {
        username: 'student10',
        email: 'student10@emeelan.com',
        password: 'welcome123',
        userRole: 'student',
        firstName: 'Divya',
        lastName: 'Krishnan',
    },

    // Parent users
    {
        username: 'parent1',
        email: 'parent1@emeelan.com',
        password: 'welcome123',
        userRole: 'parent',
        firstName: 'Mahesh',
        lastName: 'Mehta',
    },
    {
        username: 'parent2',
        email: 'parent2@emeelan.com',
        password: 'welcome123',
        userRole: 'parent',
        firstName: 'Sunita',
        lastName: 'Joshi',
    },
    {
        username: 'parent3',
        email: 'parent3@emeelan.com',
        password: 'welcome123',
        userRole: 'parent',
        firstName: 'Prakash',
        lastName: 'Kapoor',
    },
    {
        username: 'parent4',
        email: 'parent4@emeelan.com',
        password: 'welcome123',
        userRole: 'parent',
        firstName: 'Meera',
        lastName: 'Verma',
    },
    {
        username: 'parent5',
        email: 'parent5@emeelan.com',
        password: 'welcome123',
        userRole: 'parent',
        firstName: 'Sanjay',
        lastName: 'Chopra',
    },
];

/**
 * Get admin JWT token
 * Note: This user must have appropriate permissions to update other users
 */
async function getAdminToken() {
    try {
        console.log('   Attempting to login to get token...');
        const payload = {
            identifier: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
        };
        
        const response = await axios.post(`${STRAPI_URL}/api/auth/local`, payload);

        // Strapi v5 returns JWT directly in response.data.jwt
        const token = response.data.jwt;
        
        if (!token) {
            console.error('❌ No JWT token in response');
            console.log('   Response structure:', JSON.stringify(response.data, null, 2));
            return null;
        }

        console.log('   ✅ Login successful, token obtained');
        return token;
    } catch (error) {
        console.error('❌ Failed to get token:', error.response?.data?.error?.message || error.message);
        console.log('   Make sure you have created a user account with these credentials:');
        console.log(`   Email/Username: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log('\n   ⚠️  IMPORTANT: This user needs "Super Admin" role or permissions to update other users!\n');
        return null;
    }
}

/**
 * Update user with custom fields
 */
async function updateUserFields(userId, userData, adminToken) {
    try {
        await axios.put(
            `${STRAPI_URL}/api/users/${userId}`,
            {
                firstName: userData.firstName,
                lastName: userData.lastName,
                userRole: userData.userRole,
            },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );
        return true;
    } catch (error) {
        console.error(`   ⚠️  Failed to update custom fields:`, error.response?.data?.error?.message || error.message);
        return false;
    }
}

/**
 * Register a user via Strapi API
 */
async function registerUser(user, adminToken) {
    try {
        // Step 1: Register user with basic fields only
        const response = await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
            username: user.username,
            email: user.email,
            password: user.password,
        });

        const userData = response.data.user;

        // Step 2: Update user with custom fields
        if (adminToken && userData.id) {
            const updated = await updateUserFields(userData.id, user, adminToken);
            if (updated) {
                console.log(`✅ Created user: ${user.username} (${user.firstName} ${user.lastName}) - Role: ${user.userRole}`);
            } else {
                console.log(`⚠️  Created user: ${user.username} but custom fields not set`);
            }
        } else {
            console.log(`✅ Created user: ${user.username} (without custom fields - no admin token)`);
        }

        return response.data;
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('already taken')) {
            console.log(`⚠️  User already exists: ${user.username}`);

            // Try to update existing user's custom fields if we have admin token
            if (adminToken) {
                try {
                    // Get user by username to find their ID
                    const usersResponse = await axios.get(
                        `${STRAPI_URL}/api/users?filters[username][$eq]=${user.username}`,
                        {
                            headers: {
                                Authorization: `Bearer ${adminToken}`,
                            },
                        }
                    );

                    if (usersResponse.data && usersResponse.data.length > 0) {
                        const existingUser = usersResponse.data[0];
                        const updated = await updateUserFields(existingUser.id, user, adminToken);
                        if (updated) {
                            console.log(`   ✅ Updated custom fields for existing user`);
                        }
                    }
                } catch (updateError) {
                    console.log(`   ⚠️  Could not update existing user's custom fields`);
                }
            }

            return null;
        } else {
            console.error(`❌ Error creating user ${user.username}:`, error.response?.data?.error?.message || error.message);
            return null;
        }
    }
}

/**
 * Main seed function
 */
async function seedData() {
    console.log('🌱 Starting seed process...\n');
    console.log(`📍 Strapi URL: ${STRAPI_URL}\n`);

    // Get admin token for updating custom fields
    console.log('🔑 Getting admin token...');
    const adminToken = await getAdminToken();

    if (!adminToken) {
        console.log('❌ Cannot proceed without admin token.');
        console.log('   Please create an admin account first at: http://localhost:1337/admin');
        console.log('   Then update ADMIN_EMAIL and ADMIN_PASSWORD in this script.\n');
        return;
    }

    console.log('✅ Admin token obtained\n');

    let successCount = 0;
    let existingCount = 0;
    let errorCount = 0;

    for (const user of seedUsers) {
        const result = await registerUser(user, adminToken);

        if (result) {
            successCount++;
        } else if (result === null) {
            existingCount++;
        } else {
            errorCount++;
        }

        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Seed Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully created: ${successCount} users`);
    console.log(`⚠️  Already existing: ${existingCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📝 Total processed: ${seedUsers.length} users`);
    console.log('='.repeat(60));

    console.log('\n🎯 User Breakdown by Role:');
    const roleCounts = seedUsers.reduce((acc, user) => {
        acc[user.userRole] = (acc[user.userRole] || 0) + 1;
        return acc;
    }, {});

    Object.entries(roleCounts).forEach(([role, count]) => {
        console.log(`   ${role}: ${count} users`);
    });

    console.log('\n💡 You can now login with any of these credentials:');
    console.log('   Username: student1, Password: welcome123');
    console.log('   Username: teacher1, Password: welcome123');
    console.log('   Username: admin1, Password: welcome123');
    console.log('   etc...\n');
}

// Run the seed script
seedData()
    .then(() => {
        console.log('✨ Seed process completed!\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Fatal error during seed process:', error);
        process.exit(1);
    });
