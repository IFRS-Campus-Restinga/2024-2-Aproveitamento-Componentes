import { useState } from "react";

export const useUserFilters = (users, setFilteredUsers) => {
  const [search, setSearch] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const applyFilters = () => {
    let result = users;

    if (search) {
      result = result.filter((user) =>
        user.Name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCourse) {
      result = result.filter((user) => user.Course === selectedCourse.title);
    }

    if (selectedAdmission) {
      result = result.filter(
        (user) => user.Admission === selectedAdmission.title
      );
    }

    if (selectedRole) {
      result = result.filter((user) => user.Role === selectedRole.title);
    }

    if (!(showActive && showInactive)) {
      if (showActive) {
        result = result.filter((user) => user.isActive);
      } else if (showInactive) {
        result = result.filter((user) => !user.isActive);
      }
    }

    setFilteredUsers(result);
  };

  return {
    search,
    setSearch,
    showActive,
    setShowActive,
    showInactive,
    setShowInactive,
    selectedCourse,
    setSelectedCourse,
    selectedAdmission,
    setSelectedAdmission,
    selectedRole,
    setSelectedRole,
    applyFilters,
  };
};
