import React, { useState } from 'react'
import { X, MessageSquare } from 'lucide-react'

const ForumCreationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isGraded: false,
    maxMark: 0
  })

  const handleSubmit = e => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      isGraded: false,
      maxMark: 0
    })
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div className='flex items-center space-x-2'>
            <MessageSquare className='w-6 h-6 text-red-700' />
            <h2 className='text-xl font-semibold text-gray-900'>
              Create New Forum
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Forum Topic <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
              placeholder='Enter forum topic'
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Introduction Text <span className='text-red-500'>*</span>
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
              placeholder='Enter forum introduction and instructions'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='startDate'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Start Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                id='startDate'
                name='startDate'
                value={formData.startDate}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
              />
            </div>

            <div>
              <label
                htmlFor='endDate'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                End Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                id='endDate'
                name='endDate'
                value={formData.endDate}
                onChange={handleChange}
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
              />
            </div>
          </div>

          <div className='flex items-center space-x-3'>
            <input
              type='checkbox'
              id='isGraded'
              name='isGraded'
              checked={formData.isGraded}
              onChange={handleChange}
              className='w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500'
            />
            <label
              htmlFor='isGraded'
              className='text-sm font-medium text-gray-700'
            >
              This forum is graded
            </label>
          </div>

          {formData.isGraded && (
            <div>
              <label
                htmlFor='maxMark'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Maximum Mark
              </label>
              <input
                type='number'
                id='maxMark'
                name='maxMark'
                value={formData.maxMark}
                onChange={handleChange}
                min='0'
                max='100'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
                placeholder='Enter maximum mark'
              />
            </div>
          )}

          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors'
            >
              Create Forum
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForumCreationModal
