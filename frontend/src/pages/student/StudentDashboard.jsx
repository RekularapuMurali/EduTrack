import React from 'react';
import { mockAssessments, mockActivities, mockSessions } from '../../data/mockData.js';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const latest = mockAssessments[mockAssessments.length - 1];
const radarData = latest.subjects.map(s => ({ subject: s.name, score: s.score, fullMark: 100 }));
const progressData = mockAssessments.map(a => ({ period: a.period, score: a.overallScore }));

const myActivities = mockActivities.slice(0, 3);
const mySessions = mockSessions.filter(s => s.student === 'Arjun Sharma');

const totalPoints = myActivities.reduce((sum, a) => sum + a.points, 0);

const levels = [
  { name: 'Seedling', min: 0, max: 100, icon: '🌱' },
  { name: 'Sapling', min: 100, max: 250, icon: '🌿' },
  { name: 'Sprout', min: 250, max: 400, icon: '🌳' },
  { name: 'Eco Hero', min: 400, max: 600, icon: '🌍' },
];

const currentLevel = levels.find(l => totalPoints >= l.min && totalPoints < l.max) || levels[3];
const nextLevel = levels[levels.indexOf(currentLevel) + 1];

export default function StudentDashboard({ user }) {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl">

      {/* Level Progress (REPLACED ProgressBar) */}
      <div className="bg-white border rounded-xl p-5">
        <div className="flex justify-between mb-3">
          <div className="flex gap-2 items-center">
            <span className="text-2xl">{currentLevel.icon}</span>
            <div>
              <p className="font-bold">{currentLevel.name}</p>
              <p className="text-xs text-gray-500">Current Level</p>
            </div>
          </div>
        </div>

        {/* Progress bar manually */}
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-green-700 h-2 rounded-full"
            style={{
              width: `${((totalPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Charts (REPLACED Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-bold mb-2">My Academic Progress</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#166534" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-bold mb-2">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar dataKey="score" stroke="#166534" fill="#166534" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Activities (REPLACED Card) */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-bold mb-3">My Activities</h3>
        {myActivities.map(a => (
          <div key={a._id} className="flex justify-between p-3 bg-gray-50 rounded mb-2">
            <div>
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-gray-500">{a.date}</p>
            </div>
            <p className="text-green-700 font-bold">+{a.points}</p>
          </div>
        ))}
      </div>

      {/* Sessions (REPLACED Card + Badge) */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-bold mb-3">My Sessions</h3>

        {mySessions.length === 0 ? (
          <p className="text-gray-400">No sessions yet</p>
        ) : (
          mySessions.map(s => (
            <div key={s._id} className="p-3 bg-gray-50 rounded mb-2">
              <div className="flex justify-between">
                <p className="font-medium">Session</p>

                {/* Badge replaced */}
                <span className={`text-xs px-2 py-1 rounded ${
                  s.status === 'completed' ? 'bg-green-100 text-green-700' :
                  s.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {s.status}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {s.date} · {s.time}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}