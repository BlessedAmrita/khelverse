//apts\frontend\src\app\api\create-meet\route.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const accessToken = authHeader.split(' ')[1];
    const body = await req.json();
    const { title, description, date, time, athleteEmail } = body;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    const eventStartTime = new Date(`${date}T${time}`);
    const eventEndTime = new Date(eventStartTime.getTime() + 60 * 60 * 1000); // 1 hour session

    const event = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        description,
        start: { dateTime: eventStartTime.toISOString() },
        end: { dateTime: eventEndTime.toISOString() },
        attendees: [{ email: athleteEmail }],
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      },
    });

    const meetLink = event.data?.hangoutLink;
    return NextResponse.json({ meetLink }, { status: 200 });

  } catch (error) {
    console.error('Google Calendar Error:', error);
    return NextResponse.json({ detail: 'Failed to create event' }, { status: 500 });
  }
}
