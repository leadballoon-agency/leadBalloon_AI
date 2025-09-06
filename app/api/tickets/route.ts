import { NextRequest, NextResponse } from 'next/server'

// In a real app, this would be a database. For now, we'll use server memory.
// This will persist across requests but reset on server restart.
let ticketCounter = 1001
let tickets: Array<{
  id: string
  number: number
  name: string
  email: string
  phone: string
  priority: string
  details: string
  url: string
  status: 'queued' | 'in_progress' | 'completed'
  createdAt: string
  estimatedCompletion: string
}> = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, priority, details, url } = body

    // Create new ticket
    const ticketNumber = ticketCounter++
    const ticketId = `LB-${ticketNumber}`
    
    // Calculate estimated completion (24-48 hours based on priority)
    const hoursToAdd = priority === 'urgent' ? 24 : 48
    const estimatedCompletion = new Date(Date.now() + (hoursToAdd * 60 * 60 * 1000)).toISOString()

    const newTicket = {
      id: ticketId,
      number: ticketNumber,
      name,
      email,
      phone,
      priority,
      details,
      url,
      status: 'queued' as const,
      createdAt: new Date().toISOString(),
      estimatedCompletion
    }

    tickets.push(newTicket)

    // Calculate queue position (only count queued tickets ahead of this one)
    const queuedTickets = tickets.filter(t => t.status === 'queued')
    const position = queuedTickets.length

    return NextResponse.json({
      success: true,
      ticket: newTicket,
      queuePosition: position,
      totalInQueue: queuedTickets.length,
      estimatedWaitHours: position * 6 // Assume 6 hours per analysis
    })

  } catch (error) {
    console.error('Ticket creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create ticket'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return current queue status
    const queuedTickets = tickets.filter(t => t.status === 'queued')
    const inProgressTickets = tickets.filter(t => t.status === 'in_progress')
    const completedTickets = tickets.filter(t => t.status === 'completed')

    return NextResponse.json({
      success: true,
      queue: {
        total: tickets.length,
        queued: queuedTickets.length,
        inProgress: inProgressTickets.length,
        completed: completedTickets.length
      },
      recentTickets: tickets.slice(-10).map(t => ({
        id: t.id,
        number: t.number,
        name: t.name.split(' ')[0], // Only first name for privacy
        status: t.status,
        createdAt: t.createdAt
      }))
    })
  } catch (error) {
    console.error('Queue status error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get queue status'
    }, { status: 500 })
  }
}