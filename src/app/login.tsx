import { authStyles } from "@/styles/authStyles";
import { showNotification } from "@/utils/alert";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      showNotification(
        "Input Belum Lengkap",
        "Silakan masukkan email dan kata sandi Anda.",
      );
      return;
    }

    // Navigasi ke rute (tabs)/home dengan parameter email
    router.replace({
      pathname: "/home",
      params: { email: email.trim() },
    });
  };

  const handleQuickDemo = () => {
    setEmail("afo@kampus.ac.id");
    setPassword("praktikum123");
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <KeyboardAvoidingView
        style={authStyles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Hero Neobrutalist */}
          <View style={authStyles.headerArea}>
            <View style={authStyles.logoBadge}>
              <Ionicons name="storefront" size={32} color="#000000" />
            </View>
            <Text style={authStyles.title}>Portal Minimarket</Text>
            <Text style={authStyles.subtitle}>
              Masuk ke akun Anda untuk mengelola inventaris & transaksi
            </Text>
          </View>

          {/* Kartu Formulir Login */}
          <View style={authStyles.card}>
            {/* Input Email */}
            <View style={authStyles.formGroup}>
              <Text style={authStyles.label}>Alamat Email</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "email" && authStyles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color="#000000"
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="nama@kampus.ac.id"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            {/* Input Kata Sandi */}
            <View style={authStyles.formGroup}>
              <Text style={authStyles.label}>Kata Sandi</Text>
              <View
                style={[
                  authStyles.inputWrapper,
                  focusedField === "password" && authStyles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={19}
                  color="#000000"
                  style={authStyles.inputIcon}
                />
                <TextInput
                  style={authStyles.input}
                  placeholder="Masukkan kata sandi"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  style={authStyles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={19}
                    color="#000000"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Tombol Masuk */}
            <TouchableOpacity
              style={authStyles.primaryButton}
              activeOpacity={0.8}
              onPress={handleLogin}
            >
              <Text style={authStyles.primaryButtonText}>Masuk Sekarang</Text>
              <Ionicons name="arrow-forward" size={18} color="#000000" />
            </TouchableOpacity>

            {/* Tombol Isi Otomatis Demo (Praktikum) */}
            <TouchableOpacity
              style={{
                alignItems: "center",
                marginTop: 14,
                paddingVertical: 6,
              }}
              onPress={handleQuickDemo}
            >
              <Text
                style={{
                  fontSize: 12.5,
                  color: "#000000",
                  fontWeight: "900",
                  textDecorationLine: "underline",
                  textTransform: "uppercase",
                }}
              >
                Gunakan Akun Percobaan (Demo)
              </Text>
            </TouchableOpacity>

            <View style={authStyles.dividerRow}>
              <View style={authStyles.dividerLine} />
              <Text style={authStyles.dividerText}>ATAU</Text>
              <View style={authStyles.dividerLine} />
            </View>

            <View style={authStyles.footerRow}>
              <Text style={authStyles.footerText}>Belum punya akun?</Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={authStyles.footerLink}>Daftar Kasir Baru</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
