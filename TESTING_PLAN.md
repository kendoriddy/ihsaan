# Testing Plan: Course Management Flow

## Overview

This document outlines a step-by-step testing approach for:

1. Course Creation
2. Assignment of Tutors to Courses
3. Assignment of Tutors to Students

---

## Step 1: Course Creation

### Backend Specification (IhsaanLms.yaml)

- **Endpoint**: `POST /course/courses/`
- **Schema**: `CourseRequest`
- **Required Fields**: `code`, `description`, `name`, `programme`, `title`
- **Optional Fields**: `image_url`, `price`, `term`

### Current Implementation Status

- ✅ Fixed: Hardcoded base URL replaced with environment variable
- ✅ Uses correct endpoint: `/course/courses/`
- ✅ Request body structure matches spec
- ⚠️ `term` field is optional but not included in form (acceptable - nullable in API)
- ⚠️ `price` field is optional but not included in form (acceptable - nullable in API)

### Testing Checklist

- [ ] Create a course with all required fields
- [ ] Verify course appears in course list
- [ ] Test with image upload
- [ ] Test error handling for missing required fields
- [ ] Verify API response matches Course schema
- [ ] Verify no hardcoded URLs in network requests

### Fixes Applied ✅

1. ✅ Replaced hardcoded URL with `process.env.NEXT_PUBLIC_API_BASE_URL`
2. ✅ Fixed image upload endpoint to use environment variable

---

## Step 2: Assignment of Tutors to Courses

### Backend Specification (IhsaanLms.yaml)

- **Endpoint**: `POST /course/course-tutor-assignments/`
- **Schema**: `CourseTutorAssignmentRequest`
- **Required Fields**: `user` (UUID), `course` (integer)
- **Optional Fields**: `term` (integer, nullable)

### Current Implementation Status

- ✅ Supports multiple tutors per course
- ✅ Uses correct endpoint
- ✅ Request body structure matches spec
- ✅ Fixed: Data structure now correctly handles paginated response

### Testing Checklist

- [ ] Assign single tutor to a course
- [ ] Assign multiple tutors to the same course
- [ ] Verify tutors appear in assignments table
- [ ] Test with term selection
- [ ] Test without term (nullable)
- [ ] Verify error handling for duplicate assignments
- [ ] Test edit assignment functionality
- [ ] Test deassign functionality

### Expected Behavior

- Multiple tutors can be assigned to the same course
- Each assignment creates a separate record
- Assignments table shows all tutors for each course

---

## Step 3: Assignment of Tutors to Students

### Backend Specification (IhsaanLms.yaml)

- **Endpoint**: `POST /course/tutor-student-assignments/`
- **Schema**: `TutorStudentAssignmentRequest`
- **Required Fields**: `tutor` (UUID), `student` (UUID), `course` (integer)
- **Optional Fields**: `notes` (string, nullable)

### Current Implementation Status

- ✅ Supports multiple students per tutor-course combination
- ✅ Uses correct endpoint
- ✅ Includes notes field

### Testing Checklist

- [ ] Assign tutor to single student for a course
- [ ] Assign tutor to multiple students for a course
- [ ] Verify assignments appear in tutor-student assignments table
- [ ] Test with notes
- [ ] Test without notes
- [ ] Verify tutor dropdown only shows tutors assigned to selected course
- [ ] Test edit assignment functionality
- [ ] Test delete assignment functionality

### Expected Behavior

- Tutor must be assigned to course before assigning to students
- Multiple students can be assigned to same tutor for a course
- Each assignment creates a separate record

---

## Testing Order

### Phase 1: Course Creation

1. Navigate to `/admin/courses/add-course`
2. Fill in all required fields:
   - Title
   - Description
   - Name
   - Code
   - Programme
   - Image (optional)
3. Submit form
4. Verify success message
5. Check course appears in course list

### Phase 2: Assign Tutors to Course

1. Navigate to `/admin/courses`
2. Click "Assign Tutor to Course" button
3. Select:
   - Term (required)
   - Course (required)
   - Tutors (multiple selection, at least one required)
4. Submit
5. Verify success message
6. Check assignments table shows new assignments
7. Verify multiple tutors can be assigned to same course

### Phase 3: Assign Tutors to Students

1. Navigate to `/admin/courses`
2. Click "Assign Tutor to Students" button
3. Select:
   - Course (required)
   - Tutor (required - should only show tutors assigned to selected course)
   - Students (multiple selection, at least one required)
   - Notes (optional)
4. Submit
5. Verify success message
6. Check tutor-student assignments table shows new assignments

---

## Common Issues to Watch For

1. **Data Structure Mismatches**

   - Paginated responses should use `.results` property
   - Check response structure matches YAML schema

2. **Hardcoded URLs**

   - All API calls should use `process.env.NEXT_PUBLIC_API_BASE_URL`
   - Never hardcode base URLs

3. **Required vs Optional Fields**

   - Verify required fields are validated
   - Optional fields should be nullable

4. **Error Handling**

   - Check error messages are user-friendly
   - Verify error responses are properly displayed

5. **Multiple Selections**
   - Verify multiple tutors can be assigned
   - Verify multiple students can be assigned
   - Check parallel API calls handle errors correctly

---

## Success Criteria

✅ All three flows work end-to-end
✅ No hardcoded URLs in code
✅ All API calls match IhsaanLms.yaml specification
✅ Error handling works correctly
✅ Multiple assignments work as expected
✅ Data displays correctly in tables
