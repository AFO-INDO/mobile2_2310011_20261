import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface ProdukItem {
  id: string;
  nama: string;
  kategori: string;
  stok: number;
  harga: number;
}

export interface TransaksiItem {
  id: string;
  pelanggan: string;
  produkId: string;
  produk: string;
  produkNama: string;
  kategori: string;
  hargaSatuan: number;
  qty: number;
  subtotal: number;
  diskon: number;
  total: number;
  waktu: string;
  timestamp: number;
}

const INITIAL_PRODUK: ProdukItem[] = [
  { id: "1", nama: "Minyak Goreng 2L", kategori: "Sembako", stok: 45, harga: 38000 },
  { id: "2", nama: "Beras Premium 5kg", kategori: "Sembako", stok: 18, harga: 72500 },
  { id: "3", nama: "Gula Pasir 1kg", kategori: "Sembako", stok: 30, harga: 17500 },
  { id: "4", nama: "Air Mineral 600ml", kategori: "Minuman", stok: 60, harga: 4000 },
  { id: "5", nama: "Kopi Hitam Sachet", kategori: "Minuman", stok: 120, harga: 2500 },
  { id: "6", nama: "Biskuit Cokelat", kategori: "Snack", stok: 25, harga: 11000 },
];

const INITIAL_TRANSAKSI: TransaksiItem[] = [
  {
    id: "TRX-001",
    pelanggan: "Umum / Walk-in",
    produkId: "1",
    produk: "Minyak Goreng 2L x 2",
    produkNama: "Minyak Goreng 2L",
    kategori: "Sembako",
    hargaSatuan: 38000,
    qty: 2,
    subtotal: 76000,
    diskon: 0,
    total: 76000,
    waktu: "10:15 WIB",
    timestamp: Date.now() - 3600 * 1000 * 5,
  },
  {
    id: "TRX-002",
    pelanggan: "Ibu Rahma",
    produkId: "2",
    produkNama: "Beras Premium 5kg",
    produk: "Beras Premium 5kg x 1",
    kategori: "Sembako",
    hargaSatuan: 72500,
    qty: 1,
    subtotal: 72500,
    diskon: 0,
    total: 72500,
    waktu: "11:02 WIB",
    timestamp: Date.now() - 3600 * 1000 * 4,
  },
  {
    id: "TRX-003",
    pelanggan: "Pak Joko",
    produkId: "3",
    produkNama: "Gula Pasir 1kg",
    produk: "Gula Pasir 1kg x 3",
    kategori: "Sembako",
    hargaSatuan: 17500,
    qty: 3,
    subtotal: 52500,
    diskon: 0,
    total: 52500,
    waktu: "13:20 WIB",
    timestamp: Date.now() - 3600 * 1000 * 2,
  },
];

// Singleton store in memory to ensure cross-module sync & zero crashes even without Provider
let globalProdukList: ProdukItem[] = [...INITIAL_PRODUK];
let globalTransaksiList: TransaksiItem[] = [...INITIAL_TRANSAKSI];
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export interface StoreContextType {
  produkList: ProdukItem[];
  transaksiList: TransaksiItem[];
  addProduk: (item: Omit<ProdukItem, "id">) => ProdukItem;
  updateProduk: (id: string, updates: Partial<Omit<ProdukItem, "id">>) => void;
  deleteProduk: (id: string) => void;
  addTransaksi: (data: {
    pelanggan: string;
    produkId: string;
    qty: number;
    diskon: number;
  }) => { success: boolean; message?: string; trx?: TransaksiItem };
  deleteTransaksi: (id: string) => void;
}

const globalActions = {
  addProduk: (item: Omit<ProdukItem, "id">): ProdukItem => {
    const newProduk: ProdukItem = {
      id: Date.now().toString(),
      ...item,
    };
    globalProdukList = [newProduk, ...globalProdukList];
    notifyListeners();
    return newProduk;
  },

  updateProduk: (id: string, updates: Partial<Omit<ProdukItem, "id">>) => {
    globalProdukList = globalProdukList.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
    notifyListeners();
  },

  deleteProduk: (id: string) => {
    globalProdukList = globalProdukList.filter((item) => item.id !== id);
    notifyListeners();
  },

  addTransaksi: ({
    pelanggan,
    produkId,
    qty,
    diskon,
  }: {
    pelanggan: string;
    produkId: string;
    qty: number;
    diskon: number;
  }) => {
    const targetProduk = globalProdukList.find((p) => p.id === produkId);
    if (!targetProduk) {
      return { success: false, message: "Produk yang dipilih tidak ditemukan." };
    }

    if (qty <= 0) {
      return { success: false, message: "Jumlah pembelian minimal 1 item." };
    }

    if (targetProduk.stok < qty) {
      return {
        success: false,
        message: `Stok tidak mencukupi! Sisa stok untuk "${targetProduk.nama}" hanya ${targetProduk.stok} pcs.`,
      };
    }

    const subtotal = targetProduk.harga * qty;
    const cleanDiskon = Math.min(Math.max(0, diskon), subtotal);
    const grandTotal = subtotal - cleanDiskon;

    const now = new Date();
    const jam = String(now.getHours()).padStart(2, "0");
    const menit = String(now.getMinutes()).padStart(2, "0");
    const trxCounter = globalTransaksiList.length + 1;

    const newTrx: TransaksiItem = {
      id: `TRX-${String(trxCounter).padStart(3, "0")}`,
      pelanggan: pelanggan.trim() || "Pelanggan Umum",
      produkId: targetProduk.id,
      produk: `${targetProduk.nama} x ${qty}`,
      produkNama: targetProduk.nama,
      kategori: targetProduk.kategori,
      hargaSatuan: targetProduk.harga,
      qty,
      subtotal,
      diskon: cleanDiskon,
      total: grandTotal,
      waktu: `${jam}:${menit} WIB`,
      timestamp: now.getTime(),
    };

    // Kurangi stok barang di katalog
    globalProdukList = globalProdukList.map((p) =>
      p.id === targetProduk.id ? { ...p, stok: p.stok - qty } : p,
    );

    // Tambah riwayat transaksi
    globalTransaksiList = [newTrx, ...globalTransaksiList];

    notifyListeners();
    return { success: true, trx: newTrx };
  },

  deleteTransaksi: (id: string) => {
    const target = globalTransaksiList.find((t) => t.id === id);
    if (target) {
      // Kembalikan stok produk jika transaksi dibatalkan
      globalProdukList = globalProdukList.map((p) =>
        p.id === target.produkId ? { ...p, stok: p.stok + target.qty } : p,
      );
    }
    globalTransaksiList = globalTransaksiList.filter((t) => t.id !== id);
    notifyListeners();
  },
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const onStoreChange = () => setTick((t) => t + 1);
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      produkList: globalProdukList,
      transaksiList: globalTransaksiList,
      ...globalActions,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalProdukList, globalTransaksiList],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  const [, setTick] = useState(0);

  useEffect(() => {
    // If not wrapped in StoreProvider, still react to singleton store updates safely!
    if (!context) {
      const onStoreChange = () => setTick((t) => t + 1);
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    }
  }, [context]);

  if (context) {
    return context;
  }

  // Fallback to singleton store so it NEVER crashes
  return {
    produkList: globalProdukList,
    transaksiList: globalTransaksiList,
    ...globalActions,
  };
}
