import jsPDF from "jspdf";

export function downloadTripPDF({
  form,
  plan,
  weather,
  nights,
  travelCost,
  travelTime,
  estimatedBudget,
  totalDistanceKm,
  expenses = [],
}) {
  const doc = new jsPDF();

  let y = 20;

  // ===============================
  // Title
  // ===============================

  doc.setFontSize(22);
  doc.text("AI Travel Planner", 20, y);

  y += 12;

  doc.setFontSize(14);
  doc.text(`${form.source} ➜ ${form.destination}`, 20, y);

  y += 10;

  doc.setFontSize(12);

  doc.text(`Days: ${form.days}`, 20, y);
  y += 8;

  doc.text(`Nights: ${nights}`, 20, y);
  y += 8;

  doc.text(`Distance: ${totalDistanceKm} km`, 20, y);
  y += 8;

  doc.text(`Travel Time: ${travelTime.text}`, 20, y);
  y += 8;

  doc.text(`Travel Cost: ₹${travelCost}`, 20, y);
  y += 8;

  doc.text(`Estimated Budget: ₹${estimatedBudget}`, 20, y);

  y += 15;

  // ===============================
  // Weather
  // ===============================

  if (weather) {

    doc.setFontSize(16);
    doc.text("Weather", 20, y);

    y += 10;

    doc.setFontSize(12);

    doc.text(`Temperature: ${weather.tempC} °C`, 20, y);
    y += 8;

    doc.text(`Wind Speed: ${weather.windKmh} km/h`, 20, y);

    y += 15;
  }

  // ===============================
  // Places
  // ===============================

  if (plan?.places?.length) {

    doc.setFontSize(16);
    doc.text("Places to Visit", 20, y);

    y += 10;

    doc.setFontSize(12);

    plan.places.forEach((place) => {

      const name =
        typeof place === "string"
          ? place
          : place.name;

      doc.text(`• ${name}`, 25, y);

      y += 7;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

    });

    y += 8;
  }

  // ===============================
  // Hotels
  // ===============================

  if (plan?.hotels?.length) {

    doc.setFontSize(16);
    doc.text("Hotels", 20, y);

    y += 10;

    doc.setFontSize(12);

    plan.hotels.forEach((hotel) => {

      if (typeof hotel === "string") {

        doc.text(`• ${hotel}`, 25, y);

        y += 7;

      } else {

        doc.text(`${hotel.category}`, 25, y);

        y += 7;

        hotel.suggestions.forEach((h) => {

          doc.text(`   • ${h}`, 30, y);

          y += 7;

        });

        y += 4;
      }

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

    });

    y += 8;
  }

  // ===============================
  // Expense Summary
  // ===============================

  if (expenses.length) {

    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(16);
    doc.text("Expense Summary", 20, y);

    y += 10;

    const totalSpent = expenses.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const remaining = estimatedBudget - totalSpent;

    doc.setFontSize(12);

    doc.text(`Total Spent: ₹${totalSpent}`, 20, y);

    y += 8;

    doc.text(`Remaining Budget: ₹${remaining}`, 20, y);

    y += 12;

    expenses.forEach((expense) => {

      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(
        `• ${expense.category} - ₹${expense.amount}${
          expense.note ? ` (${expense.note})` : ""
        }`,
        25,
        y
      );

      y += 7;

    });

    y += 8;
  }

  // ===============================
  // Itinerary
  // ===============================

  if (plan?.itinerary?.length) {

    doc.setFontSize(16);
    doc.text("Day-wise Itinerary", 20, y);

    y += 10;

    plan.itinerary.forEach((day) => {

      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.text(`Day ${day.day}`, 20, y);

      y += 8;

      if (day.theme) {

        doc.setFontSize(12);

        doc.text(day.theme, 25, y);

        y += 8;
      }

      day.activities.forEach((activity) => {

        const line =
          typeof activity === "string"
            ? activity
            : `${activity.time} - ${activity.description}`;

        const lines = doc.splitTextToSize(line, 160);

        doc.text(lines, 30, y);

        y += lines.length * 6 + 3;

        if (y > 260) {
          doc.addPage();
          y = 20;
        }

      });

      y += 8;

    });

  }

  doc.save(
    `${form.destination.replace(/\s+/g, "_")}_Trip_Plan.pdf`
  );
}