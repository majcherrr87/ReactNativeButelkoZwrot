import { Stack } from "expo-router";
import Safescreen from "../components/SafeScreen";

export default function RootLayout() {
  return (
    <Safescreen>
      <Stack screenOptions={{ headerShown: false }} />
    </Safescreen>
  );
}
