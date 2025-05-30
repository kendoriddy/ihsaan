import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Autocomplete,
  Box,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";

const GroupStudents = ({
  open,
  onClose,
  assessmentId,
  assessment,
  getAuthToken,
}) => {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoGrouping, setAutoGrouping] = useState(false);
  const [step, setStep] = useState(0); // Step 0: Choose method, Step 1: Manual, Step 2: Auto
  const [groupSize, setGroupSize] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [groupPrefix, setGroupPrefix] = useState("Group");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Fetch existing groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://ihsaanlms.onrender.com/assessment/groups/`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
          params: { assessment: assessmentId }, // Pass assessment_id as params
        }
      );
      setGroups(response.data.results || []);
    } catch (error) {
      toast.error("Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };
  console.log(assessment, "assessment:::");

  // Fetch students
  const fetchStudents = async (search = "") => {
    try {
      setLoading(true);
      const url = search
        ? `https://ihsaanlms.onrender.com/course/course-enrollments/?course_id=${assessment.course}&search=${search}`
        : `https://ihsaanlms.onrender.com/course/course-enrollments/?course_id=${assessment.course}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      setStudents(response.data.results || []);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // Auto-group students
  const handleAutoGroup = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://ihsaanlms.onrender.com/assessment/groups/auto_split/",
        {
          assessment_id: assessmentId,
          group_size: groupSize === "" ? 0 : Number(groupSize),
          group_count: groupCount === "" ? 0 : Number(groupCount),
          group_prefix: groupPrefix,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      const {
        created_groups,
        total_students,
        groups: createdGroups,
      } = response.data;

      toast.success(
        `${created_groups} groups created successfully for ${total_students} students!`
      );

      // Update the groups state with the newly created groups
      fetchGroups();
    } catch (error) {
      console.log(error, "whyyy");
      toast.error("Failed to auto-group students");
    } finally {
      setLoading(false);
    }
  };
  console.log(groups, "groups:::::");
  // Manually create a group
  const [createGroupLoading, setCreateGroupLoading] = useState(false);
  const handleCreateGroup = async () => {
    if (!newGroupName || !selectedLeader || selectedMembers.length === 0) {
      toast.error("Please provide all required fields for the group");
      return;
    }

    try {
      setCreateGroupLoading(true);
      await axios.post(
        "https://ihsaanlms.onrender.com/assessment/groups/",
        {
          name: newGroupName,
          assessment: assessmentId,
          leader: selectedLeader,
          members: selectedMembers,
          is_active: true,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      toast.success("Group created successfully!");
      fetchGroups();
      setNewGroupName("");
      setSelectedLeader("");
      setSelectedMembers([]);
    } catch (error) {
      console.log(error, "group creation error:::::");
      toast.error("Failed to create group");
    } finally {
      setCreateGroupLoading(false);
    }
  };

  const [addLoading, setAddLoading] = useState(false);
  // Add members to a group
  const handleAddMembers = async (groupId, memberIds) => {
    try {
      setAddLoading(true);
      await axios.post(
        `https://ihsaanlms.onrender.com/assessment/groups/${groupId}/add_members/`,
        {
          student_ids: memberIds,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      toast.success("Members added successfully!");
      fetchGroups();
    } catch (error) {
      toast.error("Failed to add members");
    } finally {
      setAddLoading(false);
    }
  };

  const [removingMemberId, setRemovingMemberId] = useState(null); // Track the member being removed
  // Remove members from a group
  const handleRemoveMembers = async (groupId, memberIds) => {
    try {
      setRemovingMemberId(memberIds[0]);
      await axios.post(
        `https://ihsaanlms.onrender.com/assessment/groups/${groupId}/remove_members/`,
        {
          student_ids: memberIds,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      toast.success("Members removed successfully!");
      fetchGroups();
    } catch (error) {
      toast.error("Failed to remove members");
    } finally {
      setRemovingMemberId(null);
    }
  };

  useEffect(() => {
    if (open) {
      fetchGroups();
      fetchStudents();
    }
  }, [open]);

  // Function to update the group leader
  const updateGroupLeader = async (groupId, newLeaderId) => {
    try {
      await axios.patch(
        `https://ihsaanlms.onrender.com/assessment/groups/${groupId}/`,
        { leader: newLeaderId, assessment: assessmentId },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      toast.success("Group leader updated successfully!");
      fetchGroups(); // Refresh groups to reflect changes
    } catch (error) {
      toast.error("Failed to update group leader");
    }
  };

  // Function to update the group name
  const updateGroupName = async (groupId, newName) => {
    try {
      const response = await axios.patch(
        `https://ihsaanlms.onrender.com/assessment/groups/${groupId}/`,
        { name: newName, assessment: assessmentId },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      console.log("qqqq", response.data);
      toast.success("Group name updated successfully!");
      fetchGroups(); // Refresh groups to reflect changes
    } catch (error) {
      console.log("wwww", error);
      toast.error("Failed to update group name");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Group Students</DialogTitle>
      <DialogContent>
        {loading && (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        )}
        <>
          {/* Display Groups Section */}
          <div className="mb-4">
            {!loading && groups.length === 0 ? (
              <>
                {step === 0 && (
                  <div className="text-center py-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                      How would you like to group the students?
                    </h3>
                    <div className="flex justify-center space-x-4">
                      <button
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        onClick={() => setStep(1)}
                      >
                        Manual Creation
                      </button>
                      <button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                        onClick={() => setStep(2)}
                      >
                        Auto Splitting
                      </button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Manual Grouping
                    </h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Name
                      </label>
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter group name"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Leader
                      </label>
                      <select
                        value={selectedLeader}
                        onChange={(e) => setSelectedLeader(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          Choose a leader
                        </option>
                        {students.map((student) => (
                          <option key={student.user} value={student.user}>
                            {student.user_fullname || "First name"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 -mb-3">
                        Select Members
                      </label>
                      <FormControl fullWidth margin="normal">
                        <Autocomplete
                          multiple
                          options={students}
                          getOptionLabel={(option) => option.user_fullname}
                          value={selectedMembers.map((id) =>
                            students.find((student) => student.user === id)
                          )}
                          onChange={(event, value) => {
                            setSelectedMembers(
                              value.map((student) => student.user)
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Members"
                              variant="outlined"
                              margin="normal"
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        className="bg-[#f34103] text-white px-4 py-2 rounded-md transition"
                        onClick={handleCreateGroup}
                        disabled={loading}
                      >
                        {createGroupLoading ? "Loading..." : "Create Group"}
                      </button>
                      <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                        onClick={() => setStep(0)}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Auto Grouping
                    </h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Size
                      </label>
                      <input
                        type="number"
                        value={groupSize}
                        onChange={(e) => {
                          setGroupSize(e.target.value);
                          if (e.target.value) setGroupCount(""); // Clear Group Count if Group Size is set
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!groupCount} // Disable if Group Count is set
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Count
                      </label>
                      <input
                        type="number"
                        value={groupCount}
                        onChange={(e) => {
                          setGroupCount(e.target.value);
                          if (e.target.value) setGroupSize(""); // Clear Group Size if Group Count is set
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!groupSize} // Disable if Group Size is set
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Prefix
                      </label>
                      <input
                        type="text"
                        value={groupPrefix}
                        onChange={(e) => setGroupPrefix(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={handleAutoGroup}
                        disabled={loading}
                      >
                        Auto Group
                      </button>
                      <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition ml-4"
                        onClick={() => setStep(0)}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : !loading && groups.length > 0 ? (
              <>
                <ul>
                  {groups.map((group) => {
                    const leaderName =
                      group.members_detail.find(
                        (member) => member.id === group.leader
                      )?.full_name || "Unknown";

                    return (
                      <>
                        <li key={group.id} className="mb-6 border-b pb-4">
                          {/* Editable Group Name */}
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="text"
                              value={group.name}
                              onChange={(e) => {
                                const updatedGroups = groups.map((g) =>
                                  g.id === group.id
                                    ? { ...g, name: e.target.value }
                                    : g
                                );
                                setGroups(updatedGroups);
                              }}
                              // onBlur={() =>
                              //   updateGroupName(group.id, group.name)
                              // }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              className="bg-[#f34103] text-white px-4 py-2 rounded-md transition ml-1"
                              onClick={() =>
                                updateGroupName(group.id, group.name)
                              }
                            >
                              Update
                            </button>
                          </div>
                          {/* Change Group Leader */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Group Leader
                            </label>
                            <select
                              value={group.leader}
                              onChange={(e) =>
                                updateGroupLeader(group.id, e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {group.members_detail.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* Group Members */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Members
                            </h4>
                            <ul className="ml-4">
                              {group.members_detail.map((member) => (
                                <li
                                  key={member.id}
                                  className="flex items-center justify-between"
                                >
                                  <span>{member.full_name || "Unknown"}</span>
                                  <button
                                    onClick={() =>
                                      handleRemoveMembers(group.id, [member.id])
                                    }
                                    className="text-red-500 hover:underline"
                                  >
                                    {removingMemberId === member.id
                                      ? "Loading..."
                                      : "Remove"}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {addLoading && "Loading..."}
                          <Autocomplete
                            options={students}
                            getOptionLabel={(option) => option.user_fullname}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Search and add more students"
                                variant="outlined"
                                margin="normal"
                              />
                            )}
                            onChange={(event, value) => {
                              if (value) {
                                handleAddMembers(group.id, [value.user]);
                              }
                            }}
                          />
                        </li>
                      </>
                    );
                  })}
                </ul>

                {/* Manual Grouping Section */}
                <hr />
                <div className="mb-4">
                  <h3 className="my-4">Add Groups</h3>
                  <hr />
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Group Name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Select Leader</InputLabel>
                    <Select
                      value={selectedLeader}
                      onChange={(e) => setSelectedLeader(e.target.value)}
                    >
                      {students.map((student) => (
                        <MenuItem key={student.user} value={student.user}>
                          {student.user_fullname || "First name"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <Autocomplete
                      multiple
                      options={students}
                      getOptionLabel={(option) => option.user_fullname}
                      value={selectedMembers.map((id) =>
                        students.find((student) => student.user === id)
                      )}
                      onChange={(event, value) => {
                        setSelectedMembers(
                          value.map((student) => student.user)
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Members"
                          variant="outlined"
                          margin="normal"
                        />
                      )}
                    />
                  </FormControl>
                  <button
                    className="bg-[#f34103] text-white px-4 py-2 rounded-md transition"
                    onClick={handleCreateGroup}
                    disabled={loading}
                  >
                    {createGroupLoading ? "Loading..." : "Create Group"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupStudents;
