import { useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Show, useUser, useClerk } from "@clerk/expo";
import { Link } from "expo-router";
import { Text, View, Pressable, StyleSheet } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { transactions, summary, isLoading, loadData, deletedTransaction } =
    useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>Income: {summary.income}</Text>
      <Text>Balance: {summary.balance}</Text>
      <Text>Expenses: {summary.expenses}</Text>
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </Show>
      <Show when="signed-in">
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </Show>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
