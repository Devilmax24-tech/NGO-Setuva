import { NextResponse } from 'next/server';
import db from '@/lib/store';

// WhatsApp Message Handler
// This route receives messages from WhatsApp Business API webhook
// For now, we simulate receiving messages

export async function POST(req) {
  const body = await req.json();

  // If this is a webhook verification from WhatsApp
  if (body.hub?.verify_token) {
    const token = body.hub.verify_token;
    const challenge = body.hub.challenge;
    if (token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return NextResponse.json(challenge);
    }
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
  }

  // Handle incoming messages
  if (body.entry) {
    body.entry.forEach(entry => {
      entry.changes?.forEach(change => {
        if (change.value?.messages) {
          change.value.messages.forEach(message => {
            const phoneNumber = message.from;
            const messageText = message.text?.body || '[Image/Media]';
            const timestamp = message.timestamp;

            // Create a new report from WhatsApp message
            const newReport = {
              id: 'r' + Date.now(),
              message_raw: messageText,
              source: 'WhatsApp',
              phone_number: phoneNumber,
              need_type: 'Other',
              location_text: 'WhatsApp Reported',
              lat: 28.6 + (Math.random() * 0.1),
              lng: 77.2 + (Math.random() * 0.1),
              people_count: 1,
              urgency: 'Medium',
              trust_score: 60,
              priority_score: 0.5,
              status: 'pending',
              created_at: timestamp * 1000 || Date.now()
            };

            db.reports.push(newReport);
          });
        }
      });
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'No valid webhook data' }, { status: 400 });
}

export async function GET(req) {
  // Get all WhatsApp messages
  const whatsappReports = db.reports.filter(r => r.source === 'WhatsApp');
  return NextResponse.json(whatsappReports);
}
