let db = global.__db;
if (!db) {
  const seedVolunteers = [
    { id: 'v1', name: 'Ravi Kumar', phone: '+919999900001', skills: ['Food Delivery', 'Logistics'], lat: 28.5355, lng: 77.2642, availability: 'Available', tasks_this_week: 3, reliability_score: 95 },
    { id: 'v2', name: 'Priya Sharma', phone: '+919999900002', skills: ['Medical Aid', 'First Aid'], lat: 28.5562, lng: 77.2025, availability: 'On Task', tasks_this_week: 5, reliability_score: 88 },
    { id: 'v3', name: 'Amit Singh', phone: '+919999900003', skills: ['Shelter Setup'], lat: 28.6139, lng: 77.2090, availability: 'Unavailable', tasks_this_week: 7, reliability_score: 75 },
    { id: 'v4', name: 'Sunita Devi', phone: '+919999900004', skills: ['Food Delivery', 'Education'], lat: 28.6505, lng: 77.2303, availability: 'Available', tasks_this_week: 1, reliability_score: 100 },
    { id: 'v5', name: 'Rohit Verma', phone: '+919999900005', skills: ['Medical Aid', 'Safety'], lat: 28.5823, lng: 77.3267, availability: 'Available', tasks_this_week: 2, reliability_score: 92 },
  ];

  const seedReports = [
    { id: 'r1', reporter_phone: '+918888800001', message_raw: 'Urgent medical help needed near Apollo. 2 people injured.', need_type: 'Medical', location_text: 'Apollo', lat: 28.5355, lng: 77.2842, people_count: 2, urgency: 'High', trust_score: 85, priority_score: 0.85, status: 'pending', created_at: Date.now() - 1000 * 60 * 10 },
    { id: 'r2', reporter_phone: '+918888800002', message_raw: 'Food required for 50 people displaced near Sector 18.', need_type: 'Food', location_text: 'Sector 18', lat: 28.5632, lng: 77.3168, people_count: 50, urgency: 'Medium', trust_score: 70, priority_score: 0.75, status: 'assigned', created_at: Date.now() - 1000 * 60 * 60 },
  ];

  const seedTasks = [
    { id: 't1', report_id: 'r2', volunteer_id: 'v2', assigned_at: Date.now() - 1000 * 60 * 30, deadline: Date.now() + 1000 * 60 * 60 * 2, status: 'In Progress', admin_approved: true },
  ];

  db = global.__db = {
    volunteers: seedVolunteers,
    reports: seedReports,
    tasks: seedTasks,
  };
}

export default db;
