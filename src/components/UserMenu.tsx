import React, { useContext } from "react";
import { Avatar, Text, Menu } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconLogout,
} from "@tabler/icons-react";
import { AuthContext } from '../contexts/AuthContext'; // Adjust the path as necessary

export default function UserMenu() {
  const { userProfile, userRoles, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Call the logout function from context
  };

  // Display user roles (optional)
  const rolesDisplay = userRoles.join(', ');

  // Get user initials or name
  const userInitials = userProfile ? `${userProfile.firstName?.charAt(0)}${userProfile.lastName?.charAt(0)}` : "U";

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar color="cyan" radius="xl">
          {userInitials}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        {/* Display user roles */}
        <Menu.Item>
          Roles: {rolesDisplay}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item color="red" icon={<IconTrash size={14} />}>
          Delete my account
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={<IconLogout size={14} />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
