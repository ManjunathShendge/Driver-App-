// netlify/functions/submitBooking.js
export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Google Apps Script URL (replace with your actual deployed Web App URL)
    const scriptURL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL";

    // Convert data to query params
    const params = new URLSearchParams(data).toString();

    // Send GET request to Google Apps Script
    const response = await fetch(`${scriptURL}?${params}`, {
      method: "GET",
    });

    const text = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking submitted!", response: text }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting booking", error }),
    };
  }
}
