import { useState } from "react";

export const useUserFilters = (users, setFilteredUsers) => {
  const [search, setSearch] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const applyFilters = () => {
    let result = users;

    if (search) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCourse) {
      result = result.filter((user) => user.course === selectedCourse.title);
    }

    // Since 'admission' doesn't exist in your data, you might need to remove this filter
    // or adjust it according to your actual data structure.
    // If you have an 'entry_date' or similar field, you can modify accordingly.

    // Remove or comment out the admission filter if it's not applicable
    /*
    if (selectedAdmission) {
      result = result.filter(
        (user) => user.admission === selectedAdmission.title
      );
    }
    */

    if (selectedRole) {
      result = result.filter((user) => user.type === selectedRole.title);
    }

    if (!(showActive && showInactive)) {
      if (showActive) {
        result = result.filter((user) => user.is_active);
      } else if (showInactive) {
        result = result.filter((user) => !user.is_active);
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
    selectedRole,
    setSelectedRole,
    applyFilters,
  };
};