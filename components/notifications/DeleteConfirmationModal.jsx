"use client";

import { Delete, Close, Warning } from "@mui/icons-material";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  announcementTitle,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Warning className="w-6 h-6 text-red-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Delete Announcement
                </h2>
                <p className="text-gray-600 text-sm">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <Close className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Delete className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure?
            </h3>

            <p className="text-gray-600 mb-6">
              You are about to delete the announcement{" "}
              <span className="font-medium text-gray-800">
                "{announcementTitle}"
              </span>
              . This action will permanently remove it and cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Delete className="w-5 h-5" />
                    Delete Announcement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
