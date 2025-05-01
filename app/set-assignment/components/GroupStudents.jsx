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
      await axios.post(
        "https://ihsaanlms.onrender.com/assessment/groups/auto_split/",
        {
          assessment_id: assessmentId,
          group_size: groupSize,
          group_count: groupCount,
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
      toast.error("Failed to auto-group students");
    } finally {
      setLoading(false);
    }
  };
  console.log(groups, "groups:::::");
  // Manually create a group
  const handleCreateGroup = async () => {
    if (!newGroupName || !selectedLeader || selectedMembers.length === 0) {
      toast.error("Please provide all required fields for the group");
      return;
    }

    try {
      setLoading(true);
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
      toast.error("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  // Add members to a group
  const handleAddMembers = async (groupId, memberIds) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  // Remove members from a group
  const handleRemoveMembers = async (groupId, memberIds) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchGroups();
      fetchStudents();
    }
  }, [open]);

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
            <h3>Existing Groups</h3>
            {groups.length > 0 ? (
              <ul>
                {groups.map((group) => {
                  const leaderName =
                    group.members_detail.find(
                      (member) => member.id === group.leader
                    )?.full_name || "Unknown";

                  return (
                    <li key={group.id} className="mb-2">
                      <strong>{group.name}</strong> (Leader: {leaderName})
                      <ul>
                        {group.members_detail.map((member) => (
                          <li key={member.id} className="ml-4">
                            Member: {member.full_name || "Unknown"}{" "}
                            <Button
                              onClick={() =>
                                handleRemoveMembers(group.id, [member.id])
                              }
                              color="secondary"
                            >
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                      <FormControl fullWidth margin="normal">
                        <TextField
                          label="Search Students"
                          value={searchValue}
                          onChange={(e) => {
                            setSearchValue(e.target.value);
                            fetchStudents(e.target.value);
                          }}
                        />
                      </FormControl>
                      <ul>
                        {students.map((student) => (
                          <li key={student.id}>
                            {student.user_fullname}{" "}
                            <Button
                              onClick={() =>
                                handleAddMembers(group.id, [student.user])
                              }
                              color="primary"
                            >
                              Add
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No groups created yet.</p>
            )}
          </div>

          {/* Hide Auto Grouping and Manual Grouping if Groups Exist */}
          {groups.length === 0 && (
            <>
              {/* Auto Grouping Section */}
              <div className="mb-4">
                <h3>Auto Grouping</h3>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Group Size"
                    type="number"
                    value={groupSize}
                    onChange={(e) => setGroupSize(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Group Count"
                    type="number"
                    value={groupCount}
                    onChange={(e) => setGroupCount(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <TextField
                    label="Group Prefix"
                    value={groupPrefix}
                    onChange={(e) => setGroupPrefix(e.target.value)}
                  />
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAutoGroup}
                  disabled={loading}
                >
                  Auto Group
                </Button>
              </div>

              {/* Manual Grouping Section */}
              <div className="mb-4">
                <h3>Manual Grouping</h3>
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
                      <MenuItem key={student.id} value={student.id}>
                        {student.user_fullname || "First name"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateGroup}
                  disabled={loading}
                >
                  Create Group
                </Button>
              </div>
            </>
          )}
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
