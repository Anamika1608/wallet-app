import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import axios from 'axios';

type Transaction = {
  _id: string;
  amount: string;
  category: string;
  date: string;
};

type Wallet = {
  balance: string;
};

const Dashboard: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const API_BASE_URL = 'https://localhost:3000';

  const fetchData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/wallet`),
        axios.get(`${API_BASE_URL}/transactions`)
      ]);

      setWallet(walletRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const filterByCategory = async (category: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/transactions/category?category=${category}`);
      setTransactions(response.data);
      setSelectedCategory(category);
    } catch (error) {
      Alert.alert('Error', 'Failed to filter transactions');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  const renderTransactionItem = (transaction: Transaction) => (
    <View key={transaction._id} style={styles.transactionItem}>
      <View style={styles.transactionHeader}>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
        <Text style={styles.transactionAmount}>
          {Number(transaction.amount) > 0 ? '+' : ''}{transaction.amount}
        </Text>
      </View>
      <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
          />
        }
      >
        {wallet && (
          <View style={styles.walletContainer}>
            <Text style={styles.balanceTitle}>Current Balance</Text>
            <Text style={styles.balanceAmount}>
              {wallet.balance} 
            </Text>
          </View>
        )}

        <View style={styles.categoryFilter}>
          {['All', 'Income', 'Expense', 'Savings'].map(category => (
            <TouchableOpacity 
              key={category}
              style={[
                styles.categoryButton, 
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={() => 
                category === 'All' 
                  ? fetchData() 
                  : filterByCategory(category)
              }
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map(renderTransactionItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  walletContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333',
  },
  categoryFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  categoryButton: {
    backgroundColor: '#f9f9fc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  selectedCategory: {
    backgroundColor: '#6a5acd',
  },
  categoryButtonText: {
    color: '#6a5acd',
  },
  transactionsContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6a5acd',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDescription: {
    color: '#666',
    marginBottom: 5,
  },
  transactionDate: {
    color: '#999',
    fontSize: 12,
  },
});

export default Dashboard;