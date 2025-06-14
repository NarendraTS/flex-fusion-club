
.
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── DashboardCards.tsx
│   │   ├── MemberList.tsx
│   │   ├── TrainerRoster.tsx
│   │   ├── SessionTable.tsx
│   │   ├── BookingForm.tsx
│   │   ├── EquipmentTable.tsx
│   │   └── forms/
│   │      ├── AddTrainerForm.tsx
│   │      ├── AddMemberForm.tsx
│   │      ├── ScheduleSessionForm.tsx
│   │      └── RegisterPaymentForm.tsx
│   ├── pages/
│   │   ├── dashboard.tsx
│   │   ├── members/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── trainers/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── classes/
│   │   │   ├── index.tsx
│   │   │   └── booking.tsx
│   │   ├── sessions/
│   │   │   └── index.tsx
│   │   ├── equipment/
│   │   │   └── index.tsx
│   │   ├── payments/
│   │   │   └── index.tsx
│   │   └── settings.tsx
│   └── App.tsx

# Sample Sidebar.tsx
import { Home, Users, Calendar, List, Settings } from "lucide-react";
export default function Sidebar() {
  return (
    <nav className="bg-sidebar w-60 min-h-screen px-4 py-8">
      <div className="text-xl font-bold mb-6">GymManage</div>
      <ul className="space-y-4">
        <li><a href="/dashboard" className="flex items-center"><Home className="mr-2" /> Dashboard</a></li>
        <li><a href="/members" className="flex items-center"><Users className="mr-2" /> Members</a></li>
        <li><a href="/trainers" className="flex items-center"><List className="mr-2" /> Trainers</a></li>
        <li><a href="/classes" className="flex items-center"><Calendar className="mr-2" /> Classes</a></li>
        <li><a href="/sessions" className="flex items-center"><List className="mr-2" /> Sessions</a></li>
        <li><a href="/equipment" className="flex items-center"><List className="mr-2" /> Equipment</a></li>
        <li><a href="/payments" className="flex items-center"><List className="mr-2" /> Payments</a></li>
        <li><a href="/settings" className="flex items-center"><Settings className="mr-2" /> Settings</a></li>
      </ul>
    </nav>
  );
}

# Sample DashboardCards.tsx
export default function DashboardCards({ kpis }: { kpis: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-6">
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-lg">Active Members</div>
        <div className="text-3xl font-bold">{kpis.members}</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-lg">Upcoming Sessions</div>
        <div className="text-3xl font-bold">{kpis.upcomingSessions}</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-lg">Revenue (₹)</div>
        <div className="text-3xl font-bold">{kpis.revenue}</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-lg">Trainers</div>
        <div className="text-3xl font-bold">{kpis.trainers}</div>
      </div>
    </div>
  );
}

# Sample MemberList.tsx
export default function MemberList({ members }: { members: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-2">Members</h2>
      <table className="w-full text-left">
        <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t"><td>{m.name}</td><td>{m.email}</td><td>{m.phone}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
