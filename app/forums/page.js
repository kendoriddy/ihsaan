'use client'

import React, { useState } from 'react'
import { Plus, MessageSquare, Calendar, Users, Settings } from 'lucide-react'

import ForumCreationModal from '@/components/ForumCreationModal'
import Layout from '@/components/Layout'
import ForumPosts from './components/ForumPosts'
import { useFetch } from '@/hooks/useHttp/useHttp'
import { useQueryClient } from '@tanstack/react-query'

const Forums = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [totalForums, setTotalForums] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentView, setCurrentView] = useState('forums')
  const [selectedForumId, setSelectedForumId] = useState('')
  const [selectedForumTitle, setSelectedForumTitle] = useState('')

  const { isLoading, data, refetch, isFetching } = useFetch(
    'forums',
    `https://ihsaanlms.onrender.com/forum/forums/?page_size=15&page=${page}`,
    data => {
      if (data?.total) {
        setTotalForums(data.total)
      }
    }
  )

  const forums = data?.data?.results || []

  console.log({ forums })

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    refetch()
  }

  const getRelativeTime = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    } else {
      return 'Today'
    }
  }

  const formatDateTime = dateString => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDateOnly = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    })
  }

  const formatTimeOnly = dateString => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const handleParticipantsClick = forumId => {
    const forum = forums.find(f => f.id === forumId)
    if (forum) {
      setSelectedForumId(forumId)
      setSelectedForumTitle(forum.title)
      setCurrentView('participants')
    }
  }

  const handlePostsClick = forumId => {
    const forum = forums.find(f => f.id === forumId)
    if (forum) {
      setSelectedForumId(forumId)
      setSelectedForumTitle(forum.title)
      setCurrentView('posts')
    }
  }

  const handleBackToForums = () => {
    setCurrentView('forums')
    setSelectedForumId('')
    setSelectedForumTitle('')
  }

  if (currentView === 'posts') {
    return (
      <ForumPosts
        forumId={selectedForumId}
        forumTitle={selectedForumTitle}
        onBack={handleBackToForums}
      />
    )
  }

  return (
    <Layout>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Forum Management
            </h1>
            <p className='text-gray-600 mt-1'>
              Create and manage course forums
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
          >
            <Plus className='w-5 h-5' />
            <span>Create Forum</span>
          </button>
        </div>
        {isLoading ? (
          <div className='text-center py-20 text-gray-500'>
            Loading forums...
          </div>
        ) : (
          forums.length > 0 && (
            <div className='grid gap-4'>
              {forums.map(forum => (
                <div
                  key={forum.id}
                  className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start space-x-4'>
                    <div className='flex-shrink-0'>
                      <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                        <MessageSquare className='w-6 h-6 text-blue-600' />
                      </div>
                    </div>

                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center space-x-2'>
                          <span className='text-green-600 text-sm'>●</span>
                          <span className='text-gray-500 text-sm'>
                            {getRelativeTime(forum.created_at)}
                          </span>
                          <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium'>
                            ADOODLE BABAJOLA
                          </span>
                        </div>
                      </div>

                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                        {forum.title}
                      </h3>
                      <p className='text-gray-600 mb-4'>{forum.preview}</p>

                      <div className='flex flex-wrap gap-2'>
                        {forum.isGraded && (
                          <span className='bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm border border-red-200'>
                            MARK OBTAINABLE: {forum.maxMark}.00
                          </span>
                        )}
                        <button
                          onClick={() => handlePostsClick(forum.id)}
                          className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm border border-green-200 hover:bg-green-200 transition-colors'
                        >
                          📝 {forum.posts}
                        </button>

                        {/* <span className='bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-200'>
                      👤 {forum.participants}
                    </span> */}
                        <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm border border-gray-200'>
                          ⏰ START: {formatDateOnly(forum.start_date)}{' '}
                          {formatTimeOnly(forum.start_date)}
                        </span>
                        <span className='bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm border border-gray-200'>
                          🔚 END: {formatDateOnly(forum.end_date)}{' '}
                          {formatTimeOnly(forum.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {!isLoading && forums.length === 0 && (
          <div className='text-center py-12'>
            <MessageSquare className='w-16 h-16 text-gray-300 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No forums created yet
            </h3>
            <p className='text-gray-600 mb-4'>
              Create your first forum to start engaging with students
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Create Your First Forum
            </button>
          </div>
        )}

        <ForumCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </Layout>
  )
}

export default Forums
