import { useStore } from "@/context/StoreContext";
import { tabStyles } from "@/styles/tabStyles";
import { showNotification } from "@/utils/alert";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  DimensionValue,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReportScreen() {
  const { transaksiList } = useStore();
  const [period, setPeriod] = useState<"hari" | "minggu" | "bulan" | "semua">(
    "hari",
  );

  // Filter transaksi berdasarkan rentang waktu yang dipilih
  const filteredTransaksi = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    return transaksiList.filter((item) => {
      const diff = now - item.timestamp;
      if (period === "hari") {
        return diff <= oneDay;
      }
      if (period === "minggu") {
        return diff <= 7 * oneDay;
      }
      if (period === "bulan") {
        return diff <= 30 * oneDay;
      }
      return true;
    });
  }, [transaksiList, period]);

  // Kalkulasi Metrik Utama Berdasarkan Data Nyata
  const metrics = useMemo(() => {
    const totalOmset = filteredTransaksi.reduce(
      (acc, curr) => acc + curr.total,
      0,
    );
    const volumeNota = filteredTransaksi.length;
    const rerata = volumeNota > 0 ? Math.round(totalOmset / volumeNota) : 0;

    // Hitung produk terlaris berdasarkan kuantitas yang terjual
    const productSalesMap: Record<string, number> = {};
    filteredTransaksi.forEach((item) => {
      productSalesMap[item.produkNama] =
        (productSalesMap[item.produkNama] || 0) + item.qty;
    });

    let topProduct = "-";
    let maxQty = 0;
    Object.entries(productSalesMap).forEach(([nama, qty]) => {
      if (qty > maxQty) {
        maxQty = qty;
        topProduct = `${nama} (${qty} pcs)`;
      }
    });

    return {
      omset: `Rp ${totalOmset.toLocaleString("id-ID")}`,
      transaksi: `${volumeNota} Nota`,
      rerata: `Rp ${rerata.toLocaleString("id-ID")}`,
      topItem: topProduct,
      rawOmset: totalOmset,
      rawVolume: volumeNota,
    };
  }, [filteredTransaksi]);

  // Kalkulasi Distribusi Kategori Penjualan secara Dinamis (Warna sesuai Neobrutalism System)
  const categoryStats = useMemo(() => {
    const categoryTotals: Record<string, number> = {
      Sembako: 0,
      Minuman: 0,
      Snack: 0,
    };

    filteredTransaksi.forEach((item) => {
      const kat = item.kategori || "Sembako";
      categoryTotals[kat] = (categoryTotals[kat] || 0) + item.total;
    });

    const totalSales = metrics.rawOmset || 1;

    // Warna dari Neobrutalist System (Teal, Yellow, Magenta)
    const colors: Record<string, string> = {
      Sembako: "#00C2CB", // Accent Teal
      Minuman: "#FFE600", // Accent Yellow
      Snack: "#FF00FF", // Accent Magenta
    };

    return Object.entries(categoryTotals).map(([kat, total]) => {
      const pctNumber =
        metrics.rawOmset > 0 ? Math.round((total / totalSales) * 100) : 0;
      return {
        label: kat,
        totalRp: `Rp ${total.toLocaleString("id-ID")}`,
        pctNumber,
        pct: `${pctNumber}%` as DimensionValue,
        color: colors[kat] || "#00C2CB",
      };
    });
  }, [filteredTransaksi, metrics.rawOmset]);

  const handleExport = (type: string) => {
    showNotification(
      "Unduh Laporan Selesai",
      `Laporan penjualan periode ${period.toUpperCase()} format ${type} siap diunduh.\nTotal: ${metrics.omset} (${metrics.transaksi}).`,
    );
  };

  return (
    <ScrollView
      style={tabStyles.screenContainer}
      contentContainerStyle={tabStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={tabStyles.card}>
        <View style={tabStyles.cardHeaderRow}>
          <View style={tabStyles.badgeBlue}>
            <Ionicons name="bar-chart" size={13} color="#000000" />
            <Text style={tabStyles.badgeBlueText}>Analitik Toko</Text>
          </View>
          <Text style={{ fontSize: 12, color: "#000000", fontWeight: "800" }}>
            TAHUN 2026
          </Text>
        </View>

        <Text style={tabStyles.sectionTitle}>Laporan Penjualan</Text>
        <Text style={tabStyles.sectionSubtitle}>
          Pantau omset, total transaksi, dan performa kasir secara dinamis dan akurat.
        </Text>

        {/* Filter Periode - Neobrutalism Segmented Chips */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            borderWidth: 2.5,
            borderColor: "#000000",
            padding: 4,
            gap: 4,
            marginTop: 14,
            shadowColor: "#000000",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 3,
          }}
        >
          {(
            [
              { key: "hari", label: "Hari Ini" },
              { key: "minggu", label: "Minggu" },
              { key: "bulan", label: "Bulan" },
              { key: "semua", label: "Semua" },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor: period === item.key ? "#FFE600" : "transparent",
                borderWidth: period === item.key ? 2 : 0,
                borderColor: "#000000",
                alignItems: "center",
              }}
              onPress={() => setPeriod(item.key)}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "900",
                  color: "#000000",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Grid Statistik 4 Metrik */}
      <View style={tabStyles.statGrid}>
        <View style={tabStyles.statCard}>
          <Text style={tabStyles.statLabel}>Total Omset</Text>
          <Text style={[tabStyles.statValue, { color: "#000000" }]}>
            {metrics.omset}
          </Text>
        </View>
        <View style={tabStyles.statCard}>
          <Text style={tabStyles.statLabel}>Volume Nota</Text>
          <Text style={tabStyles.statValue}>{metrics.transaksi}</Text>
        </View>
      </View>

      <View style={tabStyles.statGrid}>
        <View style={tabStyles.statCard}>
          <Text style={tabStyles.statLabel}>Rata-Rata Nota</Text>
          <Text style={tabStyles.statValue}>{metrics.rerata}</Text>
        </View>
        <View style={tabStyles.statCard}>
          <Text style={tabStyles.statLabel}>Produk Terlaris</Text>
          <Text
            style={[tabStyles.statValue, { fontSize: 13, color: "#000000" }]}
            numberOfLines={1}
          >
            {metrics.topItem}
          </Text>
        </View>
      </View>

      {/* Ringkasan Distribusi Kategori Penjualan Riil - Neobrutalism Progress Bar */}
      <View style={tabStyles.card}>
        <Text style={[tabStyles.sectionTitle, { fontSize: 15, marginBottom: 12 }]}>
          Distribusi Penjualan per Kategori
        </Text>

        {categoryStats.map((item) => (
          <View key={item.label} style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text style={{ fontSize: 13, color: "#000000", fontWeight: "800" }}>
                {item.label}{" "}
                <Text style={{ fontSize: 11.5, color: "#374151", fontWeight: "700" }}>
                  ({item.totalRp})
                </Text>
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "900", color: "#000000" }}>
                {item.pctNumber}%
              </Text>
            </View>
            <View
              style={{
                height: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 4,
                borderWidth: 2,
                borderColor: "#000000",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: item.pct,
                  backgroundColor: item.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Rincian Transaksi dalam Periode Ini */}
      <View style={tabStyles.card}>
        <View style={tabStyles.cardHeaderRow}>
          <Text style={[tabStyles.sectionTitle, { fontSize: 15 }]}>
            Daftar Penjualan ({filteredTransaksi.length})
          </Text>
          <View style={tabStyles.badgeBlue}>
            <Text style={tabStyles.badgeBlueText}>Periode Aktif</Text>
          </View>
        </View>

        {filteredTransaksi.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Ionicons name="document-text-outline" size={32} color="#000000" />
            <Text
              style={{
                fontSize: 14,
                color: "#000000",
                fontWeight: "800",
                marginTop: 6,
                textTransform: "uppercase",
              }}
            >
              Tidak ada transaksi pada periode ini
            </Text>
          </View>
        ) : (
          filteredTransaksi.slice(0, 5).map((trx) => (
            <View
              key={trx.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 10,
                borderBottomWidth: 1.5,
                borderBottomColor: "#000000",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: "900", color: "#000000" }}>
                  {trx.id} - {trx.pelanggan}
                </Text>
                <Text style={{ fontSize: 12, color: "#374151", fontWeight: "600", marginTop: 2 }}>
                  {trx.produkNama} x {trx.qty} pcs • {trx.waktu}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 13.5,
                  fontWeight: "900",
                  color: "#000000",
                  marginLeft: 8,
                }}
              >
                Rp {trx.total.toLocaleString("id-ID")}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Tombol Ekspor Laporan */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          style={[tabStyles.secondaryBtn, { flex: 1, backgroundColor: "#00C2CB" }]}
          activeOpacity={0.8}
          onPress={() => handleExport("PDF")}
        >
          <Ionicons name="document-text-outline" size={17} color="#000000" />
          <Text style={tabStyles.secondaryBtnText}>Ekspor PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[tabStyles.secondaryBtn, { flex: 1, backgroundColor: "#FFE600" }]}
          activeOpacity={0.8}
          onPress={() => handleExport("Excel")}
        >
          <Ionicons name="download-outline" size={17} color="#000000" />
          <Text style={tabStyles.secondaryBtnText}>Ekspor Excel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
