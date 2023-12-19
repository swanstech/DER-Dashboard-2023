import React, { useContext } from "react";
import { Avatar, Text, Menu, Button } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
  IconLogout,
  IconLogin,
} from "@tabler/icons-react";
import { AuthContext } from '../contexts/AuthContext'; // Adjust the path as necessary

export default function UserMenu() {
  const { keycloak, userProfile, userRoles, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Call the logout function from context
  };

  const handleLogin = () => {
    // redirect to login page
    window.location.href = '/login';
  };

  // Check if user is authenticated
  const isAuthenticated = keycloak && keycloak.authenticated;

  // Display user roles
  const rolesDisplay = isAuthenticated && userRoles.join(', ');

  // Get user initials or name
  const userInitials = isAuthenticated && userProfile ? `${userProfile.firstName?.charAt(0)}${userProfile.lastName?.charAt(0)}` : "U";
  const fullName = isAuthenticated && userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : "Unknown User";
  const username = isAuthenticated && userProfile ? userProfile.username : "Unknown";

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar color="cyan" radius="xl">
          {isAuthenticated ? userInitials : <IconLogin size={24} />}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        {isAuthenticated ? (
          <>
            <Menu.Label>User Info</Menu.Label>
            <Menu.Item>
              Name: {fullName}
            </Menu.Item>
            <Menu.Item>
              Username: {username}
            </Menu.Item>
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
          </>
        ) : (
          <Menu.Item icon={<IconLogin size={14} />} onClick={handleLogin}>
            Login
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
