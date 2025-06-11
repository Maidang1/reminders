import { useEffect } from "react"
import { requestPermission, isPermissionGranted } from '@tauri-apps/plugin-notification';
import { message } from "@tauri-apps/plugin-dialog"

export const useRegisterNotification = () => {
  useEffect(() => {
    const checkAndRequestPermission = async () => {
      try {
        // 检查是否已经有权限
        let permissionGranted = await isPermissionGranted();

        // 如果没有权限，请求权限
        if (!permissionGranted) {
          const permission = await requestPermission();
          permissionGranted = permission === 'granted';
        }

        if (permissionGranted) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
          await message('Notification permission denied. Reminders need to use Notification permission to tell you to do something.', {
            title: 'Notification Permission Denied',
            kind: "info"
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    checkAndRequestPermission();
  }, []);
};