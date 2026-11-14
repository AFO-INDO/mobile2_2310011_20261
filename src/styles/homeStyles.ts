import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F0E6", // Paper Beige
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F5F0E6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
    gap: 16,
  },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
    borderWidth: 2.5,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  welcomeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: -0.4,
    textTransform: "uppercase",
  },
  greetingEmail: {
    fontSize: 13,
    color: "#000000",
    fontWeight: "800",
    marginTop: 2,
    backgroundColor: "#FFE600",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#000000",
  },

  // Overview Stats on Home
  overviewGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  overviewItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 10,
    borderWidth: 2,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  overviewItemLabel: {
    fontSize: 10.5,
    fontWeight: "900",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  overviewItemValue: {
    fontSize: 14.5,
    fontWeight: "900",
    color: "#000000",
    marginTop: 4,
  },

  // Menu Section
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 18,
    borderWidth: 2.5,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  menuHeader: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: -0.3,
    textTransform: "uppercase",
  },
  menuSectionSubtitle: {
    fontSize: 12.5,
    color: "#374151",
    fontWeight: "600",
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  menuItem: {
    width: "30%",
    alignItems: "center",
  },
  menuIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "#000000",
    marginBottom: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  menuLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#000000",
    textAlign: "center",
  },

  // Neo-Brutalist Solid Accent Variants for Icons
  iconBgBlue: {
    backgroundColor: "#00C2CB", // Accent Teal
  },
  iconBgGreen: {
    backgroundColor: "#10B981", // Accent Green
  },
  iconBgAmber: {
    backgroundColor: "#FFE600", // Accent Yellow
  },
  iconBgTeal: {
    backgroundColor: "#00C2CB", // Accent Teal
  },
  iconBgRose: {
    backgroundColor: "#FF00FF", // Accent Magenta
  },
  iconBgPurple: {
    backgroundColor: "#FFE600", // Accent Yellow
  },
});
