# 🌉 Sevasetu - NGO Community Service Platform

**Version 2.0 - Complete Rebranding & Feature Upgrade**

## Overview
Sevasetu is a comprehensive platform that bridges communities with volunteer support, disaster relief, and community services. The platform enables seamless communication through WhatsApp, efficient volunteer management, and real-time location-based analytics.

---

## ✨ Key Features

### 🏠 **Public Landing Page**
- Redesigned home page with NGO branding (Sevasetu instead of VolunteerIQ)
- Feature highlights for different user types
- Quick access buttons for all key sections
- Professional UI with gradient backgrounds and icons

### 💬 **WhatsApp Integration**
- Chat-based query submission directly from WhatsApp
- Real-time message processing and categorization
- Webhook API to receive messages (`/api/whatsapp/webhook`)
- Smart volunteer matching based on message content
- Location extraction and priority scoring
- Message history view with status indicators

### 📝 **Public Query Submission**
- No login required for submitting issues
- Form fields: Name, Phone, Email, Issue Type, Location, Description
- Issue categorization (Medical, Food, Education, Shelter, Safety)
- Urgency level selection
- Real-time processing and volunteer assignment

### 🔐 **Admin Authentication**
- Secure login system for administrators
- Demo credentials: `admin@sevasetu.org` / `admin123`
- Session management with localStorage tokens
- Protected dashboard routes

### 📊 **Advanced Admin Dashboard**
Includes multiple views:

#### 1. **Live Heatmap View**
- Real-time map visualization of reports
- Critical zone highlighting
- Volunteer location tracking
- Live statistics cards (Critical Zones, Reports, Resolved Issues, Active Volunteers, Pending Approvals)

#### 2. **Active Tasks**
- Table view of all active tasks
- Task ID, Location, Issue Type, Assigned Volunteer
- Status and Urgency indicators
- Approval/Rejection actions
- Search and filter capabilities

#### 3. **Volunteer Network**
- Volunteer cards with profile information
- Skill badges
- Availability status (Available/On Task/Unavailable)
- Reliability score with visual progress bars
- Fatigue level indicators
- Task count and performance metrics

#### 4. **Location Analytics**
- Reports by location
- Geographic distribution charts
- Issue type breakdown by area
- Area-wise volunteer allocation
- Hotspot identification

#### 5. **Statistics & Analytics**
- Key metrics display
- Total reports received
- Issues resolved count
- Active volunteer count
- Resolution rate tracking

### 🙋 **Volunteer Portal**
- **Registration Form**: Skills, service area, availability
- **Profile Management**: View and update volunteer information
- **Active Tasks**: Current assignments with directions
- **Statistics Dashboard**: Completed tasks, people helped, reliability score, volunteer hours
- **Task Execution**: Mark tasks complete or escalate issues
- **Google Maps Integration**: Get directions to task location

---

## 🗺️ **User Roles & Workflows**

### 1. **General Public (No Login Required)**
```
Home Page → Report Issue → Form Submission → Get Notification
         OR WhatsApp → Send Message → Auto Processing → Get Help
```

### 2. **Volunteers**
```
Home Page → Register/Login → View Tasks → Execute → Report Status
```

### 3. **Administrators**
```
Login → Dashboard → View Reports/Tasks/Volunteers → Manage Resources
     → Analytics → Location Insights → Deploy Volunteers
```

---

## 🔧 **Technical Stack**

- **Framework**: Next.js 16.2.4 with App Router
- **UI Library**: React 19.2.4 with Tailwind CSS
- **Maps**: Leaflet & React Leaflet
- **State Management**: Zustand
- **Charts**: Recharts (for future analytics)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **API**: RESTful with webhook support

---

## 📁 **Project Structure**

```
volunteer-iq/
├── src/
│   ├── app/
│   │   ├── page.js                 # Landing page (Sevasetu home)
│   │   ├── layout.js               # Root layout
│   │   ├── globals.css             # Global styling
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── page.js         # Admin login page
│   │   ├── dashboard/
│   │   │   └── page.js             # Admin control panel
│   │   ├── volunteer/
│   │   │   └── page.js             # Volunteer portal with registration
│   │   ├── whatsapp/
│   │   │   └── page.js             # WhatsApp chat interface
│   │   ├── query/
│   │   │   └── new/
│   │   │       └── page.js         # Public query form
│   │   └── api/
│   │       ├── data/
│   │       │   └── route.js        # Main data API
│   │       └── whatsapp/
│   │           └── webhook/
│   │               └── route.js    # WhatsApp webhook
│   ├── components/
│   │   └── MapUI.js                # Map component
│   └── lib/
│       └── store.js                # In-memory database
├── package.json
├── next.config.mjs
└── README.md
```

---

## 🚀 **Getting Started**

### Installation
```bash
cd volunteer-iq
npm install
```

### Running Locally
```bash
npm run dev
```
Access at: **http://localhost:3000**

### Testing with Demo Data
- **Home Page**: http://localhost:3000
- **Report Issue**: http://localhost:3000/query/new
- **WhatsApp Chat**: http://localhost:3000/whatsapp
- **Admin Login**: http://localhost:3000/auth/login
  - Email: `admin@sevasetu.org`
  - Password: `admin123`
- **Volunteer Portal**: http://localhost:3000/volunteer

---

## 📡 **API Endpoints**

### GET `/api/data`
Returns all reports, volunteers, and tasks

### POST `/api/data`
Submit a new report/query
```json
{
  "rawData": "Issue description",
  "hasImage": false,
  "source": "WhatsApp|Public Query|Official Survey"
}
```

### PUT `/api/data`
Update task status
```json
{
  "taskId": "t123456",
  "action": "complete|escalate"
}
```

### POST `/api/whatsapp/webhook`
Receive messages from WhatsApp Business API
```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "1234567890",
          "text": { "body": "message content" }
        }]
      }
    }]
  }]
}
```

---

## 🎯 **Key Improvements in v2.0**

✅ **Complete Rebranding**: From VolunteerIQ to Sevasetu
✅ **Enhanced Landing Page**: Professional NGO branding
✅ **Public Accessibility**: No login required for reporting issues
✅ **WhatsApp Integration**: Direct messaging support
✅ **Volunteer Registration**: Self-service signup with skills
✅ **Admin Authentication**: Secure login system
✅ **Location Analytics**: Geographic insights and hotspot detection
✅ **Better Statistics**: Comprehensive volunteer and task metrics
✅ **Improved UI/UX**: Modern design with Tailwind CSS
✅ **Mobile Responsive**: Works on all devices

---

## 🔐 **Demo Credentials**

**Admin Account:**
- Email: `admin@sevasetu.org`
- Password: `admin123`

---

## 🌟 **Future Enhancements**

- Real WhatsApp Business API integration
- SMS notifications for users
- Advanced analytics with Recharts
- Real-time notifications with WebSockets
- Offline mode support
- Multi-language support (Hindi, English, etc.)
- Payment integration for donations
- Volunteer certification program

---

## 📝 **License**

This project is developed for community service purposes.

---

## 👥 **Support**

For issues, feature requests, or questions, please contact the development team.

**Built with ❤️ for communities in need**
