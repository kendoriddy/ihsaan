import React, { useEffect, useState } from "react";
import { Tabs, Tab, IconButton, Menu, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgrammes } from "@/utils/redux/slices/programmeSlice";
import { fetchProgrammeTypes } from "@/utils/redux/slices/programmeTypeSlice";
import { fetchClasses } from "@/utils/redux/slices/classesSlice";
import { fetchLevels } from "@/utils/redux/slices/levelsSlice";
import Button from "../Button";
import Modal from "../validation/Modal";
import axios from "axios";
import { MoreVert } from "@mui/icons-material";
import { toast } from "react-toastify";
import { set } from "date-fns";

const DashboardTab = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("programmes");
  const [programmeOpen, setProgrammeOpen] = useState(false);
  const [programmeTypeOpen, setProgrammeTypeOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPTMode, setEditPTMode] = useState(false);
  const [editClassMode, setEditClassMode] = useState(false);
  const [editLevelMode, setEditLevelMode] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [selectedProgrammeType, setSelectedProgrammeType] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPT, setAnchorElPT] = useState(null);
  const [anchorElClass, setAnchorElClass] = useState(null);
  const [anchorElLevel, setAnchorElLevel] = useState(null);

  const openPTMenu = Boolean(anchorElPT);
  const openClassMenu = Boolean(anchorElClass);
  const openLevelMenu = Boolean(anchorElLevel);
  const openMenu = Boolean(anchorEl);

  const [programmeForm, setProgrammeForm] = useState({
    name: "",
    code: "",
    type: "",
    class_group: "",
    duration_months: "",
    level: "",
    price: "",
  });
  const [programmeTypeForm, setProgrammeTypeForm] = useState({
    name: "",
  });
  const [classForm, setClassForm] = useState({
    level: "",
    class_number: "",
  });
  const [levelForm, setLevelForm] = useState({
    level: "",
    order: "",
  });

  const { programmes } = useSelector((state) => state.programme);
  const { programmeTypes } = useSelector((state) => state.programmeType);
  const { classes } = useSelector((state) => state.classes);
  const { levels } = useSelector((state) => state.levels);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProgrammeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handlePTInputChange = (e) => {
    const { name, value } = e.target;
    setProgrammeTypeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleClassInputChange = (e) => {
    const { name, value } = e.target;
    setClassForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLevelInputChange = (e) => {
    const { name, value } = e.target;
    setLevelForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editMode) {
        // PATCH request for editing
        await axios.patch(
          `https://api.ihsaanacademia.com/programmes/${selectedProgramme.id}/`,
          programmeForm,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Programme updated successfully");
        toast.success("Programme updated successfully");
        dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
      } else {
        // POST request for adding a new programme
        await axios.post(
          "https://api.ihsaanacademia.com/programmes/",
          programmeForm,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Programme added successfully");
        dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
      }
      setProgrammeOpen(false); // Close the modal after successful submission
      console.log("Programme added successfully:", response.data);
      dispatch(fetchProgrammes({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error("Error adding programme:", error.response?.data || error);
    } finally {
      setIsLoading(false);
      setEditMode(false);
      setProgrammeForm({
        name: "",
        code: "",
        type: "",
        class_group: "",
        duration_months: "",
        level: "",
        price: "",
      }); // Reset form fields
      setSelectedProgramme(null); // Reset selected programme
    }
  };

  const handlePTSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editMode) {
        // PATCH request for editing
        await axios.patch(
          `https://api.ihsaanacademia.com/programme-types/${selectedProgrammeType.id}/`,
          programmeTypeForm,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Programme updated successfully");
        toast.success("Programme updated successfully");
        dispatch(fetchProgrammeTypes({ page: 1, pageSize: 10 }));
      } else {
        // POST request for adding a new programme
        await axios.post(
          "https://api.ihsaanacademia.com/programme-types/",
          programmeTypeForm,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Programme added successfully");
      }
      setProgrammeTypeOpen(false); // Close the modal after successful submission
      console.log("Programme added successfully:", response.data);
      dispatch(fetchProgrammeTypes({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error("Error adding programme:", error.response?.data || error);
    } finally {
      setIsLoading(false);
      setEditPTMode(false);
      setProgrammeTypeForm({
        name: "",
      }); // Reset form fields
    }
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Convert class_number to a Number before sending the payload
      console.log(classForm, "classForm:");
      const payload = {
        ...classForm,
        level: Number(classForm.level),
      };

      if (editClassMode) {
        // PATCH request for editing
        await axios.patch(
          `https://api.ihsaanacademia.com/classes/${selectedClass.id}/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Programme updated successfully");
        toast.success("Programme updated successfully");
        dispatch(fetchClasses({ page: 1, pageSize: 10 }));
      } else {
        // POST request for adding a new programme
        await axios.post("https://api.ihsaanacademia.com/classes/", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Programme added successfully");
      }
      setClassOpen(false); // Close the modal after successful submission
      console.log("Programme added successfully:", response.data);
      dispatch(fetchClasses({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error("Error adding programme:", error.response?.data || error);
    } finally {
      setIsLoading(false);
      setEditClassMode(false);
      setClassForm({
        level: "",
        class_number: "",
      }); // Reset form fields
    }
  };

  const handleLevelSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Convert class_number to a Number before sending the payload
      const payload = {
        ...levelForm,
        level: Number(levelForm.level),
      };

      if (editClassMode) {
        // PATCH request for editing
        await axios.patch(
          `https://api.ihsaanacademia.com/levels/${selectedLevel.id}/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Programme updated successfully");
        toast.success("Programme updated successfully");
        dispatch(fetchLevels({ page: 1, pageSize: 10 }));
      } else {
        // POST request for adding a new programme
        await axios.post("https://api.ihsaanacademia.com/levels/", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Programme added successfully");
      }
      setClassOpen(false); // Close the modal after successful submission
      console.log("Programme added successfully:", response.data);
      dispatch(fetchLevels({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error("Error adding programme:", error.response?.data || error);
    } finally {
      setIsLoading(false);
      setEditClassMode(false);
      setClassForm({
        level: "",
        class_number: "",
      }); // Reset form fields
    }
  };

  useEffect(() => {
    // Fetch data from the redux store
    dispatch(fetchProgrammeTypes({ page: 1, pageSize: 10 }));
    dispatch(fetchProgrammes({ page: 1, pageSize: 10 }));
    dispatch(fetchClasses({ page: 1, pageSize: 10 }));
    dispatch(fetchLevels({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  //   console.log(state, "state");
  console.log(programmes, programmeTypes, classes, levels, "SAWWW");

  const handleMenuClick = (event, programme) => {
    setAnchorEl(event.currentTarget);
    setSelectedProgramme(programme);
  };

  const handlePTMenuClick = (event, programmeType) => {
    setAnchorElPT(event.currentTarget);
    setSelectedProgrammeType(programmeType);
  };

  const handleClassMenuClick = (event, classItem) => {
    setAnchorElClass(event.currentTarget);
    setSelectedClass(classItem);
  };

  const handleLevelMenuClick = (event, level) => {
    setAnchorElLevel(event.currentTarget);
    setSelectedLevel(level);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePTMenuClose = () => {
    setAnchorElPT(null);
  };

  const handleClassMenuClose = () => {
    setAnchorElClass(null);
  };

  const handleLevelMenuClose = () => {
    setAnchorElLevel(null);
  };

  const handleEdit = () => {
    setEditMode(true);
    setProgrammeForm({
      name: selectedProgramme.name,
      code: selectedProgramme.code,
      type: selectedProgramme.type,
      class_group: selectedProgramme.class_group,
      duration_months: selectedProgramme.duration_months,
      level: selectedProgramme.level,
    });
    setProgrammeOpen(true);
    handleMenuClose();
  };

  const handleEditPT = () => {
    setEditPTMode(true);
    setProgrammeTypeForm({
      name: selectedProgrammeType.name,
    });
    setProgrammeTypeOpen(true);
    handlePTMenuClose();
  };

  const handleEditClass = () => {
    setEditClassMode(true);
    setClassForm({
      level: selectedClass.level,
      class_number: selectedClass.class_number,
    });
    setClassOpen(true);
    handleClassMenuClose();
  };

  const handleEditLevel = () => {
    setEditLevelMode(true);
    setLevelForm({
      level: selectedLevel.level,
      order: selectedLevel.order,
    });
    setLevelOpen(true);
    handleLevelMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://api.ihsaanacademia.com/programmes/${selectedProgramme.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Programme deleted successfully");
      toast.success("Programme deleted successfully");
      dispatch(fetchProgrammes({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error("Error deleting programme:", error.response?.data || error);
      toast.error("Error deleting programme");
    } finally {
      handleMenuClose();
    }
  };

  const handlePTDelete = async () => {
    try {
      await axios.delete(
        `https://api.ihsaanacademia.com/programme-types/${selectedProgrammeType.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Programme deleted successfully");
      toast.success("Programme deleted successfully");
      dispatch(fetchProgrammeTypes({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error(
        "Error deleting programme type:",
        error.response?.data || error
      );
      toast.error("Error deleting programme type");
    } finally {
      handlePTMenuClose();
    }
  };

  const handleClassDelete = async () => {
    try {
      await axios.delete(
        `https://api.ihsaanacademia.com/classes/${selectedClass.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Class deleted successfully");
      toast.success("Class deleted successfully");
      dispatch(fetchClasses({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error(
        "Error deleting programme type:",
        error.response?.data || error
      );
      toast.error("Error deleting class");
    } finally {
      handleClassMenuClose();
    }
  };

  const handleLevelDelete = async () => {
    try {
      await axios.delete(
        `https://api.ihsaanacademia.com/levels/${selectedLevel.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Level deleted successfully");
      toast.success("Level deleted successfully");
      dispatch(fetchLevels({ page: 1, pageSize: 10 })); // Refresh the programmes list
    } catch (error) {
      console.error(
        "Error deleting programme type:",
        error.response?.data || error
      );
      toast.error("Error deleting class");
    } finally {
      handleClassMenuClose();
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "programmes":
        return (
          <>
            <div className="flex justify-between items-center px-8 mb-4">
              <div className="text-lg font-bold">Programmes</div>
              <div>
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setProgrammeOpen(true)}
                >
                  Add Programme
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programmes.map((programme) => (
                <div
                  key={programme.id}
                  className="border rounded-lg shadow-md p-4 bg-white relative"
                >
                  <div
                    className="absolute top-2 right-2"
                    onClick={(event) => handleMenuClick(event, programme)}
                  >
                    <MoreVert />
                  </div>
                  <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                  <h3 className="text-lg font-bold">{programme.name}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Code:</strong> {programme.code}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Type:</strong> {programme.type_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Class Group:</strong> {programme.class_group_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Duration:</strong> {programme.duration_months}{" "}
                    months
                  </p>
                  {/* {programme.courses.length > 0 ? (
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold">Courses:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {programme.courses.map((course) => (
                          <li key={course.id}>
                            {course.name} ({course.code})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No courses available
                    </p>
                  )} */}
                </div>
              ))}
            </div>
          </>
        );
      case "programme-type":
        return (
          <>
            <div className="flex justify-between items-center px-8 mb-4">
              <div className="text-lg font-bold">Programme Types</div>
              <div>
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setProgrammeTypeOpen(true)}
                >
                  Add Programme Type
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programmeTypes.map((type) => (
                <div
                  key={type.id}
                  className="border rounded-lg shadow-md p-4 bg-white text-center"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {type.name}
                  </h3>
                </div>
              ))}
            </div>
          </>
        );
      case "classes":
        return (
          <>
            <div className="flex justify-between items-center px-8 mb-4">
              <div className="text-lg font-bold">Classes</div>
              <div>
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setClassOpen(true)}
                >
                  Add Class
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="border rounded-lg shadow-md p-4 bg-white relative"
                >
                  <div
                    className="absolute top-2 right-2"
                    onClick={(event) => handleClassMenuClick(event, classItem)}
                  >
                    <MoreVert />
                  </div>
                  <Menu
                    anchorEl={anchorElClass}
                    open={openClassMenu}
                    onClose={handleClassMenuClose}
                  >
                    <MenuItem onClick={handleEditClass}>Edit</MenuItem>
                    <MenuItem onClick={handleClassDelete}>Delete</MenuItem>
                  </Menu>

                  <h3 className="text-lg font-bold">
                    {classItem.display_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Level:</strong> {classItem.level_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Class Number:</strong> {classItem.class_number}
                  </p>
                </div>
              ))}
            </div>
          </>
        );
      case "levels":
        return (
          <>
            <div className="flex justify-between items-center px-8 mb-4">
              <div className="text-lg font-bold">Levels</div>
              <div>
                <Button
                  className="bg-red-600 text-white px-3 py-2 rounded hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setLevelOpen(true)}
                >
                  Add Level
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map((level) => (
                <div
                  key={level.id}
                  className="border rounded-lg shadow-md p-4 bg-white text-center relative"
                >
                  <IconButton
                    className="absolute top-2 right-2"
                    onClick={(event) => handleLevelMenuClick(event, level)}
                  >
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorElClass}
                    open={openClassMenu}
                    onClose={handleLevelMenuClose}
                  >
                    <MenuItem onClick={handleEditLevel}>Edit</MenuItem>
                    <MenuItem onClick={handleLevelDelete}>Delete</MenuItem>
                  </Menu>

                  <h3 className="text-lg font-bold text-gray-800">
                    {level.level}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Order:</strong> {level.order}
                  </p>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
      >
        <Tab label="Programmes" value="programmes" />
        <Tab label="Programme Type" value="programme-type" />
        <Tab label="Classes" value="classes" />
        <Tab label="Levels" value="levels" />
      </Tabs>

      {/* Tab Content */}
      <div className="tab-content mt-4">{renderTabContent()}</div>

      {/* Modal for Adding/Editing Programme */}
      <Modal
        isOpen={programmeOpen}
        title={editMode ? "Edit Programme" : "Add Programme"}
        handleClose={() => {
          setProgrammeOpen(false);
          setEditMode(false); // Reset edit mode
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={programmeForm.name}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code
            </label>
            <input
              type="text"
              name="code"
              value={programmeForm.code}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={programmeForm.type}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a type
              </option>
              {programmeTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Group
            </label>
            <select
              name="class_group"
              value={programmeForm.class_group}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a level
              </option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.display_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (Months)
            </label>
            <input
              type="number"
              name="duration_months"
              value={programmeForm.duration_months}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              name="level"
              value={programmeForm.level}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a level
              </option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.level}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={programmeForm.price}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setProgrammeOpen(false)}
              className="mr-2 px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Adding/Editing Programme type */}
      <Modal
        isOpen={programmeTypeOpen}
        title={editPTMode ? "Edit Programme Type" : "Add Programme Type"}
        handleClose={() => {
          setProgrammeTypeOpen(false);
          setEditPTMode(false); // Reset edit mode
        }}
      >
        <form onSubmit={handlePTSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={programmeTypeForm.name}
              onChange={handlePTInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setProgrammeTypeOpen(false)}
              className="mr-2 px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Adding/Editing Class */}
      <Modal
        isOpen={classOpen}
        title={editClassMode ? "Edit Class" : "Add Class"}
        handleClose={() => {
          setClassOpen(false);
          setEditClassMode(false); // Reset edit mode
        }}
      >
        <form onSubmit={handleClassSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Class Number
            </label>
            <input
              type="text"
              name="class_number"
              value={classForm.class_number}
              onChange={handleClassInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              name="level"
              value={classForm.level}
              onChange={handleClassInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a level
              </option>

              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.level}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setClassOpen(false)}
              className="mr-2 px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Adding/Editing Level */}
      <Modal
        isOpen={levelOpen}
        title={editLevelMode ? "Edit Level" : "Add Level"}
        handleClose={() => {
          setLevelOpen(false);
          setEditLevelMode(false); // Reset edit mode
        }}
      >
        <form onSubmit={handleLevelSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Order
            </label>
            <input
              type="text"
              name="order"
              value={levelForm.order}
              onChange={handleLevelInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              name="level"
              value={levelForm.level}
              onChange={handleLevelInputChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="" disabled>
                Select a level
              </option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.level}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setClassOpen(false)}
              className="mr-2 px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardTab;
