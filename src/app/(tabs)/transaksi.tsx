import { useStore } from "@/context/StoreContext";
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

export default function TransaksiScreen() {
  const { produkList, transaksiList, addTransaksi, deleteTransaksi } =
    useStore();

  const [activeTab, setActiveTab] = useState<"input" | "riwayat">("input");

  // Form State
  const [pelanggan, setPelanggan] = useState("");
  const [selectedProdukId, setSelectedProdukId] = useState<string>(
    produkList[0]?.id || "",
  );
  const [jumlah, setJumlah] = useState("1");
  const [diskon, setDiskon] = useState("0");

  // Temukan produk terpilih secara aman
  const currentProduk =
    produkList.find((p) => p.id === selectedProdukId) || produkList[0];

  const qtyNumber = parseInt(jumlah.replace(/[^0-9]/g, ""), 10);
  const validQty = isNaN(qtyNumber) || qtyNumber <= 0 ? 1 : qtyNumber;
  const diskonNumber = parseInt(diskon.replace(/[^0-9]/g, ""), 10) || 0;

  const hargaSatuan = currentProduk?.harga || 0;
  const subtotal = hargaSatuan * validQty;
  const cleanDiskon = Math.min(diskonNumber, subtotal);
  const grandTotal = Math.max(0, subtotal - cleanDiskon);

  const handleProsesTransaksi = () => {
    if (!currentProduk) {
      showNotification(
        "Katalog Kosong",
        "Silakan tambahkan produk ke dalam katalog terlebih dahulu di tab Produk.",
      );
      return;
    }

    const cleanInputQty = parseInt(jumlah.replace(/[^0-9]/g, ""), 10);
    if (isNaN(cleanInputQty) || cleanInputQty <= 0) {
      showNotification(
        "Kuantitas Salah",
        "Silakan masukkan jumlah beli minimal 1 item.",
      );
      return;
    }

    if (currentProduk.stok <= 0) {
      showNotification(
        "Stok Habis",
        `Stok untuk "${currentProduk.nama}" sedang habis. Harap restock di menu Produk.`,
      );
      return;
    }

    if (cleanInputQty > currentProduk.stok) {
      showNotification(
        "Stok Tidak Cukup",
        `Stok tersedia hanya ${currentProduk.stok} pcs, sementara permintaan adalah ${cleanInputQty} item.`,
      );
      return;
    }

    const res = addTransaksi({
      pelanggan: pelanggan.trim(),
      produkId: currentProduk.id,
      qty: cleanInputQty,
      diskon: cleanDiskon,
    });

    if (!res.success) {
      showNotification("Gagal Memproses", res.message || "Terjadi kesalahan.");
      return;
    }

    setPelanggan("");
    setJumlah("1");
    setDiskon("0");

    showNotification(
      "Transaksi Berhasil!",
      `Nota: ${res.trx?.id}\nItem: ${res.trx?.produkNama} x ${res.trx?.qty}\nTotal: Rp ${grandTotal.toLocaleString("id-ID")}`,
    );

    setActiveTab("riwayat");
  };

  const handleBatalTransaksi = (id: string) => {
    showConfirm(
      "Batalkan Transaksi",
      `Yakin ingin membatalkan nota ${id}? Stok produk akan otomatis dikembalikan ke katalog.`,
      () => {
        deleteTransaksi(id);
        showNotification("Dibatalkan", `Transaksi ${id} telah dibatalkan.`);
      },
    );
  };

  const totalOmset = transaksiList.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <ScrollView
      style={tabStyles.screenContainer}
      contentContainerStyle={tabStyles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Tab Switcher: Input vs Riwayat - Neobrutalism Segmented Control */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#FFFFFF",
          borderRadius: 8,
          borderWidth: 2.5,
          borderColor: "#000000",
          padding: 4,
          gap: 6,
          shadowColor: "#000000",
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 6,
            backgroundColor: activeTab === "input" ? "#FFE600" : "transparent",
            borderWidth: activeTab === "input" ? 2 : 0,
            borderColor: "#000000",
            alignItems: "center",
          }}
          onPress={() => setActiveTab("input")}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "900",
              color: "#000000",
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            Kasir Baru
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 6,
            backgroundColor:
              activeTab === "riwayat" ? "#FFE600" : "transparent",
            borderWidth: activeTab === "riwayat" ? 2 : 0,
            borderColor: "#000000",
            alignItems: "center",
          }}
          onPress={() => setActiveTab("riwayat")}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "900",
              color: "#000000",
              textTransform: "uppercase",
              letterSpacing: 0.3,
            }}
          >
            Riwayat ({transaksiList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "input" ? (
        /* Formulir Kasir Transaksi Baru */
        <View style={tabStyles.card}>
          <View style={tabStyles.cardHeaderRow}>
            <View style={tabStyles.badgeGreen}>
              <Ionicons name="cart" size={13} color="#000000" />
              <Text style={tabStyles.badgeGreenText}>Kasir Interaktif</Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: "#000000",
                fontWeight: "800",
                textTransform: "uppercase",
              }}
            >
              {produkList.length} Barang Tersedia
            </Text>
          </View>

          <Text style={tabStyles.sectionTitle}>Formulir Kasir</Text>
          <Text style={tabStyles.sectionSubtitle}>
            Pilih barang dari katalog, tentukan kuantitas, dan cetak transaksi.
          </Text>

          {/* Input Nama Pelanggan */}
          <View style={[tabStyles.formInputGroup, { marginTop: 14 }]}>
            <Text style={tabStyles.formLabel}>Nama Pelanggan (Opsional)</Text>
            <TextInput
              style={tabStyles.formTextInput}
              placeholder="Contoh: Budi Santoso / Ibu Maya"
              placeholderTextColor="#6B7280"
              value={pelanggan}
              onChangeText={setPelanggan}
            />
          </View>

          {/* Pilih Barang dari Katalog Nyata */}
          <View style={tabStyles.formInputGroup}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text style={tabStyles.formLabel}>Pilih Produk Belanja</Text>
              {currentProduk && (
                <Text style={{ fontSize: 12, color: "#000000", fontWeight: "800" }}>
                  Stok:{" "}
                  <Text
                    style={{
                      fontWeight: "900",
                      color: currentProduk.stok <= 10 ? "#FF3366" : "#000000",
                    }}
                  >
                    {currentProduk.stok} pcs
                  </Text>
                </Text>
              )}
            </View>

            {produkList.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: 16,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: "#000000",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 13, color: "#000000", fontWeight: "700" }}>
                  Belum ada produk di katalog.
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingVertical: 2 }}
              >
                {produkList.map((prod) => {
                  const isSelected =
                    currentProduk && currentProduk.id === prod.id;
                  const isOutOfStock = prod.stok <= 0;

                  return (
                    <TouchableOpacity
                      key={prod.id}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        borderRadius: 6,
                        backgroundColor: isSelected
                          ? "#FFE600"
                          : isOutOfStock
                            ? "#E5E7EB"
                            : "#FFFFFF",
                        borderWidth: 2.5,
                        borderColor: "#000000",
                        shadowColor: "#000000",
                        shadowOffset: { width: 3, height: 3 },
                        shadowOpacity: 1,
                        shadowRadius: 0,
                        elevation: 3,
                        opacity: isOutOfStock ? 0.6 : 1,
                      }}
                      onPress={() => setSelectedProdukId(prod.id)}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "900",
                          color: "#000000",
                        }}
                      >
                        {prod.nama}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "800",
                            color: "#000000",
                          }}
                        >
                          Rp {prod.harga.toLocaleString("id-ID")}
                        </Text>
                        <Text style={{ fontSize: 10, color: "#000000", fontWeight: "900" }}>
                          •
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "900",
                            color: isOutOfStock ? "#FF3366" : "#000000",
                          }}
                        >
                          {isOutOfStock ? "Habis" : `${prod.stok} pcs`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Row Jumlah & Potongan */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            {/* Kuantitas dengan Quick Controls */}
            <View style={[tabStyles.formInputGroup, { flex: 1 }]}>
              <Text style={tabStyles.formLabel}>Kuantitas (Qty)</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#FFFFFF",
                  borderWidth: 2.5,
                  borderColor: "#000000",
                  borderRadius: 8,
                  height: 48,
                  paddingHorizontal: 6,
                  shadowColor: "#000000",
                  shadowOffset: { width: 3, height: 3 },
                  shadowOpacity: 1,
                  shadowRadius: 0,
                  elevation: 3,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 6,
                    backgroundColor: "#00C2CB",
                    borderWidth: 2,
                    borderColor: "#000000",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() =>
                    setJumlah(Math.max(1, validQty - 1).toString())
                  }
                >
                  <Ionicons name="remove" size={16} color="#000000" />
                </TouchableOpacity>

                <TextInput
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 15,
                    fontWeight: "900",
                    color: "#000000",
                  }}
                  keyboardType="numeric"
                  value={jumlah}
                  onChangeText={setJumlah}
                />

                <TouchableOpacity
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 6,
                    backgroundColor: "#00C2CB",
                    borderWidth: 2,
                    borderColor: "#000000",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    const maxStock = currentProduk?.stok || 999;
                    if (validQty < maxStock) {
                      setJumlah((validQty + 1).toString());
                    } else {
                      showNotification(
                        "Batas Maksimum",
                        `Stok hanya tersedia ${maxStock} pcs.`,
                      );
                    }
                  }}
                >
                  <Ionicons name="add" size={16} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Potongan Diskon */}
            <View style={[tabStyles.formInputGroup, { flex: 1 }]}>
              <Text style={tabStyles.formLabel}>Potongan Diskon (Rp)</Text>
              <TextInput
                style={tabStyles.formTextInput}
                placeholder="0"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={diskon}
                onChangeText={setDiskon}
              />
            </View>
          </View>

          {/* Ringkasan Perhitungan Real-Time - Neobrutalism Box */}
          <View
            style={{
              backgroundColor: "#F5F0E6",
              borderRadius: 8,
              padding: 14,
              borderWidth: 2.5,
              borderColor: "#000000",
              marginVertical: 10,
              gap: 6,
              shadowColor: "#000000",
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 13, color: "#374151", fontWeight: "700" }}>
                Harga Satuan ({currentProduk?.nama || "-"})
              </Text>
              <Text
                style={{ fontSize: 13, fontWeight: "900", color: "#000000" }}
              >
                Rp {hargaSatuan.toLocaleString("id-ID")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 13, color: "#374151", fontWeight: "700" }}>
                Kuantitas
              </Text>
              <Text
                style={{ fontSize: 13, fontWeight: "900", color: "#000000" }}
              >
                x {validQty} item
              </Text>
            </View>
            {cleanDiskon > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 13, color: "#FF3366", fontWeight: "800" }}>
                  Potongan
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "900",
                    color: "#FF3366",
                  }}
                >
                  - Rp {cleanDiskon.toLocaleString("id-ID")}
                </Text>
              </View>
            )}
            <View
              style={{
                height: 2,
                backgroundColor: "#000000",
                marginVertical: 4,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "900",
                  color: "#000000",
                  textTransform: "uppercase",
                }}
              >
                Total Bayar:
              </Text>
              <Text
                style={{ fontSize: 19, fontWeight: "900", color: "#000000" }}
              >
                Rp {grandTotal.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Tombol Simpan Transaksi */}
          <TouchableOpacity
            style={[
              tabStyles.primaryBtn,
              {
                backgroundColor:
                  !currentProduk || currentProduk.stok <= 0
                    ? "#D1D5DB"
                    : "#10B981",
              },
            ]}
            disabled={!currentProduk || currentProduk.stok <= 0}
            activeOpacity={0.8}
            onPress={handleProsesTransaksi}
          >
            <Ionicons name="receipt-outline" size={18} color="#000000" />
            <Text style={tabStyles.primaryBtnText}>
              {"Bayar & Cetak Transaksi"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Riwayat Transaksi */
        <View style={{ gap: 12 }}>
          <View style={tabStyles.card}>
            <View style={tabStyles.cardHeaderRow}>
              <Text style={tabStyles.sectionTitle}>Rekap Kasir Toko</Text>
              <View style={tabStyles.badgeGreen}>
                <Text style={tabStyles.badgeGreenText}>
                  {transaksiList.length} Transaksi
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "900",
                color: "#000000",
                marginTop: 4,
              }}
            >
              Rp {totalOmset.toLocaleString("id-ID")}
            </Text>
            <Text style={{ fontSize: 12, color: "#374151", fontWeight: "600", marginTop: 2 }}>
              Akumulasi total pembayaran seluruh transaksi kasir.
            </Text>
          </View>

          {transaksiList.length === 0 ? (
            <View
              style={[
                tabStyles.card,
                { alignItems: "center", paddingVertical: 28 },
              ]}
            >
              <Ionicons name="receipt-outline" size={36} color="#000000" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "900",
                  color: "#000000",
                  marginTop: 8,
                  textTransform: "uppercase",
                }}
              >
                Belum ada transaksi
              </Text>
              <Text style={{ fontSize: 12, color: "#4B5563", fontWeight: "600", marginTop: 2 }}>
                Gunakan tab "Kasir Baru" untuk mencatat penjualan.
              </Text>
            </View>
          ) : (
            transaksiList.map((trx) => (
              <View key={trx.id} style={tabStyles.listItemCard}>
                <View style={tabStyles.listItemLeft}>
                  <View style={tabStyles.iconBoxGreen}>
                    <Ionicons name="receipt" size={20} color="#000000" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={tabStyles.listItemTitle}>{trx.id}</Text>
                    <Text style={tabStyles.listItemMeta}>
                      {trx.pelanggan} • {trx.waktu}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#374151",
                        fontWeight: "700",
                        marginTop: 2,
                      }}
                    >
                      {trx.produkNama || trx.produk || "Produk"} x {trx.qty} pcs
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <Text style={[tabStyles.listItemPrice, { color: "#000000" }]}>
                    Rp {trx.total.toLocaleString("id-ID")}
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 6,
                      backgroundColor: "#FF3366",
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: "#000000",
                    }}
                    onPress={() => handleBatalTransaksi(trx.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={15} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}
