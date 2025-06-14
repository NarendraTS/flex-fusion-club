
// Session booking page (form only, logic to be added)
import React from "react";
export default function SessionsPage() {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Book Gym Session</h1>
      <form className="space-y-4">
        <input className="border p-2 w-full" placeholder="Member Name" />
        <input className="border p-2 w-full" placeholder="Class" />
        <input className="border p-2 w-full" placeholder="Date & Time" type="datetime-local" />
        <button type="submit" className="bg-blue-600 px-4 py-2 text-white rounded">Book</button>
      </form>
    </div>
  );
}
