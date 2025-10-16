const { User, Campaign } = require('../models');

const seedData = async () => {
  try {
    console.log('Checking if seed data is needed...');

    // Check if admin user exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      console.log('Creating default admin user...');
      await User.create({
        username: 'admin',
        email: 'admin@cyberwave.com',
        password: 'Admin123!',
        role: 'admin',
        points: 0
      });
      console.log('Admin user created: admin@cyberwave.com / Admin123!');
    }

    // Check if sample campaigns exist
    const campaignCount = await Campaign.count();
    
    if (campaignCount === 0) {
      console.log('Creating sample campaigns...');
      
      const adminUser = await User.findOne({ where: { role: 'admin' } });
      
      await Campaign.create({
        title: 'Email Phishing Basics',
        description: 'Learn to identify common email phishing attacks',
        type: 'email',
        difficulty: 'beginner',
        content: {
          questions: [
            {
              id: 1,
              from: 'Security Team',
              email: 'security@company-verify.com',
              subject: 'URGENT: Verify Your Account',
              body: 'Your account has been compromised. Click to verify.',
              correct: 'phishing'
            }
          ]
        },
        created_by: adminUser.id,
        is_active: true
      });

      await Campaign.create({
        title: 'SMS Phishing Detection',
        description: 'Recognize smishing attacks via text messages',
        type: 'sms',
        difficulty: 'beginner',
        content: {
          messages: [
            {
              id: 1,
              from: '+1-555-0123',
              text: 'Your package delivery failed. Click here to reschedule.',
              correct: 'phishing'
            }
          ]
        },
        created_by: adminUser.id,
        is_active: true
      });

      console.log('Sample campaigns created successfully');
    }

    console.log('Seed data initialization complete');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
