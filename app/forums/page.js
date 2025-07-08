'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Plus,
  MessageSquare,
  Calendar,
  Users,
  Settings,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'

import ForumCreationModal from '@/components/ForumCreationModal'
import Layout from '@/components/Layout'
import ForumPosts from './components/ForumPosts'
// import { useFetch, useDelete, usePut } from '@/hooks/useHttp/useHttp'
import { useQueryClient } from '@tanstack/react-query'
import { useDelete, useFetch, usePut } from '@/hooks/useHttp/useHttp'

const Forums = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [totalForums, setTotalForums] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentView, setCurrentView] = useState('forums')
  const [selectedForumId, setSelectedForumId] = useState('')
  const [selectedForumTitle, setSelectedForumTitle] = useState('')
  const [editingForum, setEditingForum] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [forumToDelete, setForumToDelete] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(null)

  // Create refs for dropdown elements
  const dropdownRefs = useRef({})

  // Check user role from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        const isStudent = user.roles && user.roles.includes('STUDENT')
        setUserRole(isStudent ? 'STUDENT' : 'TUTOR')
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error)
        setUserRole('STUDENT') // Default to student if parsing fails
      }
    } else {
      setUserRole('STUDENT') // Default to student if no user data
    }
  }, [])

  const { isLoading, data, refetch, isFetching } = useFetch(
    'forums',
    `https://ihsaanlms.onrender.com/forum/forums/?page_size=15&page=${page}`,
    data => {
      if (data?.total) {
        setTotalForums(data.total)
      }
    }
  )

  // Delete hook
  const { mutate: deleteForum, isLoading: isDeleting } = useDelete(
    'https://ihsaanlms.onrender.com/forum/forums',
    {
      onSuccess: () => {
        console.log('Forum deleted successfully')
        refetch()
        queryClient.invalidateQueries(['forums'])
        setShowDeleteConfirm(false)
        setForumToDelete(null)
      },
      onError: error => {
        console.error('Error deleting forum:', error)
        alert('Failed to delete forum. Please try again.')
      }
    }
  )

  // Update hook - Fixed to include forum ID in URL
  const { mutate: updateForum, isLoading: isUpdating } = usePut(
    'https://ihsaanlms.onrender.com/forum/forums',
    {
      onSuccess: () => {
        console.log('Forum updated successfully')
        refetch()
        queryClient.invalidateQueries(['forums'])
        setShowEditModal(false)
        setEditingForum(null)
      },
      onError: error => {
        console.error('Error updating forum:', error)
        alert('Failed to update forum. Please try again.')
      }
    }
  )

  const forums = data?.data?.results || []

  console.log({ forums })
  console.log({ showCreateModal })
  console.log({ userRole })

  // Handle Page Change
  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    refetch()
  }

  // Handle successful forum creation
  const handleForumCreated = newForum => {
    console.log('New forum created:', newForum)
    refetch()
    queryClient.invalidateQueries(['forums'])
    if (page !== 1) {
      setPage(1)
    }
  }

  // Handle successful forum update - Fixed to actually call the updateForum mutation
  const handleForumUpdated = (updatedForumData, forumId) => {
    console.log(
      'Forum update requested:',
      updatedForumData,
      'for forum ID:',
      forumId
    )

    // Call the actual update mutation with the forum ID
    updateForum({
      data: updatedForumData,
      id: forumId
    })
  }

  // Alternative: If you want to handle the update entirely in this component
  const handleForumUpdateSubmit = formData => {
    if (!editingForum?.id) {
      console.error('No forum ID found for update')
      return
    }

    // Prepare the data according to the API format
    const updateData = {
      title: formData.title,
      content: formData.content,
      display_pic: formData.display_pic || 0,
      forum_type: formData.forum_type || 'GENERAL',
      course: formData.course || 0,
      tags: formData.tags || '',
      start_date: formData.start_date,
      end_date: formData.end_date,
      is_published:
        formData.is_published !== undefined ? formData.is_published : true
    }

    console.log('Updating forum with data:', updateData)

    // Call the update mutation with the forum ID and data
    updateForum({
      data: updateData,
      id: editingForum.id
    })
  }

  // Handle delete confirmation
  const handleDeleteClick = forum => {
    setForumToDelete(forum)
    setShowDeleteConfirm(true)
    setDropdownOpen(null)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (forumToDelete) {
      deleteForum(forumToDelete.id)
    }
  }

  // Handle edit click
  const handleEditClick = forum => {
    setEditingForum(forum)
    setShowEditModal(true)
    setDropdownOpen(null)
  }

  // Fixed click outside handler
  useEffect(() => {
    const handleClickOutside = event => {
      // Check if the click is outside all dropdown elements
      const isOutside = Object.values(dropdownRefs.current).every(
        ref => ref && !ref.contains(event.target)
      )

      if (isOutside) {
        setDropdownOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              {userRole === 'STUDENT'
                ? 'View and participate in course forums'
                : 'Create and manage course forums'}
            </p>
          </div>
          {/* Only show Create Forum button for non-students */}
          {userRole !== 'STUDENT' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors'
            >
              <Plus className='w-5 h-5' />
              <span>Create Forum</span>
            </button>
          )}
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

                        {/* Actions dropdown for tutors */}
                        {userRole === 'TUTOR' && (
                          <div
                            className='relative'
                            ref={el => (dropdownRefs.current[forum.id] = el)}
                          >
                            <button
                              onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                setDropdownOpen(
                                  dropdownOpen === forum.id ? null : forum.id
                                )
                              }}
                              className='p-1 rounded-full hover:bg-gray-100 transition-colors'
                            >
                              <MoreVertical className='w-5 h-5 text-gray-500' />
                            </button>

                            {dropdownOpen === forum.id && (
                              <div className='absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]'>
                                <button
                                  onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleEditClick(forum)
                                  }}
                                  className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2'
                                >
                                  <Edit className='w-4 h-4' />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteClick(forum)
                                  }}
                                  className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2'
                                >
                                  <Trash2 className='w-4 h-4' />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
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
              No forums available
            </h3>
            <p className='text-gray-600 mb-4'>
              {userRole === 'STUDENT'
                ? 'There are no forums available at the moment. Check back later!'
                : 'Create your first forum to start engaging with students'}
            </p>
            {/* Only show create button for non-students */}
            {userRole !== 'STUDENT' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className='bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors'
              >
                Create Your First Forum
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Delete Forum
              </h3>
              <p className='text-gray-600 mb-6'>
                Are you sure you want to delete "{forumToDelete?.title}"? This
                action cannot be undone.
              </p>
              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setForumToDelete(null)
                  }}
                  className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className='px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50'
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Forum Modal - Only render for non-students */}
        {userRole !== 'STUDENT' && (
          <ForumCreationModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleForumCreated}
          />
        )}

        {/* Edit Forum Modal - Only render for tutors */}
        {userRole === 'TUTOR' && (
          <ForumCreationModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false)
              setEditingForum(null)
            }}
            onSuccess={formData =>
              handleForumUpdated(formData, editingForum?.id)
            }
            editingForum={editingForum}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </Layout>
  )
}

export default Forums
