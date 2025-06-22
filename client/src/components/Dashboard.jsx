import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Filler 
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { format, subDays, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';
import Swal from 'sweetalert2';

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler); // <-- register Filler

export default function Dashboard() {
  const [jobsData, setJobsData] = useState([]);
  const [candidatesData, setCandidatesData] = useState([]);
  const [interviewsData, setInterviewsData] = useState([]);
  const [offerLettersData, setOfferLettersData] = useState([]);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Fetch data from backend APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch Jobs
        const jobsResponse = await fetch(`${baseURL}/api/jobs`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
        const jobs = await jobsResponse.json();
        setJobsData(jobs);

        // Fetch Candidates
        const candidatesResponse = await fetch(`${baseURL}/api/candidates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!candidatesResponse.ok) throw new Error('Failed to fetch candidates');
        const candidates = await candidatesResponse.json();
        setCandidatesData(candidates);

        // Fetch Interviews
        const interviewsResponse = await fetch(`${baseURL}/api/interviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!interviewsResponse.ok) throw new Error('Failed to fetch interviews');
        const interviews = await interviewsResponse.json();
        setInterviewsData(interviews);

        // Fetch Offer Letters
        const offerLettersResponse = await fetch(`${baseURL}/api/offerLetter`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!offerLettersResponse.ok) throw new Error('Failed to fetch offer letters');
        const offerLetters = await offerLettersResponse.json();
        setOfferLettersData(offerLetters);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error fetching dashboard data. Please ensure the backend server is running.',
        });
      }
    };
    fetchData();
  }, [baseURL]);

  // Chart Data and Options
  const jobsChartData = {
    labels: ['Open', 'Closed'],
    datasets: [
      {
        label: 'Job Postings',
        data: [
          jobsData.filter(job => job.status === 'Open').length,
          jobsData.filter(job => job.status === 'Closed').length,
        ],
        backgroundColor: ['#6366f1', '#f3f4f6'],
        borderColor: ['#4338CA', '#D1D5DB'],
        borderWidth: 2,
        borderRadius: 12,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    ],
  };

  const jobsChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#312e81',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#818cf8',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6366f1', font: { weight: 'bold' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e0e7ff' },
        ticks: { stepSize: 1, color: '#6366f1', font: { weight: 'bold' } },
      },
    },
    onClick: () => navigate('/jobs'),
  };

  const candidatesChartData = {
    labels: ['Applied', 'Interviewed', 'Rejected'],
    datasets: [
      {
        label: 'Candidates',
        data: [
          candidatesData.filter(candidate => candidate.status === 'Applied').length,
          candidatesData.filter(candidate => candidate.status === 'Interviewed').length,
          candidatesData.filter(candidate => candidate.status === 'Rejected').length,
        ],
        backgroundColor: [
          'rgba(251,191,36,0.85)',
          'rgba(16,185,129,0.85)',
          'rgba(239,68,68,0.85)'
        ],
        borderColor: [
          'rgba(202,138,4,1)',
          'rgba(5,150,105,1)',
          'rgba(185,28,28,1)'
        ],
        borderWidth: 2,
        hoverOffset: 16,
      },
    ],
  };

  const candidatesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#047857',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#34d399',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
      },
    },
    onClick: () => navigate('/candidates'),
  };

  const today = new Date();
  const past30Days = eachDayOfInterval({ start: subDays(today, 29), end: today });
  const interviewCounts = past30Days.map(date => {
    const startOfDayDate = startOfDay(date).getTime();
    const endOfDayDate = endOfDay(date).getTime();
    return interviewsData.filter(interview => {
      const interviewDateTime = new Date(interview.dateTime).getTime();
      return interviewDateTime >= startOfDayDate && interviewDateTime <= endOfDayDate;
    }).length;
  });

  const interviewsChartData = {
    labels: past30Days.map(date => format(date, 'MMM d')),
    datasets: [
      {
        label: 'Interviews Conducted',
        data: interviewCounts,
        fill: true,
        borderColor: '#a21caf',
        backgroundColor: 'rgba(236,72,153,0.12)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#a21caf',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const interviewsChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#a21caf',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#f472b6',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a21caf', font: { weight: 'bold' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f3e8ff' },
        ticks: { stepSize: 1, color: '#a21caf', font: { weight: 'bold' } },
      },
    },
    onClick: () => navigate('/interviews'),
  };

  const offerLettersChartData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'Offer Letters',
        data: [
          offerLettersData.filter(offer => offer.status === 'Pending').length,
          offerLettersData.filter(offer => offer.status === 'Accepted').length,
          offerLettersData.filter(offer => offer.status === 'Rejected').length,
        ],
        backgroundColor: [
          'rgba(251,191,36,0.85)',
          'rgba(52,211,153,0.85)',
          'rgba(239,68,68,0.85)'
        ],
        borderColor: [
          'rgba(202,138,4,1)',
          'rgba(5,150,105,1)',
          'rgba(185,28,28,1)'
        ],
        borderWidth: 2,
        hoverOffset: 16,
      },
    ],
  };

  const offerLettersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 14, weight: 'bold' }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#b45309',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fde68a',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
      },
    },
    onClick: () => navigate('/offerLetter'),
  };

  return (
    <div className="flex-1 pl-0 sm:pl-4 pr-4 sm:pr-8 pt-4 sm:pt-8 pb-4 sm:pb-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-4 sm:mb-0 drop-shadow-lg">
          Dashboard Overview
        </h2>
        <div className="flex space-x-3">
          <Link
            to="/jobs"
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl font-semibold shadow-lg hover:from-indigo-700 hover:to-indigo-500 transition"
          >
            View Jobs
          </Link>
          <Link
            to="/candidates"
            className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-xl font-semibold shadow-lg hover:from-green-700 hover:to-green-500 transition"
          >
            View Candidates
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-indigo-100 to-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer border border-indigo-200" onClick={() => navigate('/jobs')}>
          <h3 className="text-lg font-semibold text-indigo-700">Total Jobs</h3>
          <p className="text-3xl font-extrabold text-indigo-700 mt-2">{jobsData.length}</p>
          <p className="text-sm text-indigo-500 mt-1">Open: {jobsData.filter(job => job.status === 'Open').length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer border border-green-200" onClick={() => navigate('/candidates')}>
          <h3 className="text-lg font-semibold text-green-700">Total Candidates</h3>
          <p className="text-3xl font-extrabold text-green-700 mt-2">{candidatesData.length}</p>
          <p className="text-sm text-green-500 mt-1">Interviewed: {candidatesData.filter(candidate => candidate.status === 'Interviewed').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer border border-purple-200" onClick={() => navigate('/interviews')}>
          <h3 className="text-lg font-semibold text-purple-700">Total Interviews</h3>
          <p className="text-3xl font-extrabold text-purple-700 mt-2">{interviewsData.length}</p>
          <p className="text-sm text-purple-500 mt-1">Completed: {interviewsData.filter(interview => interview.status === 'Completed').length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer border border-yellow-200" onClick={() => navigate('/offerLetter')}>
          <h3 className="text-lg font-semibold text-yellow-700">Total Offer Letters</h3>
          <p className="text-3xl font-extrabold text-yellow-700 mt-2">{offerLettersData.length}</p>
          <p className="text-sm text-yellow-500 mt-1">Accepted: {offerLettersData.filter(offer => offer.status === 'Accepted').length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Jobs Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-200 border border-indigo-100 flex flex-col items-center">
          <h3 className="text-xl font-bold text-indigo-700 mb-6">Job Postings by Status</h3>
          <div className="w-full h-72 flex items-center justify-center">
            <Bar data={jobsChartData} options={jobsChartOptions} />
          </div>
        </div>

        {/* Candidates Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-200 border border-green-100 flex flex-col items-center">
          <h3 className="text-xl font-bold text-green-700 mb-6">Candidates by Stage</h3>
          <div className="w-full h-72 flex items-center justify-center">
            <Pie data={candidatesChartData} options={candidatesChartOptions} />
          </div>
        </div>

        {/* Interviews Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-200 border border-purple-100 flex flex-col items-center">
          <h3 className="text-xl font-bold text-purple-700 mb-6">Interviews Conducted in Last 30 Days</h3>
          <div className="w-full h-72 flex items-center justify-center">
            <Line data={interviewsChartData} options={interviewsChartOptions} />
          </div>
        </div>

        {/* Offer Letters Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl hover:shadow-2xl transition-shadow duration-200 border border-yellow-100 flex flex-col items-center">
          <h3 className="text-xl font-bold text-yellow-700 mb-6">Offer Letters by Status</h3>
          <div className="w-full h-72 flex items-center justify-center">
            <Doughnut data={offerLettersChartData} options={offerLettersChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}