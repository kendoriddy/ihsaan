// "use client";

// import React from "react";
// import { Formik, Form, Field } from "formik";
// import {
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Box,
// } from "@mui/material";
// import Button from "@/components/Button";
// import { usePost, usePatch } from "@/hooks/useHttp/useHttp";
// import { manualGradeSchema } from "@/components/validationSchemas/ValidationSchema";
// import Swal from "sweetalert2";

// const ReasonsForm = ({ reason = null, isEdit = false, onClose, onSuccess }) => {
//   // Create mutation
//   const { mutate: createManualGradeReason, isLoading: isCreating } = usePost(
//     "https://ihsaanlms.onrender.com/assessment/reason-options/"
//   );

//   // Update mutation
//   const { mutate: updateManualGradeReason, isLoading: isUpdating } = usePatch(
//     `https://ihsaanlms.onrender.com/assessment/reason-options/${reason?.id}/`
//   );

//   const initialValues = {
//     name: reason?.name || "",
//     description: reason?.description || "",
//   };

//   const handleSubmit = (values, { resetForm }) => {
//     const submitData = {
//       ...values,
//       score: parseFloat(values.score), // Ensure score is a number
//     };

//     const onSuccessCallback = () => {
//       Swal.fire({
//         title: `Manual grade reason ${
//           isEdit ? "updated" : "created"
//         } successfully`,
//         icon: "success",
//         customClass: {
//           confirmButton: "my-confirm-btn",
//         },
//       });
//       if (!isEdit) {
//         resetForm();
//       }
//       onSuccess?.();
//     };

//     const onErrorCallback = (error) => {
//       const errorData = error.response?.data;
//       if (typeof errorData === "string") {
//         Swal.fire({
//           title: errorData,
//           icon: "error",
//           customClass: {
//             confirmButton: "my-confirm-btn",
//           },
//         });
//       } else if (errorData && typeof errorData === "object") {
//         const messages = Object.values(errorData)
//           .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
//           .join(" ");
//         Swal.fire({
//           title: messages,
//           icon: "error",
//           customClass: {
//             confirmButton: "my-confirm-btn",
//           },
//         });
//       } else {
//         Swal.fire({
//           title: `Failed to ${isEdit ? "update" : "create"} manual grade`,
//           icon: "error",
//           customClass: {
//             confirmButton: "my-confirm-btn",
//           },
//         });
//       }
//     };

//     if (isEdit) {
//       updateManualGradeReason(submitData, {
//         onSuccess: onSuccessCallback,
//         onError: onErrorCallback,
//       });
//     } else {
//       createManualGradeReason(submitData, {
//         onSuccess: onSuccessCallback,
//         onError: onErrorCallback,
//       });
//     }
//   };

//   const isLoading = isCreating || isUpdating;

//   return (
//     <Box sx={{ pt: 2 }}>
//       <Formik
//         initialValues={initialValues}
//         validationSchema={manualGradeSchema}
//         onSubmit={handleSubmit}
//         enableReinitialize={true}
//       >
//         {({ errors, touched }) => {
//           return (
//             <Form>
//               {/* Score */}
//               <Field
//                 fullWidth
//                 margin="normal"
//                 type="text"
//                 label="Name"
//                 name="name"
//                 error={touched.name && Boolean(errors.name)}
//                 helperText={touched.name && errors.name}
//               />

//               {/* Details */}
//               <Field
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 rows={3}
//                 label="Description"
//                 name="description"
//                 error={touched.description && Boolean(errors.description)}
//                 helperText={touched.description && errors.description}
//               />

//               {/* Submit Buttons */}
//               <div className="flex justify-end gap-3 mt-6">
//                 <Button
//                   type="button"
//                   color="secondary"
//                   variant="outlined"
//                   onClick={onClose}
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading} color="primary">
//                   {isLoading
//                     ? isEdit
//                       ? "Updating..."
//                       : "Creating..."
//                     : isEdit
//                     ? "Update Reason"
//                     : "Create Reason"}
//                 </Button>
//               </div>
//             </Form>
//           );
//         }}
//       </Formik>
//     </Box>
//   );
// };

// export default ReasonsForm;

"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Box, Paper, Typography } from "@mui/material";
import Button from "@/components/Button";
import { usePost, usePatch } from "@/hooks/useHttp/useHttp";
import { manualGradeReasonSchema } from "@/components/validationSchemas/ValidationSchema";
import Swal from "sweetalert2";

const ReasonsForm = ({ reason = null, isEdit = false, onClose, onSuccess }) => {
  const { mutate: createManualGradeReason, isLoading: isCreating } = usePost(
    "https://ihsaanlms.onrender.com/assessment/reason-options/"
  );

  const { mutate: updateManualGradeReason, isLoading: isUpdating } = usePatch(
    `https://ihsaanlms.onrender.com/assessment/reason-options/${reason?.id}/`
  );

  const initialValues = {
    name: reason?.name || "",
    description: reason?.description || "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const submitData = { ...values };

    const onSuccessCallback = () => {
      Swal.fire({
        title: `Manual grade reason ${
          isEdit ? "updated" : "created"
        } successfully`,
        icon: "success",
        customClass: { confirmButton: "my-confirm-btn" },
      });
      if (!isEdit) resetForm();
      onSuccess?.();
    };

    const onErrorCallback = (error) => {
      const errorData = error.response?.data;
      let messages = "Something went wrong";
      if (typeof errorData === "string") {
        messages = errorData;
      } else if (errorData && typeof errorData === "object") {
        messages = Object.values(errorData)
          .map((msg) => (Array.isArray(msg) ? msg.join(" ") : msg))
          .join(" ");
      }
      Swal.fire({
        title: messages,
        icon: "error",
        customClass: { confirmButton: "my-confirm-btn" },
      });
    };

    if (isEdit) {
      updateManualGradeReason(submitData, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    } else {
      createManualGradeReason(submitData, {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {isEdit ? "Edit Reason" : "Create Reason"}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={manualGradeReasonSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            {/* Name */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            {/* Description */}
            <Field
              as={TextField}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              label="Description"
              name="description"
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                color="secondary"
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} color="primary">
                {isLoading
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Reason"
                  : "Create Reason"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default ReasonsForm;
