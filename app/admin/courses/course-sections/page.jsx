"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import videojs from "video.js";
// import "video.js/dist/video.css";
// import "../../../../styles/global.css";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);
  formData.append("type", "IMAGE");

  try {
    console.log("Uploading file to Cloudinary...");
    const uploadResponse = await fetch(
      "https://yrms-api.onrender.com/api/resources/",
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadResult = await uploadResponse.json();
    console.log("Upload result:", uploadResult);

    return {
      success: true,
      url: uploadResult.media_url,
      cloudId: uploadResult.public_id,
    };
  } catch (error) {
    console.error("File upload error:", error.message);
    throw new Error("Failed to upload file: " + error.message);
  }
};

const extractVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);

      // Format duration as MM:SS
      const formattedDuration = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      resolve(formattedDuration);
    };

    videoElement.onerror = (error) => {
      reject(error);
    };

    videoElement.src = URL.createObjectURL(file);
  });
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courseId, setCourseId] = useState(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSaveContinueModal, setShowSaveContinueModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  useEffect(() => {
    if (searchParams.has("courseId")) {
      setCourseId(searchParams.get("courseId"));
    }
  }, [searchParams]);

  const [sections, setSections] = useState([]);

  const startAddSection = () => {
    setShowAddSection(true);
    setNewSectionTitle("");
  };

  const saveNewSection = async () => {
    if (newSectionTitle.trim()) {
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://yrms-api.onrender.com/api/courses-sections/create",
          {
            title: newSectionTitle,
            course: courseId || 1,
          }
        );

        setSections((prev) => [
          ...prev,
          {
            id: response.data.id,
            title: newSectionTitle,
            items: [],
            isSaved: true,
            showItems: true,
          },
        ]);
        setShowAddSection(false);
      } catch (error) {
        console.error("Error creating section:", error);
        alert(`Failed to create section: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter a section title");
    }
  };

  const updateSectionTitle = (index, title) => {
    const updatedSections = [...sections];
    updatedSections[index].title = title;
    setSections(updatedSections);
  };

  const addItem = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].items.push({
      title: "",
      description: "",
      duration: "00:00",
      file: null,
      additionalResources: [],
      isSaved: false,
      isEditing: true,
    });
    setSections(updatedSections);
  };

  const updateItem = (sectionIndex, itemIndex, field, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].items[itemIndex][field] = value;
    setSections(updatedSections);
  };

  // const handleFileUpload = (sectionIndex, itemIndex, file) => {
  //   const updatedSections = [...sections];
  //   updatedSections[sectionIndex].items[itemIndex].file = file;
  //   setSections(updatedSections);
  // };

  // Modify your existing handleFileUpload function
  const handleFileUpload = async (sectionIndex, itemIndex, file) => {
    try {
      // Extract video duration before updating state
      const duration = await extractVideoDuration(file);

      const updatedSections = [...sections];
      updatedSections[sectionIndex].items[itemIndex].file = file;
      updatedSections[sectionIndex].items[itemIndex].duration = duration;
      setSections(updatedSections);
    } catch (error) {
      console.error("Error extracting video duration:", error);
      alert("Could not extract video duration");
    }
  };

  const handleAdditionalUpload = (sectionIndex, itemIndex, file) => {
    const updatedSections = [...sections];
    let additionalResources =
      updatedSections[sectionIndex].items[itemIndex].additionalResources;

    if (additionalResources.length < 2) {
      additionalResources.push(file);
      updatedSections[sectionIndex].items[itemIndex].additionalResources =
        additionalResources;
      setSections(updatedSections);
    }
  };

  const editSection = (index) => {
    const updatedSections = [...sections];
    updatedSections[index].isSaved = false;
    setSections(updatedSections);
  };

  const resaveSection = async (index) => {
    const section = sections[index];
    setIsLoading(true);

    try {
      await axios.put(
        `https://yrms-api.onrender.com/api/courses-sections/${section.id}`,
        {
          title: section.title,
          course: courseId || 1,
        }
      );

      const updatedSections = [...sections];
      updatedSections[index].isSaved = true;
      setSections(updatedSections);
    } catch (error) {
      console.error("Error updating section:", error);
      alert(`Failed to update section: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItem = async (sectionIndex, itemIndex) => {
    const section = sections[sectionIndex];
    const item = section.items[itemIndex];
    setIsLoading(true);

    try {
      let mediaUrl = "";
      let cloudId = "";

      if (item.file) {
        const uploadResult = await uploadToCloudinary(item.file);
        if (!uploadResult.success) {
          throw new Error("File upload failed");
        }
        mediaUrl = uploadResult.url;
        cloudId = uploadResult.cloudId;
      }

      const duration = item.duration || "00:00";

      const response = await axios.post(
        "https://yrms-api.onrender.com/api/courses-videos/create",
        {
          title: item.title,
          duration: duration,
          section: section.id,
          media_url: mediaUrl,
          cloud_id: cloudId,
        }
      );

      const updatedSections = [...sections];
      updatedSections[sectionIndex].items[itemIndex] = {
        ...item,
        id: response.data.id,
        media_url: mediaUrl,
        cloud_id: cloudId,
        isSaved: true,
        isEditing: false,
      };
      setSections(updatedSections);
    } catch (error) {
      console.error("Error saving item:", error);
      alert(`Failed to save item: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const editItem = (sectionIndex, itemIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].items[itemIndex].isSaved = false;
    updatedSections[sectionIndex].items[itemIndex].isEditing = true;
    setSections(updatedSections);
  };

  const handleSaveAndContinue = () => {
    setShowSaveContinueModal(true);
  };

  const handleFinishCourse = () => {
    setShowFinishModal(true);
  };

  const confirmSaveAndContinue = () => {
    setShowSaveContinueModal(false);
    router.push("/admin/courses");
  };

  const confirmFinishCourse = async () => {
    setShowFinishModal(false);
    setIsLoading(true);

    try {
      await axios.put(`https://yrms-api.onrender.com/api/courses/${courseId}`, {
        status: "submitted",
      });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating course status:", error);
      alert(`Failed to update course status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    router.push("/admin/courses");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Add Course Sections And Videos
      </h1>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8 p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Section {sectionIndex + 1}: {section.title}
            </h2>

            {!section.isSaved ? (
              <button
                onClick={() => resaveSection(sectionIndex)}
                disabled={isLoading}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Saving..." : "Save Section"}
              </button>
            ) : (
              <button
                onClick={() => editSection(sectionIndex)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Edit Section
              </button>
            )}
          </div>

          {section.showItems && (
            <>
              <button
                onClick={() => addItem(sectionIndex)}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Videos
              </button>

              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="mb-4 p-4 bg-gray-100 rounded">
                  {item.isEditing ? (
                    <>
                      <input
                        type="text"
                        placeholder="Item Title"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />

                      <textarea
                        placeholder="Item Description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(
                            sectionIndex,
                            itemIndex,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />

                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (MM:SS)
                        </label>
                        <input
                          type="text"
                          placeholder="00:00"
                          value={item.duration}
                          onChange={(e) =>
                            updateItem(
                              sectionIndex,
                              itemIndex,
                              "duration",
                              e.target.value
                            )
                          }
                          className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Video File
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) =>
                            handleFileUpload(
                              sectionIndex,
                              itemIndex,
                              e.target.files[0]
                            )
                          }
                        />
                      </div>

                      {item.file && (
                        <p className="text-sm text-gray-600 mb-2">
                          Selected file: {item.file.name}
                        </p>
                      )}

                      <div className="mt-3">
                        <p className="text-sm font-semibold">
                          Additional Resources
                        </p>
                        {item.additionalResources.map((file, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {file.name}
                          </p>
                        ))}

                        <div className="flex items-center gap-2 mt-2">
                          {item.additionalResources.length < 2 && (
                            <>
                              <button
                                onClick={() =>
                                  document
                                    .getElementById(
                                      `file-${sectionIndex}-${itemIndex}`
                                    )
                                    .click()
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                Add Resource
                              </button>
                              <input
                                type="file"
                                id={`file-${sectionIndex}-${itemIndex}`}
                                onChange={(e) =>
                                  handleAdditionalUpload(
                                    sectionIndex,
                                    itemIndex,
                                    e.target.files[0]
                                  )
                                }
                                className="hidden"
                              />
                            </>
                          )}

                          <button
                            onClick={() => saveItem(sectionIndex, itemIndex)}
                            disabled={isLoading || !item.title || !item.file}
                            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                              isLoading || !item.title || !item.file
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {isLoading ? "Saving..." : "Save Item"}
                          </button>
                        </div>

                        {(!item.title || !item.file) && (
                          <p className="text-xs text-red-500 mt-1">
                            * Title and video file are required
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-gray-700">{item.description}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          Duration: {item.duration}
                        </p>

                        {item.media_url && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold">Video:</p>
                            <a
                              href={item.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View video
                            </a>
                          </div>
                        )}

                        {item.additionalResources.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold">
                              Additional Resources:
                            </p>
                            <ul className="ml-4 list-disc">
                              {item.additionalResources.map((file, idx) => (
                                <li key={idx} className="text-sm text-gray-600">
                                  {file.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => editItem(sectionIndex, itemIndex)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit Item
                      </button>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ))}

      {showAddSection && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Add New Section</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={saveNewSection}
              disabled={isLoading || !newSectionTitle.trim()}
              className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                isLoading || !newSectionTitle.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Saving..." : "Save Section"}
            </button>
          </div>
        </div>
      )}

      {!showAddSection && (
        <button
          onClick={startAddSection}
          className="mb-8 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Section
        </button>
      )}

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSaveAndContinue}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save & Continue
        </button>
        <button
          onClick={handleFinishCourse}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Finish
        </button>
      </div>

      {showSaveContinueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Do you want to continue the course creation at a later time?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmSaveAndContinue}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowSaveContinueModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">
              Are you sure you are done with the course creation?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmFinishCourse}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowFinishModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              Course Creation Successful!
            </h2>
            <p className="mb-6">An admin will now review it for approval.</p>
            <button
              onClick={closeSuccessModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
