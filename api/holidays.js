export default async function handler(req, res) {
  try {
    const url = 'https://calendar.google.com/calendar/ical/ko.south_korea%23holiday%40group.v.calendar.google.com/public/basic.ics';
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).send('');
      return;
    }

    const text = await response.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.status(200).send(text);
  } catch (error) {
    res.status(500).send('');
  }
}
