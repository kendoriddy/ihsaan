// import React, { useState } from 'react'
// import { X, MessageSquare } from 'lucide-react'

// const ForumCreationModal = ({ isOpen, onClose, onSubmit }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     isGraded: false,
//     maxMark: 0
//   })

//   const handleSubmit = e => {
//     e.preventDefault()
//     onSubmit(formData)
//     setFormData({
//       title: '',
//       description: '',
//       startDate: '',
//       endDate: '',
//       isGraded: false,
//       maxMark: 0
//     })
//   }

//   const handleChange = e => {
//     const { name, value, type, checked } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }))
//   }

//   if (!isOpen) return null

//   return (
//     <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
//       <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
//         <div className='flex items-center justify-between p-6 border-b border-gray-200'>
//           <div className='flex items-center space-x-2'>
//             <MessageSquare className='w-6 h-6 text-red-700' />
//             <h2 className='text-xl font-semibold text-gray-900'>
//               Create New Forum
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
//           >
//             <X className='w-5 h-5' />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className='p-6 space-y-6'>
//           <div>
//             <label
//               htmlFor='title'
//               className='block text-sm font-medium text-gray-700 mb-2'
//             >
//               Forum Topic <span className='text-red-500'>*</span>
//             </label>
//             <input
//               type='text'
//               id='title'
//               name='title'
//               value={formData.title}
//               onChange={handleChange}
//               required
//               className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
//               placeholder='Enter forum topic'
//             />
//           </div>

//           <div>
//             <label
//               htmlFor='description'
//               className='block text-sm font-medium text-gray-700 mb-2'
//             >
//               Introduction Text <span className='text-red-500'>*</span>
//             </label>
//             <textarea
//               id='description'
//               name='description'
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows={4}
//               className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
//               placeholder='Enter forum introduction and instructions'
//             />
//           </div>

//           <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//             <div>
//               <label
//                 htmlFor='startDate'
//                 className='block text-sm font-medium text-gray-700 mb-2'
//               >
//                 Start Date <span className='text-red-500'>*</span>
//               </label>
//               <input
//                 type='date'
//                 id='startDate'
//                 name='startDate'
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 required
//                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor='endDate'
//                 className='block text-sm font-medium text-gray-700 mb-2'
//               >
//                 End Date <span className='text-red-500'>*</span>
//               </label>
//               <input
//                 type='date'
//                 id='endDate'
//                 name='endDate'
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 required
//                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
//               />
//             </div>
//           </div>

//           <div className='flex items-center space-x-3'>
//             <input
//               type='checkbox'
//               id='isGraded'
//               name='isGraded'
//               checked={formData.isGraded}
//               onChange={handleChange}
//               className='w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500'
//             />
//             <label
//               htmlFor='isGraded'
//               className='text-sm font-medium text-gray-700'
//             >
//               This forum is graded
//             </label>
//           </div>

//           {formData.isGraded && (
//             <div>
//               <label
//                 htmlFor='maxMark'
//                 className='block text-sm font-medium text-gray-700 mb-2'
//               >
//                 Maximum Mark
//               </label>
//               <input
//                 type='number'
//                 id='maxMark'
//                 name='maxMark'
//                 value={formData.maxMark}
//                 onChange={handleChange}
//                 min='0'
//                 max='100'
//                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent'
//                 placeholder='Enter maximum mark'
//               />
//             </div>
//           )}

//           <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
//             <button
//               type='button'
//               onClick={onClose}
//               className='px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
//             >
//               Cancel
//             </button>
//             <button
//               type='submit'
//               className='px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors'
//             >
//               Create Forum
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default ForumCreationModal

import React, { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material'
import { X, MessageSquare } from 'lucide-react'
import * as Yup from 'yup'
import { useFetch, usePost } from '@/hooks/useHttp/useHttp'
import DatePickers from './validation/DatePicker'

// Validation schema
const forumValidationSchema = Yup.object({
  title: Yup.string()
    .required('Forum title is required')
    .min(3, 'Title must be at least 3 characters'),
  content: Yup.string()
    .required('Forum content is required')
    .min(10, 'Content must be at least 10 characters'),
  forum_type: Yup.string().required('Forum type is required'),
  course: Yup.number().required('Course selection is required'),
  start_date: Yup.date().required('Start date is required'),
  end_date: Yup.date()
    .required('End date is required')
    .min(Yup.ref('start_date'), 'End date must be after start date')
  // maxMark: Yup.number().when('isGraded', {
  //   is: true,
  //   then: () =>
  //     Yup.number()
  //       .required('Maximum mark is required when forum is graded')
  //       .min(1, 'Maximum mark must be at least 1')
  //       .max(100, 'Maximum mark cannot exceed 100'),
  //   otherwise: () => Yup.number()
  // })
})

const ForumCreationModal = ({ isOpen, onClose }) => {
  const [tutorId, setTutorId] = useState('')
  const [fetchAll, setFetchAll] = useState(false)
  const [totalCourses, setTotalCourses] = useState(10)

  const initialValues = {
    title: '',
    content: '',
    display_pic: '',
    forum_type: '',
    course: '',
    tags: '',
    start_date: '',
    end_date: '',
    is_published: true
    // isGraded: false,
    // maxMark: 0
  }

  const forumTypes = [
    { value: 'GENERAL', label: 'General Discussion' },
    { value: 'STUDENT', label: 'Student Forum' }
  ]

  const fetchTutorId = () => {
    const storedTutorId = localStorage.getItem('userId')
    console.log('tutorIdStored', storedTutorId)
    if (storedTutorId) {
      setTutorId(storedTutorId)
    }
  }

  useEffect(() => {
    fetchTutorId()
  })
  // Fetch courses
  const {
    isLoading,
    data: CoursesList,
    refetch
  } = useFetch(
    'courses',
    `https://ihsaanlms.onrender.com/course/courses/?page_size=${
      fetchAll ? totalCourses : 10
    }`,
    data => {
      if (data?.total && !fetchAll) {
        setTotalCourses(data.total)
        setFetchAll(true)
        refetch()
      }
    }
  )

  const Courses = CoursesList?.data?.results || []

  // usePost for form submission
  const { mutate: submitForum, isLoading: submittingForum } = usePost(
    'https://ihsaanlms.onrender.com/forum/forums/'
  )

  // Submit function
  const handleSubmit = (values, { resetForm }) => {
    // Clean empty values
    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== '')
    )

    const payload = {
      ...cleanedValues,
      tutor: tutorId
    }

    console.log('tutorId', tutorId)
    console.log('Forum payload', payload)

    submitForum(payload, {
      onSuccess: () => {
        toast.success('Forum created successfully')
        resetForm() // Reset the form only when successful
        // onClose() // Close the modal
        fetchTutorId()
      },
      onError: error => {
        toast.error(error.response?.data?.message || 'Failed to create forum')
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap={1}>
            <MessageSquare size={24} style={{ color: '#d32f2f' }} />
            <Typography variant='h6'>Create New Forum</Typography>
          </Box>
          <IconButton onClick={onClose} size='small'>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={forumValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ pt: 2 }}>
              <Box display='flex' flexDirection='column' gap={3}>
                {/* Title */}
                <Field
                  as={TextField}
                  fullWidth
                  name='title'
                  label='Forum Title'
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                  placeholder='Enter forum title'
                />

                {/* Content */}
                <Field
                  as={TextField}
                  fullWidth
                  multiline
                  rows={4}
                  name='content'
                  label='Forum Content'
                  error={touched.content && Boolean(errors.content)}
                  helperText={touched.content && errors.content}
                  placeholder='Enter forum description and instructions'
                />

                {/* Forum Type */}
                <FormControl fullWidth>
                  <InputLabel>Forum Type</InputLabel>
                  <Field
                    as={Select}
                    name='forum_type'
                    error={touched.forum_type && Boolean(errors.forum_type)}
                  >
                    <MenuItem value=''>Select forum type</MenuItem>
                    {forumTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>

                {/* Course Selection */}
                <FormControl fullWidth margin='normal'>
                  <InputLabel>Select Course</InputLabel>
                  <Field as={Select} name='course'>
                    {Courses.length > 0 ? (
                      Courses.map(course => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No courses available</MenuItem>
                    )}
                  </Field>
                </FormControl>

                {/* Tags */}
                <Field
                  as={TextField}
                  fullWidth
                  name='tags'
                  label='Tags'
                  placeholder='Enter tags separated by commas (e.g., discussion, homework, exam)'
                  helperText='Use commas to separate multiple tags'
                />

                {/* Date Range */}
                <Box
                  display='grid'
                  gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
                  gap={2}
                >
                  <DatePickers
                    name='start_date'
                    placeholder='Start Date'
                    value={values.start_date}
                    onChange={value => setFieldValue('start_date', value)}
                  />
                  <DatePickers
                    name='end_date'
                    placeholder='End Date'
                    value={values.end_date}
                    onChange={value => setFieldValue('end_date', value)}
                  />
                </Box>

                {/* Graded Forum Checkbox */}
                {/* <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name='isGraded'
                      checked={values.isGraded}
                      onChange={e => {
                        setFieldValue('isGraded', e.target.checked)
                        // Reset maxMark when unchecking
                        if (!e.target.checked) {
                          setFieldValue('maxMark', 0)
                        }
                      }}
                      sx={{
                        color: '#d32f2f',
                        '&.Mui-checked': {
                          color: '#d32f2f'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      This forum is graded
                    </Typography>
                  }
                /> */}

                {/* Maximum Mark Field - Conditional */}
                {/* {values.isGraded && (
                  <Field
                    as={TextField}
                    fullWidth
                    type='number'
                    name='maxMark'
                    label='Maximum Mark'
                    placeholder='Enter maximum mark'
                    inputProps={{
                      min: 0,
                      max: 100
                    }}
                    error={touched.maxMark && Boolean(errors.maxMark)}
                    helperText={touched.maxMark && errors.maxMark}
                  />
                )} */}
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={onClose}
                variant='outlined'
                disabled={submittingForum}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='contained'
                disabled={submittingForum || isLoading}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                {submittingForum ? 'Creating...' : 'Create Forum'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default ForumCreationModal
