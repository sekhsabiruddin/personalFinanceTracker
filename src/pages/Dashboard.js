import React, { useEffect } from "react";
import Header from "../componets/Header";
import Cards from "../componets/Cards";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import AddExpenseModal from "../componets/Modals/addExpense";
import AddIncomeModal from "../componets/Modals/addIncome";
import { toast } from "react-toastify";
import { query, getDocs } from "firebase/firestore";
import TransactionsTable from "../componets/TransactionsTable";
import NoTransaction from "../componets/NoTransaction";
import ChartComponet from "../componets/Charts";
import Loader from "../componets/Loading";
// import TransactionsTable from "../components/TransactionsTable";

function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIncomeModalVisible] = useState(false);

  const [user] = useAuthState(auth);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIncomeModalVisible(true);
  };

  const handleIncomeCancel = () => {
    setIncomeModalVisible(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("On finish", values, type);
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    // console.log("newTransaction ", newTransaction);
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      toast.success("Transaction added");
      let newArr = [...transactions]; // Create a new array
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.group(e);
      toast.error("Couldn't add transaction");
    }
  }

  // Fetch transactions on component mount and when the authenticated user changes
  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Fetch transactions function
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });

      setTransactions(transactionsArray);
      // toast.success("Transactions Fetched");
    } else {
      setTransactions([]); // Set transactions to an empty array when user is null
    }
    setLoading(false);
  }

  // Calculate the balance whenever the transactions change
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let incomeTotal = 0;
    let expensesTotal = 0;
    console.log("transactions value is", transactions);
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  }
  let sortedTransaction = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <Cards
          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />
      )}

      {transactions.length != 0 ? (
        <ChartComponet sortedTransaction={sortedTransaction} />
      ) : (
        <NoTransaction />
      )}

      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}

export default Dashboard;
