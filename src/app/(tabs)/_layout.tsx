import { StoreProvider } from "@/context/StoreContext";
import { tabNavColors, tabStyles } from "@/styles/tabStyles";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({ name, focused }: { name: IoniconName; focused: boolean }) {
  return (
    <View
      style={[
        tabStyles.iconContainer,
        focused && {
          backgroundColor: "#FFE600",
          borderWidth: 2,
          borderColor: "#000000",
          shadowColor: "#000000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
      ]}
    >
      <Ionicons
        name={name}
        size={focused ? 20 : 19}
        color="#000000"
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 6);

  return (
    <StoreProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tabNavColors.active,
          tabBarInactiveTintColor: tabNavColors.inactive,
          tabBarStyle: [
            tabStyles.tabBar,
            {
              height: 60 + bottomInset,
              paddingBottom: bottomInset,
            },
          ],
          tabBarItemStyle: tabStyles.tabBarItem,
          tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: "900",
            color: "#000000",
            textTransform: "uppercase",
            letterSpacing: 0.2,
          },
          tabBarHideOnKeyboard: true,
          headerStyle: tabStyles.headerStyle,
          headerTintColor: tabNavColors.headerTint,
          headerTitleStyle: tabStyles.headerTitleStyle,
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Beranda",
            tabBarLabel: "Home",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "home" : "home-outline"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="produk"
          options={{
            title: "Katalog Produk",
            tabBarLabel: "Produk",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "cube" : "cube-outline"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transaksi"
          options={{
            title: "Kasir & Transaksi",
            tabBarLabel: "Transaksi",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "cart" : "cart-outline"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            title: "Laporan Penjualan",
            tabBarLabel: "Laporan",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "stats-chart" : "stats-chart-outline"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: "Profil Saya",
            tabBarLabel: "Profil",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "person" : "person-outline"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </StoreProvider>
  );
}
