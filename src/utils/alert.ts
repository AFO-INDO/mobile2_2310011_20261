import { Alert, Platform } from "react-native";

export function showNotification(title: string, message?: string) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
  } else {
    Alert.alert(title, message);
  }
}

export function showConfirm(
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
) {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (ok) {
        onConfirm();
      } else {
        onCancel?.();
      }
    }
  } else {
    Alert.alert(title, message, [
      { text: "Batal", style: "cancel", onPress: onCancel },
      { text: "Ya, Hapus", style: "destructive", onPress: onConfirm },
    ]);
  }
}
