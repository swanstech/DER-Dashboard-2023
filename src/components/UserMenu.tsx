import React from "react";
import { Avatar, Text, Menu } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons-react";

export default function UserMenu() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar color="cyan" radius="xl">
          SB
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item icon={<IconMessageCircle size={14} />}>N</Menu.Item>
        <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
        <Menu.Item
          icon={<IconSearch size={14} />}
          rightSection={
            <Text size="xs" color="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
          Transfer my data
        </Menu.Item>
        <Menu.Item color="red" icon={<IconTrash size={14} />}>
          Delete my account
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}