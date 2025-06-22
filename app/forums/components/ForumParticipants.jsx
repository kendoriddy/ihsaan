import React from 'react'
import { ArrowLeft, Users, Mail, Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'

const ForumParticipants = ({ forumId, forumTitle, onBack }) => {
  // Mock data - in real app this would come from API
  const participants = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@university.edu',
      joinedDate: '2024-01-16',
      lastActive: '2024-01-20',
      postsCount: 3
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      joinedDate: '2024-01-15',
      lastActive: '2024-01-19',
      postsCount: 2
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'mike.brown@university.edu',
      joinedDate: '2024-01-17',
      lastActive: '2024-01-21',
      postsCount: 1
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@university.edu',
      joinedDate: '2024-01-18',
      lastActive: '2024-01-20',
      postsCount: 4
    },
    {
      id: '5',
      name: 'David Wilson',
      email: 'david.w@university.edu',
      joinedDate: '2024-01-16',
      lastActive: '2024-01-19',
      postsCount: 2
    }
  ]

  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-4'>
        <button
          onClick={onBack}
          className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
        >
          <ArrowLeft className='w-5 h-5' />
          <span>Back to Forums</span>
        </button>
      </div>

      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Forum Participants</h1>
        <p className='text-gray-600 mt-1'>{forumTitle}</p>
      </div>

      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-2'>
            <Users className='w-5 h-5 text-blue-600' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {participants.length} Participants
            </h2>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Posts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map(participant => (
              <TableRow key={participant.id}>
                <TableCell className='font-medium'>
                  {participant.name}
                </TableCell>
                <TableCell>
                  <div className='flex items-center space-x-2'>
                    <Mail className='w-4 h-4 text-gray-400' />
                    <span>{participant.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center space-x-2'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    <span>
                      {new Date(participant.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(participant.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'>
                    {participant.postsCount}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ForumParticipants
