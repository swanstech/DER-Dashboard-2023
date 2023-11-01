import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

function CloseExpiryNotification() {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Expires Soon!" color="red">
    </Alert>
  );
}

export default CloseExpiryNotification;