# Feedback System Implementation

## Overview

This document outlines the implementation of the feedback system for the Ihsaan LMS platform, covering both the Redux state management and UI components.

## API Endpoints

### Base URLs

- **Feedback API**: `https://ihsaanlms.onrender.com/feedback-ticket/feedbacks/`
- **Resource API**: `https://ihsaanlms.onrender.com/resource/feedback-resource/`
- **User Info API**: `https://ihsaanlms.onrender.com/api/auth/logged-in-user/`

### Feedback API Endpoints

#### GET `/feedback-ticket/feedbacks/`

- **Purpose**: Fetch feedbacks with optional filters
- **Query Parameters**:
  - `is_resolved`: Filter by resolution status
  - `page`: Page number for pagination
  - `page_size`: Number of items per page
  - `rating`: Filter by rating value
  - `subject`: Filter by subject type
  - `user_email`: Filter by user email
  - `subject_id`: Filter by specific subject ID

#### POST `/feedback-ticket/feedbacks/`

- **Purpose**: Create new feedback
- **Payload**:

```json
{
  "user": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "user@example.com",
  "subject": "course",
  "subject_id": "string",
  "country": "string",
  "message": "string",
  "rating": 5,
  "resource": 0
}
```

#### GET `/feedback-ticket/feedbacks/{id}/`

- **Purpose**: Fetch specific feedback by ID

#### PATCH `/feedback-ticket/feedbacks/{id}/`

- **Purpose**: Update existing feedback

#### DELETE `/feedback-ticket/feedbacks/{id}/`

- **Purpose**: Delete feedback

### Resource API Endpoints

#### POST `/resource/feedback-resource/`

- **Purpose**: Upload files for feedback
- **Supported Types**: AUDIO, VIDEO, IMAGE, DOCUMENT, OTHERS

## Subject Types (SubjectEnums)

The system supports the following subject types:

1. **course** - Course-related feedback
2. **book** - Book-related feedback
3. **tutor** - Tutor-related feedback
4. **platform** - Platform experience feedback
5. **payment** - Payment-related feedback
6. **other** - Other types of feedback

### Subject ID Requirements

- **Required**: `course`, `book`, `tutor`
- **Not Required**: `platform`, `payment`, `other`

## Redux Implementation

### Store Configuration

The feedback slice is added to the Redux store in `utils/redux/store.js`:

```javascript
import feedbackReducer from "./slices/feedbackSlice";

export const store = configureStore({
  reducer: {
    // ... other reducers
    feedback: feedbackReducer,
  },
});
```

### Feedback Slice (`utils/redux/slices/feedbackSlice.jsx`)

#### State Structure

```javascript
{
  feedbacks: [],
  selectedFeedback: null,
  total_count: 0,
  next: null,
  previous: null,
  status: "idle",
  fetchDetailStatus: "idle",
  createStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  uploadResourceStatus: "idle",
  error: null,
  fetchDetailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  uploadResourceError: null,
}
```

#### Async Thunks

- `fetchFeedbacks(filters)` - Fetch feedbacks with optional filters
- `fetchFeedbackById(id)` - Fetch specific feedback
- `createFeedback(data)` - Create new feedback
- `updateFeedback({id, data})` - Update existing feedback
- `deleteFeedback(id)` - Delete feedback
- `uploadFeedbackResource(data)` - Upload file resource

## UI Components

### Main Components

#### 1. FeedbackMain (`components/feedback/feedback-main.jsx`)

- **Purpose**: Main container component that manages feedback state
- **Features**:
  - Role-based rendering (admin vs user)
  - Automatic feedback fetching
  - Error handling

#### 2. FeedbackDashboard (`components/feedback/feedback-dashboard.jsx`)

- **Purpose**: Display list of feedbacks with filtering and pagination
- **Features**:
  - Tab-based navigation (sent, received, all)
  - Subject type filtering
  - Pagination controls
  - Delete functionality
  - Loading and error states

#### 3. FeedbackForm (`components/feedback/feedback-form.jsx`)

- **Purpose**: Modal form for creating new feedback
- **Features**:
  - Subject type selection
  - Subject ID dropdown selection (when required)
  - Rating system (1-5 stars)
  - Message input
  - Country input
  - File attachment support
  - Form validation
  - Loading states
  - Success/error messages

### Form Validation Rules

1. **Required Fields**:

   - Subject type selection
   - Either rating OR message (or both)

2. **Conditional Requirements**:

   - Subject ID required for: course, book, tutor
   - Subject ID not required for: platform, payment, other

3. **File Upload**:
   - Supported formats: Images, PDF, Word documents
   - Automatic type detection (AUDIO, VIDEO, IMAGE, DOCUMENT, OTHERS)

### Subject ID Dropdown Implementation

The feedback form now includes intelligent dropdowns for subject IDs:

#### **Courses**

- **Source**: API endpoint `https://ihsaanlms.onrender.com/course/courses`
- **Data**: Fetched via Redux `fetchCourses` action
- **Display**: Course title with fallback to "Course {ID}"

#### **Tutors**

- **Source**: API endpoint `/tutor/tutors/`
- **Data**: Fetched via Redux `fetchTutors` action
- **Display**: Full name (first_name + last_name) with fallback to "Tutor {ID}"

#### **Books**

- **Source**: Static data from `constants/books.js`
- **Data**: Pre-loaded constants
- **Display**: Book title with fallback to "Book {ID}"

#### **Features**

- **Automatic Loading**: Data is fetched when the modal opens
- **Loading States**: Visual indicators during data fetching
- **Error Handling**: Retry buttons for failed data loads
- **Smart Reset**: Subject ID is cleared when subject type changes
- **Fallback Display**: Graceful handling of missing data

## User Experience Features

### Loading States

- Form submission loading spinner
- Dashboard data loading states
- File upload progress indication

### Error Handling

- Validation errors display
- API error messages
- Network error handling
- User-friendly error messages

### Success Feedback

- Success messages after submission
- Automatic form reset
- Modal closure on success

### Responsive Design

- Mobile-friendly interface
- Adaptive layout for different screen sizes
- Touch-friendly controls

## Security Features

### Authentication

- Token-based authentication
- Automatic token refresh
- Secure API calls

### Data Validation

- Client-side form validation
- Server-side validation
- Input sanitization

## File Upload Implementation

### Resource Upload Process

1. User selects file in feedback form
2. File is uploaded to `/resource/feedback-resource/`
3. Resource ID is returned
4. Resource ID is included in feedback submission

### Supported File Types

- **AUDIO**: Audio files (mp3, wav, etc.)
- **VIDEO**: Video files (mp4, avi, etc.)
- **IMAGE**: Image files (jpg, png, gif, etc.)
- **DOCUMENT**: PDF, Word documents
- **OTHERS**: Any other file types

## Usage Examples

### Creating Course Feedback

```javascript
const feedbackData = {
  user: "user-uuid",
  email: "user@example.com",
  subject: "course",
  subject_id: "course-123",
  country: "Nigeria",
  message: "Excellent course content and delivery",
  rating: 5,
};
```

### Creating Platform Feedback

```javascript
const feedbackData = {
  user: "user-uuid",
  email: "user@example.com",
  subject: "platform",
  country: "Nigeria",
  message: "Great platform, easy to use",
  rating: 4,
};
```

## Future Enhancements

### Planned Features

1. **Feedback Analytics**: Dashboard with feedback statistics
2. **Response System**: Admin ability to respond to feedback
3. **Email Notifications**: Notify users of feedback status changes
4. **Advanced Filtering**: More sophisticated search and filter options
5. **Bulk Operations**: Admin tools for managing multiple feedbacks

### Technical Improvements

1. **Real-time Updates**: WebSocket integration for live feedback
2. **Offline Support**: PWA capabilities for offline feedback submission
3. **Performance Optimization**: Lazy loading and pagination improvements
4. **Accessibility**: Enhanced screen reader support and keyboard navigation

## Troubleshooting

### Common Issues

#### 1. User ID Not Found

- **Cause**: User not properly authenticated
- **Solution**: Check authentication token and user session

#### 2. File Upload Failures

- **Cause**: File size too large or unsupported format
- **Solution**: Check file size limits and supported formats

#### 3. Validation Errors

- **Cause**: Missing required fields or invalid data
- **Solution**: Review form validation rules and ensure all required fields are filled

#### 4. API Connection Issues

- **Cause**: Network problems or server issues
- **Solution**: Check network connection and server status

## Testing

### Manual Testing Checklist

- [ ] Feedback form opens and closes properly
- [ ] All subject types are selectable
- [ ] Subject ID dropdowns populate with correct data
- [ ] Course dropdown shows course titles
- [ ] Tutor dropdown shows tutor names
- [ ] Book dropdown shows book titles
- [ ] Loading states display during data fetching
- [ ] Retry buttons work for failed data loads
- [ ] Subject ID resets when subject type changes
- [ ] Required field validation works
- [ ] File upload functionality works
- [ ] Form submission shows loading states
- [ ] Success/error messages display correctly
- [ ] Dashboard displays feedbacks properly
- [ ] Filtering and pagination work correctly
- [ ] Delete functionality works
- [ ] Responsive design works on mobile

### Automated Testing

- Unit tests for Redux actions and reducers
- Integration tests for API calls
- Component testing for UI components
- End-to-end testing for complete user flows

## Conclusion

The feedback system provides a comprehensive solution for collecting and managing user feedback across the Ihsaan LMS platform. It includes robust state management, intuitive user interface, and secure API integration. The system is designed to be scalable, maintainable, and user-friendly while providing administrators with powerful tools for feedback management.
