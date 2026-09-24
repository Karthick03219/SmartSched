const API_BASE_URL = "http://127.0.0.1:8000/api";


async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("SmartSched API Request:", url);

  try {
    const response = await fetch(url, {
      ...options,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    console.log(
      "SmartSched API Response:",
      response.status,
      response.statusText
    );

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      throw new Error(
        `Invalid response from Django server. HTTP ${response.status}.`
      );
    }

    if (!response.ok) {
      const message =
        data?.conflicts?.join(" ") ||
        data?.message ||
        data?.error ||
        `API request failed with HTTP ${response.status}.`;

      throw new Error(message);
    }

    return data;

  } catch (error) {
    console.error(
      "SmartSched API Error:",
      error
    );

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot reach Django API at http://127.0.0.1:8000. " +
        "Check that Django is running and that CORS allows http://localhost:5173."
      );
    }

    throw error;
  }
}


export function getDashboardStats() {
  return request("/dashboard/");
}


export function getTimetable() {
  return request("/timetable/");
}


export function generateTimetable() {
  return request("/timetable/generate/", {
    method: "POST",
  });
}