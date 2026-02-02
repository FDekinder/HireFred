from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import random
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])

# In-memory storage (in production, use a real database)
view_count = {"total": 0, "unique_sessions": set()}
contact_messages = []

# Testimonials data
TESTIMONIALS = [
    {
        "id": 1,
        "quote": "Frederick's WebSocket implementation handled 1,000+ daily sessions flawlessly. Zero data loss.",
        "author": "Tech Lead",
        "company": "Bell Canada",
        "role": "Real-Time Collaboration Project"
    },
    {
        "id": 2,
        "quote": "He reduced our API response times by 40%. The optimization skills are real.",
        "author": "Senior Developer",
        "company": "Bell Canada",
        "role": "Backend Team"
    },
    {
        "id": 3,
        "quote": "80+ features shipped with zero critical incidents. That's not luck, that's skill.",
        "author": "Project Manager",
        "company": "Bell Canada",
        "role": "Network Automation Platform"
    },
    {
        "id": 4,
        "quote": "His AI chatbot reduced support queries by 40% in the pilot phase. Impressive work.",
        "author": "Operations Lead",
        "company": "Bell Canada",
        "role": "Big Data Team"
    },
    {
        "id": 5,
        "quote": "Frederick reviewed 100+ PRs and actually made our code better. Rare find.",
        "author": "Dev Team",
        "company": "Bell Canada",
        "role": "Code Quality Initiative"
    },
]

# Skills with proficiency levels
SKILLS = [
    {"name": "Vue.js 3", "level": 95, "category": "Frontend"},
    {"name": "TypeScript", "level": 90, "category": "Frontend"},
    {"name": "React", "level": 70, "category": "Frontend", "note": "Learning fast!"},
    {"name": "Python", "level": 92, "category": "Backend"},
    {"name": "FastAPI", "level": 90, "category": "Backend"},
    {"name": "Node.js", "level": 85, "category": "Backend"},
    {"name": "PostgreSQL", "level": 88, "category": "Database"},
    {"name": "WebSocket", "level": 90, "category": "Real-Time"},
    {"name": "Git", "level": 95, "category": "Tools"},
    {"name": "Docker", "level": 80, "category": "DevOps"},
]

# Projects showcase
PROJECTS = [
    {
        "id": 1,
        "title": "Real-Time Collaboration System",
        "description": "WebSocket-based node-locking system preventing data conflicts in multi-user workflows",
        "impact": "1,000+ daily sessions with zero data loss",
        "tech": ["WebSocket", "Vue.js 3", "TypeScript", "Python", "FastAPI"]
    },
    {
        "id": 2,
        "title": "Python SDK for Network Automation",
        "description": "Built from scratch for network service automation across multiple client environments",
        "impact": "Reduced manual operations by 60%",
        "tech": ["Python", "REST APIs", "Network Protocols"]
    },
    {
        "id": 3,
        "title": "AI-Powered Support Chatbot",
        "description": "Conversational agent using OpenAI API with prompt engineering and context management",
        "impact": "40% reduction in repetitive support queries",
        "tech": ["OpenAI API", "Vue.js", "JavaScript", "LLM Integration"]
    },
]


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str


class ViewEvent(BaseModel):
    session_id: Optional[str] = None


@router.get("/testimonials")
def get_testimonials(random_order: bool = True):
    """Get testimonials/endorsements - shows dynamic data fetching"""
    testimonials = TESTIMONIALS.copy()
    if random_order:
        random.shuffle(testimonials)
    return {
        "testimonials": testimonials,
        "total": len(testimonials),
        "message": "These are real achievements from my time at Bell Canada!"
    }


@router.get("/testimonials/random")
def get_random_testimonial():
    """Get a single random testimonial - great for rotating quotes"""
    return random.choice(TESTIMONIALS)


@router.get("/skills")
def get_skills(category: Optional[str] = None):
    """Get skills with proficiency levels - shows API filtering"""
    skills = SKILLS.copy()
    if category:
        skills = [s for s in skills if s["category"].lower() == category.lower()]

    return {
        "skills": skills,
        "categories": list(set(s["category"] for s in SKILLS)),
        "average_proficiency": sum(s["level"] for s in skills) / len(skills) if skills else 0
    }


@router.get("/projects")
def get_projects():
    """Get featured projects - demonstrates structured data"""
    return {
        "projects": PROJECTS,
        "total": len(PROJECTS),
        "tech_used": list(set(tech for p in PROJECTS for tech in p["tech"]))
    }


@router.post("/views")
def track_view(event: ViewEvent):
    """Track page views - shows POST endpoint and state management"""
    view_count["total"] += 1

    is_new_visitor = False
    if event.session_id and event.session_id not in view_count["unique_sessions"]:
        view_count["unique_sessions"].add(event.session_id)
        is_new_visitor = True

    return {
        "total_views": view_count["total"],
        "unique_visitors": len(view_count["unique_sessions"]),
        "is_new_visitor": is_new_visitor,
        "message": "Thanks for checking out my application! 👀"
    }


@router.get("/views")
def get_views():
    """Get current view count"""
    return {
        "total_views": view_count["total"],
        "unique_visitors": len(view_count["unique_sessions"]),
        "popularity": "🔥 Hot!" if view_count["total"] > 10 else "📈 Growing!"
    }


def send_contact_email(contact: dict) -> bool:
    """Send email notification for new contact form submission"""
    try:
        smtp_user = os.environ.get("SMTP_USER")
        smtp_pass = os.environ.get("SMTP_PASS")
        recipient_email = "frederick.de.kinder@gmail.com"

        if not smtp_user or not smtp_pass:
            print("SMTP credentials not configured, skipping email")
            return False

        msg = MIMEMultipart()
        msg["From"] = smtp_user
        msg["To"] = recipient_email
        msg["Subject"] = f"New Contact from {contact['name']} - HireFred Portfolio"

        body = f"""
New contact form submission from your portfolio site!

From: {contact['name']}
Email: {contact['email']}
Company: {contact.get('company', 'Not provided')}

Message:
{contact['message']}

---
Submitted at: {contact['submitted_at']}
Reference ID: {contact['id']}
        """

        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


@router.post("/contact")
def submit_contact(message: ContactMessage):
    """Submit a contact message - shows form handling"""
    contact_entry = {
        "id": len(contact_messages) + 1,
        "name": message.name,
        "email": message.email,
        "company": message.company,
        "message": message.message,
        "submitted_at": datetime.now().isoformat(),
        "status": "received"
    }
    contact_messages.append(contact_entry)

    # Send email notification
    email_sent = send_contact_email(contact_entry)

    return {
        "success": True,
        "message": f"Thanks {message.name}! I'll get back to you soon!",
        "reference_id": contact_entry["id"]
    }


@router.get("/messages")
def get_contact_messages():
    """View all received contact messages - your inbox!"""
    return {
        "messages": contact_messages,
        "total": len(contact_messages),
        "unread": len([m for m in contact_messages if m["status"] == "received"])
    }


@router.get("/stats")
def get_portfolio_stats():
    """Get all portfolio stats in one call - shows data aggregation"""
    return {
        "experience": {
            "years": 3,
            "features_shipped": 80,
            "critical_incidents": 0,
            "prs_reviewed": 100,
            "daily_users_served": 1000
        },
        "highlights": [
            "40% faster API response times",
            "50% reduction in query times",
            "60% reduction in manual operations",
            "40% fewer support queries with AI chatbot",
            "95%+ sprint completion rate"
        ],
        "availability": {
            "status": "Available Immediately",
            "work_preferences": ["Hybrid", "Remote", "On-site"],
            "location": "Montreal, QC",
            "languages": ["French (Native)", "English (Professional)"]
        },
        "fun_facts": [
            "I do theatrical improv - debugging is basically 'yes, and...' for code 🎭",
            "Extensive management experience = I know how to ship AND communicate",
            "Zero critical incidents isn't luck, it's attention to detail"
        ]
    }
