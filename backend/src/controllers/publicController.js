const { BlogPost, Event, Testimony, Service } = require('../models');

/**
 * Get association history
 */
const getHistory = async (req, res) => {
  try {
    // Static content - can be stored in database or returned directly
    const history = {
      founded: '2012',
      description: 'Mehbere Edomias is a registered spiritual association of the Ethiopian Orthodox Tewahdo Church — a community of believers committed to living the ancient faith with modern intentionality.',
      mission: 'To provide a spiritually nourishing environment for Ethiopian Orthodox Tewahdo Christians - celebrating the sacraments, observing the fasting calendar, supporting one another in faith, and serving our broader community with love and humility.',
      vision: 'A vibrant, intergenerational community where Orthodox faith is lived deeply, Ethiopian heritage is honored proudly, and every member grows in holiness - a light to our city and a blessing to all who encounter us.',
      values: [
        { title: 'Faith', description: 'Rooted in the ancient tradition of the Ethiopian Orthodox Church' },
        { title: 'Community', description: 'Supporting each other in spiritual and everyday life' },
        { title: 'Service', description: 'Reaching out to those in need with love and compassion' },
      ],
      timeline: [
        { year: '2012', event: 'Association founded by a group of devoted Orthodox Christians' },
        { year: '2014', event: 'First community outreach program launched' },
        { year: '2016', event: 'Youth spiritual seminar series established' },
        { year: '2018', event: 'Expanded to serve multiple regions' },
        { year: '2020', event: 'Launched digital outreach during pandemic' },
        { year: '2024', event: 'Community center established in Addis Ababa' },
      ],
    };
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get services from database
 */
const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get what we do
 */
const getWhatWeDo = async (req, res) => {
  try {
    const activities = [
      {
        id: '1',
        title: 'Spiritual Formation',
        description: 'Teaching Orthodox faith through Bible study, theology classes, and spiritual mentorship',
        type: 'spiritual',
        impact: '200+ members trained',
      },
      {
        id: '2',
        title: 'Community Service',
        description: 'Supporting vulnerable communities through food distribution, medical aid, and social services',
        type: 'social',
        impact: '500+ families reached',
      },
      {
        id: '3',
        title: 'Youth Programs',
        description: 'Empowering youth through education, leadership training, and spiritual guidance',
        type: 'spiritual',
        impact: '100+ youth engaged',
      },
      {
        id: '4',
        title: 'Fundraising',
        description: 'Organizing events to support association activities and community projects',
        type: 'fundraising',
        impact: 'ETB 100,000+ raised',
      },
    ];
    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get contact information
 */
const getContactInfo = async (req, res) => {
  try {
    const contact = {
      phone: '+251 9XX XXX XXX',
      email: 'info@mehbereedomias.org',
      address: {
        street: 'Bole Sub-City, Woreda 03',
        city: 'Addis Ababa',
        country: 'Ethiopia',
        landmark: 'Near St. Gabriel Church',
      },
      hours: {
        weekday: 'Mon-Fri, 9 AM – 5 PM',
        weekend: 'Sat-Sun, Closed',
      },
      social: {
        facebook: 'https://facebook.com/mehbereedomias',
        instagram: 'https://instagram.com/mehbereedomias',
        youtube: 'https://youtube.com/mehbereedomias',
        telegram: 'https://t.me/mehbereedomias',
      },
    };
    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Submit contact form
 */
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    // Here you can send an email notification to admin
    // await sendContactEmail(name, email, phone, subject, message);

    res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get approved testimonies
 */
const getTestimonies = async (req, res) => {
  try {
    // For now, return static testimonies
    // In production, fetch from database
    const testimonies = [
      {
        id: '1',
        title: 'A Life Transformed',
        content: 'Finding peace and purpose through this community has changed my life completely.',
        author: 'Selamawit H.',
        category: 'spiritual',
        date: '2024-01-15',
        likes: 12,
      },
      {
        id: '2',
        title: 'Healing and Restoration',
        content: 'Through the prayers and support of this community, I experienced God\'s healing.',
        author: 'Tesfaye B.',
        category: 'healing',
        date: '2024-02-20',
        likes: 8,
      },
    ];
    res.status(200).json({
      success: true,
      data: testimonies,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all homepage data in one request
 */
const getHomepageData = async (req, res) => {
  try {
    // Get featured blog posts
    const featuredBlogs = await BlogPost.find({ 
      status: 'published', 
      isFeatured: true 
    })
      .populate('authorId', '-password')
      .sort({ createdAt: -1 })
      .limit(3);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      status: 'upcoming',
      isPublic: true,
    })
      .sort({ date: 1 })
      .limit(3);

    // Get testimonies
    const testimonies = [
      {
        id: '1',
        title: 'A Life Transformed',
        content: 'Finding peace and purpose through this community has changed my life completely.',
        author: 'Selamawit H.',
      },
    ];

    // Association summary
    const summary = {
      established: '2012',
      members: '200+',
      events: '50+',
      outreach: '500+ families served',
    };

    res.status(200).json({
      success: true,
      data: {
        summary,
        featuredBlogs,
        upcomingEvents,
        testimonies,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getHistory,
  getServices,
  getWhatWeDo,
  getContactInfo,
  submitContact,
  getTestimonies,
  getHomepageData,
};