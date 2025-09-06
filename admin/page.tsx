'use client'

import { useState, useEffect } from 'react'

interface Feedback {
  id: string
  email: string
  name: string
  rating: number
  comment: string
  date: string
  status: 'pending' | 'reviewed' | 'responded'
  type: 'feedback' | 'bug' | 'suggestion'
}

interface PartnerApplication {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  location: string
  businessType: string
  experience: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

interface Assessment {
  id: string
  name: string
  email: string
  phone?: string
  method: string
  amount: string
  area: string
  timeline: string
  score: number
  date: string
  status: 'new' | 'contacted' | 'booked' | 'completed'
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'assessments' | 'feedback' | 'partners' | 'analytics'>('assessments')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [partners, setPartners] = useState<PartnerApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    
    // Mock data - in real app, fetch from API
    const mockAssessments: Assessment[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '07123456789',
        method: 'ozempic',
        amount: '2-4stone',
        area: 'tummy',
        timeline: 'asap',
        score: 95,
        date: new Date().toISOString(),
        status: 'new'
      },
      {
        id: '2',
        name: 'Mike Thompson',
        email: 'mike@example.com',
        method: 'diet',
        amount: '1-2stone',
        area: 'arms',
        timeline: '1month',
        score: 87,
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'contacted'
      }
    ]

    const mockFeedback: Feedback[] = [
      {
        id: '1',
        email: 'happy.client@example.com',
        name: 'Emma Wilson',
        rating: 5,
        comment: 'Amazing results! The ProMax Lipo treatment exceeded my expectations. Staff were professional and the whole experience was comfortable.',
        date: new Date().toISOString(),
        status: 'pending',
        type: 'feedback'
      },
      {
        id: '2',
        email: 'concerned@example.com',
        name: 'David Brown',
        rating: 3,
        comment: 'Assessment form was a bit confusing on mobile. Maybe add more explanation for each step?',
        date: new Date(Date.now() - 172800000).toISOString(),
        status: 'reviewed',
        type: 'bug'
      }
    ]

    const mockPartners: PartnerApplication[] = [
      {
        id: '1',
        companyName: 'Cambridge Aesthetics',
        contactName: 'Dr. Jennifer Clarke',
        email: 'j.clarke@cambridgeaesthetics.co.uk',
        phone: '01223555666',
        location: 'Cambridge',
        businessType: 'Medical Spa',
        experience: '5+ years',
        date: new Date().toISOString(),
        status: 'pending'
      }
    ]

    setAssessments(mockAssessments)
    setFeedback(mockFeedback)
    setPartners(mockPartners)
    setIsLoading(false)
  }

  const updateAssessmentStatus = (id: string, status: Assessment['status']) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  const updateFeedbackStatus = (id: string, status: Feedback['status']) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f))
  }

  const updatePartnerStatus = (id: string, status: PartnerApplication['status']) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-green-100 text-green-800',
      booked: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
      reviewed: 'bg-green-100 text-green-800',
      responded: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Skulpt Body Contouring Management Portal</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Assessments</h3>
            <p className="text-3xl font-bold text-primary-500">{assessments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">New Feedback</h3>
            <p className="text-3xl font-bold text-accent-500">{feedback.filter(f => f.status === 'pending').length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Partner Applications</h3>
            <p className="text-3xl font-bold text-blue-500">{partners.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="text-3xl font-bold text-green-500">23.5%</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <nav className="flex">
              {[
                { key: 'assessments', label: 'Assessments', count: assessments.length },
                { key: 'feedback', label: 'Feedback & Bugs', count: feedback.length },
                { key: 'partners', label: 'Partner Applications', count: partners.length },
                { key: 'analytics', label: 'Analytics', count: null }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            
            {/* Assessments Tab */}
            {activeTab === 'assessments' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Assessments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assessments.map((assessment) => (
                        <tr key={assessment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{assessment.name}</div>
                            <div className="text-sm text-gray-500">{formatDate(assessment.date)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{assessment.email}</div>
                            {assessment.phone && <div className="text-sm text-gray-500">{assessment.phone}</div>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{assessment.method} • {assessment.amount}</div>
                            <div className="text-sm text-gray-500">{assessment.area} • {assessment.timeline}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-semibold text-primary-500">{assessment.score}%</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(assessment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <select
                              value={assessment.status}
                              onChange={(e) => updateAssessmentStatus(assessment.id, e.target.value as Assessment['status'])}
                              className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="booked">Booked</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback & Bug Reports</h2>
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.email} • {formatDate(item.date)}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            item.type === 'bug' ? 'bg-red-100 text-red-800' :
                            item.type === 'suggestion' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.type}
                          </span>
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      
                      {item.rating && (
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-gray-700 mb-3">{item.comment}</p>
                      
                      <div className="flex gap-2">
                        <select
                          value={item.status}
                          onChange={(e) => updateFeedbackStatus(item.id, e.target.value as Feedback['status'])}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="responded">Responded</option>
                        </select>
                        <button className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-600">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partners Tab */}
            {activeTab === 'partners' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Partner Applications</h2>
                <div className="space-y-4">
                  {partners.map((partner) => (
                    <div key={partner.id} className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 text-lg">{partner.companyName}</h4>
                          <p className="text-gray-600">{partner.contactName} • {partner.location}</p>
                          <p className="text-sm text-gray-500">{formatDate(partner.date)}</p>
                        </div>
                        {getStatusBadge(partner.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{partner.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{partner.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Business Type</p>
                          <p className="font-medium">{partner.businessType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{partner.experience}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => updatePartnerStatus(partner.id, 'approved')}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updatePartnerStatus(partner.id, 'rejected')}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-white p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Assessment Completion Rate</h3>
                    <div className="text-3xl font-bold text-primary-500 mb-2">87.3%</div>
                    <p className="text-gray-600">Users completing full assessment</p>
                  </div>
                  
                  <div className="bg-white p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Top Weight Loss Methods</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Ozempic/Wegovy</span>
                        <span className="font-semibold">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diet & Exercise</span>
                        <span className="font-semibold">32%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mounjaro</span>
                        <span className="font-semibold">23%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Problem Areas</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tummy</span>
                        <span className="font-semibold">52%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arms</span>
                        <span className="font-semibold">28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multiple Areas</span>
                        <span className="font-semibold">20%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Average Match Score</h3>
                    <div className="text-3xl font-bold text-accent-500 mb-2">91.2%</div>
                    <p className="text-gray-600">High suitability for ProMax Lipo</p>
                  </div>
                  
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}