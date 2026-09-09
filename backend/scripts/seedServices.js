// backend/scripts/seedServices.js
const mongoose = require('mongoose');
const { Service } = require('../models'); // Use index file instead

const seedServices = async () => {
  try {
    // Connect to MongoDB - use your actual connection string
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/edomias';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('🗑️ Cleared existing services');

    const services = [
      {
        title: 'Divine Liturgy',
        description: 'Weekly Qiddase (Holy Eucharist) celebrated with reverence and tradition.',
        schedule: 'Every Sunday, 6:00 AM - 9:00 AM',
        icon: '⛪',
        type: 'Liturgy',
        isActive: true,
        order: 1,
      },
      {
        title: 'Fasting Observance',
        description: "Observing the Church's 250+ fasting days as a community.",
        schedule: 'Wednesdays & Fridays, and major fasting seasons',
        icon: '🕯️',
        type: 'Fasting',
        isActive: true,
        order: 2,
      },
      {
        title: 'Feast Days Celebrations',
        description: 'Celebrating the rich calendar of Ethiopian Orthodox feasts.',
        schedule: 'As per Orthodox calendar',
        icon: '🎊',
        type: 'Feast Days',
        isActive: true,
        order: 3,
      },
      {
        title: 'Community Outreach',
        description: 'Serving the poor and marginalized as an act of faith.',
        schedule: 'Monthly, as scheduled',
        icon: '🤲',
        type: 'Outreach',
        isActive: true,
        order: 4,
      },
    ];

    for (const service of services) {
      await Service.create(service);
      console.log(`✅ Created service: ${service.title}`);
    }

    console.log('🎉 Services seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    process.exit(1);
  }
};

seedServices();