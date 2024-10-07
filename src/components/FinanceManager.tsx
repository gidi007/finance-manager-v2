"use client"
import { useState, useEffect } from "react"
import { Plus, DollarSign, TrendingUp, PiggyBank, BarChart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart as BarChartComponent, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type Transaction = {
  id: number
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

type Category = {
  id: number
  name: string
  type: "income" | "expense"
  budget?: number
}

type Investment = {
  id: number
  name: string
  value: number
  type: string
  performance: number
}

export function FinanceManagerComponent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Salary", type: "income" },
    { id: 2, name: "Groceries", type: "expense", budget: 500 },
    { id: 3, name: "Rent", type: "expense", budget: 1500 },
    { id: 4, name: "Entertainment", type: "expense", budget: 200 },
  ])
  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    amount: "",
    description: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
  })
  const [savingsGoal, setSavingsGoal] = useState(1000)
  const [investments, setInvestments] = useState<Investment[]>([
    { id: 1, name: "Stocks", value: 5000, type: "Equity", performance: 7.5 },
    { id: 2, name: "Bonds", value: 3000, type: "Fixed Income", performance: 2.5 },
    { id: 3, name: "Real Estate", value: 10000, type: "Property", performance: 5.0 },
  ])
  const [notifications, setNotifications] = useState<string[]>([])

  const totalIncome = transactions
  .filter((t) => t.type === "income")
  .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
  .filter((t) => t.type === "expense")
  .reduce((sum, t) => sum + t.amount, 0)

  const currentSavings = totalIncome - totalExpenses

  useEffect(() => {
    // Check for low balance
    const currentBalance = totalIncome - totalExpenses;
    if (currentBalance < 500) {
      addNotification("Low balance alert: Your current balance is below $500");
    }
    
    // Check for upcoming bills (simplified example)
    const rentTransaction = transactions.find(
      (t) => t.category === "Rent" && new Date(t.date) > new Date()
    );
    if (rentTransaction) {
      addNotification(
        `Upcoming bill: Rent payment of $${rentTransaction.amount} due on ${rentTransaction.date}`
      );
    }
    
    // Check for reached savings goal
    if (currentSavings >= savingsGoal) {
      addNotification("Congratulations! You've reached your savings goal!");
    }
  }, [transactions, savingsGoal, totalIncome, totalExpenses, currentSavings]);
  

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
  }

  const addTransaction = () => {
    if (newTransaction.amount && newTransaction.description && newTransaction.category) {
      setTransactions([
        ...transactions,
        {
          id: Date.now(),
          type: newTransaction.type as "income" | "expense",
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category: newTransaction.category,
          date: newTransaction.date,
        },
      ])
      setNewTransaction({ type: "income", amount: "", description: "", category: "", date: new Date().toISOString().split('T')[0] })
    }
  }

  const savingsProgress = (currentSavings / savingsGoal) * 100

  const totalInvestments = investments.reduce((sum, inv) => sum + inv.value, 0)

  const getCategoryBudget = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName)
    return category?.budget || 0
  }

  const getCategorySpending = (categoryName: string) => {
    return transactions
      .filter(t => t.category === categoryName && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const chartData = categories
    .filter(c => c.type === "expense")
    .map(category => ({
      name: category.name,
      budget: getCategoryBudget(category.name),
      spending: getCategorySpending(category.name),
    }))

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Finance Manager</h1>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Income: ${totalIncome.toFixed(2)}</p>
                <p>Total Expenses: ${totalExpenses.toFixed(2)}</p>
                <p>Current Savings: ${currentSavings.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Goal: ${savingsGoal}</p>
                <Progress value={savingsProgress} className="mt-2" />
                <p className="mt-2">
                  Progress: {savingsProgress.toFixed(2)}% (${currentSavings.toFixed(2)})
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => setSavingsGoal(savingsGoal + 500)}
                >
                  <PiggyBank className="mr-2 h-4 w-4" /> Increase Goal
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {notifications.map((notification, index) => (
                    <div key={index} className="mb-2 p-2 bg-muted rounded">
                      {notification}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setNotifications([])}>
                  <Bell className="mr-2 h-4 w-4" /> Clear All
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="space-y-2">
                  {transactions.slice(-5).reverse().map((transaction) => (
                    <li
                      key={transaction.id}
                      className={`flex justify-between items-center p-2 rounded ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <span>{transaction.description}</span>
                      <span
                        className={
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, type: value as "income" | "expense" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTransaction.description}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.type === newTransaction.type)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) =>
                      setNewTransaction({
                        ...newTransaction,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={addTransaction}>
                  <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <ul className="space-y-2">
                  {transactions.map((transaction) => (
                    <li
                      key={transaction.id}
                      className={`flex justify-between items-center p-2 rounded ${
                        transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <div>
                        <span className="font-bold">{transaction.description}</span>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {transaction.category} - {transaction.date}
                        </span>
                      </div>
                      <span
                        className={
                          transaction.type === "income" ? "text-green-600" : "text-red-600"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {transaction.amount.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartComponent
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                    <Bar dataKey="spending" fill="#82ca9d" name="Actual Spending" />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ul className="space-y-4">
                  {categories
                    .filter((c) => c.type === "expense")
                    .map((category) => {
                      const spent = getCategorySpending(category.name)
                      const budget = getCategoryBudget(category.name)
                      const progress = (spent / budget) * 100
                      return (
                        <li key={category.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{category.name}</span>
                            <span>
                              ${spent.toFixed(2)} / ${budget.toFixed(2)}
                            </span>
                          </div>
                          <Progress value={progress} />
                        </li>
                      )
                    })}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Portfolio</CardTitle>
              <CardDescription>Total Value: ${totalInvestments.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {investments.map((investment) => (
                  <li key={investment.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{investment.name}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {investment.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div>${investment.value.toFixed(2)}</div>
                      <div
                        className={
                          investment.performance >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {investment.performance >= 0 ? "+" : ""}
                        {investment.performance.toFixed(2)}%
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" /> Add Investment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Investment</DialogTitle>
                    <DialogDescription>
                      Enter the details of your new investment here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="value" className="text-right">
                        Value
                      </Label>
                      <Input id="value" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Input id="type" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Investment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartComponent
                    data={[
                      { name: 'Jan', income: 4000, expenses: 2400 },
                      { name: 'Feb', income: 3000, expenses: 1398 },
                      { name: 'Mar', income: 2000, expenses: 9800 },
                      { name: 'Apr', income: 2780, expenses: 3908 },
                      { name: 'May', income: 1890, expenses: 4800 },
                      { name: 'Jun', income: 2390, expenses: 3800 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#8884d8" />
                    <Bar dataKey="expenses" fill="#82ca9d" />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Health Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Savings Rate</h3>
                  <Progress value={(currentSavings / totalIncome) * 100} />
                  <p className="text-sm text-muted-foreground">
                    You&apos;re saving {((currentSavings / totalIncome) * 100).toFixed(2)}% of your income
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Debt-to-Income Ratio</h3>
                  <Progress value={30} />
                  <p className="text-sm text-muted-foreground">
                    Your debt-to-income ratio is 30% (sample data)
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Emergency Fund</h3>
                  <Progress value={75} />
                  <p className="text-sm text-muted-foreground">
                    You have 3 months of expenses saved (sample data)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default FinanceManagerComponent;