import { ProdukItem, useStore } from "@/context/StoreContext";
import { tabStyles } from "@/styles/tabStyles";
import { showConfirm, showNotification } from "@/utils/alert";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AVAILABLE_KATEGORI = ["Sembako", "Minuman", "Snack"];

export default function ProdukScreen() {
  const { produkList, addProduk, updateProduk, deleteProduk } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [namaInput, setNamaInput] = useState("");
  const [kategoriInput, setKategoriInput] = useState("Sembako");
  const [hargaInput, setHargaInput] = useState("");
  const [stokInput, setStokInput] = useState("");

  const resetForm = () => {
    setNamaInput("");
    setKategoriInput("Sembako");
    setHargaInput("");
    setStokInput("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleOpenAddForm = () => {
    setEditingId(null);
    setNamaInput("");
    setKategoriInput("Sembako");
    setHargaInput("");
    setStokInput("");
    setIsFormOpen(true);
  };

  const handleEditPress = (item: ProdukItem) => {
    setEditingId(item.id);
    setNamaInput(item.nama);
    setKategoriInput(item.kategori);
    setHargaInput(item.harga.toString());
    setStokInput(item.stok.toString());
    setIsFormOpen(true);
  };

  const handleSimpanProduk = () => {
    const trimmedNama = namaInput.trim();
    if (!trimmedNama || !hargaInput.trim() || !stokInput.trim()) {
      showNotification(
        "Form Belum Lengkap",
        "Silakan lengkapi semua kolom produk.",
      );
      return;
    }

    const hargaNum = parseInt(hargaInput.replace(/[^0-9]/g, ""), 10);
    const stokNum = parseInt(stokInput.replace(/[^0-9]/g, ""), 10);

    if (isNaN(hargaNum) || hargaNum <= 0) {
      showNotification(
        "Harga Tidak Valid",
        "Harga jual produk harus lebih dari Rp 0.",
      );
      return;
    }

    if (isNaN(stokNum) || stokNum < 0) {
      showNotification(
        "Stok Tidak Valid",
        "Stok produk tidak boleh bernilai negatif.",
      );
      return;
    }

    if (editingId) {
      // Mode Edit Produk
      updateProduk(editingId, {
        nama: trimmedNama,
        kategori: kategoriInput,
        harga: hargaNum,
        stok: stokNum,
      });
      showNotification(
        "Berhasil Diperbarui",
        `Data produk "${trimmedNama}" berhasil disimpan.`,
      );
    } else {
      // Mode Tambah Produk Baru
      addProduk({
        nama: trimmedNama,
        kategori: kategoriInput,
        harga: hargaNum,
        stok: stokNum,
      });
      showNotification(
        "Sukses",
        `Produk "${trimmedNama}" berhasil ditambahkan ke katalog.`,
      );
    }

    resetForm();
  };

  const handleHapusProduk = (id: string, nama: string) => {
    showConfirm(
      "Hapus Produk",
      `Apakah Anda yakin ingin menghapus "${nama}" dari katalog?`,
      () => {
        deleteProduk(id);
        if (editingId === id) {
          resetForm();
        }
      },
    );
  };

  const filteredProduk = produkList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori =
      selectedKategori === "Semua" || item.kategori === selectedKategori;
    return matchSearch && matchKategori;
  });

  return (
    <ScrollView
      style={tabStyles.screenContainer}
      contentContainerStyle={tabStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Kartu Header & Tombol Tambah */}
      <View style={tabStyles.card}>
        <View style={tabStyles.cardHeaderRow}>
          <View style={tabStyles.badgeBlue}>
            <Ionicons name="cube" size={13} color="#000000" />
            <Text style={tabStyles.badgeBlueText}>Katalog Inventaris</Text>
          </View>
          <Text style={{ fontSize: 12, color: "#000000", fontWeight: "800" }}>
            {filteredProduk.length} dari {produkList.length} BARANG
          </Text>
        </View>

        <Text style={tabStyles.sectionTitle}>Kelola Produk</Text>
        <Text style={tabStyles.sectionSubtitle}>
          Cari barang, perbarui harga/stok, atau daftarkan produk baru ke database minimarket.
        </Text>

        <TouchableOpacity
          style={[
            tabStyles.primaryBtn,
            {
              marginTop: 14,
              backgroundColor: isFormOpen ? "#FFFFFF" : "#FFE600",
            },
          ]}
          activeOpacity={0.8}
          onPress={() => {
            if (isFormOpen) {
              resetForm();
            } else {
              handleOpenAddForm();
            }
          }}
        >
          <Ionicons
            name={isFormOpen ? "close-circle" : "add-circle"}
            size={18}
            color="#000000"
          />
          <Text style={tabStyles.primaryBtnText}>
            {isFormOpen ? "Tutup Form Input" : "Input Produk Baru"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Formulir Input / Edit Produk */}
      {isFormOpen && (
        <View style={tabStyles.card}>
          <View style={tabStyles.cardHeaderRow}>
            <Text style={[tabStyles.sectionTitle, { fontSize: 15 }]}>
              {editingId ? "Perbarui Data Produk" : "Formulir Tambah Produk"}
            </Text>
            {editingId && (
              <TouchableOpacity onPress={resetForm}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#FF3366",
                    fontWeight: "900",
                    textTransform: "uppercase",
                  }}
                >
                  Batal Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Input Nama Produk */}
          <View style={tabStyles.formInputGroup}>
            <Text style={tabStyles.formLabel}>Nama Produk</Text>
            <TextInput
              style={tabStyles.formTextInput}
              placeholder="Contoh: Susu UHT 1L"
              placeholderTextColor="#6B7280"
              value={namaInput}
              onChangeText={setNamaInput}
            />
          </View>

          {/* Kategori Selector */}
          <View style={tabStyles.formInputGroup}>
            <Text style={tabStyles.formLabel}>Kategori Produk</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {AVAILABLE_KATEGORI.map((kat) => (
                <TouchableOpacity
                  key={kat}
                  style={[
                    tabStyles.secondaryBtn,
                    {
                      flex: 1,
                      height: 42,
                      paddingHorizontal: 8,
                      backgroundColor:
                        kategoriInput === kat ? "#FFE600" : "#FFFFFF",
                      borderColor: "#000000",
                    },
                  ]}
                  onPress={() => setKategoriInput(kat)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "900",
                      color: "#000000",
                      textTransform: "uppercase",
                    }}
                  >
                    {kat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Row Harga & Stok */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[tabStyles.formInputGroup, { flex: 1 }]}>
              <Text style={tabStyles.formLabel}>Harga Jual (Rp)</Text>
              <TextInput
                style={tabStyles.formTextInput}
                placeholder="Contoh: 15000"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={hargaInput}
                onChangeText={setHargaInput}
              />
            </View>
            <View style={[tabStyles.formInputGroup, { flex: 1 }]}>
              <Text style={tabStyles.formLabel}>Jumlah Stok</Text>
              <TextInput
                style={tabStyles.formTextInput}
                placeholder="Contoh: 50"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={stokInput}
                onChangeText={setStokInput}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              tabStyles.primaryBtn,
              {
                backgroundColor: editingId ? "#00C2CB" : "#10B981",
                marginTop: 4,
              },
            ]}
            activeOpacity={0.8}
            onPress={handleSimpanProduk}
          >
            <Ionicons
              name={editingId ? "save-outline" : "checkmark-circle"}
              size={18}
              color="#000000"
            />
            <Text style={tabStyles.primaryBtnText}>
              {editingId ? "Simpan Perubahan" : "Simpan ke Database"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bar Pencarian */}
      <View style={tabStyles.searchWrapper}>
        <Ionicons name="search" size={18} color="#000000" />
        <TextInput
          style={tabStyles.searchInput}
          placeholder="Cari nama atau kategori..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#000000" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Kategori Chips - Horizontal Scroll Neobrutalism Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
      >
        {["Semua", ...AVAILABLE_KATEGORI].map((kategori) => {
          const isSelected = selectedKategori === kategori;
          return (
            <TouchableOpacity
              key={kategori}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: isSelected ? "#00C2CB" : "#FFFFFF",
                borderWidth: 2,
                borderColor: "#000000",
                shadowColor: "#000000",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 2,
              }}
              onPress={() => setSelectedKategori(kategori)}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "900",
                  color: "#000000",
                  textTransform: "uppercase",
                }}
              >
                {kategori}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Daftar Produk */}
      {filteredProduk.length === 0 ? (
        <View
          style={[
            tabStyles.card,
            { alignItems: "center", paddingVertical: 28 },
          ]}
        >
          <Ionicons name="cube-outline" size={36} color="#000000" />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "900",
              color: "#000000",
              marginTop: 8,
              textTransform: "uppercase",
            }}
          >
            Tidak ada produk yang cocok
          </Text>
          <Text style={{ fontSize: 12, color: "#4B5563", fontWeight: "600", marginTop: 2 }}>
            Coba ubah kata kunci pencarian atau kategori
          </Text>
        </View>
      ) : (
        filteredProduk.map((item) => {
          const isLowStock = item.stok <= 10;
          return (
            <View key={item.id} style={tabStyles.listItemCard}>
              <View style={tabStyles.listItemLeft}>
                <View
                  style={[
                    tabStyles.iconBox,
                    isLowStock && { backgroundColor: "#FF00FF" },
                  ]}
                >
                  <Ionicons
                    name="cube-outline"
                    size={22}
                    color="#000000"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={tabStyles.listItemTitle}>{item.nama}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    <Text style={tabStyles.listItemMeta}>{item.kategori}</Text>
                    <Text style={{ color: "#000000", fontWeight: "900" }}>•</Text>
                    <Text
                      style={[
                        tabStyles.listItemMeta,
                        isLowStock && {
                          color: "#FF3366",
                          fontWeight: "900",
                        },
                      ]}
                    >
                      Stok: {item.stok} pcs
                    </Text>
                    {isLowStock && (
                      <View
                        style={{
                          backgroundColor: "#FF00FF",
                          borderWidth: 1.5,
                          borderColor: "#000000",
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                          borderRadius: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#000000",
                            fontWeight: "900",
                            textTransform: "uppercase",
                          }}
                        >
                          Menipis
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={tabStyles.listItemPrice}>
                  Rp {item.harga.toLocaleString("id-ID")}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 6,
                      backgroundColor: "#FFE600",
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: "#000000",
                    }}
                    onPress={() => handleEditPress(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="pencil-outline" size={15} color="#000000" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 6,
                      backgroundColor: "#FF3366",
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: "#000000",
                    }}
                    onPress={() => handleHapusProduk(item.id, item.nama)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
