import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

function ExpiredNotification() {
  return (
    <Alert icon={<IconAlertCircle size="1rem" />} title="Expired!" color="red">
    </Alert>
  );
}

export default ExpiredNotification;