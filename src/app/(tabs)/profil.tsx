import { tabStyles } from "@/styles/tabStyles";
import { showConfirm, showNotification } from "@/utils/alert";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilScreen() {
  // Form State yang bisa diinput & diedit
  const [nama, setNama] = useState("Al Fahrul Ozi");
  const [email, setEmail] = useState("afo@kampus.ac.id");
  const [noHp, setNoHp] = useState("082360180484");
  const [nim, setNim] = useState("2310011");

  // Setting Switches
  const [soundNotif, setSoundNotif] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);

  const handleSimpanProfil = () => {
    if (!nama.trim() || !email.trim()) {
      showNotification("Validasi Gagal", "Nama dan Email wajib diisi.");
      return;
    }

    showNotification(
      "Profil Disimpan",
      `Data profil ${nama.trim()} berhasil diperbarui secara lokal.`,
    );
  };

  const handleLogout = () => {
    showConfirm(
      "Konfirmasi Keluar",
      "Apakah Anda yakin ingin keluar dari akun?",
      () => router.replace("/login"),
    );
  };

  return (
    <ScrollView
      style={tabStyles.screenContainer}
      contentContainerStyle={tabStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Kartu Profil & Avatar - Neobrutalism Style */}
      <View style={[tabStyles.card, { alignItems: "center" }]}>
        <View style={tabStyles.profileAvatar}>
          <Ionicons name="person" size={38} color="#000000" />
        </View>
        <Text style={tabStyles.sectionTitle}>{nama || "Pengguna"}</Text>
        <Text
          style={{
            fontSize: 13,
            color: "#000000",
            fontWeight: "700",
            marginTop: 4,
            backgroundColor: "#00C2CB",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: "#000000",
          }}
        >
          {email || "email@kampus.ac.id"}
        </Text>
        <View style={[tabStyles.badgeBlue, { marginTop: 10 }]}>
          <Text style={tabStyles.badgeBlueText}>Kasir Aktif • Mobile 2</Text>
        </View>
      </View>

      {/* Formulir Edit Profil (Bisa Diinput) */}
      <View style={tabStyles.card}>
        <View style={tabStyles.cardHeaderRow}>
          <Text style={[tabStyles.sectionTitle, { fontSize: 16 }]}>
            Informasi Akun
          </Text>
          <Ionicons name="create-outline" size={20} color="#000000" />
        </View>

        {/* Input Nama */}
        <View style={tabStyles.formInputGroup}>
          <Text style={tabStyles.formLabel}>Nama Lengkap</Text>
          <TextInput
            style={tabStyles.formTextInput}
            value={nama}
            onChangeText={setNama}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Input Email */}
        <View style={tabStyles.formInputGroup}>
          <Text style={tabStyles.formLabel}>Alamat Email</Text>
          <TextInput
            style={tabStyles.formTextInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="nama@kampus.ac.id"
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Input NIM & No HP */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[tabStyles.formInputGroup, { flex: 1 }]}>
            <Text style={tabStyles.formLabel}>NIM / ID Kasir</Text>
            <TextInput
              style={tabStyles.formTextInput}
              value={nim}
              onChangeText={setNim}
              keyboardType="numeric"
              placeholder="NIM"
              placeholderTextColor="#6B7280"
            />
          </View>
          <View style={[tabStyles.formInputGroup, { flex: 1 }]}>
            <Text style={tabStyles.formLabel}>No. Handphone</Text>
            <TextInput
              style={tabStyles.formTextInput}
              value={noHp}
              onChangeText={setNoHp}
              keyboardType="phone-pad"
              placeholder="08..."
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        {/* Tombol Simpan Perubahan */}
        <TouchableOpacity
          style={[tabStyles.primaryBtn, { marginTop: 6, backgroundColor: "#00C2CB" }]}
          activeOpacity={0.8}
          onPress={handleSimpanProfil}
        >
          <Ionicons name="save-outline" size={18} color="#000000" />
          <Text style={tabStyles.primaryBtnText}>Simpan Perubahan Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Pengaturan Aplikasi & Perangkat */}
      <View style={tabStyles.card}>
        <Text
          style={[tabStyles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}
        >
          Preferensi Kasir
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomWidth: 1.5,
            borderBottomColor: "#000000",
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 13.5, fontWeight: "800", color: "#000000" }}>
              Suara Notifikasi Transaksi
            </Text>
            <Text style={{ fontSize: 12, color: "#374151", fontWeight: "600", marginTop: 2 }}>
              Mainkan suara "beep" saat pembayaran berhasil
            </Text>
          </View>
          <Switch
            value={soundNotif}
            onValueChange={setSoundNotif}
            trackColor={{ false: "#D1D5DB", true: "#00C2CB" }}
            thumbColor={soundNotif ? "#000000" : "#6B7280"}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ fontSize: 13.5, fontWeight: "800", color: "#000000" }}>
              Cetak Struk Otomatis
            </Text>
            <Text style={{ fontSize: 12, color: "#374151", fontWeight: "600", marginTop: 2 }}>
              Kirim perintah cetak nota ke printer bluetooth
            </Text>
          </View>
          <Switch
            value={autoPrint}
            onValueChange={setAutoPrint}
            trackColor={{ false: "#D1D5DB", true: "#00C2CB" }}
            thumbColor={autoPrint ? "#000000" : "#6B7280"}
          />
        </View>
      </View>

      {/* Tombol Logout - Neobrutalism Magenta Accent */}
      <TouchableOpacity
        style={tabStyles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={19} color="#000000" />
        <Text style={tabStyles.logoutButtonText}>Keluar dari Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
