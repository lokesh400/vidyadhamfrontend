import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

const MarksScreen = ({ navigation }) => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      // Calling the POST /marks/all endpoint
      const response = await api.post("/marks/all", {}, token);

      if (response.ok) {
        setMarks(response.data.marks || []);
      } else {
        const errorMsg = response.data?.message || "Failed to fetch marks";
        Alert.alert("Error", errorMsg);
      }
    } catch (error) {
      console.error("Fetch Marks Error:", error);
      Alert.alert("Error", "Something went wrong while fetching marks.");
    } finally {
      setLoading(false);
    }
  };

  const renderSubjectScore = (subject, score, total) => {
    if (score == null || total == null) return null;
    return (
      <Text style={styles.subjectText}>
        {subject}:{" "}
        <Text style={styles.scoreText}>
          {score} / {total}
        </Text>
      </Text>
    );
  };

  const renderMarkItem = ({ item }) => {
    const isJee = item.examType?.toUpperCase() === "JEE";
    const isNeet = item.examType?.toUpperCase() === "NEET";

    // Calculate total scored and max total based on exam type
    let totalScored = (item.physics || 0) + (item.chemistry || 0);
    let maxTotal = (item.physicsTotal || 0) + (item.chemistryTotal || 0);

    if (isJee) {
      totalScored += item.math || 0;
      maxTotal += item.mathTotal || 0;
    } else if (isNeet) {
      totalScored += (item.botany || 0) + (item.zoology || 0);
      maxTotal += (item.botanyTotal || 0) + (item.zoologyTotal || 0);
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.testTitle}>{item.testTitle}</Text>
          <Text style={styles.examType}>{item.examType}</Text>
        </View>

        <Text style={styles.dateText}>
          {new Date(item.uploadedAt).toDateString()}
        </Text>

        <View style={styles.scoresContainer}>
          {renderSubjectScore("Physics", item.physics, item.physicsTotal)}
          {renderSubjectScore("Chemistry", item.chemistry, item.chemistryTotal)}

          {isJee && renderSubjectScore("Math", item.math, item.mathTotal)}

          {isNeet && renderSubjectScore("Botany", item.botany, item.botanyTotal)}
          {isNeet && renderSubjectScore("Zoology", item.zoology, item.zoologyTotal)}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalScore}>
            {totalScored} / {maxTotal}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <FlatList
          data={marks}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          renderItem={renderMarkItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No marks found for any tests.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8FF",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCEBFF",
    padding: 16,
    marginBottom: 16,
    shadowColor: "#60A5FA",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
  },
  examType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563EB",
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  dateText: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 12,
  },
  scoresContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 12,
    marginBottom: 12,
  },
  subjectText: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 6,
  },
  scoreText: {
    fontWeight: "600",
    color: "#0F172A",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginRight: 8,
  },
  totalScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0EA5E9",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#64748B",
  },
});

export default MarksScreen;
