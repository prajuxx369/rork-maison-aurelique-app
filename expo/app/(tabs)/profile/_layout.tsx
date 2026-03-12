import { Stack } from 'expo-router';
import Colors from '@/constants/colors';
import { Typography } from '@/constants/typography';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.black },
        headerStyle: { backgroundColor: Colors.black },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontFamily: Typography.serifFamily,
          fontSize: 18,
          fontWeight: '400' as const,
        },
        animation: 'slide_from_right',
      }}
    />
  );
}
