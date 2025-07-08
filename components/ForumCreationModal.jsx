// // import React, { useState, useEffect } from 'react'
// // import { Formik, Form, Field } from 'formik'
// // import {
// //   TextField,
// //   MenuItem,
// //   Select,
// //   InputLabel,
// //   FormControl,
// //   FormControlLabel,
// //   Checkbox,
// //   Box,
// //   Typography,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Button,
// //   IconButton
// // } from '@mui/material'
// // import { X, MessageSquare } from 'lucide-react'
// // import * as Yup from 'yup'
// // import { useFetch, usePost } from '@/hooks/useHttp/useHttp'
// // import DatePickers from './validation/DatePicker'
// // import { toast } from 'react-toastify'

// // // Validation schema
// // const forumValidationSchema = Yup.object({
// //   title: Yup.string()
// //     .required('Forum title is required')
// //     .min(3, 'Title must be at least 3 characters'),
// //   content: Yup.string()
// //     .required('Forum content is required')
// //     .min(10, 'Content must be at least 10 characters'),
// //   forum_type: Yup.string().required('Forum type is required'),
// //   course: Yup.number().required('Course selection is required'),
// //   start_date: Yup.date().required('Start date is required'),
// //   end_date: Yup.date()
// //     .required('End date is required')
// //     .min(Yup.ref('start_date'), 'End date must be after start date')
// //   // maxMark: Yup.number().when('isGraded', {
// //   //   is: true,
// //   //   then: () =>
// //   //     Yup.number()
// //   //       .required('Maximum mark is required when forum is graded')
// //   //       .min(1, 'Maximum mark must be at least 1')
// //   //       .max(100, 'Maximum mark cannot exceed 100'),
// //   //   otherwise: () => Yup.number()
// //   // })
// // })

// // const ForumCreationModal = ({ isOpen, onClose, onSuccess }) => {
// //   const [tutorId, setTutorId] = useState('')
// //   const [fetchAll, setFetchAll] = useState(false)
// //   const [totalCourses, setTotalCourses] = useState(10)

// //   const initialValues = {
// //     title: '',
// //     content: '',
// //     display_pic: '',
// //     forum_type: '',
// //     course: '',
// //     tags: '',
// //     start_date: '',
// //     end_date: '',
// //     is_published: true
// //   }

// //   const forumTypes = [
// //     { value: 'GENERAL', label: 'General Discussion' },
// //     { value: 'STUDENT', label: 'Student Forum' }
// //   ]

// //   const fetchTutorId = () => {
// //     const storedTutorId = localStorage.getItem('userId')
// //     console.log('tutorIdStored', storedTutorId)
// //     if (storedTutorId) {
// //       setTutorId(storedTutorId)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchTutorId()
// //   }, []) // Added dependency array to prevent infinite re-renders

// //   // Fetch courses
// //   const {
// //     isLoading,
// //     data: CoursesList,
// //     refetch
// //   } = useFetch(
// //     'courses',
// //     `https://ihsaanlms.onrender.com/course/courses/?page_size=${
// //       fetchAll ? totalCourses : 10
// //     }`,
// //     data => {
// //       if (data?.total && !fetchAll) {
// //         setTotalCourses(data.total)
// //         setFetchAll(true)
// //         refetch()
// //       }
// //     }
// //   )

// //   const Courses = CoursesList?.data?.results || []

// //   // usePost for form submission
// //   const { mutate: submitForum, isLoading: submittingForum } = usePost(
// //     'https://ihsaanlms.onrender.com/forum/forums/'
// //   )

// //   // Submit function
// //   const handleSubmit = (values, { resetForm, setSubmitting }) => {
// //     try {
// //       // Clean empty values
// //       const cleanedValues = Object.fromEntries(
// //         Object.entries(values).filter(([_, value]) => value !== '')
// //       )

// //       const payload = {
// //         ...cleanedValues,
// //         tutor: tutorId
// //       }

// //       console.log('tutorId', tutorId)
// //       console.log('Forum payload', payload)

// //       submitForum(payload, {
// //         onSuccess: data => {
// //           toast.success('Forum created successfully')
// //           resetForm()
// //           setSubmitting(false)

// //           // Call onClose to close the modal
// //           onClose()

// //           // Call onSuccess callback if provided
// //           if (onSuccess) {
// //             onSuccess(data)
// //           }
// //         },
// //         onError: error => {
// //           console.error('Forum creation error:', error)
// //           toast.error(error.response?.data?.message || 'Failed to create forum')
// //           setSubmitting(false)
// //         }
// //       })
// //     } catch (error) {
// //       console.error('Unexpected error:', error)
// //       toast.error('An unexpected error occurred')
// //       setSubmitting(false)
// //     }
// //   }

// //   return (
// //     <Dialog
// //       open={isOpen}
// //       onClose={onClose}
// //       maxWidth='md'
// //       fullWidth
// //       PaperProps={{
// //         sx: { minHeight: '600px' }
// //       }}
// //     >
// //       <DialogTitle>
// //         <Box display='flex' alignItems='center' justifyContent='space-between'>
// //           <Box display='flex' alignItems='center' gap={1}>
// //             <MessageSquare size={24} style={{ color: '#d32f2f' }} />
// //             <Typography variant='h6'>Create New Forum</Typography>
// //           </Box>
// //           <IconButton onClick={onClose} size='small'>
// //             <X size={20} />
// //           </IconButton>
// //         </Box>
// //       </DialogTitle>

// //       <Formik
// //         initialValues={initialValues}
// //         validationSchema={forumValidationSchema}
// //         onSubmit={handleSubmit}
// //         enableReinitialize
// //       >
// //         {({ errors, touched, values, setFieldValue, isSubmitting }) => (
// //           <Form>
// //             <DialogContent sx={{ pt: 2 }}>
// //               <Box display='flex' flexDirection='column' gap={3}>
// //                 {/* Title */}
// //                 <Field
// //                   as={TextField}
// //                   fullWidth
// //                   name='title'
// //                   label='Forum Title'
// //                   error={touched.title && Boolean(errors.title)}
// //                   helperText={touched.title && errors.title}
// //                   placeholder='Enter forum title'
// //                 />

// //                 {/* Content */}
// //                 <Field
// //                   as={TextField}
// //                   fullWidth
// //                   multiline
// //                   rows={4}
// //                   name='content'
// //                   label='Forum Content'
// //                   error={touched.content && Boolean(errors.content)}
// //                   helperText={touched.content && errors.content}
// //                   placeholder='Enter forum description and instructions'
// //                 />

// //                 {/* Forum Type */}
// //                 <FormControl fullWidth>
// //                   <InputLabel>Forum Type</InputLabel>
// //                   <Field
// //                     as={Select}
// //                     name='forum_type'
// //                     error={touched.forum_type && Boolean(errors.forum_type)}
// //                   >
// //                     <MenuItem value=''>Select forum type</MenuItem>
// //                     {forumTypes.map(type => (
// //                       <MenuItem key={type.value} value={type.value}>
// //                         {type.label}
// //                       </MenuItem>
// //                     ))}
// //                   </Field>
// //                 </FormControl>

// //                 {/* Course Selection */}
// //                 <FormControl fullWidth margin='normal'>
// //                   <InputLabel>Select Course</InputLabel>
// //                   <Field as={Select} name='course'>
// //                     {Courses.length > 0 ? (
// //                       Courses.map(course => (
// //                         <MenuItem key={course.id} value={course.id}>
// //                           {course.name}
// //                         </MenuItem>
// //                       ))
// //                     ) : (
// //                       <MenuItem disabled>No courses available</MenuItem>
// //                     )}
// //                   </Field>
// //                 </FormControl>

// //                 {/* Tags */}
// //                 <Field
// //                   as={TextField}
// //                   fullWidth
// //                   name='tags'
// //                   label='Tags'
// //                   placeholder='Enter tags separated by commas (e.g., discussion, homework, exam)'
// //                   helperText='Use commas to separate multiple tags'
// //                 />

// //                 {/* Date Range */}
// //                 <Box
// //                   display='grid'
// //                   gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
// //                   gap={2}
// //                 >
// //                   <DatePickers
// //                     name='start_date'
// //                     placeholder='Start Date'
// //                     value={values.start_date}
// //                     onChange={value => setFieldValue('start_date', value)}
// //                   />
// //                   <DatePickers
// //                     name='end_date'
// //                     placeholder='End Date'
// //                     value={values.end_date}
// //                     onChange={value => setFieldValue('end_date', value)}
// //                   />
// //                 </Box>

// //                 {/* Graded Forum Checkbox */}
// //                 {/* <FormControlLabel
// //                   control={
// //                     <Field
// //                       as={Checkbox}
// //                       name='isGraded'
// //                       checked={values.isGraded}
// //                       onChange={e => {
// //                         setFieldValue('isGraded', e.target.checked)
// //                         // Reset maxMark when unchecking
// //                         if (!e.target.checked) {
// //                           setFieldValue('maxMark', 0)
// //                         }
// //                       }}
// //                       sx={{
// //                         color: '#d32f2f',
// //                         '&.Mui-checked': {
// //                           color: '#d32f2f'
// //                         }
// //                       }}
// //                     />
// //                   }
// //                   label={
// //                     <Typography variant='body2' sx={{ fontWeight: 500 }}>
// //                       This forum is graded
// //                     </Typography>
// //                   }
// //                 /> */}

// //                 {/* Maximum Mark Field - Conditional */}
// //                 {/* {values.isGraded && (
// //                   <Field
// //                     as={TextField}
// //                     fullWidth
// //                     type='number'
// //                     name='maxMark'
// //                     label='Maximum Mark'
// //                     placeholder='Enter maximum mark'
// //                     inputProps={{
// //                       min: 0,
// //                       max: 100
// //                     }}
// //                     error={touched.maxMark && Boolean(errors.maxMark)}
// //                     helperText={touched.maxMark && errors.maxMark}
// //                   />
// //                 )} */}
// //               </Box>
// //             </DialogContent>

// //             <DialogActions sx={{ px: 3, pb: 3 }}>
// //               <Button
// //                 onClick={onClose}
// //                 variant='outlined'
// //                 disabled={submittingForum || isSubmitting}
// //               >
// //                 Cancel
// //               </Button>
// //               <Button
// //                 type='submit'
// //                 variant='contained'
// //                 disabled={submittingForum || isSubmitting || isLoading}
// //                 sx={{
// //                   bgcolor: '#d32f2f',
// //                   '&:hover': { bgcolor: '#b71c1c' }
// //                 }}
// //               >
// //                 {submittingForum || isSubmitting
// //                   ? 'Creating...'
// //                   : 'Create Forum'}
// //               </Button>
// //             </DialogActions>
// //           </Form>
// //         )}
// //       </Formik>
// //     </Dialog>
// //   )
// // }

// // export default ForumCreationModal

// import React, { useState, useEffect } from 'react'
// import { Formik, Form, Field } from 'formik'
// import {
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   FormControlLabel,
//   Checkbox,
//   Box,
//   Typography,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   IconButton
// } from '@mui/material'
// import { X, MessageSquare } from 'lucide-react'
// import * as Yup from 'yup'
// import { useFetch, usePost } from '@/hooks/useHttp/useHttp'
// import DatePickers from './validation/DatePicker'
// // Add toast import - choose one based on what you're using
// import { toast } from 'react-toastify' // or 'react-hot-toast' or your toast library

// // Validation schema
// const forumValidationSchema = Yup.object({
//   title: Yup.string()
//     .required('Forum title is required')
//     .min(3, 'Title must be at least 3 characters'),
//   content: Yup.string()
//     .required('Forum content is required')
//     .min(10, 'Content must be at least 10 characters'),
//   forum_type: Yup.string().required('Forum type is required'),
//   course: Yup.number().required('Course selection is required'),
//   start_date: Yup.date().required('Start date is required'),
//   end_date: Yup.date()
//     .required('End date is required')
//     .min(Yup.ref('start_date'), 'End date must be after start date')
// })

// const ForumCreationModal = ({ isOpen, onClose, onSuccess }) => {
//   const [tutorId, setTutorId] = useState('')
//   const [fetchAll, setFetchAll] = useState(false)
//   const [totalCourses, setTotalCourses] = useState(10)

//   const initialValues = {
//     title: '',
//     content: '',
//     display_pic: '',
//     forum_type: '',
//     course: '',
//     tags: '',
//     start_date: '',
//     end_date: '',
//     is_published: true
//   }

//   const forumTypes = [
//     { value: 'GENERAL', label: 'General Discussion' },
//     { value: 'STUDENT', label: 'Student Forum' }
//   ]

//   const fetchTutorId = () => {
//     const storedTutorId = localStorage.getItem('userId')
//     console.log('tutorIdStored', storedTutorId)
//     if (storedTutorId) {
//       setTutorId(storedTutorId)
//     }
//   }

//   useEffect(() => {
//     fetchTutorId()
//   }, []) // Added dependency array to prevent infinite re-renders

//   // Fetch courses
//   const {
//     isLoading,
//     data: CoursesList,
//     refetch
//   } = useFetch(
//     'courses',
//     `https://ihsaanlms.onrender.com/course/courses/?page_size=${
//       fetchAll ? totalCourses : 10
//     }`,
//     data => {
//       if (data?.total && !fetchAll) {
//         setTotalCourses(data.total)
//         setFetchAll(true)
//         refetch()
//       }
//     }
//   )

//   const Courses = CoursesList?.data?.results || []

//   // usePost for form submission
//   const { mutate: submitForum, isLoading: submittingForum } = usePost(
//     'https://ihsaanlms.onrender.com/forum/forums/'
//   )

//   // Submit function
//   const handleSubmit = (values, { resetForm, setSubmitting }) => {
//     try {
//       // Clean empty values
//       const cleanedValues = Object.fromEntries(
//         Object.entries(values).filter(([_, value]) => value !== '')
//       )

//       const payload = {
//         ...cleanedValues,
//         tutor: tutorId
//       }

//       console.log('tutorId', tutorId)
//       console.log('Forum payload', payload)

//       submitForum(payload, {
//         onSuccess: data => {
//           toast.success('Forum created successfully')
//           resetForm()
//           setSubmitting(false)

//           // Call onClose to close the modal
//           onClose()

//           // Call onSuccess callback if provided
//           if (onSuccess) {
//             onSuccess(data)
//           }
//         },
//         onError: error => {
//           console.error('Forum creation error:', error)
//           toast.error(error.response?.data?.message || 'Failed to create forum')
//           setSubmitting(false)
//         }
//       })
//     } catch (error) {
//       console.error('Unexpected error:', error)
//       toast.error('An unexpected error occurred')
//       setSubmitting(false)
//     }
//   }

//   return (
//     <Dialog
//       open={isOpen}
//       onClose={onClose}
//       maxWidth='md'
//       fullWidth
//       PaperProps={{
//         sx: { minHeight: '600px' }
//       }}
//     >
//       <DialogTitle>
//         <Box display='flex' alignItems='center' justifyContent='space-between'>
//           <Box display='flex' alignItems='center' gap={1}>
//             <MessageSquare size={24} style={{ color: '#d32f2f' }} />
//             <Typography variant='h6'>Create New Forum</Typography>
//           </Box>
//           <IconButton onClick={onClose} size='small'>
//             <X size={20} />
//           </IconButton>
//         </Box>
//       </DialogTitle>

//       <Formik
//         initialValues={initialValues}
//         validationSchema={forumValidationSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize
//       >
//         {({ errors, touched, values, setFieldValue, isSubmitting }) => (
//           <Form>
//             <DialogContent sx={{ pt: 2 }}>
//               <Box display='flex' flexDirection='column' gap={3}>
//                 {/* Title */}
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   name='title'
//                   label='Forum Title'
//                   error={touched.title && Boolean(errors.title)}
//                   helperText={touched.title && errors.title}
//                   placeholder='Enter forum title'
//                 />

//                 {/* Content */}
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   multiline
//                   rows={4}
//                   name='content'
//                   label='Forum Content'
//                   error={touched.content && Boolean(errors.content)}
//                   helperText={touched.content && errors.content}
//                   placeholder='Enter forum description and instructions'
//                 />

//                 {/* Forum Type */}
//                 <FormControl fullWidth>
//                   <InputLabel>Forum Type</InputLabel>
//                   <Field
//                     as={Select}
//                     name='forum_type'
//                     error={touched.forum_type && Boolean(errors.forum_type)}
//                   >
//                     <MenuItem value=''>Select forum type</MenuItem>
//                     {forumTypes.map(type => (
//                       <MenuItem key={type.value} value={type.value}>
//                         {type.label}
//                       </MenuItem>
//                     ))}
//                   </Field>
//                 </FormControl>

//                 {/* Course Selection */}
//                 <FormControl fullWidth margin='normal'>
//                   <InputLabel>Select Course</InputLabel>
//                   <Field as={Select} name='course'>
//                     {Courses.length > 0 ? (
//                       Courses.map(course => (
//                         <MenuItem key={course.id} value={course.id}>
//                           {course.name}
//                         </MenuItem>
//                       ))
//                     ) : (
//                       <MenuItem disabled>No courses available</MenuItem>
//                     )}
//                   </Field>
//                 </FormControl>

//                 {/* Tags */}
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   name='tags'
//                   label='Tags'
//                   placeholder='Enter tags separated by commas (e.g., discussion, homework, exam)'
//                   helperText='Use commas to separate multiple tags'
//                 />

//                 {/* Date Range */}
//                 <Box
//                   display='grid'
//                   gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
//                   gap={2}
//                 >
//                   <DatePickers
//                     name='start_date'
//                     placeholder='Start Date'
//                     value={values.start_date}
//                     onChange={value => setFieldValue('start_date', value)}
//                   />
//                   <DatePickers
//                     name='end_date'
//                     placeholder='End Date'
//                     value={values.end_date}
//                     onChange={value => setFieldValue('end_date', value)}
//                   />
//                 </Box>
//               </Box>
//             </DialogContent>

//             <DialogActions sx={{ px: 3, pb: 3 }}>
//               <Button
//                 onClick={onClose}
//                 variant='outlined'
//                 disabled={submittingForum || isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type='submit'
//                 variant='contained'
//                 disabled={submittingForum || isSubmitting || isLoading}
//                 sx={{
//                   bgcolor: '#d32f2f',
//                   '&:hover': { bgcolor: '#b71c1c' }
//                 }}
//               >
//                 {submittingForum || isSubmitting
//                   ? 'Creating...'
//                   : 'Create Forum'}
//               </Button>
//             </DialogActions>
//           </Form>
//         )}
//       </Formik>
//     </Dialog>
//   )
// }

// export default ForumCreationModal

import React, { useState, useEffect, useMemo } from 'react'
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
import { X, MessageSquare, Edit } from 'lucide-react'
import * as Yup from 'yup'
import { useFetch, usePost, usePut } from '@/hooks/useHttp/useHttp'
import DatePickers from './validation/DatePicker'
import { toast } from 'react-toastify'

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
})

const ForumCreationModal = ({
  isOpen,
  onClose,
  onSuccess,
  editingForum = null
}) => {
  const [tutorId, setTutorId] = useState('')
  const [fetchAll, setFetchAll] = useState(false)
  const [totalCourses, setTotalCourses] = useState(10)

  const isEditing = !!editingForum

  // Format date for form input (YYYY-MM-DDTHH:mm format)
  const formatDateForForm = dateString => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  // Dynamic initial values based on whether we're editing or creating
  const initialValues = useMemo(() => {
    if (isEditing && editingForum) {
      return {
        title: editingForum.title || '',
        content: editingForum.content || '',
        display_pic: editingForum.display_pic || '',
        forum_type: editingForum.forum_type || '',
        course: editingForum.course || '',
        tags: editingForum.tags || '',
        start_date: formatDateForForm(editingForum.start_date) || '',
        end_date: formatDateForForm(editingForum.end_date) || '',
        is_published:
          editingForum.is_published !== undefined
            ? editingForum.is_published
            : true
      }
    }

    return {
      title: '',
      content: '',
      display_pic: '',
      forum_type: '',
      course: '',
      tags: '',
      start_date: '',
      end_date: '',
      is_published: true
    }
  }, [isEditing, editingForum])

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
  }, [])

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

  // usePost for forum creation
  const { mutate: createForum, isLoading: creatingForum } = usePost(
    'https://ihsaanlms.onrender.com/forum/forums/'
  )

  // usePut for forum updates
  const { mutate: updateForum, isLoading: updatingForum } = usePut(
    'https://ihsaanlms.onrender.com/forum/forums',
    {
      onSuccess: data => {
        toast.success('Forum updated successfully')
        onClose()
        if (onSuccess) {
          onSuccess(data)
        }
      },
      onError: error => {
        console.error('Forum update error:', error)
        toast.error(error.response?.data?.message || 'Failed to update forum')
      }
    }
  )

  // Submit function
  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    try {
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
      console.log('isEditing', isEditing)

      if (isEditing) {
        // Update existing forum
        updateForum({
          id: editingForum.id,
          data: payload
        })
      } else {
        // Create new forum
        createForum(payload, {
          onSuccess: data => {
            toast.success('Forum created successfully')
            resetForm()
            setSubmitting(false)
            onClose()
            if (onSuccess) {
              onSuccess(data)
            }
          },
          onError: error => {
            console.error('Forum creation error:', error)
            toast.error(
              error.response?.data?.message || 'Failed to create forum'
            )
            setSubmitting(false)
          }
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
      setSubmitting(false)
    }
  }

  const isSubmitting = creatingForum || updatingForum

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
            {isEditing ? (
              <Edit size={24} style={{ color: '#d32f2f' }} />
            ) : (
              <MessageSquare size={24} style={{ color: '#d32f2f' }} />
            )}
            <Typography variant='h6'>
              {isEditing ? 'Edit Forum' : 'Create New Forum'}
            </Typography>
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
        enableReinitialize={true}
        key={editingForum?.id || 'create'} // Force re-render when switching between edit/create
      >
        {({
          errors,
          touched,
          values,
          setFieldValue,
          isSubmitting: formSubmitting
        }) => (
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

                {/* Published Status */}
                <FormControlLabel
                  control={
                    <Field
                      as={Checkbox}
                      name='is_published'
                      checked={values.is_published}
                      onChange={e =>
                        setFieldValue('is_published', e.target.checked)
                      }
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
                      Publish forum immediately
                    </Typography>
                  }
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={onClose}
                variant='outlined'
                disabled={isSubmitting || formSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='contained'
                disabled={isSubmitting || formSubmitting || isLoading}
                sx={{
                  bgcolor: '#d32f2f',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                {isSubmitting || formSubmitting
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update Forum'
                  : 'Create Forum'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

export default ForumCreationModal
