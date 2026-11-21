import { useStore } from "@/context/StoreContext";
import { getAuthSession, UserData } from "@/services/authService";
import { homeStyles } from "@/styles/homeStyles";
import { tabStyles } from "@/styles/tabStyles";
import { showNotification } from "@/utils/alert";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  useEffect(() => {
    getAuthSession().then((session) => {
      if (session) setUser(session.user);
    });
  }, []);
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { produkList, transaksiList } = useStore();

  const totalOmset = transaksiList.reduce((acc, curr) => acc + curr.total, 0);

  const handleMenuPress = (menuName: string, targetRoute?: string) => {
    if (targetRoute) {
      router.push(targetRoute as never);
    } else {
      showNotification(
        menuName,
        `Fitur ${menuName} aktif dan siap digunakan untuk pencatatan operasional.`,
      );
    }
  };

  return (
    <SafeAreaView style={homeStyles.safeArea} edges={[]}>
      <ScrollView
        style={homeStyles.scrollContainer}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Kartu Sambutan & Status */}
        <View style={homeStyles.welcomeCard}>
          <View style={homeStyles.welcomeTopRow}>
            <View style={homeStyles.statusBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#000000" />
              <Text style={homeStyles.statusBadgeText}>Kasir Aktif</Text>
            </View>
            <Text style={{ fontSize: 12, color: "#000000", fontWeight: "800" }}>
              SESI: MOBILE 2
            </Text>
          </View>

          <Text style={homeStyles.greetingTitle}>Selamat Datang!</Text>
          <Text style={homeStyles.greetingEmail}>
            {email || "luthfi.ariesto@kampus.ac.id"}
          </Text>

          {/* Quick Stats Overview */}
          <View style={homeStyles.overviewGrid}>
            <View style={homeStyles.overviewItem}>
              <Text style={homeStyles.overviewItemLabel}>Total Produk</Text>
              <Text style={homeStyles.overviewItemValue}>
                {produkList.length} Item
              </Text>
            </View>
            <View style={homeStyles.overviewItem}>
              <Text style={homeStyles.overviewItemLabel}>Transaksi</Text>
              <Text style={homeStyles.overviewItemValue}>
                {transaksiList.length} Nota
              </Text>
            </View>
            <View style={homeStyles.overviewItem}>
              <Text style={homeStyles.overviewItemLabel}>Total Omset</Text>
              <Text
                style={[
                  homeStyles.overviewItemValue,
                  { color: "#000000", fontSize: 13.5 },
                ]}
                numberOfLines={1}
              >
                Rp {totalOmset.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Cepat Layanan */}
        <View style={homeStyles.menuCard}>
          <View style={homeStyles.menuHeader}>
            <Text style={homeStyles.menuSectionTitle}>
              {"Layanan & Navigasi"}
            </Text>
            <Text style={homeStyles.menuSectionSubtitle}>
              {"Pintasan cepat modul operasional kasir & inventaris"}
            </Text>
          </View>

          <View style={homeStyles.menuGrid}>
            {/* 1. Produk */}
            <TouchableOpacity
              style={homeStyles.menuItem}
              activeOpacity={0.7}
              onPress={() =>
                handleMenuPress("Katalog Produk", "/(tabs)/produk")
              }
            >
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgBlue]}>
                <Ionicons name="cube" size={26} color="#000000" />
              </View>
              <Text style={homeStyles.menuLabel}>Produk</Text>
            </TouchableOpacity>

            {/* 2. Kasir / Transaksi */}
            <TouchableOpacity
              style={homeStyles.menuItem}
              activeOpacity={0.7}
              onPress={() =>
                handleMenuPress("Transaksi Kasir", "/(tabs)/transaksi")
              }
            >
              <View
                style={[homeStyles.menuIconWrapper, homeStyles.iconBgGreen]}
              >
                <Ionicons name="cart" size={26} color="#000000" />
              </View>
              <Text style={homeStyles.menuLabel}>Kasir</Text>
            </TouchableOpacity>

            {/* 3. Laporan */}
            <TouchableOpacity
              style={homeStyles.menuItem}
              activeOpacity={0.7}
              onPress={() =>
                handleMenuPress("Laporan Keuangan", "/(tabs)/report")
              }
            >
              <View
                style={[homeStyles.menuIconWrapper, homeStyles.iconBgAmber]}
              >
                <Ionicons name="stats-chart" size={26} color="#000000" />
              </View>
              <Text style={homeStyles.menuLabel}>Laporan</Text>
            </TouchableOpacity>

            {/* 4. Pelanggan */}
            <TouchableOpacity
              style={homeStyles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress("Pelanggan Tetap")}
            >
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgTeal]}>
                <Ionicons name="people" size={26} color="#000000" />
              </View>
              <Text style={homeStyles.menuLabel}>Pelanggan</Text>
            </TouchableOpacity>

            {/* 5. Supplier */}
            <TouchableOpacity
              style={homeStyles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress("Distributor & Supplier")}
            >
              <View style={[homeStyles.menuIconWrapper, homeStyles.iconBgRose]}>
                <Ionicons name="business" size={26} color="#000000" />
              </View>
              <Text style={homeStyles.menuLabel}>Supplier</Text>
            </TouchableOpacity>

            {/* 6. Profil */}
            <TouchableOpacity
              style={homeStyles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress("Profil Saya", "/(tabs)/profil")}
            >
              <View
                style={[homeStyles.menuIconWrapper, homeStyles.iconBgPurple]}
              >
                <Ionicons name="person" size={26} color="#000000" />
              </View>
              <Text style={homeStyles.menuLabel}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Kartu Ringkasan Aktivitas Terkini */}
        <View style={tabStyles.card}>
          <View style={tabStyles.cardHeaderRow}>
            <Text style={tabStyles.sectionTitle}>Aktivitas Kasir Terkini</Text>
            <View style={tabStyles.badgeGreen}>
              <Text style={tabStyles.badgeGreenText}>Real-time</Text>
            </View>
          </View>
          <Text style={tabStyles.sectionSubtitle}>
            {transaksiList.length > 0
              ? `Transaksi terakhir (${transaksiList[0].id}) diproses pada ${transaksiList[0].waktu} sebesar Rp ${transaksiList[0].total.toLocaleString("id-ID")}.`
              : "Belum ada transaksi kasir yang tercatat hari ini."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
